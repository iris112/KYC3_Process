package com.kyc3.icotool.dataTypes;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
//@NamedQuery(name = "UserData.findByUserName", query = "SELECT u FROM UserData WHERE LOWER(u.userName) = LOWER(?1)")
@Table(name = "user_data")
public class UserData implements Serializable {
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@NotNull
	@Size(max=65)
	@Column(unique = true)
	private String userName;
	@NotNull
	@Size(max=65)
	private String firstName;
	@NotNull
	@Size(max=65)
	private String lastName;
	@NotNull
	@Size(max=100)
	@Column(unique = true)
	private String email;
	@NotNull
	private String password;
	@NotNull
	private String passwordSalt;
	private long createdAt;
	@NotNull
	private boolean isMuted = false;
	
	@OneToOne(fetch = FetchType.EAGER,
			cascade = CascadeType.ALL,
			mappedBy = "userData")
	@JsonManagedReference
	private UserDetails details; //= new UserDetails(this);
	
	@OneToOne(fetch = FetchType.EAGER,
			cascade = CascadeType.ALL,
			mappedBy = "userData")
	@JsonManagedReference
	private RiskResult riskResult; // = new RiskResult(this);
	
	@OneToOne(fetch = FetchType.EAGER,
			cascade = CascadeType.ALL,
			mappedBy = "userData")
	@JsonManagedReference
	private Status status;// = new Status(this);

	@OneToMany(
			cascade = CascadeType.ALL,
			orphanRemoval = true
	)
	private List<Role> role = new ArrayList<Role>();


	public UserData() {
		;
	}

	public UserData(UserDataWithoutBinary uNb) {
		this.id = uNb.getId();
		this.userName = uNb.getUserName();
		this.firstName= uNb.getFirstName();
		this.lastName = uNb.getLastName();
		this.password = uNb.getPassword();
		this.passwordSalt = uNb.getPasswordSalt();
		this.createdAt = uNb.getCreatedAt();
		this.isMuted = uNb.getIsMuted();
		this.email = uNb.getEmail();
	}


	public Long getId() {
		return id;
	}
	
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password; //org.apache.commons.codec.digest.DigestUtils.sha256Hex(password);
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	public UserDetails getDetails() {
		return details;
	}
	public void setDetails(UserDetails details) {
		this.details = details;
	}
	
	public RiskResult getRiskResult() {
		return riskResult;
	}
	
	public void setRiskResult(RiskResult rIn) {
		this.riskResult = rIn;
	}
	
	public Status getStatus() {
		return status;
	}
	
	public void setStatus(Status statusIn) {
		this.status = statusIn;
	}
	
	public String getPasswordSalt() {
		return passwordSalt;
	}
	
	public void setPasswordSalt(String saltIn) {
		passwordSalt = saltIn;
	}

	public long getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(long createdAt) {
		this.createdAt = createdAt;
	}
	
	public void addRole(Role role){
		this.role.add(role);
	}

	//public boolean hasRole(Role role) { this.role.isEmpty(); }

	public void setRoles(List<Role> roles) {
		this.role = roles;
	}

	public List<Role> getRoles() {
		return this.role;
	}

	public String getUsername() {
		return this.userName;
	}

	public boolean getIsMuted()
	{
		return this.isMuted;
	}

	public void setIsMuted(boolean isMuted) {
		this.isMuted = isMuted;
	}

}

