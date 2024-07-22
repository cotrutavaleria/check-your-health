package com.example.backend.services;

import com.example.backend.dtos.ReviewDto;
import com.example.backend.entities.Doctor;
import com.example.backend.entities.Patient;
import com.example.backend.entities.Review;
import com.example.backend.repositories.DoctorRepository;
import com.example.backend.repositories.PatientRepository;
import com.example.backend.repositories.ReviewRepository;
import com.example.backend.requests.EmailMessageRequest;
import com.example.backend.requests.PostedReviewRequest;
import com.example.backend.responses.DoctorReviewsResponse;
import com.example.backend.services.utils.EmailService;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.text.DecimalFormat;
import java.util.HashSet;
import java.util.Set;

@Service
public class ReviewService {
    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    PatientRepository patientRepository;
    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    SecurityService securityService;

    @Autowired
    ImageService imageService;

    @Autowired
    EmailService emailService;


    private Review buildReview(Integer stars, String comment) {
        return Review.builder()
                .stars(stars)
                .comment(comment)
                .build();
    }

    public String postReview(String patientToken, PostedReviewRequest requestBody) throws AccountNotFoundException {
        Claims claims = this.securityService.decodeToken(patientToken);
        var patient = this.patientRepository.findByEmailAddress(claims.getSubject());
        if (patient == null) {
            throw new AccountNotFoundException("Patient not found!");
        }
        Review review = buildReview(requestBody.getStars(), securityService.encodeData(requestBody.getComment()));
        this.reviewRepository.save(review);
        Set<Review> patientReviews = patient.getReviews();
        patientReviews.add(review);
        var doctor = this.doctorRepository.findByUuid(securityService.encodeData(requestBody.getDoctorUuid()));
        if (doctor == null) {
            throw new AccountNotFoundException("Doctor not found!");
        }
        Set<Review> doctorReviews = doctor.getReviews();
        doctorReviews.add(review);
        patient.setReviews(patientReviews);
        this.patientRepository.save(patient);
        doctor.setReviews(doctorReviews);
        this.doctorRepository.save(doctor);
        sendDoctorNotification(doctor, review, patient.getFullName());
        sendPatientNotification(patient, doctor.getUuid());
        return null;
    }

    private void sendDoctorNotification(Doctor doctor, Review review, String patient) {
        String emailText = ("Dear " + securityService.decodeData(doctor.getFullName()) + ",")
                .concat("""


                        We would like to inform you that one of your patients posted a review on your page.\
                        Check it out:
                        
                        """)
                .concat(patient + "(" + review.getStars() + " stars):")
                .concat(securityService.decodeData(review.getComment()))
                .concat("\n\n If there are any questions, don't hesitate to reach out.")
                .concat("\n\nhttp://localhost:4200/help")
                .concat("\n\nBest regards,\nSymptoChecker Team");
        this.emailService.sendNewNotificationEmail(new EmailMessageRequest(securityService.decodeData(doctor.getEmailAddress()), emailText, "New notification"));
    }

    private void sendPatientNotification(Patient patient, String doctorUuid) {
        String emailText = ("Dear " + securityService.decodeData(patient.getFullName()) + ",")
                .concat("""


                        We would like to inform you that your review was posted on doctor's page.\
                         To check it out, please click on the following link.

                        """)
                .concat("http://localhost:4200/doctor/" + securityService.decodeData(doctorUuid))
                .concat("\n\n If there are any questions, don't hesitate to reach out.")
                .concat("\n\nhttp://localhost:4200/help")
                .concat("\n\nBest regards,\nSymptoChecker Team");
        this.emailService.sendNewNotificationEmail(new EmailMessageRequest(securityService.decodeData(patient.getEmailAddress()), emailText, "New notification"));
    }

    public DoctorReviewsResponse getDoctorReviews(String doctorUuid) throws AccountNotFoundException {
        var doctor = this.doctorRepository.findByUuid(securityService.encodeData(doctorUuid));
        if (doctor == null) {
            throw new AccountNotFoundException("Doctor not found!");
        }
        Set<ReviewDto> reviews = new HashSet<>();
        DecimalFormat decimalFormat = new DecimalFormat("0.00");
        Double ratingAverage = 0.0;
        for (Review review : doctor.getReviews()) {
            Patient patient = this.patientRepository.findByReviews(review);
            if (patient != null) {
                String patientProfileImage = "";
                if (patient.getImage() != null) {
                    patientProfileImage = this.imageService.getImageUrl(patient.getImage().getImageName());
                }
                ReviewDto reviewResponse = ReviewDto.builder()
                        .name(securityService.decodeData(patient.getFullName()))
                        .stars(review.getStars())
                        .comment(securityService.decodeData(review.getComment()))
                        .patientProfileImageUrl(patientProfileImage)
                        .build();
                reviews.add(reviewResponse);
                ratingAverage += review.getStars();
            }
        }

        if (!doctor.getReviews().isEmpty()) {
            return new DoctorReviewsResponse(decimalFormat.format(ratingAverage / doctor.getReviews().size()), reviews);
        }
        return new DoctorReviewsResponse("0.00", reviews);
    }

}
