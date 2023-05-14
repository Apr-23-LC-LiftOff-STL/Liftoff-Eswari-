plugins {
	java
	id("org.springframework.boot") version "2.7.11"
	id("io.spring.dependency-management") version "1.0.15.RELEASE"
}

group = "com.alongtheway"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
	mavenCentral()
}

dependencies {
	implementation ("org.mongodb:mongodb-driver-sync")
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
	implementation ("org.springframework.boot:spring-boot-starter-thymeleaf")
//	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation ("org.springframework.security:spring-security-crypto")
	implementation ("org.springframework.boot:spring-boot-starter-validation")
//	implementation ("mysql:mysql-connector-java:8.0.29")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
