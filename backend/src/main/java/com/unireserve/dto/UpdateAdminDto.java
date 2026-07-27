package com.unireserve.dto;



import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateAdminDto extends UpdateProfileDto {

    private String status;
}
