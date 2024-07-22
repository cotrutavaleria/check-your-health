package com.example.backend.services;

import com.example.backend.entities.Specialty;
import com.example.backend.repositories.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialtyService {
    @Autowired
    SpecialtyRepository specialtyRepository;
    public List<Specialty> getAll(){
        return this.specialtyRepository.findAll();
    }
}
