package com.kyc3.icotool.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.PARTIAL_CONTENT)
public class NoContentException extends RuntimeException {
    public NoContentException(String message) {
        super(message);
    }
}