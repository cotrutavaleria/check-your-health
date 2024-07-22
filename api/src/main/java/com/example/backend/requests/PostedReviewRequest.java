package com.example.backend.requests;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PostedReviewRequest implements Serializable {
    private Integer stars;
    private String comment;
    private String doctorUuid;
}