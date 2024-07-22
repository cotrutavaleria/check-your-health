package com.example.backend.responses;

import com.example.backend.enumerations.UserType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Builder
public class PatientDataResponse {
    private UserType userType;
    private String fullName;
    private String emailAddress;
    private String phoneNumber;
    private String gender;
    private LocalDate birthdate;
    private String image;
}
