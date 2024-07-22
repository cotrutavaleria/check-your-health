package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.time.LocalTime;

@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctors_working_schedules")

public class DoctorTimetable implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank(message = "Day should not be null.")
    @NotNull
    private Integer day;
    @NotBlank(message = "StartsAt should not be null.")
    @NotNull
    private LocalTime startsAt;
    @NotBlank(message = "EndsAt should not be null.")
    @NotNull
    private LocalTime endsAt;



}
