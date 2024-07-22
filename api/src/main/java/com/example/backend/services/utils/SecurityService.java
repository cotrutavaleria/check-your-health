package com.example.backend.services.utils;

import com.example.backend.enumerations.UserType;
import com.example.backend.exceptions.ExpiredTokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Service
public class SecurityService {
    private static final String TOKEN_PRIVATE_KEY = "asdfSFS34wfsdfsdfSDSD32dfsddDDerQSNCK34SOWEK5354fdgdf4";
    private static final Key HMACSharedSecretKey = new SecretKeySpec(Base64.getDecoder().decode(TOKEN_PRIVATE_KEY),
            SignatureAlgorithm.HS256.getJcaName());

    private final PasswordEncoder BCryptPasswordEncoder = new BCryptPasswordEncoder();

    public Claims decodeToken(String token) {
        Claims decodedToken = Jwts.parser()
                .setSigningKey(HMACSharedSecretKey)
                .parseClaimsJws(token).getBody();
        if (decodedToken == null) {
            throw new ExpiredTokenException("Your token has expired.");
        }
        return decodedToken;
    }

    public String generateToken(String id, String fullName, String email, UserType userType) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setId(id)
                .claim("name", fullName)
                .claim("emailAddress", email)
                .claim("userType", userType)
                .setSubject(email)
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(5000L, ChronoUnit.MINUTES)))
                .signWith(SignatureAlgorithm.HS256, HMACSharedSecretKey)
                .compact();
    }

    public String encryptPassword(String userPassword) {
        return BCryptPasswordEncoder.encode(userPassword);
    }

    public boolean checkPasswords(String providedUserPassword, String hashedPassword) {
        return BCryptPasswordEncoder.matches(providedUserPassword, hashedPassword);
    }

    public String encodeData(String data) {
        return Base64.getEncoder().encodeToString(data.getBytes());
    }

    public String decodeData(String encodedData) {
        return new String(Base64.getDecoder().decode(encodedData));
    }

}
