package com.example.backend.responses;

import com.example.backend.entities.Specialty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
public class DoctorApplicationResponse {
   private String fullName;
   private String specialty;
   private Set<Specialty> specialties;
   private String workAddress;
   private String emailAddress;
   private String gender;
   private LocalDate birthdate;
   private String phoneNumber;


}