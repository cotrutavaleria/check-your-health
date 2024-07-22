package com.example.backend.requests;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class EmailMessageRequest {
    private String receiver;
    private String emailBody;
    private String subject;
}
