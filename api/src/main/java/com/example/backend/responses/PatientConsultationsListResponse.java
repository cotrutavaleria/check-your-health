package com.example.backend.responses;

import com.example.backend.dtos.PatientConsultationDto;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class PatientConsultationsListResponse {
    private List<PatientConsultationDto> appointments;
    private long totalElements;

}
