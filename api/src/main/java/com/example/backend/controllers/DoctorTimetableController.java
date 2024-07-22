package com.example.backend.controllers;

import com.example.backend.requests.DoctorTimetableRequest;
import com.example.backend.services.DoctorScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountException;
import javax.security.auth.login.AccountNotFoundException;

@RestController
@RequestMapping("/doctors-schedules")
public class DoctorTimetableController {
    @Autowired
    DoctorScheduleService doctorScheduleService;

    @GetMapping("")
    public ResponseEntity<?> getDoctorTimetable(@RequestHeader(value="X-Auth-Token") String token) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.doctorScheduleService.getTimetable(token));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
        }
    }

    @PutMapping("")
    public ResponseEntity<?> updateDoctorTimetable(@Valid @RequestBody DoctorTimetableRequest requestBody, @RequestHeader(value="X-Auth-Token") String token) {
        try {
            String newToken = this.doctorScheduleService.updateTimetable(requestBody,token);
            return ResponseEntity.status(HttpStatus.OK).body("{\"token\":\"" + newToken + "\"}");
        } catch (AccountException exception) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    @GetMapping("/{doctor-uuid}/available-hours/{date}")
    public ResponseEntity<?> getDoctorCurrentDayTimetable(@Valid @PathVariable("date") String date, @Valid @PathVariable("doctor-uuid") String doctorUuid) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.doctorScheduleService.getAvailableTimeSlots(date, doctorUuid));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }
}
