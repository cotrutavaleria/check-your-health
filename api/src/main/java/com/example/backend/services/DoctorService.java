package com.example.backend.services;

import com.example.backend.dtos.ExtraDoctorInformationDto;
import com.example.backend.dtos.DoctorServiceInfoDto;
import com.example.backend.entities.ConsultingType;
import com.example.backend.entities.Doctor;
import com.example.backend.entities.Review;
import com.example.backend.entities.Specialty;
import com.example.backend.enumerations.UserType;
import com.example.backend.exceptions.ExpiredTokenException;
import com.example.backend.repositories.ConsultationServiceRepository;
import com.example.backend.repositories.DoctorRepository;
import com.example.backend.repositories.SpecialtyRepository;
import com.example.backend.requests.EmailMessageRequest;
import com.example.backend.requests.DoctorRegistrationRequest;
import com.example.backend.requests.ExtraDoctorInformationRequest;
import com.example.backend.requests.GeneralUserInformationRequest;
import com.example.backend.responses.DoctorApplicationResponse;
import com.example.backend.responses.FoundDoctorsResponse;
import com.example.backend.responses.DoctorSearchResponse;
import com.example.backend.services.utils.EmailService;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountException;
import javax.security.auth.login.AccountNotFoundException;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional

public class DoctorService {
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    ConsultationServiceRepository consultationServiceRepository;
    @Autowired
    SpecialtyRepository specialtyRepository;
    @Autowired
    SecurityService securityService;
    @Autowired
    EmailService emailService;
    @Autowired
    ImageService imageService;


    public List<DoctorSearchResponse> getAll() {
        List<Doctor> allDoctors = this.doctorRepository.findAll();
        List<DoctorSearchResponse> doctorSearchResponse = new ArrayList<>();
        for (Doctor doctor : allDoctors) {
            String profileImage = "";
            if (doctor.getImage() != null) {
                profileImage = this.imageService.getImageUrl(doctor.getImage().getImageName());
            }
            doctorSearchResponse.add(DoctorSearchResponse.builder()
                    .uuid(securityService.decodeData(doctor.getUuid()))
                    .fullName(securityService.decodeData(doctor.getFullName()))
                    .specialties(doctor.getSpecialties())
                    .workAddress(securityService.decodeData(doctor.getWorkAddress()))
                    .phoneNumber(securityService.decodeData(doctor.getPhoneNumber()))
                    .image(profileImage)
                    .build());
        }
        return doctorSearchResponse;
    }

    public String getByEmailAndPassword(String email, String password) throws AccountException {
        email = securityService.encodeData(email);
        var doctor = doctorRepository.findByEmailAddress(email);
        if (doctor != null) {
            if (!doctor.isAccountActive()) {
                throw new AccountException("Your account is still not enabled!");
            }
            Boolean passwordsMatching = securityService.checkPasswords(password, doctor.getPassword());
            if (passwordsMatching) {
                return this.securityService.generateToken(String.valueOf(doctor.getId()), doctor.getFullName(), email, UserType.DOCTOR);
            }
        }
        return null;
    }

    public Doctor getByEmail(String email) {
        return doctorRepository.findByEmailAddress(securityService.encodeData(email));
    }

    public Doctor registerDoctor(DoctorRegistrationRequest doctor) {
        Set<Specialty> specialties = new HashSet<>();
        Specialty primarySpecialty = this.specialtyRepository.findByEnglishName(doctor.getSpecialty());
        specialties.add(primarySpecialty);

        Doctor newDoctor = Doctor.builder()
                .uuid(securityService.encodeData(UUID.randomUUID().toString()))
                .status(UserType.DOCTOR)
                .specialty(securityService.encodeData(doctor.getSpecialty()))
                .specialties(specialties)
                .workAddress(securityService.encodeData(doctor.getWorkAddress()))
                .fullName(securityService.encodeData(doctor.getFullName()))
                .emailAddress(securityService.encodeData(doctor.getEmailAddress()))
                .phoneNumber(securityService.encodeData(doctor.getPhoneNumber()))
                .gender(securityService.encodeData(doctor.getGender()))
                .birthdate(securityService.encodeData(doctor.getBirthdate().toString()))
                .password(securityService.encryptPassword(doctor.getPassword()))
                .isAccountActive(false)
                .build();
        this.doctorRepository.save(newDoctor);
        return newDoctor;
    }

