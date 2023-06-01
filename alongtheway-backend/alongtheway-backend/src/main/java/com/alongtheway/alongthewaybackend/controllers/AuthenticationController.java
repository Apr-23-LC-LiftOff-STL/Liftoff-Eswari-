package com.alongtheway.alongthewaybackend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.alongtheway.alongthewaybackend.models.User;
import com.alongtheway.alongthewaybackend.models.data.UserRepository;
import com.alongtheway.alongthewaybackend.models.dto.SignupForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/signup")
public class AuthenticationController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> processSignupForm(@RequestBody SignupForm signupForm, Errors errors) {
        if (errors.hasErrors()) {
            // Return the validation errors as a JSON response
            return ResponseEntity.badRequest().body(errors.getAllErrors());
        }

        // Check if the username already exists
        User existingUser = userRepository.findByUsername(signupForm.getUsername());
        if (existingUser != null) {
            // Return error as JSON
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A user with that username already exists");
        }

        // Check if passwords match
        String password = signupForm.getPassword();
        String verifyPassword = signupForm.getVerifyPassword();
        if (!password.equals(verifyPassword)) {
            // Return error as JSON
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        // Create a new user
        User newUser = new User(signupForm.getUsername(), signupForm.getPassword());
        userRepository.save(newUser);

        return ResponseEntity.ok("Sign-up successful");
    }
}
