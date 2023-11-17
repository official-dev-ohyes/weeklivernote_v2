package com.ohyes.soolsool.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        SecurityScheme securityScheme = new SecurityScheme()
            .name("Authorization")
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER);

        return new OpenAPI()
            .addSecurityItem(new SecurityRequirement().addList("Authorization"))
            .components(
                new io.swagger.v3.oas.models.Components().addSecuritySchemes("Authorization",
                    securityScheme))
            .info(new Info()
                .title("SoolSool Application API Document")
                .description("SoolSool Application의 API 명세서입니다.")
                .version("1.0")
                .contact(new Contact().name("(주)오예스").email("official.ohyes@gmail.com"))
            );
    }
}
