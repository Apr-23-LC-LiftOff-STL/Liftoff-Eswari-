package com.alongtheway.alongthewaybackend.controllers.security;

import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String secretKey;

    public String generateToken(String userId, String username) {
        byte[] secretBytes = Base64.getDecoder().decode(secretKey);

        long expirationTimeMillis = 30 * 60 * 1000; // 30 minutes
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTimeMillis);

        return Jwts.builder()
                .claim("userId", userId)
                .claim("username", username)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, secretBytes)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        byte[] secretBytes = Base64.getDecoder().decode(secretKey);

        Jws<Claims> claims = Jwts.parserBuilder()
                .setSigningKey(secretBytes)
                .build()
                .parseClaimsJws(token);

        return claims.getBody().get("userId", String.class);
    }
}
