package com.kyc3.icotool.dataTypes;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class SanctionEntity implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	private View view;
	private String type;
	
	@ElementCollection
    @CollectionTable(name = "aka_names", joinColumns = @JoinColumn(name = "sanction_entity_id"))
    @Column(name = "aka_name")
	private List<String> akaNames;
	@ElementCollection
    @CollectionTable(name = "addresses", joinColumns = @JoinColumn(name = "sanction_entity_id"))
    @Column(name = "address")
	private List<String> addresses;
	@ElementCollection
    @CollectionTable(name = "birth_dates", joinColumns = @JoinColumn(name = "sanction_entity_id"))
    @Column(name = "birth_date")
	private List<String> birthDates;
	@ElementCollection
    @CollectionTable(name = "birth_places", joinColumns = @JoinColumn(name = "sanction_entity_id"))
    @Column(name = "birth_place")
	private List<String> birthPlaces;
	private boolean sanctioned;
	private boolean pep;
	@ElementCollection
    @CollectionTable(name = "affiliations", joinColumns = @JoinColumn(name = "sanction_entity_id"))
    @Column(name = "affiliation")
	private List<String> affiliations;
	private long firstSeen;
	private long lastSeen;
	private String entityType;
	private String entityName;
	@Column(length=2048)
	private String description;
	private String source;
	private long timestamp;

	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="risk_id")
	private RiskResult riskResult;
	
	public View getView() {
		return view;
	}
	public void setView(View view) {
		this.view = view;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<String> getAkaNames() {
		return akaNames;
	}
	public void setAkaNames(List<String> akaNames) {
		this.akaNames = akaNames;
	}
	public List<String> getAddresses() {
		return addresses;
	}
	public void setAddresses(List<String> addresses) {
		this.addresses = addresses;
	}
	public List<String> getBirthDates() {
		return birthDates;
	}
	public void setBirthDates(List<String> birthDates) {
		this.birthDates = birthDates;
	}
	public List<String> getBirthPlaces() {
		return birthPlaces;
	}
	public void setBirthPlaces(List<String> birthPlaces) {
		this.birthPlaces = birthPlaces;
	}
	public boolean isSanctioned() {
		return sanctioned;
	}
	public void setSanctioned(boolean sanctioned) {
		this.sanctioned = sanctioned;
	}
	public boolean isPep() {
		return pep;
	}
	public void setPep(boolean pep) {
		this.pep = pep;
	}
	public List<String> getAffiliations() {
		return affiliations;
	}
	public void setAffiliations(List<String> affiliations) {
		this.affiliations = affiliations;
	}
	public long getFirstSeen() {
		return firstSeen;
	}
	public void setFirstSeen(long firstSeen) {
		this.firstSeen = firstSeen;
	}
	public long getLastSeen() {
		return lastSeen;
	}
	public void setLastSeen(long lastSeen) {
		this.lastSeen = lastSeen;
	}
	public String getEntityType() {
		return entityType;
	}
	public void setEntityType(String entityType) {
		this.entityType = entityType;
	}
	public String getEntityName() {
		return entityName;
	}
	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}

	public void setRiskResult(RiskResult riskResult)
	{
		this.riskResult = riskResult;
	}

	RiskResult getRiskResult() {
		return this.riskResult;
	}
}
