package com.kyc3.icotool.dataTypes;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class CountryRisk implements Serializable {
	private String isoCode;
	private String isoName;
	private float totalRisk;
	@SerializedName("mlRisk")
	private float amlRisk;
	private float corruptionRisk;
	
	public CountryRisk(String isoCode,
			String isoName,
			float totalRisk,
			float amlRisk,
			float corruptionRisk) {
		this.setIsoCode(isoCode);
		this.setIsoName(isoName);
		this.setTotalRisk(totalRisk);
		this.setAmlRisk(amlRisk);
		this.setCorruptionRisk(corruptionRisk);
	}

	public String getIsoCode() {
		return isoCode;
	}

	public void setIsoCode(String isoCode) {
		this.isoCode = isoCode;
	}

	public String getIsoName() {
		return isoName;
	}

	public void setIsoName(String isoName) {
		this.isoName = isoName;
	}

	public float getTotalRisk() {
		return totalRisk;
	}

	public void setTotalRisk(float totalRisk) {
		this.totalRisk = totalRisk;
	}

	public float getAmlRisk() {
		return amlRisk;
	}

	public void setAmlRisk(float amlRisk) {
		this.amlRisk = amlRisk;
	}

	public float getCorruptionRisk() {
		return corruptionRisk;
	}

	public void setCorruptionRisk(float corruptionRisk) {
		this.corruptionRisk = corruptionRisk;
	}
}
