package com.example.backend.services;

import com.example.backend.dtos.DoctorNotificationDto;
import com.example.backend.dtos.PatientNotificationDto;
import com.example.backend.entities.Appointment;
import com.example.backend.entities.Doctor;
import com.example.backend.entities.Patient;
import com.example.backend.enumerations.ConsultationRequestStatus;
import com.example.backend.exceptions.ConsultationNotFoundException;
import com.example.backend.repositories.ConsultationRepository;
import com.example.backend.repositories.DoctorRepository;
import com.example.backend.repositories.PatientRepository;
import com.example.backend.requests.ContactUsRequest;
import com.example.backend.requests.PatientConsultationRequestConfirmation;
import com.example.backend.requests.EmailMessageRequest;
import com.example.backend.responses.DoctorNotificationListResponse;
import com.example.backend.responses.PatientNotificationListResponse;
import com.example.backend.services.utils.EmailService;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    ConsultationRepository consultationRepository;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    SecurityService securityService;
    @Autowired
    EmailService emailService;

    public DoctorNotificationListResponse getDoctorNotifications(String token) throws AccountNotFoundException {
        Claims claims = this.securityService.decodeToken(token);
        var doctor = this.doctorRepository.findByEmailAddress(claims.getSubject());
        if (doctor != null) {
            List<Appointment> filteredAppointments = this.consultationRepository.findByStatus(ConsultationRequestStatus.AWAITING, Sort.by("date").ascending().and(Sort.by("time").ascending()));
            List<DoctorNotificationDto> notificationList = new ArrayList<>();
            for (Appointment appointment : filteredAppointments) {
                Patient patient = this.patientRepository.findByAppointments(appointment);
                if (patient != null) {
                    DoctorNotificationDto notification = DoctorNotificationDto.builder()
                            .patientUuid(securityService.decodeData(patient.getUuid()))
                            .name(securityService.decodeData(patient.getFullName()))
                            .phoneNumber(securityService.decodeData(patient.getPhoneNumber()))
                            .date(appointment.getDate())
                            .time(String.valueOf(appointment.getTime()))
                            .services(appointment.getConsultingTypes())
                            .isPatientNew(appointment.isNewPatient())
                            .reason(securityService.decodeData(appointment.getExplanation()))
                            .totalAmount(appointment.getTotalAmount())
                            .createdAt(appointment.getCreatedAt())
                            .build();
                    notificationList.add(notification);
                }
            }
            return new DoctorNotificationListResponse(notificationList.stream()
                    .sorted(Comparator.comparing(DoctorNotificationDto::getDate))
                    .limit(5)
                    .collect(Collectors.toList()));
        } else {
            throw new AccountNotFoundException("There is no doctor with such e-mail address!");
        }
    }

    public void changeConsultationRequestStatus(String patientUuid, PatientConsultationRequestConfirmation request, ConsultationRequestStatus status) throws AccountNotFoundException {
        Patient patient = this.patientRepository.findByUuid(securityService.encodeData(patientUuid));
        if (patient == null) {
            throw new AccountNotFoundException("There is no patient registered with this email address.");
        }
        List<Appointment> appointments = this.consultationRepository
                .findByDateAndTimeAndCreatedAtOrderByDateAsc(LocalDate.parse(request.getDate()), LocalTime.parse(request.getTime()), request.getCreatedAt());
        if (appointments.isEmpty()) {
            throw new ConsultationNotFoundException("There is no appointment on the date " + request.getDate()
                    + " at " + request.getTime());
        }
        for (Appointment appointment : appointments) {
            if (patient.getAppointments().contains(appointment)) {
                appointment.setStatus(status);
                appointment.setCreatedAt(LocalDateTime.now());
                this.consultationRepository.save(appointment);
                sendNewPatientEmail(patient.getEmailAddress());
            }
        }
    }

    private void sendNewPatientEmail(String email) throws AccountNotFoundException {
        var patient = this.patientRepository.findByEmailAddress(email);
        if (patient == null) {
            throw new AccountNotFoundException("There is no patient with such e-mail address!");
        }
        String emailText = ("Hello there,")
                .concat("\n\nWe would like to inform you that an important notification is waiting for you." +
                        " To check it out, please click on the following link.\n\n")
                .concat("http://localhost:4200/notifications")
                .concat("\n\n If there are any questions, don't hesitate to reach out.")
                .concat("\n\nhttp://localhost:4200/help")
                .concat("\n\nBest regards,\nSymptoChecker Team");
        this.emailService.sendNewNotificationEmail(new EmailMessageRequest(securityService.decodeData(patient.getEmailAddress()), emailText, "New notification"));
    }

    public PatientNotificationListResponse getPatientNotifications(String token) throws AccountNotFoundException {
        Claims claims = this.securityService.decodeToken(token);
        var patient = this.patientRepository.findByEmailAddress(claims.getSubject());
        if (patient != null) {
            List<Appointment> filteredAppointments = this.consultationRepository.findByStatus(ConsultationRequestStatus.ACCEPTED);
            filteredAppointments.addAll(this.consultationRepository.findByStatus(ConsultationRequestStatus.REFUSED));
            Set<PatientNotificationDto> notificationList = new HashSet<>();
            for (Appointment appointment : filteredAppointments) {
                Doctor doctor = this.doctorRepository.findByAppointments(appointment);
                if (doctor != null && patient.equals(this.patientRepository.findByAppointments(appointment))) {
                    PatientNotificationDto notification = PatientNotificationDto.builder()
                            .doctorUuid(securityService.decodeData(doctor.getUuid()))
                            .name(securityService.decodeData(doctor.getFullName()))
                            .date(appointment.getDate())
                            .time(String.valueOf(appointment.getTime()))
                            .consultationRequestState(appointment.getStatus())
                            .createdAt(appointment.getCreatedAt())
                            .build();
                    notificationList.add(notification);
                }
            }
            return new PatientNotificationListResponse(notificationList.stream()
                    .sorted(Comparator.comparing(PatientNotificationDto::getCreatedAt).reversed())
                    .limit(5)
                    .collect(Collectors.toList()));
        } else {
            throw new AccountNotFoundException("There is no doctor with such e-mail address!");
        }
    }

    public boolean sendContactNotification(ContactUsRequest contactUsRequest) {
        return this.emailService.sendContactUsEmail(contactUsRequest);
    }
}