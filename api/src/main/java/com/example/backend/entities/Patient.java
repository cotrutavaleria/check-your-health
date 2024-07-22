package com.example.backend.entities;

import com.example.backend.enumerations.UserType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@Entity
@Table(name = "patients")
public class Patient {
    @OneToMany(targetEntity = Appointment.class)
    Set<Appointment> appointments;
    @OneToMany(targetEntity = Review.class)
    Set<Review> reviews;
    @OneToOne(targetEntity = Image.class)
    Image image;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank(message = "Status must be PATIENT.")
    private UserType status;
    @NotBlank(message = "Full name must contain between 4 and 100 characters.")
    @Size(min = 4, max = 100)
    private String fullName;
    @Column(unique = true)
    @NotBlank(message = "E-mail address must be at least 3 characters.")
    @Size(min = 3, max = 100)
    @Email
    private String emailAddress;
    @Column(unique = true)
    private String uuid;
    @NotBlank(message = "Phone number must have 10 characters.")
    @Size(min = 10, max = 10)
    private String phoneNumber;
    @NotBlank(message = "Gender must be either Female or Male.")
    private String gender;
    @NotNull
    private String birthdate;
    @NotBlank(message = "Password must contain 8 too 100 characters.")
    @Size(min = 8, max = 100)
    private String password;
    private boolean isAccountActive;
}
