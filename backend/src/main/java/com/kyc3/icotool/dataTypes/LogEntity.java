package com.kyc3.icotool.dataTypes;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
public class LogEntity implements Serializable {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(max=65)
    private String userName;

    @NotNull
    private Long timestamp;

    @NotNull
    private UserData userData;

    public LogEntity() {
        ;
    }

    public LogEntity(UserData userData) {
        this.timestamp = System.currentTimeMillis();
        this.userName = userData.getUserName();
        this.userData = userData;
    }

    public String getUserName(){
        return this.userName;
    }

    public UserData getUserData() {
        return this.userData;
    }

    public Long getTimestamp() {
        return this.timestamp;
    }

}
