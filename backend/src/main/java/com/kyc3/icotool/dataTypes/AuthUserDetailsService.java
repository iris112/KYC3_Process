package com.kyc3.icotool.dataTypes;

import com.kyc3.icotool.AccessToken;
import com.kyc3.icotool.repositories.AccessTokenRepository;
import com.kyc3.icotool.repositories.RoleRepository;
import com.kyc3.icotool.repositories.UserDataRepository;
import com.kyc3.icotool.dataTypes.AuthUser.Authority;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;

import static java.util.stream.Collectors.toSet;

@Slf4j
@Component
public class AuthUserDetailsService implements UserDetailsService {
    @Autowired
    private UserDataRepository userDataRepository;
    @Autowired
    private  RoleRepository roleRepository;
    @Autowired
    private AccessTokenRepository accessTokenRepository;

    @Autowired
    public AuthUserDetailsService(UserDataRepository userDataRepository, RoleRepository roleRepository, AccessTokenRepository accessTokenRepository) {
        this.userDataRepository = userDataRepository;
        this.roleRepository = roleRepository;
        this.accessTokenRepository = accessTokenRepository;
    }

    @Transactional
    public org.springframework.security.core.userdetails.UserDetails loadUserByAccessToken(String token) {
        //log.info("Getting user by token [{}]", token);

        AccessToken accessToken = accessTokenRepository.findByToken(token);
        AccessTokenManager.checkAllowed(accessToken != null, "Access token does not exist");

        //log.info("Found token [{}]", accessToken);
        //log.info("Return token user [{}]", accessToken.getUserName());

        return this.loadUserByUsername(accessToken.getUserName());
    }

    @Override
    @Transactional
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //log.info("find role by username for [{}]",username);
        final List<Role> roles = roleRepository.findByUserName(username);
        //Role role = roleRepository.findByUserName(username);

//        for (Role role : roles)  {
//            log.info("found role [{}]", role.getRoleName());
//        }
         //roles.forEach( r -> log.info("role: {}", r.getRoleName()));

//        Set<Authority> authorities = roles
//                .stream()
//                .map(e -> new Authority(e.getRoleName()))
//                .collect(toSet());
//

        UserData userData = new UserData();
       //checkRoleExpired(roles);
        try {
//            log.info("loading userData by username for [{}]", username);
            userData = userDataRepository.findByUserName(username);
//            if (userData == null) {
//                log.info("no userData found for [{}]", username);
//            }
//            log.info("found userData [{}]", userData.getUserName());
        } catch (Exception e) {
            e.printStackTrace();
        }

        Set<Authority> authorities = roles
                .stream()
                .map(e -> new Authority(e.getRoleName()))
                .collect(toSet());

        return AuthUser.builder()
                .password(userData.getPassword())
                .username(userData.getUsername())
                .authorities(authorities)
                .accountNonExpired(!checkRoleExpired(roles))
                .accountNonLocked(true)
                .enabled(true)
                .credentialsNonExpired(true)
                .build();
    }

    private boolean checkRoleExpired(List<Role> roles) {
        //roles.forEach( e -> log.info("Check role: {}", e.getRoleName()));
        return roles.stream()
                .filter((e) -> "user".equals(e.getRoleName()) || "admin".equals(e.getRoleName()))
                .anyMatch(e -> System.currentTimeMillis() > e.getExpirationTimestamp());
    }
}