    public Doctor getInfo(String token) {
        try {
            Claims claims = this.securityService.decodeToken(token);
            return this.doctorRepository.findByEmailAddress(claims.getSubject());
        } catch (ExpiredTokenException exception) {
            return null;
        }
    }

    public List<DoctorApplicationResponse> getRegistrationRequests() {
        List<Doctor> doctorsList = this.doctorRepository.findByIsAccountActive(false);
        List<DoctorApplicationResponse> table = new ArrayList<>();
        for (Doctor doctor : doctorsList) {
            DoctorApplicationResponse row = DoctorApplicationResponse.builder()
                    .fullName(securityService.decodeData(doctor.getFullName()))
                    .specialty(securityService.decodeData(doctor.getSpecialty()))
                    .workAddress(securityService.decodeData(doctor.getWorkAddress()))
                    .emailAddress(securityService.decodeData(doctor.getEmailAddress()))
                    .phoneNumber(securityService.decodeData(doctor.getPhoneNumber()))
                    .gender(securityService.decodeData(doctor.getGender()))
                    .birthdate(LocalDate.parse(securityService.decodeData(doctor.getBirthdate())))
                    .build();
            table.add(row);
        }
        return table;
    }

    public Doctor setAccountActive(String email) throws AccountNotFoundException {
        email = securityService.encodeData(email);
        Doctor doctorData = this.doctorRepository.findByEmailAddress(email);
        if (doctorData == null) {
            throw new AccountNotFoundException("There is no account registered with this email address.");
        }
        doctorData.setAccountActive(true);
        this.doctorRepository.save(doctorData);
        return doctorData;
    }

    public void rejectDoctorRequest(String email) throws AccountNotFoundException {
        Doctor doctorData = this.doctorRepository.findByEmailAddress(securityService.encodeData(email));
        if (doctorData == null) {
            throw new AccountNotFoundException("There is no account registered with this email address.");
        }
        this.doctorRepository.delete(doctorData);
    }

    public Doctor sendChangePasswordEmail(String email) throws AccountException {
        email = securityService.encodeData(email);
        var doctor = this.doctorRepository.findByEmailAddress(email);
        if (doctor != null) {
            if (!doctor.isAccountActive()) {
                throw new AccountException("Your account is still not activated!");
            }
            String token = this.securityService.generateToken(String.valueOf(doctor.getId()), doctor.getFullName(), doctor.getEmailAddress(), UserType.DOCTOR);
            this.emailService.sendResetPasswordEmail(new EmailMessageRequest(doctor.getEmailAddress(), ("http://localhost:4200/auth/reset-password/").concat(token), "Reset password request"));
        }
        return doctor;
    }

    public Doctor updatePassword(String token, String newPassword) {
        Claims claims = this.securityService.decodeToken(token);
        if (claims == null) {
            throw new ExpiredTokenException("JWT validity cannot be asserted and should not be trusted.");
        }
        String email = claims.getSubject();
        Doctor doctorData = this.doctorRepository.findByEmailAddress(email);
        if (doctorData != null) {
            doctorData.setPassword(securityService.encryptPassword(newPassword));
            this.doctorRepository.save(doctorData);
        }
        return doctorData;
    }

    public void sendActivationEmail(String email) throws AccountNotFoundException {
        String encodedEmail = securityService.encodeData(email);
        var doctor = this.doctorRepository.findByEmailAddress(encodedEmail);
        if (doctor == null) {
            throw new AccountNotFoundException("There is no account with such e-mail address!");
        }
        this.emailService.sendDoctorAccountActivationEmail(new EmailMessageRequest(email, null, "Activate account"));
    }

