package com.alongtheway.alongthewaybackend.controllers;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.alongtheway.alongthewaybackend.controllers.security.JwtTokenProvider;
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

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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

    private static void setUserInSession(HttpSession session, User user) {
        session.setAttribute(userSessionKey, user.getId());
    }
    private String generateToken(String username) {
        long expirationTimeMillis = TimeUnit.MINUTES.toMillis(30); // Token expiration time: 30 minutes
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTimeMillis);

        String token = Jwts.builder()
                .claim("username", username) // Include username as a claim
                .setExpiration(expirationDate)
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY), SignatureAlgorithm.HS256)
                .compact();

        return token;
    }



    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupForm signupForm, HttpServletRequest request) {
      Errors errors = validateSignupForm(signupForm);
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
        newUser = this.userRepository.save(newUser);  // Save the newUser and use the returned persisted user
        setUserInSession(request.getSession(), newUser);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(newUser.getId(), newUser.getUsername());

        // Return success message and token as JSON
        Map<String, String> response = new HashMap<>();
        response.put("message", "Sign-up successful");
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    private Errors validateSignupForm(SignupForm signupForm) {
    Errors errors = new BeanPropertyBindingResult(signupForm, "signupForm");

    // Perform validation using Spring's ValidationUtils or custom validation code
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "field.required");
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "field.required");
    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "verifyPassword", "field.required");

    // Custom validation: Check if passwords match
    if (!signupForm.getPassword().equals(signupForm.getVerifyPassword())) {
        errors.rejectValue("verifyPassword", "password.mismatch");
    }

    // Add more validation rules as needed

    return errors;
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
        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername());

        // Return the token in the response
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
