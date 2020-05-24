package com.kyc3.icotool.dataTypes;

import java.io.Serializable;

public class RecognitionHash implements Serializable {

	private boolean liveliness = false;
	private boolean humanFace = false;
	private String faceHash = "";

	public RecognitionHash() {
    }

	public boolean isLiveliness() {
		return liveliness;
	}

	public void setLiveliness(boolean liveliness) {
		this.liveliness = liveliness;
	}

	public boolean isHumanFace() {
		return humanFace;
	}

	public void setHumanFace(boolean humanFace) {
		this.humanFace = humanFace;
	}

	public String getFaceHash() {
		return faceHash;
	}

	public void setFaceHash(String faceHash) {
        this.faceHash = faceHash;
    }
}
