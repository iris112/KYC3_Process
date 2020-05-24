package com.kyc3.icotool.controller;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.springframework.http.HttpHeaders;

public class MultipartHttpFetcher {
    public HttpFetcherResponse doRequest(MultipartEntityBuilder builder, String endPoint) throws IOException {
        HttpEntity entity = builder.build();

        HttpPost extRequest = new HttpPost("https://api.kyc3.com/v2" + endPoint);

        extRequest.setEntity(entity);
        extRequest.setHeader("X-Api-Key","hossamarkusesgeht");
        

        HttpClient client = new DefaultHttpClient();

        HttpResponse extResponse = null;
        try {
            extResponse = client.execute(extRequest);
        } catch (IOException e) {
            e.printStackTrace();
        }
        String json = "";
        int status = 400;
        try {
            json = EntityUtils.toString(extResponse.getEntity());
            status = extResponse.getStatusLine().getStatusCode();
        } catch (org.apache.http.ParseException | IOException e) {
            e.printStackTrace();
        }


        return new HttpFetcherResponse(status, json);
    }
}
