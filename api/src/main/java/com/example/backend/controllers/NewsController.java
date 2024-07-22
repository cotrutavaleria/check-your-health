package com.example.backend.controllers;

import com.example.backend.services.NewsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.AccountNotFoundException;

@RestController
@RequestMapping("/news")
public class NewsController {
    @Autowired
    NewsService newsService;

    @GetMapping("")
    public ResponseEntity<?> getBlogNews(@RequestHeader(value = "X-Auth-Token") String token, @Valid @RequestParam String language) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(newsService.getAll(token, language));
        } catch (AccountNotFoundException | JsonProcessingException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

}
