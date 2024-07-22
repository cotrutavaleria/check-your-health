package com.example.backend.dtos;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ReviewDto implements Serializable {
    private String name;
    private String comment;
    private Integer stars;
    private String patientProfileImageUrl;

}
