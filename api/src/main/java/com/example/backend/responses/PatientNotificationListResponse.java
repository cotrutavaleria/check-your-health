package com.example.backend.responses;

import com.example.backend.dtos.PatientNotificationDto;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class PatientNotificationListResponse {
    List<PatientNotificationDto> notifications;
}
