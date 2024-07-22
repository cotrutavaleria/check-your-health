package com.example.backend.controllers;

import com.example.backend.exceptions.ExistentConsultationFoundException;
import com.example.backend.repositories.DoctorRepository;
import com.example.backend.requests.PatientAppointmentRequest;
import com.example.backend.services.ConsultationService;
import com.example.backend.services.utils.SecurityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;
import java.security.InvalidParameterException;

@RestController
@RequestMapping("/appointments")
public class ConsultationController {
    @Autowired
    ConsultationService consultationService;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    SecurityService securityService;

    @PostMapping("/{doctor-uuid}")
    public ResponseEntity<?> saveConsultationRequest(@RequestHeader(value = "X-Auth-Token") String token,
                                                     @Valid @PathVariable("doctor-uuid") String doctorUuid,
                                                     @Valid @RequestBody PatientAppointmentRequest requestBody) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.consultationService.createConsultationRequest(token, doctorUuid, requestBody));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (ExistentConsultationFoundException | InvalidParameterException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<?> getPatientConsultations(@RequestHeader(value = "X-Auth-Token") String token,
                                                     @Valid @RequestParam(defaultValue = "0") int page,
                                                     @Valid @RequestParam(defaultValue = "25") int size) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.consultationService.getPatientConsultations(token, page, size));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctorConsultations(@RequestHeader(value = "X-Auth-Token") String token,
                                                    @Valid @RequestParam(defaultValue = "0") int page,
                                                    @Valid @RequestParam(defaultValue = "25") int size) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.consultationService.getDoctorConsultations(token, page, size));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @GetMapping("/doctors/{doctor-uuid}/consulting-types")
    public ResponseEntity<?> getDoctorServices(@Valid @PathVariable("doctor-uuid") String doctorUuid) {
        var doctor = this.doctorRepository.findByUuid(securityService.encodeData(doctorUuid));
        if (doctor != null) {
            return ResponseEntity.status(HttpStatus.OK).body(doctor.getConsultingTypes());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }


}
