package com.kyc3.icotool.dataTypes;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Entity
public class Message implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @NotNull
    String fromAddr;
    @NotNull
    String toAddr;
    @NotNull
    Long timestamp;
    @NotNull
    @Column(length=2048)
    String text;

    public Message(String fromAddr, String toAddr, String text) {
        this.fromAddr = fromAddr;
        this.toAddr = toAddr;
        this.text = text;
        this.timestamp = System.currentTimeMillis();
    }

    public Message() {
        ;
    }

    public String getFromAddr() {
        return this.fromAddr;
    }

    public String getToAddr() {
        return this.toAddr;
    }

    public String getText() {
        return this.text;
    }

    public Long getTimestamp() {
        return this.timestamp;
    }

}
