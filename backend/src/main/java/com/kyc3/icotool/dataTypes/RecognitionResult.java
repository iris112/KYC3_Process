package com.kyc3.icotool.dataTypes;

import javax.persistence.*;
import java.io.Serializable;


@Entity
public class RecognitionResult implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private boolean liveliness = false;
	private boolean humanFace = false;
	private boolean faceMatch = false;

	@OneToOne(cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn(name="status_id")
	private Status status;

	public RecognitionResult() {
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

	public boolean isFaceMatch() {
		return faceMatch;
	}

	public void setFaceMatch(boolean faceMatch) {
		this.faceMatch = faceMatch;
	}

	
	
}
