package com.maintenance.maintenance_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI predictiveMaintenanceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sentinel Predictive Maintenance API")
                        .description("REST API pour la supervision et la maintenance prédictive industrielle basée sur le dataset Microsoft Azure.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Sentinel Platform Engineering")
                                .email("support@sentinel-maintenance.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
