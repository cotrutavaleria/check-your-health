package com.example.backend.controllers;

import com.example.backend.entities.Patient;
import com.example.backend.enumerations.UserType;
import com.example.backend.requests.GeneralUserInformationRequest;
import com.example.backend.responses.AuthenticationResponse;
import com.example.backend.services.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountException;

@RestController
@RequestMapping("/patients")
public class PatientController {
    @Autowired
    PatientService patientService;

    @PutMapping("/activated")
    public ResponseEntity<?> setActiveAccount(@RequestHeader(value = "X-Auth-Token") String token) throws AccountException {
        try {
            Patient patient = this.patientService.setAccountActive(token);
            if (patient != null) {
                return ResponseEntity.status(HttpStatus.OK).body(new AuthenticationResponse(token, UserType.PATIENT, patient.getEmailAddress(), patient.getFullName()));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } catch (AccountException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
        }
    }

    @PutMapping("")
    public ResponseEntity<?> updatePatientDetails(@Valid @RequestBody GeneralUserInformationRequest requestBody, @RequestHeader(value = "X-Auth-Token") String token) {
        try {
            String newToken = this.patientService.updateInformation(requestBody, token);
            return ResponseEntity.status(HttpStatus.OK).body("{\"token\":\"" + newToken + "\"}");
        } catch (AccountException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }
}
