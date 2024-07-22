package com.example.backend.requests;

import com.example.backend.dtos.ExtraDoctorInformationDto;
import lombok.*;

import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class ExtraDoctorInformationRequest {
    private Set<ExtraDoctorInformationDto> additionalDoctorInformation;
    private String workAddress;
}