    public void sendAdminSuggestions(String email, String emailBody) throws AccountNotFoundException {
        String encodedEmail = securityService.encodeData(email);
        var doctor = this.doctorRepository.findByEmailAddress(encodedEmail);
        if (doctor == null) {
            throw new AccountNotFoundException("There is no account with such e-mail address!");
        }
        this.emailService.sendEmailFromAdmin(new EmailMessageRequest(email, emailBody, "Account activation was rejected."));
    }

    public String updateGeneralInformation(GeneralUserInformationRequest doctor, String token) throws AccountException {
        Claims claims = this.securityService.decodeToken(token);
        Doctor doctorData = this.doctorRepository.findByEmailAddress(claims.getSubject());
        if (doctorData == null) {
            throw new AccountNotFoundException("There is no account with such e-mail address!");
        }
        if (!securityService.decodeData(claims.getSubject()).equals(doctor.getEmailAddress())) {
            Doctor findDoctor = this.doctorRepository.findByEmailAddress(securityService.encodeData(doctor.getEmailAddress()));
            if (findDoctor == null) {
                doctorData.setEmailAddress(securityService.encodeData(doctor.getEmailAddress()));
            } else {
                throw new AccountException("The e-mail address is already taken!");
            }
        }
        doctorData.setFullName(securityService.encodeData(doctor.getFullName()));
        doctorData.setGender(securityService.encodeData(doctor.getGender()));
        doctorData.setBirthdate(securityService.encodeData(doctor.getBirthdate().toString()));
        doctorData.setPhoneNumber(securityService.encodeData(doctor.getPhoneNumber()));
        this.doctorRepository.save(doctorData);
        return this.securityService.generateToken(String.valueOf(doctorData.getId()), doctorData.getFullName(), doctorData.getEmailAddress(), UserType.DOCTOR);
    }

    public String updateWorkInformation(ExtraDoctorInformationRequest doctor, String token) throws AccountException, ExpiredTokenException {
        Claims claims = this.securityService.decodeToken(token);
        Doctor doctorData = this.doctorRepository.findByEmailAddress(claims.getSubject());
        if (doctorData == null) {
            throw new AccountNotFoundException("There is no account with such e-mail address!");
        }
        doctorData.setWorkAddress(securityService.encodeData(doctor.getWorkAddress()));
        Set<Specialty> specialtyList = new HashSet<>();
        Set<ConsultingType> consultingTypes = new HashSet<>();
        for (ExtraDoctorInformationDto additionalDoctorInformation : doctor.getAdditionalDoctorInformation()) {
            Specialty specialty = this.specialtyRepository.findByEnglishName(additionalDoctorInformation.getSpecialty());
            Set<DoctorServiceInfoDto> consultations = additionalDoctorInformation.getServiceInfo();
            for (DoctorServiceInfoDto consultation : consultations) {
                ConsultingType consultingType = ConsultingType.builder()
                        .name(consultation.getName())
                        .price(consultation.getPrice())
                        .specialtyId(specialty.getId())
                        .build();
                this.consultationServiceRepository.save(consultingType);
                consultingTypes.add(consultingType);
            }
            this.specialtyRepository.save(specialty);
            specialtyList.add(specialty);
        }
        doctorData.setConsultingTypes(consultingTypes);
        doctorData.setSpecialties(specialtyList);
        this.doctorRepository.save(doctorData);
        return this.securityService.generateToken(String.valueOf(doctorData.getId()), doctorData.getFullName(), doctorData.getEmailAddress(), UserType.DOCTOR);
    }

    private String calculateReviewsRating(Set<Review> reviews) {
        DecimalFormat decimalFormat = new DecimalFormat("0.00");
        Double ratingAverage = 0.0;
        for (Review review : reviews) {
            ratingAverage += review.getStars();
        }
        return decimalFormat.format(ratingAverage / reviews.size());
    }

