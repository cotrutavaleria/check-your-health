package com.example.backend.repositories;

import com.example.backend.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Override
    List<Review> findAll();

    Optional<Review> findById(Integer name);

    @Override
    <S extends Review> S save(S entity);

    @Override
    void delete(Review entity);
}
