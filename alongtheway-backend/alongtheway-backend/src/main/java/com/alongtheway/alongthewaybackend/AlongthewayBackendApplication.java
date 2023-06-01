package com.alongtheway.alongthewaybackend;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;


@SpringBootApplication
@EnableMongoRepositories
@CrossOrigin(origins = "*")
public class AlongthewayBackendApplication {



	public static void main(String[] args) {
		SpringApplication.run(AlongthewayBackendApplication.class, args);
	}

}
