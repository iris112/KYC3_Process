package com.kyc3.icotool.dataTypes;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

import javax.persistence.*;

@Entity
public class MrzObject implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@SerializedName("PassportType")
	private String passportType = "";
	@SerializedName("IssuingCountry")
	private String issuingCountry = "";
	@SerializedName("Surname")
	private String surname = "";
	@SerializedName("GivenName")
	private String givenName = "";
	@SerializedName("Sex")
	private String sex = "";
	@SerializedName("PassportNumber")
	private String passportNumber = "";
	@SerializedName("DateOfBirth")
	private String dateOfBirth = "";
	@SerializedName("DateOfExpiration")
	private String dateOfExpiration = "";
	@SerializedName("MRZCheck")
	private boolean mrzCheck = false;
	private boolean numberCheck = false;
	private boolean dobCheck = false;
	private boolean doeCheck = false;

	@OneToOne(cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn(name="status_id")
	private Status status;

	public MrzObject(Status status) {
		this.status = status;
	}

	public MrzObject() {
		;
	}

	public MrzObject(String passportTypeIn,
			String issuingCountryIn,
			String surNameIn,
			String givenNameIn,
			String sexIn,
			String passportNumberIn,
			String dateOfBirthIn,
			String dateOfExpirationIn,
			boolean mrzCheckIn,
			boolean numberCheckIn,
			boolean dobCheckIn,
			boolean doeCheckIn) {
		this.setPassportType(passportTypeIn);
		this.setIssuingCountry(issuingCountryIn);
		this.setSurname(surNameIn);
		this.setGivenName(givenNameIn);
		this.setSex(sexIn);
		this.setPassportNumber(passportNumberIn);
		this.setDateOfBirth(dateOfBirthIn);
		this.setDateOfExpiration(dateOfExpirationIn);
		this.setMrzCheck(mrzCheckIn);
		this.setNumberCheck(numberCheckIn);
		this.setDobCheck(dobCheckIn);
		this.setDoeCheck(doeCheckIn);
	}

	public String getPassportType() {
		return passportType;
	}

	public void setPassportType(String passportType) {
		this.passportType = passportType;
	}

	public String getIssuingCountry() {
		return issuingCountry;
	}

	public void setIssuingCountry(String issuingCountry) {
		this.issuingCountry = issuingCountry;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getGivenName() {
		return givenName;
	}

	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getPassportNumber() {
		return passportNumber;
	}

	public void setPassportNumber(String passportNumber) {
		this.passportNumber = passportNumber;
	}

	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getDateOfExpiration() {
		return dateOfExpiration;
	}

	public void setDateOfExpiration(String dateOfExpiration) {
		this.dateOfExpiration = dateOfExpiration;
	}

	public boolean isMrzCheck() {
		return mrzCheck;
	}

	public void setMrzCheck(boolean mrzCheck) {
		this.mrzCheck = mrzCheck;
	}

	public boolean isNumberCheck() {
		return numberCheck;
	}

	public void setNumberCheck(boolean numberCheck) {
		this.numberCheck = numberCheck;
	}

	public boolean isDobCheck() {
		return dobCheck;
	}

	public void setDobCheck(boolean dobCheck) {
		this.dobCheck = dobCheck;
	}

	public boolean isDoeCheck() {
		return doeCheck;
	}

	public void setDoeCheck(boolean doeCheck) {
		this.doeCheck = doeCheck;
	}

	public Status getStatus() {
		return this.status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
	
}
