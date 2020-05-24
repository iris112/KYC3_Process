package com.kyc3.icotool.controller;

import java.util.HashMap;
import java.util.Map;

import com.kyc3.icotool.dataTypes.UserData;

import com.kyc3.icotool.UserPasswordManager;
import com.kyc3.icotool.payload.UserPayload;

public class UserCreator {
	
	//@Autowired
	//static UserPasswordManager userPasswordManager = new UserPasswordManager();
	
	public static UserData createUser(UserPayload userP) {
		UserData actUserData = new UserData();
		Map<String, String> pswd = new HashMap<String,String>();
		
		pswd = UserPasswordManager.hashPasswordShiro(userP.getPassword());

		//System.out.println("pswd,hash: " + pswd.get("hash"));
		//System.out.println("pswd.salt: " + pswd.get("salt"));
		
		actUserData.setFirstName(userP.getFirstName());
		actUserData.setLastName(userP.getLastName());
		actUserData.setEmail(userP.getEmail());
		//actUserData.setRole(userP.getRole());
		actUserData.setUserName(userP.getUserName());
		actUserData.setPassword(pswd.get("hash"));
		actUserData.setPasswordSalt(pswd.get("salt"));
		actUserData.setCreatedAt(System.currentTimeMillis());
		
		return actUserData;
	}
	
	

}
