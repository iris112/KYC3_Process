package com.kyc3.icotool;

import com.kyc3.icotool.dataTypes.UserData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.kyc3.icotool.dataTypes.Entities;

public class KycEvaluator {
	
	public String doKYC(UserData userData) {
		Gson gson = new Gson();
		String tmpName = userData.getFirstName() + " " + userData.getLastName();
		String sanctionString = "https://api.kyc3.com/rest/api/_getSanctionEntityDetails?api_key=Z2SBQ89dN8yoVDXZ&search_query=" + tmpName;		
		String pepString = "https://api.kyc3.com/rest/api/_getPepEntityDetails?api_key=Z2SBQ89dN8yoVDXZ&search_query=" + tmpName;		

		ResponseEntity<String> response = null;

		RestTemplate sRestTemplate = new RestTemplate();
		Entities sanctions = null;
		Entities peps = null;
		
		try {
			response = sRestTemplate.getForEntity(sanctionString, String.class);
			sanctions = gson.fromJson(response.getBody(),Entities.class);
			
			response = sRestTemplate.getForEntity(pepString,String.class);
			peps = gson.fromJson(response.getBody(),Entities.class);
			
			//System.out.println(response.getBody().toString());
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Does not work!!");
		}
		
		
		
		return "Blubb.";
	}
}
