package com.kyc3.icotool.dataTypes;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import com.kyc3.icotool.repositories.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.kyc3.icotool.AccessToken;
import com.kyc3.icotool.AuthToken;
import com.kyc3.icotool.UserPasswordManager;
import com.kyc3.icotool.exceptions.ForbiddenException;
import com.kyc3.icotool.payload.AuthPayload;
import com.kyc3.icotool.repositories.AccessTokenRepository;

@Component
public class AccessTokenManager {

    private final UserDataRepository userDataRepository;

    private final AccessTokenRepository accessTokenRepository;

    private final UserPasswordManager userPasswordManager;
    
    public static void checkAllowed(boolean state, String message) {
    	if (!state) {
    		throw new ForbiddenException(message);
    	}
    }

    @Autowired
    public AccessTokenManager(UserDataRepository userDataRepository, AccessTokenRepository accessTokenRepository, UserPasswordManager userPasswordManager) {
        this.userDataRepository = userDataRepository;
        this.accessTokenRepository = accessTokenRepository;
        this.userPasswordManager = userPasswordManager;
    }

    public String generateToken(AuthPayload authPayload) {
        String username = authPayload.getUsername();
        UserData userData = userDataRepository.findByUserName(username);


        checkAllowed(userData != null, "UserData " + username + " does not exist");
        checkAllowed(UserPasswordManager.verify(userData.getPassword(), authPayload.getPassword()), "Password is not valid");

        return generateToken(userData);
    }

    public AuthToken generateTokenObj(AuthPayload authPayload) {
        String username = authPayload.getUsername();
        UserData userData = userDataRepository.findByUserName(username);

        checkAllowed(userData != null, "UserData " + username + " does not exist");

        // NO SHIRO ENCRYPTION - NO SALT
        /*checkAllowed(userPasswordManager.verify(userData.getPassword(), authPayload.getPassword()), "Password is not valid");*/

        checkAllowed(UserPasswordManager.passwordsMatch(userData.getPassword(), userData.getPasswordSalt(), authPayload.getPassword()), "Password is not valid");

        return generateTokenObj(userData);
    }

    public String generateToken(String username) {
        UserData userData = userDataRepository.findByUserName(username);
        checkAllowed(userData != null, "UserData " + username + " does not exist");

        return generateToken(userData);
    }

    private String generateToken(UserData userData) {
        AccessToken accessToken = AccessToken.builder()
                .userId(userData.getId())
                .userName(userData.getUsername())
                .token(UUID.randomUUID().toString())
                .validUntilTimestamp(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(365))
                .build();

        accessTokenRepository.save(accessToken);

        //log.info("Saved token [{}]", accessToken);

        return accessToken.getToken();
    }

    private AuthToken generateTokenObj(UserData userData) {
        AccessToken accessToken = AccessToken.builder()
                .userId(userData.getId())
                .userName(userData.getUsername())
                .token(UUID.randomUUID().toString())
                .validUntilTimestamp(System.currentTimeMillis() + TimeUnit.DAYS.toMillis(365))
                .build();

        accessTokenRepository.save(accessToken);

        //log.info("Saved token [{}]", accessToken);

        AuthToken authToken = new AuthToken();
        authToken.setToken(accessToken.getToken());
        authToken.setValidUntilTimestamp(accessToken.getValidUntilTimestamp());

        return authToken;
    }

    public UserData getUser(String token) {
        if (token != "") {
            AccessToken atoken = accessTokenRepository.findByToken(token);
            if (atoken != null) {
                //log.info("atoken-userid [{}]", atoken.getUserId());
            	UserData actUserData = userDataRepository.findByUserName(atoken.getUserName());
                return actUserData;
            }
        }
        return null;
    }

    public UserData getUserByUsername(String username) {
        return userDataRepository.findByUserName(username);
    }
}