    private Set<DoctorSearchResponse> getListContent(Set<Doctor> doctorList) {
        return doctorList.stream()
                .map(doctor -> DoctorSearchResponse.builder()
                        .uuid(securityService.decodeData(doctor.getUuid()))
                        .fullName(securityService.decodeData(doctor.getFullName()))
                        .specialties(doctor.getSpecialties())
                        .rate(doctor.getReviews().isEmpty() ? "00.0" : calculateReviewsRating(doctor.getReviews()))
                        .workAddress(securityService.decodeData(doctor.getWorkAddress()))
                        .phoneNumber(securityService.decodeData(doctor.getPhoneNumber()))
                        .image(doctor.getImage() != null ? this.imageService.getImageUrl(doctor.getImage().getImageName()) : "")
                        .build())
                .collect(Collectors.toSet());
    }

    private Set<DoctorSearchResponse> getBySpecialty(String specialty, Pageable pageSpecifications) {
        Set<DoctorSearchResponse> doctorsResponse = new HashSet<>();
        Set<Doctor> doctors = new HashSet<>();
        if (!specialty.isEmpty()) {
            List<Specialty> englishSpecialtyDetailsList = this.specialtyRepository.findByEnglishNameContaining(specialty);
            List<Specialty> romanianSpecialtyDetailsList = this.specialtyRepository.findByRomanianNameContaining(specialty);
            if (!englishSpecialtyDetailsList.isEmpty()) {
                for (Specialty specialtyDetails : englishSpecialtyDetailsList) {
                    Page<Doctor> doctorsBySpecialty = this.doctorRepository.findBySpecialties(specialtyDetails, pageSpecifications);
                    for (Doctor doctor : doctorsBySpecialty.getContent()) {
                        if (doctor.isAccountActive()) {
                            if (!doctors.contains(doctor)) {
                                doctors.add(doctor);
                            }
                        }
                    }
                    doctorsResponse.addAll(getListContent(doctors));
                }
            } else if (!romanianSpecialtyDetailsList.isEmpty()) {
                for (Specialty specialtyDetails : romanianSpecialtyDetailsList) {
                    Page<Doctor> doctorsBySpecialty = this.doctorRepository.findBySpecialties(specialtyDetails, pageSpecifications);
                    for (Doctor doctor : doctorsBySpecialty.getContent()) {
                        if (doctor.isAccountActive()) {
                            if (!doctors.contains(doctor)) {
                                doctors.add(doctor);
                            }
                        }
                    }
                    doctorsResponse.addAll(getListContent(doctors));
                }
            }
        }
        return doctorsResponse;
    }

    private Set<DoctorSearchResponse> getByName(String name, Pageable pageSpecifications) {
        Set<DoctorSearchResponse> doctorsResponse = new HashSet<>();
        Set<Doctor> doctors = new HashSet<>();
        if (!name.isEmpty()) {
            Page<Doctor> doctorsByName = this.doctorRepository.findAll(pageSpecifications);
            for (Doctor doctor : doctorsByName.getContent()) {
                if (doctor.isAccountActive() && securityService.decodeData(doctor.getFullName()).contains(name)) {
                    if (!doctors.contains(doctor)) {
                        doctors.add(doctor);
                    }
                }
            }
            doctorsResponse.addAll(getListContent(doctors));
        }
        return doctorsResponse;
    }

    private Set<DoctorSearchResponse> getByLocation(Set<DoctorSearchResponse> doctorsResponse, Set<DoctorSearchResponse> content) {
        Iterator<DoctorSearchResponse> resultIterator = doctorsResponse.iterator();
        while (resultIterator.hasNext()) {
            DoctorSearchResponse doctor = resultIterator.next();
            boolean areEqual = false;
            for (DoctorSearchResponse doctorByLocation : content) {
                if (doctor.toString().equals(doctorByLocation.toString())) {
                    areEqual = true;
                    break;
                }
            }
            if (!areEqual) {
                resultIterator.remove();
            }
        }
        return doctorsResponse;
    }

