package com.kyc3.icotool.dataTypes;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "user_risk")
public class RiskResult implements Serializable{
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private int sanctionScore = 0;
	private int pepScore = 0;
	private double riskScore = 0.0;
	private double countryRisk;
//	@ElementCollection(fetch=FetchType.LAZY)
//	@CollectionTable(name = "sanction_details", joinColumns = @JoinColumn(name = "risk_result_id"))
    //@Column(name = "sanction_detail")
	@OneToMany(fetch = FetchType.EAGER,cascade=CascadeType.ALL)
	@JoinColumn(name="risk_result_id")
	private List<SanctionEntity> sanctionDetails; // = new ArrayList<SanctionEntity>();
	//@ElementCollection(fetch=FetchType.LAZY)
	//@CollectionTable(name = "pep_details", joinColumns = @JoinColumn(name = "risk_result_id"))
	@OneToMany(fetch = FetchType.EAGER,cascade=CascadeType.ALL)
	@JoinColumn(name="risk_result_id")
    //@Column(name = "pep_detail")
	private List<SanctionEntity> pepDetails; // = new ArrayList<SanctionEntity>();

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id")
	@JsonBackReference
	private UserData userData;
	
	public RiskResult(UserData userData) {
		this.userData = userData;
		//sanctionDetails = new ArrayList<SanctionEntity>();
		//pepDetails = new ArrayList<SanctionEntity>();
	}

	public RiskResult() {
    }
	
	public int getSanctionScore() {
		return sanctionScore;
	}

	public void setSanctionScore(int sanctionScore) {
		this.sanctionScore = sanctionScore;
	}

	public int getPepScore() {
		return pepScore;
	}

	public void setPepScore(int pepScore) {
		this.pepScore = pepScore;
	}

	public double getCountryRisk() {
		return countryRisk;
	}

	public void setCountryRisk(double countryRisk) {
		this.countryRisk = countryRisk;
	}
	
	public List<SanctionEntity> getSanctionDetails() {
		return sanctionDetails;
	}
	
	public List<SanctionEntity> getPepDetails() {
		return pepDetails;
	}
	
	public void addSanctionDetail(SanctionEntity in) {
		sanctionDetails.add(in);
	}
	
	public void addPepDetail(SanctionEntity in) {
		pepDetails.add(in);
	}

	public double getRiskScore() {
		return riskScore;
	}

	public void setRiskScore(double riskScore) {
		this.riskScore = riskScore;
	}
	
	public void setUserData(UserData u) {
		this.userData = u;
	}

	public UserData getUserData() {
		return this.userData;
	}
}
