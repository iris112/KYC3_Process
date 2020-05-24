package com.kyc3.icotool.dataTypes;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Wither;

import java.io.Serializable;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Wither
public class Role implements Serializable {

	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	private Integer id;
	
	@NotNull
	@Size(max=65)
	private String roleName;
	@NotNull
	private Long expirationTimestamp = 0L;
	@NotNull
	private String userName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id")
	@JsonBackReference
	private UserData userData;

//	public void setExpirationTimestamp(Long timeIn) {
//		this.expirationTimestamp = timeIn;
//	}
//
//	public Long getExpirationTimestamp() {
//		return this.expirationTimestamp;
//	}
	
}
