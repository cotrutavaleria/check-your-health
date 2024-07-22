package com.example.backend.services;

import com.example.backend.entities.Patient;
import com.example.backend.enumerations.UserType;
import com.example.backend.exceptions.ExpiredTokenException;
import com.example.backend.repositories.PatientRepository;
import com.example.backend.requests.EmailMessageRequest;
import com.example.backend.requests.PatientRegistrationRequest;
import com.example.backend.requests.GeneralUserInformationRequest;
import com.example.backend.responses.PatientDataResponse;
import com.example.backend.responses.PatientRegistrationResponse;
import com.example.backend.services.utils.EmailService;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountException;
import javax.security.auth.login.AccountNotFoundException;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class PatientService {
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    SecurityService securityService;
    @Autowired
    EmailService emailService;
    @Autowired
    ImageService imageService;

    public Patient sendChangePasswordEmail(String email) throws AccountException {
        email = securityService.encodeData(email);
        var patient = this.patientRepository.findByEmailAddress(email);
        if (patient != null) {
            if (!patient.isAccountActive()) {
                throw new AccountException("Your account is still not activated!");
            }
            String token = this.securityService.generateToken(String.valueOf(patient.getId()), patient.getFullName(), patient.getEmailAddress(), UserType.PATIENT);
            this.emailService.sendResetPasswordEmail(new EmailMessageRequest(patient.getEmailAddress(), ("http://localhost:4200/auth/reset-password/").concat(token), "Reset password request"));
        }
        return patient;
    }

    public String getByEmailAndPassword(String email, String password) throws AccountException {
        email = securityService.encodeData(email);
        var patient = patientRepository.findByEmailAddress(email);
        if (patient != null) {
            if (!patient.isAccountActive()) {
                throw new AccountException("Your account is still not enabled!");
            }
            boolean passwordsMatching = securityService.checkPasswords(password, patient.getPassword());
            if (passwordsMatching) {
                return this.securityService.generateToken(String.valueOf(patient.getId()), patient.getFullName(), email, UserType.PATIENT);
            }
        }
        return null;
    }

    public Patient getByEmail(String email) {
        return patientRepository.findByEmailAddress(securityService.encodeData(email));
    }

    public PatientRegistrationResponse registerPatient(PatientRegistrationRequest patient) {
        Patient newPatient = Patient.builder()
                .uuid(securityService.encodeData(UUID.randomUUID().toString()))
                .status(UserType.PATIENT)
                .fullName(securityService.encodeData(patient.getFullName()))
                .emailAddress(securityService.encodeData(patient.getEmailAddress()))
                .phoneNumber(securityService.encodeData(patient.getPhoneNumber()))
                .gender(securityService.encodeData(patient.getGender()))
                .birthdate(securityService.encodeData(patient.getBirthdate().toString()))
                .password(securityService.encryptPassword(patient.getPassword()))
                .isAccountActive(false)
                .build();
        this.patientRepository.save(newPatient);
        String token = this.securityService.generateToken(String.valueOf(newPatient.getId()), newPatient.getFullName(), newPatient.getEmailAddress(), UserType.PATIENT);
        this.emailService.sendPatientAccountActivationEmail(new EmailMessageRequest(patient.getEmailAddress(), ("http://localhost:4200/auth/activate-account/").concat(token), "Activate account"));
        return new PatientRegistrationResponse(token, UserType.PATIENT, patient.getEmailAddress(), patient.getFullName());
    }

    public Patient setAccountActive(String token) throws AccountException {
        try {
            Claims claims = this.securityService.decodeToken(token);
            String email = claims.getSubject();
            Patient patient = this.patientRepository.findByEmailAddress(email);
            if (patient.isAccountActive()) {
                throw new AccountException("Account is already active!");
            }
            patient.setAccountActive(true);
            this.patientRepository.save(patient);
            return patient;
        } catch (ExpiredTokenException exception) {
            return null;
        }
    }

    public Patient getInfo(String token) {
        try {
            Claims claims = this.securityService.decodeToken(token);
            return this.patientRepository.findByEmailAddress(claims.getSubject());
        } catch (ExpiredTokenException exception) {
            return null;
        }
    }

    public Patient updatePassword(String token, String newPassword) {
        Claims claims = this.securityService.decodeToken(token);
        String email = claims.getSubject();
        Patient patient = this.patientRepository.findByEmailAddress(email);
        if (patient != null) {
            patient.setPassword(securityService.encryptPassword(newPassword));
            this.patientRepository.save(patient);
        }
        return patient;
    }

    public String updateInformation(GeneralUserInformationRequest patient, String token) throws AccountException, ExpiredTokenException, NullPointerException {
        Claims claims = this.securityService.decodeToken(token);
        Patient patientData = this.patientRepository.findByEmailAddress(claims.getSubject());
        if (patientData == null) {
            throw new NullPointerException("There is no account with such e-mail address!");
        }
        if (!securityService.decodeData(claims.getSubject()).equals(patient.getEmailAddress())) {
            Patient findPatient = this.patientRepository.findByEmailAddress(securityService.encodeData(patient.getEmailAddress()));
            if (findPatient == null) {
                patientData.setEmailAddress(securityService.encodeData(patient.getEmailAddress()));
            } else {
                throw new AccountException("The e-mail address is already taken!");
            }
        }
        patientData.setFullName(securityService.encodeData(patient.getFullName()));
        patientData.setGender(securityService.encodeData(patient.getGender()));
        patientData.setBirthdate(securityService.encodeData(patient.getBirthdate().toString()));
        patientData.setPhoneNumber(securityService.encodeData(patient.getPhoneNumber()));
        this.patientRepository.save(patientData);
        return this.securityService.generateToken(String.valueOf(patientData.getId()), patientData.getFullName(), patientData.getEmailAddress(), UserType.PATIENT);
    }

    public PatientDataResponse getByUuid(String uuid) throws AccountNotFoundException {
        var patient = this.patientRepository.findByUuid(securityService.encodeData(uuid));
        if (patient == null) {
            throw new AccountNotFoundException();
        }
        String imageUrl = "";
        if (patient.getImage() != null) {
            imageUrl = this.imageService.getImageUrl(patient.getImage().getImageName());
        }
        return PatientDataResponse.builder()
                .userType(UserType.PATIENT)
                .image(imageUrl)
                .fullName(securityService.decodeData(patient.getFullName()))
                .phoneNumber(securityService.decodeData(patient.getPhoneNumber()))
                .emailAddress(securityService.decodeData(patient.getEmailAddress()))
                .gender(securityService.decodeData(patient.getGender()))
                .birthdate(LocalDate.parse(securityService.decodeData(patient.getBirthdate())))
                .build();
    }
}
