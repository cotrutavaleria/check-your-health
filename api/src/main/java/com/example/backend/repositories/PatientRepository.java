package com.example.backend.repositories;

import com.example.backend.entities.Appointment;
import com.example.backend.entities.Patient;
import com.example.backend.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    @Override
    List<Patient> findAll();

    Patient findByEmailAddress(String emailAddress);

    Patient findByAppointments(Appointment appointment);

    Patient findByUuid(String uuid);

    Patient findByReviews(Review review);

    @Override
    <S extends Patient> S save(S entity);

}
