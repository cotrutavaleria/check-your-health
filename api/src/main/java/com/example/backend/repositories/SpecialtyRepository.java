package com.example.backend.repositories;

import com.example.backend.entities.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpecialtyRepository extends JpaRepository<Specialty, Integer> {
    @Override
    List<Specialty> findAll();

    Specialty findByEnglishName(String name);

    List<Specialty> findByEnglishNameContaining(String name);

    List<Specialty> findByRomanianNameContaining(String name);

    Optional<Specialty> findById(Integer name);

    @Override
    <S extends Specialty> S save(S entity);

    @Override
    void delete(Specialty entity);
}
