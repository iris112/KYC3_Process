package com.kyc3.icotool.web.filter;

import com.kyc3.icotool.dataTypes.AuthUser;
import com.kyc3.icotool.dataTypes.AuthUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.List;

@Slf4j
@Component
public class TokenAuthenticationFilter extends GenericFilterBean {

    @Autowired
    private AuthUserDetailsService authUserDetailsService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        final HttpServletRequest httpRequest = (HttpServletRequest)request;

        String token = httpRequest.getHeader("X-Auth-Token");

        if (token == null) {
            chain.doFilter(request, response);
            return;
        }

        log.info("Token header present with value [{}]", token);

        try {
            org.springframework.security.core.userdetails.UserDetails user = authUserDetailsService.loadUserByAccessToken(token);

            final UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

            log.info("Set username to [{}].", user.getUsername());

            Collection<? extends GrantedAuthority> myAuth = user.getAuthorities();

            SecurityContextHolder.getContext().setAuthentication(authentication);
            request.setAttribute("USER_NAME", user.getUsername());
        } catch (Exception e) {
            ((HttpServletResponse)response).sendError(403, "Token invalid");
            return;
        }

        chain.doFilter(request, response);
    }
}
