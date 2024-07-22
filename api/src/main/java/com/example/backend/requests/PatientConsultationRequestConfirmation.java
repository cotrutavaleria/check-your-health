package com.example.backend.requests;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PatientConsultationRequestConfirmation implements Serializable {
   private String date;
   private String time;
   private LocalDateTime createdAt;
}
