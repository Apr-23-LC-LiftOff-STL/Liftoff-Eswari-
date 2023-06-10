package com.alongtheway.alongthewaybackend.controllers;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alongtheway.alongthewaybackend.models.CarForm;
import com.alongtheway.alongthewaybackend.models.User;
import com.alongtheway.alongthewaybackend.models.data.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable String userId, HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        try {
            String token = authHeader.substring(7);
            Jws<Claims> jws = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token);

            String userIdClaim = (String) jws.getBody().get("userId");
            if (!userIdClaim.equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token for this user");
            }

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> user = userRepository.findById(userId);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/car")
      public ResponseEntity<?> updateUserCarInfo(@PathVariable String userId, @RequestBody CarForm carForm, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        try {
            String token = authHeader.substring(7);
            Jws<Claims> jws = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token);

            String userIdClaim = (String) jws.getBody().get("userId");
            if (!userIdClaim.equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token for this user");
            }

        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

    Optional<User> optionalUser = userRepository.findById(userId);
    if (optionalUser.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    User user = optionalUser.get();
    user.setMpg(carForm.getMpg());
    user.setTankCapacity(carForm.getTankCapacity());
    userRepository.save(user);

    return ResponseEntity.ok("User car information updated");
}

}
