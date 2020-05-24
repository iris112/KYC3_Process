package com.kyc3.icotool;

import lombok.Data;

@Data
public class AuthToken {
    private String token;
    private Long validUntilTimestamp;
	
    public String getToken() {
		return token;
	}
    
    public Long getValidUntilTimestamp() {
    	return validUntilTimestamp;
    }
}