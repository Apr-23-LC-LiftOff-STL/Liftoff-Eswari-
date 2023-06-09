package com.alongtheway.alongthewaybackend.controllers;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class AuthenticationController {

    // Generate a secure secret key for HS256 algorithm
    private static final byte[] SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();

    @Autowired
    private UserRepository userRepository;

    private static final String userSessionKey = "user";

    public User getUserFromSession(HttpSession session) {
        String userId = (String) session.getAttribute(userSessionKey);
        if (userId == null) {
            return null;
        }

        Optional<User> user = userRepository.findById(userId);

        if (user == null) {
            return null;
        }

        return user.get();
    }

    private String generateToken(String username) {
    User user = userRepository.findByUsername(username);
    if (user == null) {
        throw new IllegalArgumentException("Invalid username");
    }

    long expirationTimeMillis = TimeUnit.MINUTES.toMillis(30); // Token expiration time: 30 minutes
    Date expirationDate = new Date(System.currentTimeMillis() + expirationTimeMillis);

    String token = Jwts.builder()
            .claim("username", user.getUsername())
            .claim("mpg", user.getMpg()) // Include mpg as a claim
            .claim("tankCapacity", user.getTankCapacity()) // Include tankCapacity as a claim
            .setExpiration(expirationDate)
            .signWith(Keys.hmacShaKeyFor(SECRET_KEY), SignatureAlgorithm.HS256)
            .compact();

    return token;
}



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

    @PostMapping("/login")
    public ResponseEntity<?> processLoginForm(@Valid @RequestBody LoginForm loginForm, HttpServletRequest request,
                                              Errors errors) {
        if (errors.hasErrors()) {
            // Return validation errors
            return ResponseEntity.badRequest().body(errors.getAllErrors());
        }

        User user = userRepository.findByUsername(loginForm.getUsername());

        // If the user doesn't exist or the password is incorrect, return an error
        if (user == null || !user.isMatchingPassword(loginForm.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        // Generate JWT token
        String token = generateToken(user.getUsername());

        // Set the token in the response

        // Return the token in the response
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Perform necessary logout operations
        invalidateSession(request);
        clearAuthenticationInfo();

        // Return a JSON response with a success message
    return ResponseEntity.ok().body("{\"message\": \"Logout successful\"}");
    }

    private void invalidateSession(HttpServletRequest request) {
        // Invalidate the session or perform any necessary operations
        request.getSession().invalidate();
    }

    private void clearAuthenticationInfo() {
        // Clear authentication information or perform any necessary operations
        // Example: Clear any user-related data from the session
    }


}

