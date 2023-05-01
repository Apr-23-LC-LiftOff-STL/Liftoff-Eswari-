package com.alongtheway.alongthewaybackend.models;



import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
public class User {

    @NotNull
    private String username;

    @NotNull
    private String pwhash;

    @Id
    @GeneratedValue
    private Integer Id;

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();


    public User() {}

    public User (String username, String password) {
        this.username = username;
        this. pwhash = encoder.encode(password);
    }

    public Boolean isMatchingPassword(String password) {
        return encoder.matches(password, pwhash); }

    public String getUsername() { return username; }

    public Integer getId() { return Id; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(getId(), user.getId());
    }

    @Override
    public int hashCode() { return Objects.hash(getId()); }
}
