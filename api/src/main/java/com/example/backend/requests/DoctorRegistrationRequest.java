package com.example.backend.requests;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class DoctorRegistrationRequest {
    private String specialty;
    private String workAddress;
    private String fullName;
    private String gender;
    private LocalDate birthdate;
    private String emailAddress;
    private String phoneNumber;
    private String password;
    private String passwordConfirmation;
}
