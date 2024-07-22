package com.example.backend.requests;

import com.example.backend.dtos.DoctorTimetableDto;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DoctorTimetableRequest implements Serializable {
    private Set<DoctorTimetableDto> weeklyProgramme;
}