package com.kyc3.icotool.dataTypes;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Set;

@Data
@Builder
public class AuthUser implements org.springframework.security.core.userdetails.UserDetails {

    private Long userId;
    private String password;
    private String username;
    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private boolean credentialsNonExpired;
    private boolean enabled;
    private Set<Authority> authorities;

    @Value
    @Getter
    @RequiredArgsConstructor
    public static class Authority implements GrantedAuthority {
        private final String authority;
    }
}
