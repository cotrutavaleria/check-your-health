package com.example.backend.dtos;

import com.example.backend.entities.ConsultingType;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class PatientConsultationDto implements Serializable {
    private String doctorUuid;
    private String name;
    private LocalDate date;
    private String time;
    private Set<ConsultingType> doctorServices;
    private float totalAmount;
}
