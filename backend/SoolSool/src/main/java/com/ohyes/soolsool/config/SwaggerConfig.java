package com.ohyes.soolsool.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("SoolSool Application API Document")
                .description("SoolSool Application의 API 명세서입니다.")
                .version("1.0")
                .contact(new Contact().name("(주)오예스").email("official.ohyes@gmail.com"))
            );
    }
}
