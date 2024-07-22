package com.example.backend.dtos;

import com.example.backend.enumerations.ConsultationRequestStatus;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class PatientNotificationDto implements Serializable {
    private String doctorUuid;
    private String name;
    private LocalDate date;
    private String time;
    private ConsultationRequestStatus consultationRequestState;
    private LocalDateTime createdAt;

}
