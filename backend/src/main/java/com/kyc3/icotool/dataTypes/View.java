package com.kyc3.icotool.dataTypes;

import java.io.Serializable;

import javax.persistence.Embeddable;

@Embeddable
public class View implements Serializable{
	private String key;
	private String viewName;
	
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getViewName() {
		return viewName;
	}
	public void setViewName(String viewName) {
		this.viewName = viewName;
	}
}