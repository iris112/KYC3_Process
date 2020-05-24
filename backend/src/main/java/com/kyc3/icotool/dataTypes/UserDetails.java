package com.kyc3.icotool.dataTypes;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "user_details")
public class UserDetails implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	//@NotNull
	@Size(max=3)
	private String taxCountry;
	
	//@NotNull
	//@Size(max=3)
	private String nationality;
	
	//@NotNull
	@Temporal(TemporalType.DATE)
	private Date dateOfBirth;
	
	//@NotNull
	//@Size(max=100)
	private String address;
	
	//@NotNull
	@Size(max=256)
	private String walletAddress;

	//@NotNull
	private double amount;

	//@NotNull
	@Size(max=50)
	private String currencyType;
	
	//@NotNull
	@Size(max=65)
	private String sourceOfFunds;

	private Long registrationTimestamp;
	
	//@NotNull
	private boolean onOwnBehalf;

	//@NotNull
	private boolean nonUs;
	
	//@NotNull
	private boolean nonChinese;
	
	//@NotNull
	private boolean conditionsAgreement;
	
	//@NotNull
	private boolean fullAndFactual;
	
	//@NotNull
	private boolean exclusionStatement;
	
	//@NotNull
	private boolean nonFATF;
	
	//@NotNull
	private boolean acceptanceOfRiskDisclaimer;
	
	@Size(max=65)
	private String telegramName;
	
	@Size(max=65)
	private String twitterName;
	
	@Size(max=512)
	private String linkedinProfile;
	
	@Size(max=512)
	private String facebookProfile;

	private String[] wordList = new String[0];
	
	@Lob
	private byte[] proofOfResidence = new byte[0];
	
	@Lob
	private byte[] selfie = new byte[0];
	
	@Lob
	private byte[] passportFront = new byte[0];
	
	@Lob
	private byte[] passportBack = new byte[0];

	@Lob
	private byte[] selfieVideo = new byte[0];

	@Lob
	private String faceHash = "";
	
	private int kycStatus = 0;

	private String identityDocumentStatus = "gray";

	private String proofOfResidenceStatus = "gray";
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id")
	@JsonBackReference
	private UserData userData;

	public UserDetails(String taxCountry,
					   String nationality,
					   Date dateOfBirth,
					   String address,
					   String walletAddress,
					   double amount,
					   String currencyType,
					   String sourceOfFunds,
					   Long registrationTimestamp,
					   boolean onOwnBehalf,
					   boolean nonUs,
					   boolean nonChinese,
					   boolean conditionsAgreement,
					   boolean fullAndFactual,
					   boolean exclusionStatement,
					   boolean nonFATF,
					   boolean acceptanceOfRiskDisclaimer,
					   String telegramName,
					   String twitterName,
					   String linkedinProfile,
					   String facebookProfile
	) {
		this.taxCountry = taxCountry;
		this.nationality = nationality;
		this.dateOfBirth = dateOfBirth;
		this.address = address;
		this.walletAddress = walletAddress;
		this.amount = amount;
		this.currencyType = currencyType;
		this.sourceOfFunds = sourceOfFunds;
		this.registrationTimestamp = registrationTimestamp;

		this.onOwnBehalf = onOwnBehalf;
		this.nonUs = nonUs;
		this.nonChinese = nonChinese;
		this.conditionsAgreement = conditionsAgreement;
		this.fullAndFactual = fullAndFactual;
		this.exclusionStatement = exclusionStatement;
		this.nonFATF = nonFATF;
		this.acceptanceOfRiskDisclaimer = acceptanceOfRiskDisclaimer;

		this.telegramName = telegramName;
		this.twitterName = twitterName;
		this.linkedinProfile = linkedinProfile;
		this.facebookProfile = facebookProfile;
	}

	public UserDetails(String taxCountry,
			String nationality,
			Date dateOfBirth,
			String address,
			String walletAddress,
			double amount,
			String currencyType,
			String sourceOfFunds,
			Long registrationTimestamp,
			boolean onOwnBehalf,
			boolean nonUs,
			boolean nonChinese,
			boolean conditionsAgreement,
			boolean fullAndFactual,
			boolean exclusionStatement,
			boolean nonFATF,
			boolean acceptanceOfRiskDisclaimer,
			String telegramName,
			String twitterName,
			String linkedinProfile,
			String facebookProfile,
			byte[] proofOfResidence,
			byte[] selfie,
			byte[] passportFront,
			byte[] passportBack
			) {
		this.taxCountry = taxCountry;
		this.nationality = nationality;
		this.dateOfBirth = dateOfBirth;
		this.address = address;
		this.walletAddress = walletAddress;
		this.amount = amount;
		this.currencyType = currencyType;
		this.sourceOfFunds = sourceOfFunds;
		this.registrationTimestamp = registrationTimestamp;
		
		this.onOwnBehalf = onOwnBehalf;
		this.nonUs = nonUs;
		this.nonChinese = nonChinese;
		this.conditionsAgreement = conditionsAgreement;
		this.fullAndFactual = fullAndFactual;
		this.exclusionStatement = exclusionStatement;
		this.nonFATF = nonFATF;
		this.acceptanceOfRiskDisclaimer = acceptanceOfRiskDisclaimer;
		
		this.telegramName = telegramName;
		this.twitterName = twitterName;
		this.linkedinProfile = linkedinProfile;
		this.facebookProfile = facebookProfile;

		this.proofOfResidence = proofOfResidence;
		this.selfie = selfie;
		this.passportFront = passportFront;
		this.passportBack = passportBack;
	}
	
	public UserDetails(String taxCountry,
			String nationality,
			Date dateOfBirth,
			String address,
			String walletAddress,
			double amount,
			String currencyType,
			String sourceOfFunds,
			Long registrationTimestamp,
			boolean onOwnBehalf,
			boolean nonUs,
			boolean nonChinese,
			boolean conditionsAgreement,
			boolean fullAndFactual,
			boolean exclusionStatement,
			boolean nonFATF,
			boolean acceptanceOfRiskDisclaimer,
			String telegramName,
			String twitterName,
			String linkedinProfile,
			String facebookProfile,
			byte[] proofOfResidence,
			byte[] selfie,
			byte[] passportFront) {
		this.taxCountry = taxCountry;
		this.nationality = nationality;
		this.dateOfBirth = dateOfBirth;
		this.address = address;
		this.walletAddress = walletAddress;
		this.amount = amount;
		this.currencyType = currencyType;
		this.sourceOfFunds = sourceOfFunds;
		this.registrationTimestamp = registrationTimestamp;
		
		this.onOwnBehalf = onOwnBehalf;
		this.nonUs = nonUs;
		this.nonChinese = nonChinese;
		this.conditionsAgreement = conditionsAgreement;
		this.fullAndFactual = fullAndFactual;
		this.exclusionStatement = exclusionStatement;
		this.nonFATF = nonFATF;
		this.acceptanceOfRiskDisclaimer = acceptanceOfRiskDisclaimer;

		this.telegramName = telegramName;
		this.twitterName = twitterName;
		this.linkedinProfile = linkedinProfile;
		this.facebookProfile = facebookProfile;
		
		this.proofOfResidence = proofOfResidence;
		this.selfie = selfie;
		this.passportFront = passportFront;
	}
	
	public UserDetails(String taxCountry,
			String nationality,
			Date dateOfBirth,
			String address,
			String walletAddress,
			double amount,
			String currencyType,
			String sourceOfFunds,
			Long registrationTimestamp) {
		this.taxCountry = taxCountry;
		this.nationality = nationality;
		this.dateOfBirth = dateOfBirth;
		this.address = address;
		this.walletAddress = walletAddress;
		this.amount = amount;
		this.currencyType = currencyType;
		this.sourceOfFunds = sourceOfFunds;
		this.registrationTimestamp = registrationTimestamp;
	}
	
	public UserDetails() {

    }
	
	public UserDetails(UserData u) {
		this.userData = u;
	}
	
	public void setUserData(UserData u) {
		this.userData = u;
	}

	public void setProofOfResidence(byte[] sIn) {
		this.proofOfResidence = sIn;
	}
	
	public void setSelfie(byte[] selfieIn) {
		this.selfie = selfieIn;
	}
	
	public void setPassportFront(byte[] passportFrontIn) {
		this.passportFront = passportFrontIn;
	}
	
	public void setPassportBack(byte[] passportBackIn) {
		this.passportBack = passportBackIn;
	}

	public void setTaxCountry(String taxCountry) {
	    this.taxCountry = taxCountry;
    }

    public void setNationality(String nationality) {
	    this.nationality = nationality;
    }

    public void setDateOfBirth(Date dateOfBirth) {
	    this.dateOfBirth = dateOfBirth;
    }

    public void setAddress(String address) {
	    this.address = address;
    }

    public void setWalletAddress(String walletAddress) {
	    this.walletAddress = walletAddress;
    }

    public void setSourceOfFunds(String sourceOfFunds) {
	    this.sourceOfFunds = sourceOfFunds;
	}
	
	public void setRegistrationTimestamp(Long registrationTimestamp) {
	    this.registrationTimestamp = registrationTimestamp;
    }

    public void setTwitterName(String twitterName) {
	    this.twitterName = twitterName;
    }

    public void setFacebookProfile(String facebookProfile) {
	    this.facebookProfile = facebookProfile;
    }

    public void setLinkedinProfile(String linkedinProfile) {
	    this.linkedinProfile = linkedinProfile;
    }

    public void setTelegramName(String telegramName) {
	    this.telegramName = telegramName;
    }

	public byte[] getProofOfResidence() {
		return this.proofOfResidence;
	}
	
	public byte[] getSelfie() {
		return this.selfie;
	}

	public byte[] getSelfieVideo() { return this.selfieVideo; }
	
	public byte[] getPassportFront() {
		return this.passportFront;
	}

	public String getUserName() {
		return this.userData.getUserName();
	}
	
	public byte[] getPassportBack() {
		return this.passportBack;
	}
	
	public String getTaxCountry() {
		return taxCountry;
	}
	
	public String getNationality() {
		return nationality;
	}

	public String getFaceHash() {
		return this.faceHash;
	}
	
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	
	public String getAddress() {
		return address;
	}
	
	public String getwalletAddress() {
		return walletAddress;
	}
	
	public String getSourceOfFunds() {
		return sourceOfFunds;
	}

	public Long getRegistrationTimestamp() {
		return registrationTimestamp;
	}

	public void setSelfieVideo(byte[] selfieVideo) { this.selfieVideo = selfieVideo; }

	public void setWordList(String[] wordList) {
		this.wordList = wordList;
	}

	public String[] getWordList() {
		return this.wordList;
	}

	public void setamount(double amount) {
		this.amount = amount;
	}

	public double getamount() {
		return this.amount;
	}

	public void setCurrencyType(String currencyType) {
		this.currencyType = currencyType;
	}

	public String getCurrencyType() {
		return this.currencyType;
	}
	
	public int getKycStatus() {
		return this.kycStatus;
	}
	
	public void setKycStatus(int kycStatus) {
		this.kycStatus = kycStatus;
	}

	public String getIdentityDocumentStatus() {
		return this.identityDocumentStatus;
	}
	
	public void setIdentityDocumentStatus(String identityDocumentStatus) {
		this.identityDocumentStatus = identityDocumentStatus;
	}

	public String getProofOfResidenceStatus() {
		return this.proofOfResidenceStatus;
	}
	
	public void setProofOfResidenceStatus(String proofOfResidenceStatus) {
		this.proofOfResidenceStatus = proofOfResidenceStatus;
	}

	public void setFaceHash(String faceHash) {
		this.faceHash = faceHash;
	}
}
