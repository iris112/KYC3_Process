package com.kyc3.icotool.dataTypes;

import lombok.Value;

import java.util.Date;

@Value
public class UserDetailsWithoutBinary {
    //private Long id;
    private String taxCountry;
    private String nationality;
    private Date dateOfBirth;
    private String address;
    private String walletAddress;
    private double amount;
    private String currencyType;
    private String sourceOfFunds;
    private Long registrationTimestamp;
    private boolean onOwnBehalf;
    private boolean nonUs;
    private boolean nonChinese;
    private boolean conditionsAgreement;
    private boolean fullAndFactual;
    private boolean exclusionStatement;
    private boolean nonFATF;
    private boolean acceptanceOfRiskDisclaimer;
    private String telegramName;
    private String twitterName;
    private String linkedinProfile;
    private String facebookProfile;
    private int kycStatus;
    private String identityDocumentStatus;
    private String proofOfResidenceStatus;
    private byte[] proofOfResidence=null;
    private byte[] selfie=null;
    private byte[] passportFront=null;
    private byte[] passportBack=null;
    private byte[] selfieVideo = null;
}
