package com.example.backend.repositories;

import com.example.backend.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdministratorRepository extends JpaRepository<Administrator, Integer> {
    @Override
    List<Administrator> findAll();

    Administrator findByEmailAddress(String emailAddress);

    @Override
    <S extends Administrator> S save(S entity);
}
