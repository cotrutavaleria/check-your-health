package com.example.backend.entities;

import com.example.backend.enumerations.UserType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "administrators")

public class Administrator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank(message = "Status must be ADMIN.")
    private UserType status;
    @NotBlank(message = "Username must contain between 4 and 100 characters.")
    @Size(min = 4, max = 100)
    private String username;
    @Column(unique = true)
    @NotBlank(message = "E-mail address must be at least 3 characters.")
    @Size(min = 3, max = 100)
    @Email
    private String emailAddress;
    @NotBlank(message = "Password must contain 8 too 100 characters.")
    @Size(min = 8, max = 100)
    private String password;
}
