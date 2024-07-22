package com.example.backend.responses;

import com.example.backend.dtos.DoctorTimetableDto;
import lombok.*;

import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class DoctorTimetableResponse {
    Set<DoctorTimetableDto> weeklyProgramme;
}
