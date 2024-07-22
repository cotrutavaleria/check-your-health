package com.example.backend.controllers;

import com.example.backend.enumerations.ConsultationRequestStatus;
import com.example.backend.exceptions.ExpiredTokenException;
import com.example.backend.requests.ContactUsRequest;
import com.example.backend.requests.PatientConsultationRequestConfirmation;
import com.example.backend.services.NotificationService;
import com.example.backend.services.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    NotificationService notificationService;
    @Autowired
    PatientService patientService;

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctorNotifications(@RequestHeader(value="X-Auth-Token") String token) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.notificationService.getDoctorNotifications(token));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @GetMapping("/doctors/requests/{patient-uuid}")
    public ResponseEntity<?> getPatientProfileInformation(@Valid @PathVariable("patient-uuid") String patientUuid) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.patientService.getByUuid(patientUuid));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @PutMapping("/doctors/accepted/{patient-uuid}")
    public ResponseEntity<?> acceptPatientConsultationRequest(@Valid @PathVariable("patient-uuid") String patientUuid, @Valid @RequestBody PatientConsultationRequestConfirmation request) {
        try {
            this.notificationService.changeConsultationRequestStatus(patientUuid, request, ConsultationRequestStatus.ACCEPTED);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @PutMapping("/doctors/rejected/{patient-uuid}")
    public ResponseEntity<?> rejectPatientConsultationRequest(@Valid @PathVariable("patient-uuid") String patientUuid, @Valid @RequestBody PatientConsultationRequestConfirmation request) {
        try {
            this.notificationService.changeConsultationRequestStatus(patientUuid, request, ConsultationRequestStatus.REFUSED);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getPatientNotifications(@RequestHeader(value="X-Auth-Token") String token) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.notificationService.getPatientNotifications(token));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @PostMapping("/contact-us")
    public ResponseEntity<?> contactUs(@Valid @RequestBody ContactUsRequest contactUsRequest) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.notificationService.sendContactNotification(contactUsRequest));
        } catch (ExpiredTokenException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
