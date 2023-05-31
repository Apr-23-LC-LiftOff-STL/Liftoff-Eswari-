package com.alongtheway.alongthewaybackend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.validation.constraints.NotNull;
import java.util.Objects;

@Document(collection = "users")
public class User {

    @NotNull
    @Field
    private String username;

    @NotNull
    @Field
    private String pwhash;

    @Id
    @Field
    private String Id;

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User() {
    }

    public User(String username, String password) {
        super();
        this.username = username;
        this.pwhash = encoder.encode(password);
    }

    public Boolean isMatchingPassword(String password) {
        return encoder.matches(password, pwhash);
    }

    public String getUsername() {
        return username;
    }

    public String getId() {
        return Id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        User user = (User) o;
        return Objects.equals(getId(), user.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}