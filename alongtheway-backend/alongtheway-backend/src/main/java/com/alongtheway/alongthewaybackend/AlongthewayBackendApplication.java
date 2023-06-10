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


	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(AlongthewayBackendApplication.class, args);
		loadEnvProperties(context.getEnvironment());
	}

	private static void loadEnvProperties(ConfigurableEnvironment environment) {
		Dotenv dotenv = Dotenv.configure().load();
		Map<String, Object> properties = new HashMap<>();
		properties.put("app.jwt.secret", dotenv.get("APP_JWT_SECRET"));
		environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", properties));
	}

	@Configuration
	public class ApplicationStartup implements ApplicationListener<ContextRefreshedEvent> {

		@Autowired
		private ApplicationContext applicationContext;

		@Override
		public void onApplicationEvent(ContextRefreshedEvent event) {
			Environment environment = applicationContext.getEnvironment();
			String jwtSecret = environment.getProperty("app.jwt.secret");

			if (jwtSecret.equals("yoursecretkeyhere")) {
				Dotenv dotenv = Dotenv.configure().load();
				String secretKey = dotenv.get("APP_JWT_SECRET");
				System.setProperty("app.jwt.secret", secretKey);
				System.out.println("Loaded Secret Key from .env: " + secretKey);
			}
		}
	}
}