package com.example.backend.dtos;

import com.example.backend.entities.ConsultingType;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class DoctorNotificationDto implements Serializable {
    private String patientUuid;
    private String name;
    private String phoneNumber;
    private LocalDate date;
    private String time;
    private Set<ConsultingType> services;
    private String reason;
    private boolean isPatientNew;
    private float totalAmount;
    private LocalDateTime createdAt;

}
