package com.example.backend.services;

import com.example.backend.dtos.DoctorTimetableDto;
import com.example.backend.entities.Appointment;
import com.example.backend.entities.DoctorTimetable;
import com.example.backend.enumerations.ConsultationRequestStatus;
import com.example.backend.enumerations.UserType;
import com.example.backend.repositories.DoctorRepository;
import com.example.backend.repositories.DoctorTimetableRepository;
import com.example.backend.requests.DoctorTimetableRequest;
import com.example.backend.responses.AvailableHoursResponse;
import com.example.backend.responses.DoctorTimetableResponse;
import com.example.backend.services.utils.SecurityService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountNotFoundException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DoctorScheduleService {
    @Autowired
    DoctorTimetableRepository doctorTimetableRepository;
    @Autowired
    SecurityService securityService;
    @Autowired
    DoctorRepository doctorRepository;

    public DoctorTimetableResponse getTimetable(String token) throws AccountNotFoundException {
        Claims claims = this.securityService.decodeToken(token);
        var doctor = this.doctorRepository.findByEmailAddress(claims.getSubject());
        if (doctor == null) {
            throw new AccountNotFoundException("There is no account with such e-mail address!");
        }
        Set<DoctorTimetableDto> schedule = new HashSet<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");
        for (DoctorTimetable dailyProgramme : doctor.getSchedules()) {
            DoctorTimetableDto daily = new DoctorTimetableDto();
            daily.setDay(convertIntToDay(dailyProgramme.getDay()));
            LocalTime startsAt = LocalTime.of(dailyProgramme.getStartsAt().getHour(), dailyProgramme.getStartsAt().getMinute());
            LocalTime endsAt = LocalTime.of(dailyProgramme.getEndsAt().getHour(), dailyProgramme.getEndsAt().getMinute());
            daily.setStartsAt(startsAt.format(timeFormatter));
            daily.setEndsAt(endsAt.format(timeFormatter));
            schedule.add(daily);
        }
        return new DoctorTimetableResponse(schedule);
    }

    public String updateTimetable(DoctorTimetableRequest scheduleRequest, String token) throws AccountNotFoundException {
        Claims claims = this.securityService.decodeToken(token);
        var doctor = this.doctorRepository.findByEmailAddress(claims.getSubject());
        if (doctor == null) {
            throw new AccountNotFoundException("There is no account with such e-mail address!");
        }
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("h:mm a");
        Set<DoctorTimetable> schedule = new HashSet<>();
        for (DoctorTimetableDto programme : scheduleRequest.getWeeklyProgramme()) {
            LocalTime startsAt = LocalTime.parse(programme.getStartsAt(), inputFormatter);
            LocalTime endsAt = LocalTime.parse(programme.getEndsAt(), inputFormatter);
            DoctorTimetable dailyProgramme = DoctorTimetable.builder()
                    .day(convertDayToInt(programme.getDay()))
                    .startsAt(startsAt)
                    .endsAt(endsAt)
                    .build();
            this.doctorTimetableRepository.save(dailyProgramme);
            schedule.add(dailyProgramme);
        }
        Set<DoctorTimetable> outdatedSchedule = new HashSet<>(doctor.getSchedules());
        doctor.setSchedules(schedule);
        this.doctorRepository.save(doctor);
        outdatedSchedule.forEach(dailyProgramme -> this.doctorTimetableRepository.delete(dailyProgramme));
        return this.securityService.generateToken(String.valueOf(doctor.getId()), doctor.getFullName(), doctor.getFullName(), UserType.DOCTOR);
    }

    private String convertIntToDay(int day) {
        return switch (day) {
            case 0 -> "Sunday";
            case 1 -> "Monday";
            case 2 -> "Tuesday";
            case 3 -> "Wednesday";
            case 4 -> "Thursday";
            case 5 -> "Friday";
            case 6 -> "Saturday";
            default -> "";
        };
    }

    private Integer convertDayToInt(String day) {
        return switch (day) {
            case "Sunday" -> 0;
            case "Monday" -> 1;
            case "Tuesday" -> 2;
            case "Wednesday" -> 3;
            case "Thursday" -> 4;
            case "Friday" -> 5;
            case "Saturday" -> 6;
            default -> -1;
        };
    }

    public AvailableHoursResponse getAvailableTimeSlots(String selectedDate, String uuid) throws AccountNotFoundException {
        if (LocalDate.parse(selectedDate).isBefore(LocalDate.now())) {
            return new AvailableHoursResponse(new ArrayList<>());
        }
        var doctor = this.doctorRepository.findByUuid(securityService.encodeData(uuid));
        if (doctor == null) {
            throw new AccountNotFoundException("There is no doctor with this id");
        }
        Set<DoctorTimetable> schedule = new HashSet<>(doctor.getSchedules());
        Map<LocalTime, LocalTime> availableHours = new HashMap<>();
        LocalDate date = LocalDate.parse(selectedDate);
        var dayOfTheWeek = getDayNumber(date);
        for (DoctorTimetable dailyProgramme : schedule) {
            if (dailyProgramme.getDay() == dayOfTheWeek) {
                availableHours.putIfAbsent(dailyProgramme.getStartsAt(), dailyProgramme.getEndsAt());
            }
        }
        Set<String> availableHoursResponse = new HashSet<>();
        for (Map.Entry<LocalTime, LocalTime> programme : availableHours.entrySet()) {
            availableHoursResponse.addAll(generateTimeSlots(programme.getKey(), programme.getValue()));
        }
        Set<Appointment> doctorAppointments = doctor.getAppointments();
        return new AvailableHoursResponse(filterTimeSlots(orderTimeSlots(availableHoursResponse), doctorAppointments, dayOfTheWeek, selectedDate));
    }

    private Set<String> generateTimeSlots(LocalTime startHour, LocalTime endHour) {
        Set<String> availableHours = new HashSet<>();
        if (startHour.isAfter(endHour)) {
            while (!startHour.equals(LocalTime.MIDNIGHT)) {
                availableHours.add(String.valueOf(startHour));
                startHour = startHour.plusMinutes(30);
            }
            startHour = LocalTime.MIDNIGHT;
        }
        while (!startHour.isAfter(endHour) && !startHour.equals(endHour)) {
            availableHours.add(String.valueOf(startHour));
            startHour = startHour.plusMinutes(30);
        }
        return availableHours;
    }

    private List<String> orderTimeSlots(Set<String> availableHours) {
        List<String> availableHoursList = new ArrayList<>(availableHours.stream().toList());
        availableHoursList.sort((o1, o2) -> {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            LocalTime t1 = LocalTime.parse(o1, formatter);
            LocalTime t2 = LocalTime.parse(o2, formatter);
            return t1.compareTo(t2);
        });
        return availableHoursList;
    }

    private int getDayNumber(LocalDate date) {
        if (date.getDayOfWeek().getValue() == 7) {
            return 0;
        }
        return date.getDayOfWeek().getValue();
    }

    private List<String> filterTimeSlots(List<String> availableHours, Set<Appointment> appointments, int dayOfTheWeek, String selectedDate) {
        LocalDate localDate = LocalDate.parse(selectedDate);
        for (Appointment appointment : appointments) {
            if (appointment.getStatus() == ConsultationRequestStatus.ACCEPTED && getDayNumber(appointment.getDate()) == dayOfTheWeek && appointment.getDate().equals(localDate) && appointment.getDate().getYear() == localDate.getYear()) {
                availableHours.remove(String.valueOf(appointment.getTime()));
            }
        }
        return availableHours;
    }
}
