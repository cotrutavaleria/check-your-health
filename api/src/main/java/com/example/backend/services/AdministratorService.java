package com.example.backend.services;

import com.example.backend.entities.Administrator;
import com.example.backend.enumerations.UserType;
import com.example.backend.exceptions.ExpiredTokenException;
import com.example.backend.repositories.AdministratorRepository;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class AdministratorService {
    @Autowired
    AdministratorRepository administratorRepository;
    @Autowired
    SecurityService securityService;

    public String getByEmailAndPassword(String email, String password) {
        email = securityService.encodeData(email);
        var administrator = this.administratorRepository.findByEmailAddress(email);
        if (administrator != null) {
            if (this.securityService.checkPasswords(password, administrator.getPassword())) {
                return this.securityService.generateToken(String.valueOf(administrator.getId()), administrator.getUsername(), email, UserType.ADMINISTRATOR);
            }
        }
        return null;
    }

    public Administrator getInfo(String token) {
        try {
            Claims claims = this.securityService.decodeToken(token);
            return this.administratorRepository.findByEmailAddress(claims.getSubject());
        } catch (ExpiredTokenException exception) {
            return null;
        }
    }
}
