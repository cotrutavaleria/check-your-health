package com.example.backend.controllers;

import com.example.backend.entities.Doctor;
import com.example.backend.responses.DoctorApplicationResponse;
import com.example.backend.services.AdministratorService;
import com.example.backend.services.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/doctor-applications")
public class DoctorApplicationController {
    @Autowired
    DoctorService doctorService;
    @Autowired
    AdministratorService administratorService;

    @GetMapping("")
    public ResponseEntity<?> getAll() {
        List<DoctorApplicationResponse> table = this.doctorService.getRegistrationRequests();
        return ResponseEntity.status(HttpStatus.OK).body(table);
    }

    @PutMapping("/{email-address}/accepted")
    public ResponseEntity<?> acceptDoctorRequest(@Valid @PathVariable("email-address") String email) {
        try {
            Doctor doctorData = this.doctorService.setAccountActive(email);
            this.doctorService.sendActivationEmail(email);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @DeleteMapping("/{email-address}/rejected")
    public ResponseEntity<?> rejectDoctorRequest(@Valid @PathVariable("email-address") String email) {
        try {
            String message = ("Hello there,").concat("\n\nUnfortunately, your application has been rejected. Please, register again.").concat("\n\nBest regards,\nSymptoChecker Team");
            this.doctorService.sendAdminSuggestions(email, message);
            this.doctorService.rejectDoctorRequest(email);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @PostMapping("/{email-address}/email-rejected")
    public ResponseEntity<?> rejectDoctorRequestEmail(@Valid @PathVariable("email-address") String email, @Valid @RequestBody Map<String, String> body) {
        try {
            this.doctorService.sendAdminSuggestions(email, body.get("message"));
            this.doctorService.rejectDoctorRequest(email);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }
}
