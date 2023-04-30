package com.alongtheway.alongthewaybackend.models.dto;

public class SignupForm extends LoginForm{

    private String verifyPassword;

    public String getVerifyPassword() {
        return verifyPassword;
    }

    public void setVerifyPassword(String verifyPassword) {
        this.verifyPassword = verifyPassword;
    }
}
