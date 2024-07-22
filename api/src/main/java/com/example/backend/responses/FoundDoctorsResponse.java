package com.example.backend.responses;

import lombok.*;

import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FoundDoctorsResponse {
    private Set<DoctorSearchResponse> doctorList;
    private long totalElements;
}
