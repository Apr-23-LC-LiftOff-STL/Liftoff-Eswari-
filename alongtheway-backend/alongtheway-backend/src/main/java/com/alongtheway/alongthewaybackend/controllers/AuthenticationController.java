package com.alongtheway.alongthewaybackend.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.alongtheway.alongthewaybackend.models.User;
import com.alongtheway.alongthewaybackend.models.data.UserRepository;
import com.alongtheway.alongthewaybackend.models.dto.LoginForm;
import com.alongtheway.alongthewaybackend.models.dto.SignupForm;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
// @RequestMapping("/signup")
public class AuthenticationController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
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

    @PostMapping("/auth/login")
public ResponseEntity<?> processLoginForm(@Valid @RequestBody LoginForm loginForm, Errors errors) {
    if (errors.hasErrors()) {
        // Return validation errors
        return ResponseEntity.badRequest().body(errors.getAllErrors());
    }

    User user = userRepository.findByUsername(loginForm.getUsername());

    // If the user doesn't exist or the password is incorrect, return an error
    if (user == null || !user.isMatchingPassword(loginForm.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }

    // Login successful, return OK response
    return ResponseEntity.ok().body("Login successful");
  }
}
