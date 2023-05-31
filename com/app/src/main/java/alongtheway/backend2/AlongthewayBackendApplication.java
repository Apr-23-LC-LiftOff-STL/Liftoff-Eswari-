package com.alongtheway.alongthewaybackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class AlongthewayBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlongthewayBackendApplication.class, args);
    }

}