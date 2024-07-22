package com.example.backend.repositories;

import com.example.backend.entities.Appointment;
import com.example.backend.entities.Doctor;
import com.example.backend.entities.Specialty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Page<Doctor> findBySpecialties(Specialty specialty, Pageable pageable);

    Page<Doctor> findAll(Pageable pageable);

    @Override
    List<Doctor> findAll();

    Optional<Doctor> findById(Integer integer);

    Doctor findByEmailAddress(String emailAddress);

    Doctor findByUuid(String uuid);

    Doctor findByAppointments(Appointment appointment);

    List<Doctor> findByIsAccountActive(boolean isActive);


    @Override
    <S extends Doctor> S save(S entity);

    @Override
    void delete(Doctor entity);
}
