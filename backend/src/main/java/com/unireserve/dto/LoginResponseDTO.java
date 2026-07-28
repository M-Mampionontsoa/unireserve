package com.unireserve.dto;



import lombok.Data;

@Data
public class LoginResponseDTO {

    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private UserInfoDTO user;

}
 