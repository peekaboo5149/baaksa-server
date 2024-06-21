package org.baaksa;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebApplication {

    public static void main(String[] args) {
        Dotenv env = Dotenv.configure().load();
        for (DotenvEntry entry : env.entries()) {
            System.setProperty(entry.getKey(), entry.getValue());
        }
        SpringApplication.run(WebApplication.class, args);
    }
}
