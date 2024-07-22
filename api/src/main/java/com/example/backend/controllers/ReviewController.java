package com.example.backend.controllers;

import com.example.backend.requests.PostedReviewRequest;
import com.example.backend.services.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    @Autowired
    ReviewService reviewService;

    @PostMapping("/patients")
    public ResponseEntity<?> postReview(@RequestHeader(value="X-Auth-Token") String patientToken, @Valid @RequestBody PostedReviewRequest reviewRequest) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.reviewService.postReview(patientToken, reviewRequest));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }
    }

    @GetMapping("/doctors/{doctor-uuid}")
    public ResponseEntity<?> getDoctorsReviews(@Valid @PathVariable("doctor-uuid") String doctorUuid) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(this.reviewService.getDoctorReviews(doctorUuid));
        } catch (AccountNotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        }
    }
}
