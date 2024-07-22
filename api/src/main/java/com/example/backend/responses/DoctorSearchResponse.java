package com.example.backend.responses;

import com.example.backend.entities.Specialty;
import lombok.*;

import java.util.Set;

@Setter
@Getter
@Builder
@AllArgsConstructor
@ToString

public class DoctorSearchResponse {
   private String uuid;
   private String fullName;
   private Set<Specialty> specialties;
   private String workAddress;
   private String phoneNumber;
   private String image;
   private String rate;

}