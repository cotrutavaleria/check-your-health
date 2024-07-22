package com.example.backend.responses;

import com.example.backend.entities.ConsultingType;
import com.example.backend.entities.Specialty;
import com.example.backend.enumerations.UserType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Setter
@Getter
@Builder
public class DoctorDataResponse {
    private UserType userType;
    private String fullName;
    private String emailAddress;
    private String phoneNumber;
    private String gender;
    private LocalDate birthdate;
    private Set<Specialty> specialties;
    private Set<ConsultingType> consultingTypes;
    private String specialty;
    private String workAddress;
    private String image;

}
