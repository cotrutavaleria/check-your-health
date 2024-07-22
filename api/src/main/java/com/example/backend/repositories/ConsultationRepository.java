package com.example.backend.repositories;

import com.example.backend.entities.Appointment;
import com.example.backend.enumerations.ConsultationRequestStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Appointment, Integer> {
    @Override
    List<Appointment> findAll();

    Optional<Appointment> findById(Integer id);

    List<Appointment> findByStatus(ConsultationRequestStatus status);

    List<Appointment> findByStatus(ConsultationRequestStatus status, Sort sort);

    List<Appointment> findByDateAndTimeAndCreatedAtOrderByDateAsc(LocalDate date, LocalTime time, LocalDateTime createdAt);

    @Override
    <S extends Appointment> S save(S entity);

    @Override
    void delete(Appointment entity);

    @Override
    void deleteById(Integer integer);
}
