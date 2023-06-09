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
	implementation ("com.fasterxml.jackson.core:jackson-databind:2.15.1")
	implementation ("javax.validation:validation-api:2.0.1.Final")
	implementation ("org.mongodb:mongodb-driver-sync")
	implementation ("org.springframework.boot:spring-boot-starter-data-mongodb")
	implementation ("org.springframework.boot:spring-boot-starter-web")
	implementation ("org.springframework.security:spring-security-crypto")
	implementation ("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework:spring-webmvc:5.3.27")
	implementation("io.jsonwebtoken:jjwt-api:0.11.2")
	implementation ("io.github.cdimascio:java-dotenv:5.2.2")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.2")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.2")
	developmentOnly ("org.springframework.boot:spring-boot-devtools")
	testImplementation ("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
