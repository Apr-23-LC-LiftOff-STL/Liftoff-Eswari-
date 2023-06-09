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

    @Field
    private Integer mpg;

    @Field
    private Integer tankCapacity;

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();


    public User() {}

    public User (String username, String password) {
        super();
        this.username = username;
        this.pwhash = encoder.encode(password);
        this.mpg = 0;
        this.tankCapacity = 0;
    }

    public Boolean isMatchingPassword(String password) {
        return encoder.matches(password, pwhash); }

    public String getUsername() { return username; }

    public String getId() { return Id; }

    public Integer getMpg() {
        return mpg;
    }

    public void setMpg(Integer mpg) {
        this.mpg = mpg;
    }

    public Integer getTankCapacity() {
        return tankCapacity;
    }

    public void setTankCapacity(Integer tankCapacity) {
        this.tankCapacity = tankCapacity;
    }

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
