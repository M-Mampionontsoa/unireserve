package com.unireserve.dto;

import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
public class AuthDTO {
    private String email;
    private String password;
}
