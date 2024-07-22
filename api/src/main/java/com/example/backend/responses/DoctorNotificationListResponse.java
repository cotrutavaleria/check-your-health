package com.example.backend.responses;

import com.example.backend.dtos.DoctorNotificationDto;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class DoctorNotificationListResponse {
    List<DoctorNotificationDto> notifications;
}
