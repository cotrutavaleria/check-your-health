package com.example.backend.dtos;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DoctorTimetableDto implements Serializable {
    private String day;
    private String startsAt;
    private String endsAt;
}
