package com.kyc3.icotool.controller;

import javax.transaction.Transactional;
import javax.validation.Valid;

import com.kyc3.icotool.dataTypes.Role;
import com.kyc3.icotool.dataTypes.UserData;
import com.kyc3.icotool.repositories.UserDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.kyc3.icotool.AccessToken;
import com.kyc3.icotool.AuthToken;
import com.kyc3.icotool.dataTypes.AccessTokenManager;
import com.kyc3.icotool.payload.AuthPayload;

import lombok.Value;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Value(staticConstructor = "of")
    public static class AccessToken {
        private String token;
        private Long validUntilTimestamp;
        private boolean isAdmin;
    }
    
	@Autowired
    private AccessTokenManager accessTokenManager;

	@Autowired
    private UserDataRepository userDataRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<AccessToken> generateAuthToken(@Valid @RequestBody AuthPayload authPayload) {
        AuthToken authToken = accessTokenManager.generateTokenObj(authPayload);

        UserData u = userDataRepository.findByUserName(authPayload.getUsername());
        List<Role> roles = u.getRoles();
        boolean isAdmin = false;

        try {
            for (Role r : roles) {
                if ("admin".equals(r.getRoleName())) {
                    isAdmin = true;
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        AccessToken accessToken = AccessToken.of(authToken.getToken(), authToken.getValidUntilTimestamp(), isAdmin);


        return new ResponseEntity<>(accessToken, HttpStatus.OK);
    }

    
}