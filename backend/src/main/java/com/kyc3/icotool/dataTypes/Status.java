package com.kyc3.icotool.dataTypes;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import org.hibernate.annotations.TypeDef;

@Entity
@Table(name = "user_status")
@TypeDef(
	    name = "json-node",
	    typeClass = JsonNodeType.class
	)
public class Status implements Serializable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id")
	@JsonBackReference
	private UserData userData;
	
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="recognition_id")
	private RecognitionResult recognitionResult;
	private boolean pictureGenuity = false;
	private String ipLocation;
	@ElementCollection
    @CollectionTable(name = "device_locations", joinColumns = @JoinColumn(name = "status_id"))
    @Column(name = "device_location")
	private List<GpsCoords> deviceLocations = new ArrayList<GpsCoords>();
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="status_id")
	private MrzObject mrz;
	private Boolean[] returnList;
	private boolean wordMatch;
	private int kycStatus = 0;
	private String identityDocumentStatus = "gray";
	private String proofOfResidenceStatus = "gray";
	@Column(length=10240)
	private String comment = "";

	public Status(UserData u) {
		this.userData = u;
	}
	
	public Status() {
    }
	
	public boolean isPictureGenuity() {
		return pictureGenuity;
	}

	public void setPictureGenuity(boolean pictureGenuity) {
		this.pictureGenuity = pictureGenuity;
	}

	public String getIpLocation() {
		return ipLocation;
	}

	public void setIpLocation(String ipLocation) {
		this.ipLocation = ipLocation;
	}

	public List<GpsCoords> getDeviceLocations() {
		return deviceLocations;
	}

	public void setDeviceLocations(List<GpsCoords> deviceLocations) {
		this.deviceLocations = deviceLocations;
	}
	
	public void addDeviceLocation(GpsCoords coords) {
		this.deviceLocations.add(coords);
	}

	public int getKycStatus() {
		return kycStatus;
	}

	public void setKycStatus(int kycStatus) {
		this.kycStatus = kycStatus;
	}

	public String getIdentityDocumentStatus() {
		return identityDocumentStatus;
	}

	public void setIdentityDocumentStatus(String identityDocumentStatus) {
		this.identityDocumentStatus = identityDocumentStatus;
	}

	public String getProofOfResidenceStatus() {
		return proofOfResidenceStatus;
	}

	public void setProofOfResidenceStatus(String proofOfResidenceStatus) {
		this.proofOfResidenceStatus = proofOfResidenceStatus;
	}
	
	public void setUserData(UserData u) {
		this.userData = u;
	}

	public RecognitionResult getRecognitionResult() {
		return recognitionResult;
	}

	public void setRecognitionResult(RecognitionResult recognitionResult) {
		this.recognitionResult = recognitionResult;
	}

	public void setMrz(MrzObject mrz) {
		this.mrz = mrz;
	}

	public MrzObject getMrz() {
		return this.mrz;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public void setWordMatch(boolean wordMatch) {
	    this.wordMatch = wordMatch;
    }

    public boolean getWordMatch() {
	    return this.wordMatch;
    }

	public String getComment() {
		return this.comment;
	}

	public void setReturnList(Boolean[] returnList) {
		this.returnList = returnList;
	}

	public Boolean[] getReturnList() {
		return this.returnList;
	}

}
