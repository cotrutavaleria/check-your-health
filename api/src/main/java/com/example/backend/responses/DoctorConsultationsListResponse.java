package com.example.backend.responses;

import com.example.backend.dtos.DoctorConsultationDto;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class DoctorConsultationsListResponse {
    private List<DoctorConsultationDto> appointments;
    private long totalElements;
}
