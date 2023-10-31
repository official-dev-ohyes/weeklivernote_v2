package com.ohyes.soolsool;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@OpenAPIDefinition(servers = {@Server(url = "/api", description = "Default Server URL")})

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class SoolSoolApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoolSoolApplication.class, args);
	}

}
