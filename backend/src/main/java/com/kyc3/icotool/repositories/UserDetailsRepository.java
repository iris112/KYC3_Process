package com.kyc3.icotool.repositories;

import com.kyc3.icotool.dataTypes.UserDetailsWithoutBinary;
import com.kyc3.icotool.dataTypes.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.Nullable;

import com.kyc3.icotool.dataTypes.UserDetails;

public interface UserDetailsRepository extends JpaRepository<UserDetails, Long>{
	
	@Nullable
	UserDetails findByUserData(UserData userData);

	/**
	 *  private Long id;
	 *     private String taxCountry;
	 *     private String nationality;
	 *     private Date dateOfBirth;
	 *     private String address;
	 *     private String walletAddress;
	 *     private Long amount;
	 *     private String sourceOfFunds;
	 *     private boolean onOwnBehalf;
	 *     private boolean nonUs;
	 *     private boolean nonChinese;
	 *     private boolean conditionsAgreement;
	 *     private boolean fullAndFactual;
	 *     private boolean exclusionStatement;
	 *     private boolean nonFATF;
	 *     private boolean acceptanceOfRiskDisclaimer;
	 *     private String telegramName;
	 *     private String twitterName;
	 *     private String linkedinProfile;
	 *     private String facebookProfile;
	 *     private int kycStatus = 0;
	 */
	@Query("select new com.kyc3.icotool.dataTypes.UserDetailsWithoutBinary(ud.taxCountry,ud.nationality,ud.dateOfBirth,ud.address," +
			"ud.walletAddress,ud.amount,ud.currencyType,ud.sourceOfFunds,ud.registrationTimestamp," +
			"ud.onOwnBehalf,ud.nonUs,ud.nonChinese,ud.conditionsAgreement,ud.fullAndFactual,ud.exclusionStatement,ud.nonFATF," +
			"ud.acceptanceOfRiskDisclaimer,ud.telegramName,ud.twitterName,ud.linkedinProfile,ud.facebookProfile,ud.kycStatus,ud.identityDocumentStatus,ud.proofOfResidenceStatus)" +
			" from UserDetails ud where ud.userData = ?1")
	UserDetailsWithoutBinary findByUserDataWithoutBinary(UserData userData);
}
