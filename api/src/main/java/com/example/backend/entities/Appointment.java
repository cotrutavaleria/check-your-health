package com.example.backend.entities;

import com.example.backend.enumerations.ConsultationRequestStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")

public class Appointment implements Serializable {
    @ManyToMany(targetEntity = ConsultingType.class)
    Set<ConsultingType> consultingTypes;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank(message = "Date should not be null.")
    @NotNull
    private LocalDate date;
    @NotBlank(message = "Time should not be null.")
    @NotNull
    private LocalTime time;
    @NotBlank(message = "Status should not be null.")
    @NotNull
    private ConsultationRequestStatus status;
    @NotBlank(message = "User role should not be null.")
    @NotNull
    private String explanation;
    @NotBlank(message = "New patient should not be null.")
    @NotNull
    private boolean newPatient;
    @NotBlank(message = "Created at should not be null.")
    @NotNull
    private LocalDateTime createdAt;
    @NotBlank(message = "Created at should not be null.")
    @NotNull
    private float totalAmount;



}
