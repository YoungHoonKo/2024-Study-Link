plugins {
	java
	id("org.springframework.boot") version "3.3.2"
	id("io.spring.dependency-management") version "1.1.6"
	kotlin("jvm") version "2.0.0"
}

group = "com.project"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.projectlombok:lombok")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
	implementation ("io.jsonwebtoken:jjwt-api:0.12.3")
	implementation ("io.jsonwebtoken:jjwt-impl:0.12.3")
	implementation ("io.jsonwebtoken:jjwt-jackson:0.12.3")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-mustache")
	implementation("org.springframework.boot:spring-boot-starter-data-redis")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	runtimeOnly("com.mysql:mysql-connector-j")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	annotationProcessor("org.projectlombok:lombok")


	implementation(kotlin("stdlib-jdk8"))

}

tasks.withType<Test> {
	useJUnitPlatform()
}

springBoot {
	mainClass = "com.project.project.ProjectApplication"
}

