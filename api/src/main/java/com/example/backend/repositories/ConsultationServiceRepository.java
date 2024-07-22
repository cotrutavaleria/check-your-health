package com.example.backend.repositories;

import com.example.backend.entities.ConsultingType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultationServiceRepository extends JpaRepository<ConsultingType, Integer> {
    @Override
    List<ConsultingType> findAll();

    Optional<ConsultingType> findById(Integer name);

    @Override
    <S extends ConsultingType> S save(S entity);

    @Override
    void delete(ConsultingType entity);
}
