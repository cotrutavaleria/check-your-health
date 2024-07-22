package com.example.backend.requests;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class PasswordChangingRequest {
    private String token;
    private String password;
}
