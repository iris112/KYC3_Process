package com.kyc3.icotool.dataTypes;

import java.util.List;

public class Entities {
	private int hits;
	private List<SanctionEntity> sanctionedEntities;
	
	
	public int getHits() {
		return hits;
	}
	public void setHits(int hits) {
		this.hits = hits;
	}
	public List<SanctionEntity> getSanctionedEntities() {
		return sanctionedEntities;
	}
	public void setSanctionedEntities(List<SanctionEntity> sanctionedEntities) {
		this.sanctionedEntities = sanctionedEntities;
	}
}
