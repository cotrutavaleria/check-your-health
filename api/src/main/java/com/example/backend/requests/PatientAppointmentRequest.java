package com.example.backend.requests;

import com.example.backend.entities.ConsultingType;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PatientAppointmentRequest implements Serializable {
   private String date;
   private String time;
   private Set<ConsultingType> consultingTypes;
   private String explanation;
   private int isNew;
   private float totalAmount;
}
