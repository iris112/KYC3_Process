package com.kyc3.icotool.payload;

import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@Builder
@Data
public class TokenPurchasePayload {
    @NotEmpty
    private String email;
    private Integer amount;
    @NotEmpty
    @Length(min = 3, max = 3)
    private String currency;
    @NotEmpty
    private String stripetoken;
    private String walletAddress;
}
