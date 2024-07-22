package com.example.backend.controllers;

import com.example.backend.entities.Doctor;
import com.example.backend.requests.DoctorRegistrationRequest;
import com.example.backend.requests.PatientRegistrationRequest;
import com.example.backend.responses.PatientRegistrationResponse;
import com.example.backend.services.DoctorService;
import com.example.backend.services.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
public class RegistrationController {
    @Autowired
    PatientService patientService;
    @Autowired
    DoctorService doctorService;

    @PostMapping("/patients/signup")
    public ResponseEntity<?> patientSignup(@Valid @RequestBody PatientRegistrationRequest requestBody) {
        var existsPatient = this.patientService.getByEmail(requestBody.getEmailAddress());
        var existsDoctor = this.doctorService.getByEmail(requestBody.getEmailAddress());
        if (existsPatient == null && existsDoctor == null) {
            PatientRegistrationResponse responseBody = this.patientService.registerPatient(requestBody);
            return ResponseEntity.status(HttpStatus.OK).body(responseBody);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
    }

    @PostMapping("/doctors/signup")
    public ResponseEntity<?> doctorSignup(@Valid @RequestBody DoctorRegistrationRequest requestBody) {
        var existsPatient = this.patientService.getByEmail(requestBody.getEmailAddress());
        var existsDoctor = this.doctorService.getByEmail(requestBody.getEmailAddress());
        if (existsPatient == null && existsDoctor == null) {
            Doctor responseBody = this.doctorService.registerDoctor(requestBody);
            return ResponseEntity.status(HttpStatus.OK).body(responseBody);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
    }
}
