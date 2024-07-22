package com.example.backend.controllers;

import com.example.backend.entities.Administrator;
import com.example.backend.entities.Doctor;
import com.example.backend.entities.Patient;
import com.example.backend.enumerations.UserType;
import com.example.backend.exceptions.ExpiredTokenException;
import com.example.backend.requests.AuthenticationRequest;
import com.example.backend.requests.PasswordChangingRequest;
import com.example.backend.responses.AdministratorDataResponse;
import com.example.backend.responses.DoctorDataResponse;
import com.example.backend.responses.PatientDataResponse;
import com.example.backend.services.AdministratorService;
import com.example.backend.services.DoctorService;
import com.example.backend.services.ImageService;
import com.example.backend.services.PatientService;
import com.example.backend.services.utils.SecurityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountException;
import java.time.LocalDate;

@RestController
@RequestMapping("/users")
public class AuthenticationController {
    @Autowired
    PatientService patientService;
    @Autowired
    DoctorService doctorService;
    @Autowired
    AdministratorService administratorService;
    @Autowired
    ImageService imageService;

    @Autowired
    SecurityService securityService;


    private String getToken(String token) {
        return "{\"token\":\"" + token + "\"}";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthenticationRequest requestBody) {
        try {
            String token = this.patientService.getByEmailAndPassword(requestBody.getEmailAddress(), requestBody.getPassword());
            if (token != null) {
                return ResponseEntity.status(HttpStatus.OK).body(getToken(token));
            }
            token = this.doctorService.getByEmailAndPassword(requestBody.getEmailAddress(), requestBody.getPassword());
            if (token != null) {
                return ResponseEntity.status(HttpStatus.OK).body(getToken(token));
            }
            token = this.administratorService.getByEmailAndPassword(requestBody.getEmailAddress(), requestBody.getPassword());
            if (token != null) {
                return ResponseEntity.status(HttpStatus.OK).body(getToken(token));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (AccountException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getUserGeneralDetails(@RequestHeader(value = "X-Auth-Token") String token) {
        try {
            Patient patientData = this.patientService.getInfo(token);
            if (patientData != null) {
                String imageUrl = "";
                if (patientData.getImage() != null) {
                    imageUrl = this.imageService.getImageUrl(patientData.getImage().getImageName());
                }
                return ResponseEntity.status(HttpStatus.OK).body(
                        PatientDataResponse.builder()
                                .userType(UserType.PATIENT)
                                .fullName(securityService.decodeData(patientData.getFullName()))
                                .emailAddress(securityService.decodeData(patientData.getEmailAddress()))
                                .phoneNumber( securityService.decodeData(patientData.getPhoneNumber()))
                                .gender(securityService.decodeData(patientData.getGender()))
                                .birthdate(LocalDate.parse(securityService.decodeData(patientData.getBirthdate())))
                                .image(imageUrl)
                                .build()
                );
            }

            Administrator administratorData = this.administratorService.getInfo(token);
            if (administratorData != null) {
                return ResponseEntity.status(HttpStatus.OK).body(
                        AdministratorDataResponse.builder()
                                .userType(UserType.ADMINISTRATOR)
                                .username(securityService.decodeData(administratorData.getUsername()))
                                .emailAddress(securityService.decodeData(administratorData.getEmailAddress()))
                                .build()
                );
            }

            Doctor doctorData = this.doctorService.getInfo(token);
            if (doctorData != null) {
                String imageUrl = "";
                if (doctorData.getImage() != null) {
                    imageUrl = this.imageService.getImageUrl(doctorData.getImage().getImageName());
                }
                return ResponseEntity.status(HttpStatus.OK).body(
                        DoctorDataResponse.builder()
                                .userType(UserType.DOCTOR)
                                .fullName(securityService.decodeData(doctorData.getFullName()))
                                .emailAddress(securityService.decodeData(doctorData.getEmailAddress()))
                                .phoneNumber(securityService.decodeData(doctorData.getPhoneNumber()))
                                .gender(securityService.decodeData(doctorData.getGender()))
                                .birthdate(LocalDate.parse(securityService.decodeData(doctorData.getBirthdate())))
                                .specialties(doctorData.getSpecialties())
                                .consultingTypes(doctorData.getConsultingTypes())
                                .workAddress(securityService.decodeData(doctorData.getWorkAddress()))
                                .image(imageUrl)
                                .build()
                );
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @PostMapping("/password-reset-emails/{email-address}")
    public ResponseEntity<?> sendChangePasswordEmail(@Valid @PathVariable("email-address") String email) {
        try {
            Patient patient = this.patientService.sendChangePasswordEmail(email);
            if (patient != null) {
                return ResponseEntity.status(HttpStatus.OK).body(null);
            }
            Doctor doctor = this.doctorService.sendChangePasswordEmail(email);
            if (doctor != null) {
                return ResponseEntity.status(HttpStatus.OK).body(null);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (AccountException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/password-reset-responses")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody PasswordChangingRequest requestBody) {
        try {
            Patient patient = this.patientService.updatePassword(requestBody.getToken(), requestBody.getPassword());
            if (patient != null) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            Doctor doctor = this.doctorService.updatePassword(requestBody.getToken(), requestBody.getPassword());
            if (doctor != null) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (ExpiredTokenException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/encrypt")
    public String encryptSensitiveData(@RequestBody String plaintext) {
        try {
            String encryptedText = securityService.encodeData(plaintext);
            return encryptedText;
        } catch (Exception e) {
            e.printStackTrace();
            return "Encryption failed: " + e.getMessage();
        }
    }

    @PostMapping("/decrypt")
    public String decryptSensitiveData(@RequestBody String encryptedText) {
        try {
            String decryptedText = securityService.decodeData(encryptedText);
            return decryptedText;
        } catch (Exception e) {
            e.printStackTrace();
            return "Decryption failed: " + e.getMessage();
        }
    }

    @GetMapping("/encryptPassword")
    public String encryptPassword(@RequestParam String data) {
        try {
            return securityService.encryptPassword(data);
        } catch (Exception e) {
            e.printStackTrace();
            return "Encryption error: " + e.getMessage();
        }
    }

    @GetMapping("/checkPasswords")
    public boolean checkPasswords(@RequestParam String data, @RequestParam String encryptedData) {
        try {
            return securityService.checkPasswords(data, encryptedData);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Decryption error: " + e.getMessage());
            return false;
        }
    }
}