package com.ohyes.soolsool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SoolSoolApplication {

	public static void main(String[] args) {
		SpringApplication.run(SoolSoolApplication.class, args);
	}

}
