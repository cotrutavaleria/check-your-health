package com.example.backend.services;

import com.example.backend.dtos.ArticleDto;
import com.example.backend.entities.Appointment;
import com.example.backend.entities.Doctor;
import com.example.backend.entities.Patient;
import com.example.backend.entities.Specialty;
import com.example.backend.repositories.DoctorRepository;
import com.example.backend.repositories.PatientRepository;
import com.example.backend.repositories.SpecialtyRepository;
import com.example.backend.services.utils.SecurityService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.security.auth.login.AccountNotFoundException;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class NewsService {
    @Autowired
    SecurityService securityService;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    SpecialtyRepository specialtyRepository;
    public static String API_KEY = "975a0f79be8fc520ad710ccf3f4940f6";
    public static String CATEGORY = "health";

    public Set<ArticleDto> getAll(String token, String language) throws AccountNotFoundException, JsonProcessingException {
        Set<ArticleDto> articles;
        String apiUrl;
        if (!token.isEmpty()) {
            Claims claims = this.securityService.decodeToken(token);
            var doctor = this.doctorRepository.findByEmailAddress(claims.getSubject());
            if (doctor != null) {
                apiUrl = getDoctorNews(doctor, language);
            } else {
                var patient = this.patientRepository.findByEmailAddress(claims.getSubject());
                if (patient == null) {
                    throw new AccountNotFoundException("There is no user with such e-mail address!");
                }
                apiUrl = getPatientNews(patient, language);
            }
        } else {
            if (language.equals("ro")) {
                apiUrl = "https://gnews.io/api/v4/top-headlines?category=" + CATEGORY + "&lang=ro&country=ro&&max=9&apikey=" + API_KEY;
            } else {
                apiUrl = "https://gnews.io/api/v4/top-headlines?category=" + CATEGORY + "&lang=en&country=gb&&max=9&apikey=" + API_KEY;
            }
        }
        articles = buildNewsBlog(apiUrl);
        return articles;
    }

    private String getDoctorNews(Doctor doctor, String language) {
        List<Specialty> doctorSpecialties = new ArrayList<>(doctor.getSpecialties());
        int randomSpecialtyIndex = ThreadLocalRandom.current().nextInt(doctorSpecialties.size());
        Specialty randomSpecialty = doctorSpecialties.get(randomSpecialtyIndex);
        String apiUrl;
        if (language.equals("ro")) {
            String specialtyName = randomSpecialty.getRomanianName().replace(" ", " OR ");
            apiUrl = "https://gnews.io/api/v4/top-headlines?category=" + CATEGORY + "&lang=ro&country=ro&q=" + specialtyName + "&max=9&apikey=" + API_KEY;
        } else {
            String specialtyName = randomSpecialty.getEnglishName().replace(" ", " OR ");
            apiUrl = "https://gnews.io/api/v4/top-headlines?category=" + CATEGORY + "&lang=en&country=gb&q=" + specialtyName + "&max=9&apikey=" + API_KEY;

        }
        return apiUrl;
    }

    private String getPatientNews(Patient patient, String language) throws AccountNotFoundException {
        Set<Appointment> patientAppointments = patient.getAppointments();
        if (patientAppointments.isEmpty()) {
            return "https://gnews.io/api/v4/top-headlines?category=" + CATEGORY + "&lang=" + language + "&country=" + language + "&&max=9&apikey=" + API_KEY;
        }
        List<Appointment> sortedAppointmentList = patientAppointments.stream()
                .sorted(Comparator.comparing(Appointment::getCreatedAt))
                .toList();
        Appointment lastAppointment = sortedAppointmentList.get(sortedAppointmentList.size() - 1);
        Doctor doctor = this.doctorRepository.findByAppointments(lastAppointment);
        if (doctor == null) {
            throw new AccountNotFoundException("There is no doctor that has such appointment!");
        }
        String apiUrl;
        String specialty = doctor.getSpecialty();
        if (language.equals("ro")) {
            Specialty doctorSpecialty = specialtyRepository.findByEnglishName(securityService.decodeData(specialty));
            String specialtyName = doctorSpecialty.getRomanianName().replace(" ", " OR ");
            apiUrl = "https://gnews.io/api/v4/top-headlines?category=" + CATEGORY + "&lang=ro&country=ro&q=" + specialtyName + "&max=9&apikey=" + API_KEY;

        } else {
            String specialtyName = securityService.decodeData(specialty).replace(" ", " OR ");
            apiUrl = "https://gnews.io/api/v4/top-headlines?category=" + CATEGORY + "&lang=en&country=gb&q=" + specialtyName + "&max=9&apikey=" + API_KEY;
        }
        return apiUrl;
    }

    private Set<ArticleDto> buildNewsBlog(String apiUrl) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode root = objectMapper.readTree(response.getBody());
        Set<ArticleDto> healthNews = new HashSet<>();
        for (JsonNode articleNode : root.get("articles")) {
            ArticleDto newsArticle = objectMapper.readValue(articleNode.toString(), ArticleDto.class);
            healthNews.add(newsArticle);
        }
        return healthNews;
    }

}