    public FoundDoctorsResponse searchDoctor(String specialty, String name, String location, int page, int size) {
        Pageable pageSpecifications = PageRequest.of(page, size);
        FoundDoctorsResponse foundDoctorsResponse = new FoundDoctorsResponse();
        Page<Doctor> allDoctors = this.doctorRepository.findAll(pageSpecifications);
        if (specialty.isEmpty() && name.isEmpty() && location.isEmpty()) {
            foundDoctorsResponse.setDoctorList(new HashSet<>(getListContent(new HashSet<>(allDoctors.getContent()))));
            foundDoctorsResponse.setTotalElements(allDoctors.getTotalElements());
            return foundDoctorsResponse;
        }
        Set<DoctorSearchResponse> doctorsResponse = getBySpecialty(specialty, pageSpecifications);
        doctorsResponse.addAll(getByName(name, pageSpecifications));
        if (!location.isEmpty()) {
            List<Doctor> doctorsByLocation = new ArrayList<>();
            for (Doctor doctor : allDoctors.getContent()) {
                if (doctor.isAccountActive()) {
                    String doctorLocation = securityService.decodeData(doctor.getWorkAddress());
                    if (doctorLocation.contains(location)) {
                        doctorsByLocation.add(doctor);
                    }
                }
            }
            Set<DoctorSearchResponse> content = getListContent(new HashSet<>(doctorsByLocation));
            if (doctorsResponse.isEmpty()) {
                doctorsResponse.addAll(content);
            } else {
                doctorsResponse = getByLocation(doctorsResponse, content);
            }
        }
        foundDoctorsResponse.setDoctorList(new HashSet<>(doctorsResponse));
        foundDoctorsResponse.setTotalElements(new HashSet<>(doctorsResponse).size());
        return foundDoctorsResponse;
    }

    public DoctorSearchResponse getByUuid(String uuid) {
        var doctor = this.doctorRepository.findByUuid(securityService.encodeData(uuid));
        if (doctor != null) {
            return DoctorSearchResponse.builder()
                    .uuid(securityService.decodeData(doctor.getUuid()))
                    .fullName(securityService.decodeData(doctor.getFullName()))
                    .specialties(doctor.getSpecialties())
                    .workAddress(securityService.decodeData(doctor.getWorkAddress()))
                    .phoneNumber(securityService.decodeData(doctor.getPhoneNumber()))
                    .image(doctor.getImage() != null ? this.imageService.getImageUrl(doctor.getImage().getImageName()) : "")
                    .build();
        }
        return null;
    }

    public List<DoctorSearchResponse> getByName(String name) {
        List<Doctor> doctors = this.doctorRepository.findAll();
        List<Doctor> doctorsResponse = new ArrayList<>();
        for (Doctor doctor : doctors) {
            String doctorName = securityService.decodeData(doctor.getFullName());
            if (doctorName.contains(name)) {
                doctorsResponse.add(doctor);
            }
        }
        if (doctorsResponse.isEmpty()) {
            throw new NoSuchElementException();
        }
        List<DoctorSearchResponse> doctorSearchResponses = new ArrayList<>();
        for (Doctor doctor : doctorsResponse) {
            doctorSearchResponses.add(DoctorSearchResponse.builder()
                    .uuid(securityService.decodeData(doctor.getUuid()))
                    .fullName(securityService.decodeData(doctor.getFullName()))
                    .specialties(doctor.getSpecialties())
                    .workAddress(securityService.decodeData(doctor.getWorkAddress()))
                    .phoneNumber(securityService.decodeData(doctor.getPhoneNumber()))
                    .image(doctor.getImage() != null ? this.imageService.getImageUrl(doctor.getImage().getImageName()) : "")
                    .build());
        }
        return doctorSearchResponses;
    }

}
