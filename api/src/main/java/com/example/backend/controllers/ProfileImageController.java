package com.example.backend.controllers;

import com.example.backend.services.ImageService;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/images")
public class ProfileImageController {
    @Autowired
    SecurityService securityService;
    @Autowired
    private ImageService imageService;

    @PostMapping("")
    public ResponseEntity<?> saveProfileImage(@RequestParam("file") MultipartFile file, @RequestHeader(value="X-Auth-Token") String token) throws IOException {
        Claims claims = this.securityService.decodeToken(token);
        String imageUrl = this.imageService.save(file, claims.getSubject());
        Map<String, String> map = new HashMap<>();
        map.put("imageUrl", imageUrl);
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }
}
