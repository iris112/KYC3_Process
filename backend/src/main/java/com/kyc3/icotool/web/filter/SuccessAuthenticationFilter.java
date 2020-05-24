package com.kyc3.icotool.web.filter;

import com.kyc3.icotool.dataTypes.AccessTokenManager;
import com.kyc3.icotool.dataTypes.UserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
public class SuccessAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AccessTokenManager accessTokenManager;

    public SuccessAuthenticationFilter(AuthenticationManager authenticationManager, AccessTokenManager accessTokenManager) {
        this.setAuthenticationManager(authenticationManager);
        this.accessTokenManager = accessTokenManager;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) {
        UserDetails principal = (UserDetails) authResult.getPrincipal();

        log.info("successfulAuthentication called for user [{}]", principal.getUserName());

        String value = accessTokenManager.generateToken(principal.getUserName());

        log.info("generated token [{}]", value);

        response.setHeader("X-Auth-Token", value);
    }
}