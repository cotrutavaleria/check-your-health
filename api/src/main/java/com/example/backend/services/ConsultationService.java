package com.example.backend.services;

import com.example.backend.dtos.DoctorConsultationDto;
import com.example.backend.dtos.PatientConsultationDto;
import com.example.backend.entities.Appointment;
import com.example.backend.entities.Doctor;
import com.example.backend.entities.Patient;
import com.example.backend.enumerations.ConsultationRequestStatus;
import com.example.backend.exceptions.ExistentConsultationFoundException;
import com.example.backend.repositories.*;
import com.example.backend.requests.EmailMessageRequest;
import com.example.backend.requests.PatientAppointmentRequest;
import com.example.backend.responses.AvailableHoursResponse;
import com.example.backend.responses.DoctorConsultationsListResponse;
import com.example.backend.responses.PatientConsultationsListResponse;
import com.example.backend.services.utils.EmailService;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.security.InvalidParameterException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConsultationService {
    @Autowired
    ConsultationRepository consultationRepository;
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    DoctorScheduleService doctorScheduleService;
    @Autowired
    SecurityService securityService;
    @Autowired
    EmailService emailService;

    private boolean getPatientStatus(int isPatientNew) {
        return switch (isPatientNew) {
            case 1 -> true;
            case 0 -> false;
            default ->
                    throw new IllegalArgumentException("isNew should be either 0 or 1. However, it is " + isPatientNew);
        };
    }

    private Appointment saveConsultationRequest(PatientAppointmentRequest appointmentInformation) {
        return Appointment.builder()
                .time(LocalTime.parse(appointmentInformation.getTime()))
                .date(LocalDate.parse(appointmentInformation.getDate()))
                .consultingTypes(appointmentInformation.getConsultingTypes())
                .explanation(securityService.encodeData(appointmentInformation.getExplanation()))
                .status(ConsultationRequestStatus.AWAITING)
                .newPatient(getPatientStatus(appointmentInformation.getIsNew()))
                .createdAt(LocalDateTime.now())
                .totalAmount(appointmentInformation.getTotalAmount())
                .build();
    }

    public String createConsultationRequest(String token, String doctorUuid, PatientAppointmentRequest appointmentInformation) throws AccountNotFoundException {
        Claims claims = this.securityService.decodeToken(token);
        Patient patient = this.patientRepository.findByEmailAddress(claims.getSubject());
        if (patient == null) {
            throw new AccountNotFoundException("A problem occurred regarding patient's token!");
        }
        Doctor doctor = this.doctorRepository.findByUuid(securityService.encodeData(doctorUuid));
        if (doctor == null) {
            throw new AccountNotFoundException("A problem occurred regarding doctor's uuid!");
        }
        AvailableHoursResponse availableHours = this.doctorScheduleService.getAvailableTimeSlots(appointmentInformation.getDate(), doctorUuid);
        boolean isDateValid = LocalDate.parse(appointmentInformation.getDate()).isAfter(LocalDate.now());
        boolean isTimeSlotValid = availableHours.getAvailableHours().contains(appointmentInformation.getTime());
        if (!isDateValid || !isTimeSlotValid) {
            throw new InvalidParameterException("A problem occurred regarding the date or the time of the appointment!");
        }
        Appointment appointment = saveConsultationRequest(appointmentInformation);
        addRequestToPatient(patient, appointment);
        addRequestToDoctor(doctor, appointment, patient);
        notifyDoctor(doctor.getEmailAddress());
        return "Appointment created!";
    }

    private void addRequestToDoctor(Doctor doctor, Appointment appointment, Patient patient) {
        Map<LocalDate, Set<LocalTime>> doctorAppointments = new HashMap<>();
        for (Appointment dbAppointment : doctor.getAppointments()) {
            Set<LocalTime> list;
            if (!doctorAppointments.containsKey(dbAppointment.getDate())) {
                doctorAppointments.put(dbAppointment.getDate(), new HashSet<>());
            }
            list = doctorAppointments.get(dbAppointment.getDate());
            list.add(dbAppointment.getTime());
            doctorAppointments.put(dbAppointment.getDate(), list);
        }
        if (doctorAppointments.containsKey(appointment.getDate())) {
            if (doctorAppointments.get(appointment.getDate()).contains(appointment.getTime())) {
                List<Appointment> existentPatientAppointments = this.consultationRepository.findByDateAndTimeAndCreatedAtOrderByDateAsc(appointment.getDate(), appointment.getTime(), appointment.getCreatedAt());
                for (Appointment existentAppointment : existentPatientAppointments) {
                    Patient existentPatient = this.patientRepository.findByAppointments(existentAppointment);
                    if (patient.equals(existentPatient) && (existentAppointment.getStatus() == ConsultationRequestStatus.ACCEPTED)) {
                        throw new ExistentConsultationFoundException("A similar appointment is already done from doctor!");
                    }
                }
            }
        }
        Set<Appointment> appointmentList = new HashSet<>(doctor.getAppointments());
        appointmentList.add(appointment);
        doctor.setAppointments(appointmentList);
        this.doctorRepository.save(doctor);
    }

    private void addRequestToPatient(Patient patient, Appointment appointment) {
        Map<LocalDate, Set<LocalTime>> patientAppointments = new HashMap<>();
        for (Appointment dbAppointment : patient.getAppointments()) {
            Set<LocalTime> list;
            if (!patientAppointments.containsKey(dbAppointment.getDate())) {
                patientAppointments.put(dbAppointment.getDate(), new HashSet<>());
            }
            list = patientAppointments.get(dbAppointment.getDate());
            list.add(dbAppointment.getTime());
            patientAppointments.put(dbAppointment.getDate(), list);
        }
        if (patientAppointments.containsKey(appointment.getDate())) {
            if (patientAppointments.get(appointment.getDate()).contains(appointment.getTime())) {
                List<Appointment> existentAppointments = this.consultationRepository.findByDateAndTimeAndCreatedAtOrderByDateAsc(appointment.getDate(), appointment.getTime(), appointment.getCreatedAt());
                existentAppointments.forEach(appointment1 -> {
                    if (appointment1.getStatus() == ConsultationRequestStatus.ACCEPTED || appointment1.getStatus() == ConsultationRequestStatus.AWAITING) {
                        throw new ExistentConsultationFoundException("A similar appointment is already done from patient!");
                    }
                });
            }
        }
        this.consultationRepository.save(appointment);
        Set<Appointment> appointmentList = new HashSet<>(patient.getAppointments());
        appointmentList.add(appointment);
        patient.setAppointments(appointmentList);
        this.patientRepository.save(patient);
    }

    private void notifyDoctor(String email) throws AccountNotFoundException {
        var doctor = this.doctorRepository.findByEmailAddress(email);
        if (doctor == null) {
            throw new AccountNotFoundException("There is no doctor with such e-mail address!");
        }
        String emailText = ("Dear " + securityService.decodeData(doctor.getFullName()) + ",")
                .concat("""


                        We would like to inform you that an important notification is waiting for you.\
                         To check it out, please click on the following link.

                        """)
                .concat("http://localhost:4200/notifications")
                .concat("\n\n If there are any questions, don't hesitate to reach out.")
                .concat("\n\nBest regards,\nSymptoChecker Team");
        this.emailService.sendNewNotificationEmail(new EmailMessageRequest(securityService.decodeData(doctor.getEmailAddress()), emailText, "New notification"));
    }

    public PatientConsultationsListResponse getPatientConsultations(String token, int page, int size) throws AccountNotFoundException {
        Pageable pageSpecifications = PageRequest.of(page, size);
        Claims claims = this.securityService.decodeToken(token);
        Patient patient = this.patientRepository.findByEmailAddress(claims.getSubject());
        List<Appointment> acceptedAppointments = patient.getAppointments().stream().filter(appointment -> appointment.getStatus() == ConsultationRequestStatus.ACCEPTED).toList();
        List<PatientConsultationDto> patientAppointmentList = new ArrayList<>();
        for (Appointment appointment : acceptedAppointments) {
            Doctor doctor = this.doctorRepository.findByAppointments(appointment);
            if (doctor == null) {
                throw new AccountNotFoundException("There is no doctor for this appointment: " + appointment);
            }
            patientAppointmentList.add(new PatientConsultationDto(securityService.decodeData(doctor.getUuid()), securityService.decodeData(doctor.getFullName()), appointment.getDate(), String.valueOf(appointment.getTime()), appointment.getConsultingTypes(), appointment.getTotalAmount()));
        }
        List<PatientConsultationDto> sortedAppointmentList = patientAppointmentList.stream()
                .sorted(Comparator.comparing(PatientConsultationDto::getDate).thenComparing(PatientConsultationDto::getTime))
                .collect(Collectors.toList());
        Page<PatientConsultationDto> list = new PageImpl<>(sortedAppointmentList
                .subList((int) pageSpecifications.getOffset(),
                        (int) Math.min(pageSpecifications.getOffset() + pageSpecifications.getPageSize(), sortedAppointmentList.size())),
                pageSpecifications, sortedAppointmentList.size());
        return new PatientConsultationsListResponse(list.getContent(), sortedAppointmentList.size());
    }

    public DoctorConsultationsListResponse getDoctorConsultations(String token, int page, int size) throws AccountNotFoundException {
        Pageable pageSpecifications = PageRequest.of(page, size);
        Claims claims = this.securityService.decodeToken(token);
        Doctor doctor = this.doctorRepository.findByEmailAddress(claims.getSubject());
        List<Appointment> acceptedAppointments = doctor.getAppointments().stream().filter(appointment -> appointment.getStatus() == ConsultationRequestStatus.ACCEPTED).toList();
        List<DoctorConsultationDto> doctorAppointmentList = new ArrayList<>();
        for (Appointment appointment : acceptedAppointments) {
            Patient patient = this.patientRepository.findByAppointments(appointment);
            if (patient == null) {
                throw new AccountNotFoundException("There is no patient for this appointment: " + appointment);
            }
            doctorAppointmentList.add(new DoctorConsultationDto(securityService.decodeData(patient.getUuid()), securityService.decodeData(patient.getFullName()), appointment.getDate(), String.valueOf(appointment.getTime()), appointment.getConsultingTypes(), securityService.decodeData(appointment.getExplanation()), appointment.isNewPatient(), appointment.getTotalAmount()));
        }
        List<DoctorConsultationDto> sortedAppointmentList = doctorAppointmentList.stream()
                .sorted(Comparator.comparing(DoctorConsultationDto::getDate).thenComparing(DoctorConsultationDto::getTime))
                .collect(Collectors.toList());
        Page<DoctorConsultationDto> list = new PageImpl<>(sortedAppointmentList
                .subList((int) pageSpecifications.getOffset(),
                        (int) Math.min(pageSpecifications.getOffset() + pageSpecifications.getPageSize(), sortedAppointmentList.size())),
                pageSpecifications, sortedAppointmentList.size());
        return new DoctorConsultationsListResponse(list.getContent(), list.getTotalElements());
    }
}