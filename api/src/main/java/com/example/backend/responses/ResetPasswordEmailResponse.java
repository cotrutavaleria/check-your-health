package com.example.backend.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ResetPasswordEmailResponse {
    private String token;
    private String emailAddress;

}
