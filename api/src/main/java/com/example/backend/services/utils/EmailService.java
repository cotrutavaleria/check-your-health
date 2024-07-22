package com.example.backend.services.utils;

import com.example.backend.requests.ContactUsRequest;
import com.example.backend.requests.EmailMessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final String SENDER = "symptochecker.team@gmail.com";
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendPatientAccountActivationEmail(EmailMessageRequest emailMessageRequest) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(SENDER);
            email.setTo(emailMessageRequest.getReceiver());
            String emailText = ("Hello there,").concat("\n\nThank you very much for your application. We are glad to have a new member in our SymptoChecker team. Please, activate your account.\n\n").concat(emailMessageRequest.getEmailBody()).concat("\n\nBest regards,\nSymptoChecker Team");
            email.setText(emailText);
            email.setSubject(emailMessageRequest.getSubject());
            javaMailSender.send(email);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendDoctorAccountActivationEmail(EmailMessageRequest emailMessageRequest) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(SENDER);
            email.setTo(emailMessageRequest.getReceiver());
            String emailText = ("Hello there,").concat("\n\nThank you very much for your application. We are glad to have a new member in our SymptoChecker team. Your account has been activated. You can now log in.").concat("\n\nBest regards,\nSymptoChecker Team");
            email.setText(emailText);
            email.setSubject(emailMessageRequest.getSubject());
            javaMailSender.send(email);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public void sendEmailFromAdmin(EmailMessageRequest emailMessageRequest) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(SENDER);
            email.setTo(emailMessageRequest.getReceiver());
            String emailText = emailMessageRequest.getEmailBody().concat("\n\nBest regards,\nSymptoChecker Team");
            email.setText(emailText);
            email.setSubject(emailMessageRequest.getSubject());
            javaMailSender.send(email);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendResetPasswordEmail(EmailMessageRequest emailMessageRequest) {
        try {
            System.out.println(emailMessageRequest.getEmailBody());
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(SENDER);
            email.setTo(emailMessageRequest.getReceiver());
            String emailText = ("Hello there,").concat("\n\nWe are sorry for this inconvenience. We're delighted to hear that you wish to rejoin our SymptoChecker team. To reset your password, please click on the following link.\n\n").concat(emailMessageRequest.getEmailBody()).concat("\n\nBest regards,\nSymptoChecker Team");
            email.setText(emailText);
            email.setSubject(emailMessageRequest.getSubject());
            javaMailSender.send(email);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendNewNotificationEmail(EmailMessageRequest emailMessageRequest) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(SENDER);
            email.setTo(emailMessageRequest.getReceiver());
            String emailText = emailMessageRequest.getEmailBody();
            email.setText(emailText);
            email.setSubject(emailMessageRequest.getSubject());
            javaMailSender.send(email);
            System.out.println("am trimis");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public boolean sendContactUsEmail(ContactUsRequest contactUsRequest) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(SENDER);
            email.setTo(SENDER);
            String emailText = ("Hello there,").concat("Customer with email address: " + contactUsRequest.emailAddress + " asks us about: " + contactUsRequest.reason + ".\n\n").concat("\n\nBest regards,\nSymptoChecker Team");
            email.setText(emailText);
            email.setSubject("Contact us form");
            javaMailSender.send(email);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
