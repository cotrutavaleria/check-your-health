package com.example.backend.dtos;

import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExtraDoctorInformationDto implements Serializable {
    private String specialty;
    private Set<DoctorServiceInfoDto> serviceInfo;
}
