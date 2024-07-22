package com.example.backend.dtos;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DoctorServiceInfoDto implements Serializable {
    private String name;
    private Float price;

}
