package com.example.backend.responses;

import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class AvailableHoursResponse {
    List<String> availableHours;
}
