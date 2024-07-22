package com.example.backend.responses;

import com.example.backend.enumerations.UserType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PatientRegistrationResponse {
    private String token;
    private UserType userType;
    private String emailAddress;
    private String fullName;
}
