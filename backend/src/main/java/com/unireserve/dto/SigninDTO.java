package com.unireserve.dto;

import com.unireserve.entity.Role;

import lombok.Data;

@Data
public class SigninDTO {
    private String name;
    private String firstName;
    private String username;
    private String email;
    private String password;
    private String role;


}
