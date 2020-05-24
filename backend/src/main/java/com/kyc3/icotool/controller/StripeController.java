package com.kyc3.icotool.controller;

import java.lang.Exception;
import java.util.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.MalformedURLException;
import org.json.JSONObject;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.stripe.*;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;

import com.kyc3.icotool.repositories.*;
import com.kyc3.icotool.dataTypes.Round;

import com.kyc3.icotool.payload.TokenPurchasePayload;

@Controller
@Slf4j
public class StripeController {

    @Autowired
    RoundRepository roundRepository;

	@PostMapping(path = "/payment")
	@Transactional
	public ResponseEntity payment(@RequestBody TokenPurchasePayload tokenPurchasePayload) {
        log.info("Got payload [{}]", tokenPurchasePayload);
        charge(tokenPurchasePayload.getEmail(),tokenPurchasePayload.getAmount(), tokenPurchasePayload.getCurrency(), tokenPurchasePayload.getStripetoken(), tokenPurchasePayload.getWalletAddress());
        return new ResponseEntity<>(HttpStatus.CREATED);
	}

	public void charge(String email, int amount, String currency, String stripeToken, String walletAddress) {
		Map<String, Object> params = new HashMap<>();
        params.put("amount", amount*100);
        params.put("currency", currency);
        params.put("description", "KYC3.com | Purchase of " + amount + " KYC3 tokens");
        params.put("receipt_email", email);
        params.put("source", stripeToken);
        
        Map<String, String> initialMetadata = new HashMap<String, String>();
        initialMetadata.put("email", email);
        initialMetadata.put("walletAddress", walletAddress);
        initialMetadata.put("currency", currency);
        initialMetadata.put("amount", Integer.toString(amount));

        params.put("metadata",initialMetadata);

		Stripe.apiKey = "sk_test_S8rCg0cxxiAxqY2Tm8h62gKr";

		// Charge charge = Charge.create(params);
        //     log.info("Charged client for package. Charge id [{}]", charge.getId());

        try {
            Round test = null;
            Charge charge = Charge.create(params);
            log.info("Charged client for package. Charge id [{}]", charge.getId());
            Date date = new Date();
            long currentTimestamp = date.getTime();
            // test = roundRepository.findActiveRound();
            // System.out.println(test);
            // System.out.println(test.getDiscount());
            // System.out.println(test.getEndTimestamp());
        } catch (StripeException e) {
            log.error("Cannot charge customer", e);
        }

        String ethRate = getEthRate();
        System.out.println(ethRate);
        String btcRate = getBtcRate();
        System.out.println(btcRate);

	}
    
    public String getEthRate() {
        try {
            String url = "https://api.coinbase.com/v2/prices/ETH-EUR/spot";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            int responseCode = con.getResponseCode();
            BufferedReader in =new BufferedReader(
            new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
            } in .close();
            JSONObject ethInfo = new JSONObject(response.toString());
            JSONObject data = ethInfo.getJSONObject("data");
            return data.getString("amount");
        } catch (Exception e) {
            System.out.println(e);
        }
        return "";
    }

    public String getBtcRate() {
        try {
            String url = "https://api.coinbase.com/v2/prices/BTC-EUR/spot";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            int responseCode = con.getResponseCode();
            BufferedReader in =new BufferedReader(
            new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
            } in .close();
            JSONObject btcInfo = new JSONObject(response.toString());
            JSONObject data = btcInfo.getJSONObject("data");
            return data.getString("amount");
        } catch (Exception e) {
            System.out.println(e);
        }
        return "";
    }


}
