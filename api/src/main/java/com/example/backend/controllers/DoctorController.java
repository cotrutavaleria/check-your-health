package com.example.backend.controllers;

import com.example.backend.exceptions.ExpiredTokenException;
import com.example.backend.requests.ExtraDoctorInformationRequest;
import com.example.backend.requests.GeneralUserInformationRequest;
import com.example.backend.responses.DoctorSearchResponse;
import com.example.backend.services.DoctorScheduleService;
import com.example.backend.services.DoctorService;
import com.example.backend.services.SpecialtyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountException;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/doctors")
public class DoctorController {
    @Autowired
    DoctorService doctorService;
    @Autowired
    SpecialtyService specialtyService;

    @Autowired
    DoctorScheduleService doctorScheduleService;

    @PutMapping("")
    public ResponseEntity<?> updateGeneralInformation(@Valid @RequestBody GeneralUserInformationRequest requestBody, @RequestHeader(value = "X-Auth-Token") String token) {
        try {
            String newToken = this.doctorService.updateGeneralInformation(requestBody, token);
            return ResponseEntity.status(HttpStatus.OK).body("{\"token\":\"" + newToken + "\"}");
        } catch (AccountException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @PutMapping("/work-settings")
    public ResponseEntity<?> updateWorkInformation(@Valid @RequestBody ExtraDoctorInformationRequest requestBody, @RequestHeader(value = "X-Auth-Token") String token) {
        try {
            String newToken = this.doctorService.updateWorkInformation(requestBody, token);
            return ResponseEntity.status(HttpStatus.OK).body("{\"token\":\"" + newToken + "\"}");
        } catch (ExpiredTokenException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @GetMapping("/specialties")
    public ResponseEntity<?> getSpecialties() {
        return ResponseEntity.status(HttpStatus.OK).body(this.specialtyService.getAll());
    }

    @GetMapping("")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(this.doctorService.getAll());
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchDoctor(
            @Valid @RequestParam(defaultValue = "0") int page,
            @Valid @RequestParam(defaultValue = "25") int size,
            @Valid @RequestParam String specialty,
            @Valid @RequestParam String name,
            @Valid @RequestParam String location) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.doctorService.searchDoctor(specialty, name, location, page, size));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{field}")
    public ResponseEntity<?> getByUuidOrName(@Valid @PathVariable("field") String field) {
        try {
            DoctorSearchResponse doctor = this.doctorService.getByUuid(field);
            if (doctor != null) {
                return ResponseEntity.status(HttpStatus.OK).body(doctor);
            }
            List<DoctorSearchResponse> doctors = this.doctorService.getByName(field);
            return ResponseEntity.status(HttpStatus.OK).body(doctors);
        } catch (NoSuchElementException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
