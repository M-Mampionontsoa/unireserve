package com.unireserve.dto;



import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateAssociationDto extends UpdateProfileDto {

    private String typeActivite;
}
 