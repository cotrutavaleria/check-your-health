package com.example.backend.services;

import com.example.backend.entities.Image;
import com.example.backend.repositories.DoctorRepository;
import com.example.backend.repositories.ImageRepository;
import com.example.backend.repositories.PatientRepository;
import com.example.backend.services.utils.AmazonService;
import com.example.backend.services.utils.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

@Service
public class ImageService {

    @Autowired
    private AmazonService amazonService;
    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private SecurityService securityService;

    public String save(MultipartFile file, String emailAddress) throws IOException {
        try {
            var existsPatient = this.patientRepository.findByEmailAddress(emailAddress);
            var existsDoctor = this.doctorRepository.findByEmailAddress(emailAddress);
            int id = 0;
            int status = 0;
            if (existsPatient != null) {
                id = existsPatient.getId();
            }
            if (existsDoctor != null) {
                id = existsDoctor.getId();
                status = 1;
            }
            this.amazonService.uploadImage(file.getOriginalFilename(), file.getInputStream());
            Image image = Image.builder()
                    .imageName(file.getOriginalFilename())
                    .userId(id)
                    .userType(status)
                    .build();
            this.imageRepository.save(image);
            if (status == 0 && existsPatient != null) {
                existsPatient.setImage(image);
                this.patientRepository.save(existsPatient);
            }
            if (status == 1) {
                existsDoctor.setImage(image);
                this.doctorRepository.save(existsDoctor);
            }
            return this.getImageUrl(image.getImageName());
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public String getImageUrl(String imageName) {
        return this.amazonService.getImage(imageName);
    }
}
