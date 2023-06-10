package com.alongtheway.alongthewaybackend.models.dto;

public class SignupForm extends LoginForm {

    private int mpg;
    private int tankCapacity;
    private String verifyPassword;

    public int getMpg() {
        return mpg;
    }

    public void setMpg(int mpg) {
        this.mpg = mpg;
    }

    public int getTankCapacity() {
        return tankCapacity;
    }

    public void setTankCapacity(int tankCapacity) {
        this.tankCapacity = tankCapacity;
    }

    public String getVerifyPassword() {
        return verifyPassword;
    }

    public void setVerifyPassword(String verifyPassword) {
        this.verifyPassword = verifyPassword;
    }
}
