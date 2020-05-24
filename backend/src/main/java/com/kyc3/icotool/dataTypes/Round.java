package com.kyc3.icotool.dataTypes;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
//@NamedQuery(name = "UserData.findByUserName", query = "SELECT u FROM UserData WHERE LOWER(u.userName) = LOWER(?1)")
@Table(name = "rounds")
public class Round implements Serializable {
	@Id
    @GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	@NotNull
    private int discount;
	@NotNull
    private int tokens;
	@NotNull
    private Long startTimestamp;
    @NotNull
    private Long endTimestamp;
    @NotNull
    private int round;
    @NotNull
    private boolean active;

    public Round() {
    }
    
    public Round(Round rnd) {
        this.id = rnd.getId();
        this.discount = rnd.getDiscount();
        this.tokens = rnd.getTokens();
        this.startTimestamp = rnd.getStartTimestamp();
        this.endTimestamp = rnd.getEndTimestamp();
        this.round = rnd.getRound();
        this.active = rnd.getActive();
    }

	public Long getId() {
		return id;
    }
    
    public int getDiscount() {
        return discount;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public int getTokens() {
        return tokens;
    }

    public void setTokens(int tokens) {
        this.tokens = tokens;
    }

    public Long getStartTimestamp() {
        return startTimestamp;
    }

    public void setStartTimestamp(Long startTimestamp) {
        this.startTimestamp = startTimestamp;
    }

    public Long getEndTimestamp() {
        return endTimestamp;
    }

    public void setEndTimestamp(Long endTimestamp) {
        this.endTimestamp = endTimestamp;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    public boolean getActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

}

