package com.unireserve.dto;



import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AssociationDto extends ProfileDto {

    private String typeActivite;
}
