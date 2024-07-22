package com.example.backend.requests;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class AuthenticationRequest {
    private String emailAddress;
    private String password;
}
