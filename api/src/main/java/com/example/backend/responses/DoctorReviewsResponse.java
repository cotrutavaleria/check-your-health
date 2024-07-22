package com.example.backend.responses;

import com.example.backend.dtos.ReviewDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class DoctorReviewsResponse {
    private String ratingAverage;
    private Set<ReviewDto> reviews;
}
