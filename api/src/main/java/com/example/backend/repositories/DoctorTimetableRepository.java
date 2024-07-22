package com.example.backend.repositories;

import com.example.backend.entities.DoctorTimetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorTimetableRepository extends JpaRepository<DoctorTimetable, Integer> {
    @Override
    List<DoctorTimetable> findAll();

    @Override
    Optional<DoctorTimetable> findById(Integer integer);

    @Override
    <S extends DoctorTimetable> S save(S entity);

    @Override
    void delete(DoctorTimetable entity);
}
