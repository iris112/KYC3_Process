package com.kyc3.icotool.controller;

public class HttpFetcherResponse {
    private Integer status;
    private String body;

    public HttpFetcherResponse(Integer inStatus, String inBody) {
        status = inStatus;
        body = inBody;
    }

    public Integer getStatus() {
        return status;
    }

    public String getBody() {
        return body;
    }
}