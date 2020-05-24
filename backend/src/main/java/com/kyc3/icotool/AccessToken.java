package com.kyc3.icotool;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Builder
@AllArgsConstructor
@Entity
public class AccessToken {
    
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
    private String token;
    private Long userId;
    private Boolean isAdmin;
    private String userName;
    private Long validUntilTimestamp;

}