package com.example.backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "consulting_types")

public class ConsultingType implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank(message = "Price should not be null.")
    @NotNull
    private Float price;
    @NotBlank(message = "Name should not be null.")
    @NotNull
    private String name;

    @NotBlank(message = "specialtyId should not be null.")
    @NotNull
    private Integer specialtyId;




}
