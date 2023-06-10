package com.alongtheway.alongthewaybackend;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import io.github.cdimascio.dotenv.Dotenv;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;


@SpringBootApplication
@EnableMongoRepositories
@CrossOrigin(origins = "*")
public class AlongthewayBackendApplication {


	public static void main(String[] args) { SpringApplication.run(AlongthewayBackendApplication.class, args);}



	@Configuration
	public class ApplicationStartup implements ApplicationListener<ApplicationReadyEvent> {

		@Autowired
		private ApplicationContext applicationContext;

		@Value("${app.jwt.secret}")
		private String jwtSecret;

		@Override
		public void onApplicationEvent(ApplicationReadyEvent event) {
			if (jwtSecret.equals("${app.jwt.secret}")) {
				System.err.println("ERROR: 'app.jwt.secret' placeholder not resolved");
				System.exit(1);
			}

			System.out.println("Loaded Secret Key: " + jwtSecret);
			// Your additional logic here
		}
	}
}