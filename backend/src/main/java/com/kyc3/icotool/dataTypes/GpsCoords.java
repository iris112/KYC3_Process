package com.kyc3.icotool.dataTypes;

import java.io.Serializable;

public class GpsCoords implements Serializable {
	private double lon;
	private double lat;
	
	public GpsCoords(double lonIn, double latIn) {
		this.lon = lonIn;
		this.lat = latIn;
	}

	public GpsCoords() {
		;
	}
	
	public double getLon() {
		return lon;
	}
	public void setLon(double lon) {
		this.lon = lon;
	}
	public double getLat() {
		return lat;
	}
	public void setLat(double lat) {
		this.lat = lat;
	}
	
}
