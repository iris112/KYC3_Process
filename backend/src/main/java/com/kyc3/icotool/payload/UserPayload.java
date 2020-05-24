package com.kyc3.icotool.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

import org.hibernate.validator.constraints.Length;

import lombok.Data;

@Data
public class UserPayload {
	
	//@NotEmpty(message = "{username.not.empty}")
	//@UserDoesNotExist
	private String userName;
	//@NotEmpty(message = "{first.name.must.not.be.empty}")
	private String firstName;
	//@NotEmpty(message = "{last.name.must.not.be.empty}")
	private String lastName;
	@NotEmpty
	private String email;
	@NotBlank(message = "{user.password.not.valid}")
	@Length(min=6, max=64, message = "{user.password.not.valid}")
	private String password;
	private String role;
	
	public UserPayload(String userName,
			String firstName,
			String lastName,
			String email,
			String password,
			String role) {
		this.userName = userName;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.role = role;
	}
	
	public String getUserName() {
		return this.userName;
	}
	
	public String getFirstName() {
		return this.firstName;
	}
	
	public String getLastName() {
		return this.lastName;
	}
	
	public String getEmail() {
		return this.email;
	}
	
	public String getPassword() {
		return this.password;
	}
	
	public String getRole() {
		return role;
	}
}
