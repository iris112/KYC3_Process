package com.kyc3.icotool.dataTypes;

import com.kyc3.icotool.dataTypes.RiskResult;
import com.kyc3.icotool.dataTypes.Role;
import com.kyc3.icotool.dataTypes.Status;
import lombok.Value;
import lombok.experimental.NonFinal;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Value
public class UserDataWithoutBinary {

    private Long id;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String passwordSalt;
    private long createdAt;
    private boolean isMuted;
    @NonFinal
    private UserDetailsWithoutBinary details = null;
    @NonFinal
    private RiskResult riskResult = null;
    @NonFinal
    private Status status = null;
    @NonFinal
    private List<Role> role = null;

    public UserDataWithoutBinary(Long id, String userName, String firstName, String lastName,
                                 String email, String password, String passwordSalt, Long createdAt, boolean isMuted) {
        this.id = id;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.passwordSalt = passwordSalt;
        this.createdAt = createdAt;
        this.isMuted = isMuted;
        this.details = null;
        this.riskResult = null;
        this.status = null;
        this.role = new ArrayList<Role>();
    }

    public boolean getIsMuted() {
        return this.isMuted;
    }


    public List<Role> getRoles() {
        return this.role;
    }

    public void setDetails(UserDetailsWithoutBinary details) {
        this.details = details;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setResult(RiskResult result) {
        this.riskResult = result;
    }

    public void setRole(List<Role> role) {
        this.role = role;
    }
}
