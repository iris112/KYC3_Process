package com.kyc3.icotool.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AuthPayload {

    @NotEmpty(message = "{username.not.empty}")
    private String username;

    @NotBlank(message = "{user.password.not.valid}")
    @Length(min = 6, max = 64, message = "{user.password.not.valid}")
    private String password;

	public String getUsername() {
		return username;
	}
	
	public String getPassword() {
		return password;
	}
}