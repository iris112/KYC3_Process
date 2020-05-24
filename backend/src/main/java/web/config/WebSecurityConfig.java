package com.kyc3.icotool.web.config;

import com.kyc3.icotool.dataTypes.AccessTokenManager;
import com.kyc3.icotool.web.filter.SuccessAuthenticationFilter;
import com.kyc3.icotool.web.filter.TokenAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AccessTokenManager accessTokenManager;

    @Autowired
    private TokenAuthenticationFilter tokenAuthenticationFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.addFilterBefore(tokenAuthenticationFilter, BasicAuthenticationFilter.class);

        http
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(STATELESS);

        http
                .authorizeRequests()
                .antMatchers("/addUser").permitAll()
                .antMatchers("/createUser").permitAll()
                .antMatchers("/createSimpleUser").permitAll()
                .antMatchers("/addVideoAuth").permitAll()
                .antMatchers("/addUserDetails").permitAll()
                .antMatchers("/faceMatch").permitAll()
                .antMatchers("/addIdCard").permitAll()
                .antMatchers("/getDetails").permitAll()
                .antMatchers("/addPassport").permitAll()
                .antMatchers("/addProofOfResidence").permitAll()
                .antMatchers("/addSelfieVideo").permitAll()
                .antMatchers("/getWordList").permitAll()
                .antMatchers("/auth").permitAll()
                .antMatchers("/getAdmins").permitAll()
                .antMatchers("/allUser").permitAll()
                .antMatchers("/allUserDetails").permitAll()
                .antMatchers("/saveComment").permitAll()
                .antMatchers("/setKycStatus").hasAuthority("admin")
                .antMatchers("/setIdentityDocumentStatus").hasAuthority("admin")
                .antMatchers("/setProofOfResidenceStatus").hasAuthority("admin")
                .antMatchers("/getMessagesForUser").permitAll()
                .antMatchers("/sendMessage").permitAll()
                .antMatchers("/changePassword").permitAll()
                .antMatchers("/getUserDetails").hasAnyAuthority("admin","user")
                .antMatchers("/setWordMatch").hasAnyAuthority("admin")
                .antMatchers("/getAllUserDetails").hasAnyAuthority("admin")
                .antMatchers("/muteUser").hasAnyAuthority("admin")
                .antMatchers("/deleteUser").hasAuthority("admin")
                .antMatchers("/risk/**").hasAuthority("admin")
                .antMatchers("/admin/*").hasAnyAuthority("admin")
                .antMatchers("/payment").permitAll()
                .antMatchers("/stripe/**").permitAll()
                //.antMatchers("/admin/getAdmins").permitAll()
//                .antMatchers("/v2/api-docs/**", "/configuration/ui/**", "/swagger-resources/**", "/configuration/security/**", "/swagger-ui.html/**", "/webjars/**").permitAll()
//                .antMatchers("/user/**").permitAll()
//                .antMatchers("/register/**").permitAll()
//                .antMatchers("/internalAuth/**").permitAll()
//                .antMatchers("/auth").permitAll()
//                .antMatchers("/stripe/**").permitAll()
//                .antMatchers("/payments/plans").permitAll()
//                .antMatchers("/payments/**").not().hasRole("KYC3_TRIAL")
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .defaultSuccessUrl("/secured")
                .permitAll();

        http.addFilter(new SuccessAuthenticationFilter(authenticationManager(), accessTokenManager));
    }
}
