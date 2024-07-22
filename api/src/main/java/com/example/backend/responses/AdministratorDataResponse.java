package com.example.backend.responses;

import com.example.backend.enumerations.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class AdministratorDataResponse {
    private UserType userType;
    private String username;
    private String emailAddress;


}
