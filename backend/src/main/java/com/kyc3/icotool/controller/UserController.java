package com.kyc3.icotool.controller;

import java.io.FileOutputStream;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import com.google.common.collect.ImmutableMap;
import com.google.gson.Gson;
import com.kyc3.icotool.dataTypes.*;
import com.kyc3.icotool.exceptions.NoContentException;
import com.kyc3.icotool.repositories.*;
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

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.kyc3.icotool.UserPasswordManager;
import com.kyc3.icotool.payload.UserPayload;
import com.kyc3.icotool.dataTypes.UserData;

@Controller
@Slf4j
public class UserController {

	@Bean
	public RestTemplate restTemplate() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {

		SSLContextBuilder builder = new SSLContextBuilder();
		builder.loadTrustMaterial(null, new TrustSelfSignedStrategy());
		SSLConnectionSocketFactory sslConnectionSocketFactory = new SSLConnectionSocketFactory(builder.build(),
				NoopHostnameVerifier.INSTANCE);
		Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create()
				.register("http", new PlainConnectionSocketFactory()).register("https", sslConnectionSocketFactory)
				.build();

		PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager(registry);
		cm.setMaxTotal(100);
		CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(sslConnectionSocketFactory)
				.setConnectionManager(cm)
				.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0")
				.build();

		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();

		requestFactory.setHttpClient(httpClient);
		RestTemplate restTemplate = new RestTemplate(requestFactory);
		return restTemplate;
	}

	private static final ImmutableMap<Integer,String> alphabet = new ImmutableMap.Builder<Integer,String>()
	        .put(1,"Alpha")
            .put(2,"Bravo")
            .put(3,"Charlie")
            .put(4,"Delta")
            .put(5,"Echo")
            .put(6,"Foxtrot")
            .put(7,"Golf")
            .put(8,"Hotel")
            .put(9,"India")
            .put(10,"Juliet")
            .put(11,"Kilo")
            .put(12,"Lima")
            .put(13,"Mike")
            .put(14,"November")
            .put(15,"Oscar")
            .put(16,"Papa")
            .put(17,"Quebec")
            .put(18,"Romeo")
            .put(19,"Sierra")
            .put(20,"Tango")
            .put(21,"Uniform")
            .put(22,"Victor")
            .put(23,"Whiskey")
            .put(24,"Xray")
            .put(25,"Yankee")
            .put(26,"Zulu")
            .build();

	@Autowired
	private UserDataRepository userDataRepository;

	@Autowired
	private UserDetailsRepository userDetailsRepository;

	@Autowired
	private StatusRepository statusRepository;

	@Autowired
	private RiskResultRepository riskResultRepository;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private LogEntityRepository logEntityRepository;

	@Autowired
	MrzObjectRepository mrzObjectRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	MessageRepository messageRepository;

	@Autowired
	private UserPasswordManager userPasswordManager;

	@Autowired
	private AccessTokenManager accessTokenManager;

	@Autowired
	RestTemplateBuilder restTemplateBuilder;

	@Value("${google.recaptcha.secret}")
	String capchtaKey;

	private String getIpLocation(String remoteAddr) {
		String uri = "https://tools.keycdn.com:443/geo.json?host=" + remoteAddr;

		ResponseEntity<String> response = null;

		try {
			response = restTemplate.getForEntity(uri, String.class);
			//System.out.println(response.getBody().toString());
		} catch (Exception e) {
			return "na";
			//System.out.println("Does not work!!");
		}

		JsonParser jsonParser = new JsonParser();
		JsonElement element = jsonParser.parse(response.getBody());
		// if (element.isJsonObject()) {
		// JsonObject jobject = element.getAsJsonObject();
		// }
		JsonObject jobject = element.getAsJsonObject();
		JsonObject data = jobject.getAsJsonObject("data");
		JsonObject geo = data.getAsJsonObject("geo");
		JsonElement cc = geo.get("country_code");

		//System.out.println(cc.toString());
		return cc.toString();
	}


	@PostMapping("/createSimpleUser")
	public @ResponseBody ResponseEntity<String> createSimpleUser(HttpServletRequest request,
										@RequestParam String email,
										@RequestParam String password,
										@RequestParam String captcha) throws IOException {

		UserData sameEmail = userDataRepository.findByEmail(email);

		if (sameEmail != null) {
            return new ResponseEntity<>("UserData with " + email + " already exists.", HttpStatus.BAD_REQUEST);
			//return new String("UserData with " + email + " already exists.");
		}

        String uri = "https://www.google.com/recaptcha/api/siteverify";

        //MultiValueMap<String, Object> vars = new LinkedMultiValueMap<String, Object>();
        Map<String, String> parms = new HashMap<String, String>();
        //log.info("using api_key: [{}]", apiKey);
        parms.put("secret",capchtaKey);
        parms.put("response",captcha);

        log.info("Captcha: {}",parms);

        ResponseEntity<Map> response = restTemplateBuilder.build()
                .postForEntity(uri+"?secret={secret}&response={response}",
                        parms, Map.class, parms);
        //restTemplate.postForEntity(uri, null, String.class, vars);

        log.info("Response from google: {}", response);

        Map<String, Object> responseBody =
                response.getBody();

        if ((Boolean)responseBody.get("success") == false) {
            return new ResponseEntity<>("Wrong captcha!", HttpStatus.BAD_REQUEST);
        }


        try {
			UserPayload userPayload = new UserPayload(email, "", "", email, password, "user");

			UserData u = UserCreator.createUser(userPayload);
			userDataRepository.save(u);

			UserDetails ud = new UserDetails(u);
			u.setDetails(ud);
			ud.setUserData(u);
			
			Long validTime = System.currentTimeMillis() + 3600L * 365L * 24L * 1000L;
            
			Role r = Role.builder()
                    .expirationTimestamp(validTime)
                    .roleName("user")
                    .userName(u.getUsername())
                    .build();

            u.addRole(r);
            userDataRepository.save(u);

		} catch (Exception e){
			return new ResponseEntity<>("Unable to create user.", HttpStatus.BAD_REQUEST);
		}

		return new ResponseEntity<>(email, HttpStatus.OK);
	}

	@PostMapping("/createUser")
	public @ResponseBody ResponseEntity<String> createUser(HttpServletRequest request,
										@RequestParam String firstName,
										@RequestParam String lastName,
										@RequestParam String email,
										@RequestParam String password,
										@RequestParam String captcha) throws IOException {

		UserData sameEmail = userDataRepository.findByEmail(email);

		if (sameEmail != null) {
            return new ResponseEntity<>("UserData with " + email + " already exists.", HttpStatus.BAD_REQUEST);
			//return new String("UserData with " + email + " already exists.");
		}

        String uri = "https://www.google.com/recaptcha/api/siteverify";

        //MultiValueMap<String, Object> vars = new LinkedMultiValueMap<String, Object>();
        Map<String, String> parms = new HashMap<String, String>();
        //log.info("using api_key: [{}]", apiKey);
        parms.put("secret",capchtaKey);
        parms.put("response",captcha);

        log.info("Captcha: {}",parms);

        ResponseEntity<Map> response = restTemplateBuilder.build()
                .postForEntity(uri+"?secret={secret}&response={response}",
                        parms, Map.class, parms);
        //restTemplate.postForEntity(uri, null, String.class, vars);

        log.info("Response from google: {}", response);

        Map<String, Object> responseBody =
                response.getBody();

        if ((Boolean)responseBody.get("success") == false) {
            return new ResponseEntity<>("Wrong captcha!", HttpStatus.BAD_REQUEST);
        }


        try {
			UserPayload userPayload = new UserPayload(email, firstName, lastName, email, password, "user");

			UserData u = UserCreator.createUser(userPayload);

			Long validTime = System.currentTimeMillis() + 3600L * 365L * 24L * 1000L;

            userDataRepository.save(u);

		} catch (Exception e){
			return new ResponseEntity<>("Unable to create user.", HttpStatus.BAD_REQUEST);
		}

		return new ResponseEntity<>(email, HttpStatus.OK);
	}

	@PostMapping("/addUserDetails")
	@Transactional
	public @ResponseBody ResponseEntity<String> addUserDetails(HttpServletRequest request,
											   @RequestParam String email,
											   @RequestParam String taxCountry,
											   @RequestParam String nationality,
											   @RequestParam String dateOfBirth,
											   @RequestParam String address,
											   @RequestParam String walletAddress,
											   @RequestParam double amount,
											   @RequestParam String currencyType,
											   @RequestParam String sourceOfFunds,
											   @RequestParam(value = "firstName", required = false) String firstName,
											   @RequestParam(value = "lastName", required = false) String lastName,
											   @RequestParam(value = "telegramName", required = false) String telegramName,
											   @RequestParam(value = "twitterName", required = false) String twitterName,
											   @RequestParam(value = "facebookProfile", required = false) String facebookProfile,
											   @RequestParam(value = "linkedinProfile", required = false) String linkedinProfile) throws IOException {


		UserData u = userDataRepository.findByEmail(email);

		if (firstName != null) {
			u.setFirstName(firstName);
		}
		if (lastName != null) {
			u.setLastName(lastName);
		}

		//UserDetails fUd = userDetailsRepository.findByUserData(u);

//		if (fUd != null) {
//			return new ResponseEntity<>("Detail information for this user already exist.",HttpStatus.BAD_REQUEST);
//		}


		Date date = new Date();

        if (dateOfBirth.contains("/")) {
            String[] components =dateOfBirth.split("/");
            dateOfBirth=components[2] + "-" + components[1] + "-" + components[0];
        }

        DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		try {
			date = format.parse(dateOfBirth);
		} catch (ParseException e) {
			e.printStackTrace();
			return new ResponseEntity<>("Can't format date of birth.",HttpStatus.BAD_REQUEST);
		}

		UserDetails ud;


		Date registrationDate = new Date();

		Long registrationTimestamp = registrationDate.getTime();

		ud = u.getDetails(); //.findByUserData(u);
		if (ud == null) {
			ud = new UserDetails(taxCountry,
					nationality,
					date,
					address,
					walletAddress,
					amount,
					currencyType,
					sourceOfFunds,
					registrationTimestamp,
					true,
					true,
					true,
					true,
					true,
					true,
					true,
					true,
					telegramName,
					twitterName,
					linkedinProfile,
					facebookProfile
			);

            Long validTime = System.currentTimeMillis() + 3600L * 365L * 24L * 1000L;
            Role r = Role.builder()
                    .expirationTimestamp(validTime)
                    .roleName("user")
                    .userName(u.getUsername())
                    .build();

            u.addRole(r);

		} else {
			ud.setTaxCountry(taxCountry);
			ud.setNationality(nationality);
			ud.setDateOfBirth(date);
			ud.setAddress(address);
			ud.setWalletAddress(walletAddress);
			ud.setamount(amount);
			ud.setCurrencyType(currencyType);
			ud.setSourceOfFunds(sourceOfFunds);
			ud.setRegistrationTimestamp(registrationTimestamp);
			ud.setTelegramName(telegramName);
			ud.setTwitterName(twitterName);
			ud.setLinkedinProfile(linkedinProfile);
			ud.setFacebookProfile(facebookProfile);
		}

		String remoteAddr = request.getHeader("X-Forwarded-For");
		if (remoteAddr == null) {
			remoteAddr = request.getRemoteAddr();
		}
		log.info("remote address: {}", remoteAddr);
		String browserLocation = getIpLocation(remoteAddr);

		Status st = u.getStatus(); //.findByUserData(u);
		RiskResult rr = u.getRiskResult(); //riskResultRepository.findByUserData(u);

		if (rr == null){
            rr = new RiskResult(u);
        }
        if (st == null) {
            st = new Status(u);
        }

		st.setIpLocation(browserLocation);
		u.setStatus(st);
		u.setRiskResult(rr);

		u.setDetails(ud);

		u.setStatus(st);
		//r.setUserData(u);

		ud.setUserData(u);

		userDataRepository.save(u);

		return new ResponseEntity<>(email, HttpStatus.OK);
	}

	@PostMapping("/addPassport")
	@Transactional
	public @ResponseBody ResponseEntity<String> addPassport(@RequestParam String email,
											@RequestParam("passportFront") MultipartFile passFront,
											@RequestParam(value = "passportBack", required = false) MultipartFile passBack) throws IOException {

		UserData u = userDataRepository.findByEmail(email);

		if (u == null) {
		    return new ResponseEntity<>("User " + email + " not found.",HttpStatus.BAD_REQUEST);
        }

		//UserDetails ud = u.getDetails();

		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        Long timestamp = System.currentTimeMillis();
      	builder.addBinaryBody("passportFront", passFront.getBytes(), ContentType.DEFAULT_BINARY, "passportFront.jpg");
		if (passBack != null) {
			builder.addBinaryBody("passportBack", passBack.getBytes(), ContentType.DEFAULT_BINARY, "passportBack.jpg");
		}

	    HttpEntity entity = builder.build();
		MultipartHttpFetcher fetcher = new MultipartHttpFetcher();
        HttpFetcherResponse res = fetcher.doRequest(builder,"/mrzExtractor");

        // String uri = "https://facerecognition.int.amlapi.com/mrzExtractor";

        // MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        // builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        // Long timestamp = System.currentTimeMillis();
        // builder.addBinaryBody("passportFront", passFront.getBytes(), ContentType.DEFAULT_BINARY, "passportFront.jpg");

        // if (passBack != null) {
        //     builder.addBinaryBody("passportBack", passBack.getBytes(), ContentType.DEFAULT_BINARY, "passportBack.jpg");
		// }
		
		if (passBack != null){
			u.getDetails().setPassportFront(passFront.getBytes());
			u.getDetails().setPassportBack(passBack.getBytes());
		} else {
			u.getDetails().setPassportFront(passFront.getBytes());
		}

		userDataRepository.save(u);

        // HttpEntity entity = builder.build();

        // HttpPost extRequest = new HttpPost( uri);

        // extRequest.setEntity(entity);

        // HttpClient client = new DefaultHttpClient();

        // HttpResponse extResponse = null;
        // try {
        //     extResponse = client.execute(extRequest);
        // } catch (IOException e) {
        //     e.printStackTrace();
        // }
        String json = "";
        int status = 400;
        try {
			json = res.getBody(); //.toString(extResponse.getEntity());
			log.info(json);
            status = res.getStatus(); //.getStatusLine().getStatusCode();
        } catch (Exception e) {
            e.printStackTrace();
        }

		Gson gson;
		try {
			gson = new Gson();
			MrzObject mrzObject = gson.fromJson(json, MrzObject.class);
			if (u.getStatus() == null) {
				Status st = new Status(u);
				st.setMrz(mrzObject);
				u.setStatus(st);
			} else {
				u.getStatus().setMrz(mrzObject);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		userDataRepository.save(u);		

		return new ResponseEntity<>(json,HttpStatus.valueOf(status));
	}

	@PostMapping("/addIdCard")
    @Transactional
    public @ResponseBody ResponseEntity<String> addIdCard(@RequestParam String email,
                                          @RequestParam("passportFront") MultipartFile passFront,
                                          @RequestParam("passportBack") MultipartFile passBack) throws IOException {

	    UserData u = userDataRepository.findByEmail(email);

	    if (u == null) {
	        return new ResponseEntity<>("User " + email + " not found.", HttpStatus.BAD_REQUEST);
        }

	    //UserDetails ud = u.getDetails();

	    u.getDetails().setPassportFront(passFront.getBytes());
		u.getDetails().setPassportBack(passBack.getBytes());
		
		userDataRepository.save(u);

		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        Long timestamp = System.currentTimeMillis();
        builder.addBinaryBody("passportFront", passFront.getInputStream(), ContentType.DEFAULT_BINARY, "passportFront.jpg");
		builder.addBinaryBody("passportBack", passBack.getInputStream(), ContentType.DEFAULT_BINARY, "passportBack.jpg");

		HttpEntity entity = builder.build();
		MultipartHttpFetcher fetcher = new MultipartHttpFetcher();
        HttpFetcherResponse res = fetcher.doRequest(builder,"/mrzExtractor");

	    // String uri = "https://facerecognition.int.amlapi.com/mrzExtractor";

        // MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        // builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        // Long timestamp = System.currentTimeMillis();
        // builder.addBinaryBody("passportFront", passFront.getBytes(), ContentType.DEFAULT_BINARY, "passportFront.jpg");
        // builder.addBinaryBody("passportBack", passBack.getBytes(), ContentType.DEFAULT_BINARY, "passportBack.jpg");

        // HttpEntity entity = builder.build();

        // HttpPost extRequest = new HttpPost( uri);
        // //HttpPost extRequest = new HttpPost(uri);

        // extRequest.setEntity(entity);

        // HttpClient client = new DefaultHttpClient();

        // HttpResponse extResponse = null;
        // try {
        //     extResponse = client.execute(extRequest);
        // } catch (IOException e) {
        //     e.printStackTrace();
        // }
        String json = "";
        int status = 400;
        try {
			json = res.getBody(); // EntityUtils.toString(extResponse.getEntity());
			System.out.println(json);
            status = res.getStatus(); // extResponse.getStatusLine().getStatusCode();
        } catch (Exception e) {
            e.printStackTrace();
        }

        Gson gson;
		try {
			gson = new Gson();
			MrzObject mrzObject = gson.fromJson(json, MrzObject.class);
			if (u.getStatus() == null) {
				Status st = new Status(u);
				st.setMrz(mrzObject);
				u.setStatus(st);
			} else {
				u.getStatus().setMrz(mrzObject);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		userDataRepository.save(u);

        return new ResponseEntity<>(json,HttpStatus.valueOf(status));
    }

	@PostMapping("/addProofOfResidence")
	@Transactional
	public @ResponseBody String addProofOfResidence(@RequestParam String email,
													@RequestParam ("prrofOfResidence") MultipartFile proofOfResidence) throws IOException {

		UserData u = userDataRepository.findByEmail(email);
		try {
			u.getDetails().setProofOfResidence(proofOfResidence.getBytes());
		} catch (Exception e) {
			return new String("Can't put Proof of Residence.");
		}

		userDataRepository.save(u);

		return email;
	}

//	@CrossOrigin
//    @GetMapping("/addSelfieVideo")
//    @Transactional
//    public void addSelfieGet(@RequestParam String email,
//                             @RequestParam ("selfieVideo") MultipartFile selfieVideo) throws IOException {
//	    return;
//
//    }

	@CrossOrigin
	@PostMapping("/addVideoAuth")
	@Transactional
	public void addVideoAuth(@RequestParam String email,
							 @RequestParam("selfieVideo") MultipartFile selfieVideo,
							 @RequestParam("wordList") String wordList,
							 HttpServletResponse response) throws IOException {
		
		UserData u = userDataRepository.findByEmail(email);
        if (u == null) {
			response.setStatus(400);
			response.getWriter().write("User not found.");
			response.getWriter().flush();
			return;
        }

		try {
			u.getDetails().setSelfieVideo(selfieVideo.getBytes());
			userDataRepository.save(u);
		} catch (Exception e) {
			e.printStackTrace();
		}

		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        Long timestamp = System.currentTimeMillis();
        builder.addBinaryBody("videoFile", selfieVideo.getInputStream(), ContentType.DEFAULT_BINARY, selfieVideo.getName());
        builder.addTextBody("wordList",wordList);

        HttpEntity entity = builder.build();
		MultipartHttpFetcher fetcher = new MultipartHttpFetcher();
		HttpFetcherResponse res = fetcher.doRequest(builder,"/videoAuthenticator");
		
		Gson gson;
		try {
			gson = new Gson();
			VideoReturnHash videoReturnObject = gson.fromJson(res.getBody(), VideoReturnHash.class);
			if (u.getStatus() == null) {
				Status st = new Status(u);
				// st.setReturnList(videoReturnObject.getWordMatch());
				// st.setRecognitionResult(new RecognitionResult());
				// st.getRecognitionResult().setHumanFace(videoReturnObject.getRecognitionResult().isHumanFace());
				// st.getRecognitionResult().setLiveliness(videoReturnObject.getRecognitionResult().isLiveliness());
				u.setStatus(st);
			}
			if (u.getStatus().getRecognitionResult() == null) {
				u.getStatus().setRecognitionResult(new RecognitionResult());
			}
			u.getStatus().setReturnList(videoReturnObject.getWordMatch());
			u.getDetails().setFaceHash(videoReturnObject.getRecognitionResult().getFaceHash());
			u.getStatus().getRecognitionResult().setHumanFace(videoReturnObject.getRecognitionResult().isHumanFace());
			u.getStatus().getRecognitionResult().setLiveliness(videoReturnObject.getRecognitionResult().isLiveliness());
		} catch (Exception e) {
			e.printStackTrace();
		}

		String[] providedList = u.getDetails().getWordList();
		Boolean[] receivedList = u.getStatus().getReturnList();

		boolean wordMatch = true;

		if (receivedList == null) {
		    wordMatch = false;
        } else {

            for (int i = 0; i < receivedList.length; ++i) {
                if (receivedList[i] == false) {
                    wordMatch = false;
                    break;
                }
            }
        }

		u.getStatus().setWordMatch(wordMatch);

		//UserData u = userDataRepository.findByEmail(email);
		
		userDataRepository.save(u);

		response.setStatus(res.getStatus());
        response.getWriter().write(res.getBody());
        response.getWriter().flush();
	}

	@CrossOrigin
	@PostMapping("/addSelfieVideo")
	@Transactional
	public @ResponseBody ResponseEntity<String> addSelfieVideo(@RequestParam String email,
															   @RequestParam("selfieVideo") MultipartFile selfieVideo,
															   @RequestParam("wordList") String wordList) throws IOException {


        UserData u = userDataRepository.findByEmail(email);
        if (u == null) {
            return new ResponseEntity<>("User not found.", HttpStatus.BAD_REQUEST);
        }

		try {
			u.getDetails().setSelfieVideo(selfieVideo.getBytes());
			userDataRepository.save(u);
		} catch (Exception e) {
			e.printStackTrace();
		}

		byte[] passportFront = u.getDetails().getPassportFront();
		
		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        Long timestamp = System.currentTimeMillis();
        builder.addBinaryBody("videoFile", selfieVideo.getInputStream(), ContentType.DEFAULT_BINARY, selfieVideo.getName());
        builder.addBinaryBody("passportFront", passportFront, ContentType.DEFAULT_BINARY, "passportForont.jpg");
		builder.addTextBody("wordList",wordList);

        HttpEntity entity = builder.build();
		MultipartHttpFetcher fetcher = new MultipartHttpFetcher();
        HttpFetcherResponse res = fetcher.doRequest(builder,"/videoRecognizer");

        // String uri = "https://facerecognition.int.amlapi.com/videoSelfie";
		// //String uri="http://192.168.109.20:5000/videoSelfie";

        // MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        // builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        // Long timestamp = System.currentTimeMillis();
        // builder.addBinaryBody("videoSelfie", selfieVideo.getInputStream(), ContentType.DEFAULT_BINARY, selfieVideo.getName());
        // builder.addBinaryBody("passportFront", passportFront, ContentType.DEFAULT_BINARY, "passportFront.jpg");
        // builder.addTextBody("wordList",wordList);

        // HttpEntity entity = builder.build();

        // HttpPost extRequest = new HttpPost(uri);

        // extRequest.setEntity(entity);

        // HttpClient client = new DefaultHttpClient();

        // HttpResponse extResponse = null;
        // try {
        //     //extResponse = client.execute(extRequest);
        // } catch (IOException e) {
        //     e.printStackTrace();
        // }
		
		String json = "";
        int status = 400;
        try {
			json =res.getBody();
			System.out.println(json);
            status = res.getStatus(); //.getStatusLine().getStatusCode();
        } catch (Exception e) {
            e.printStackTrace();
        }

		Gson gson;
		try {
			gson = new Gson();
			VideoReturnObject videoReturnObject = gson.fromJson(json, VideoReturnObject.class);
			u.getStatus().setReturnList(videoReturnObject.getWordMatch());
			u.getStatus().setRecognitionResult(videoReturnObject.getRecognitionResult());

		} catch (Exception e) {
			e.printStackTrace();
		}

		String[] providedList = u.getDetails().getWordList();
		Boolean[] receivedList = u.getStatus().getReturnList();

		boolean wordMatch = true;

		if (receivedList == null) {
		    wordMatch = false;
        } else {

            for (int i = 0; i < receivedList.length; ++i) {
                if (receivedList[i] == false) {
                    wordMatch = false;
                    break;
                }
            }
        }

		u.getStatus().setWordMatch(wordMatch);

		//UserData u = userDataRepository.findByEmail(email);
		
		userDataRepository.save(u);

		return new ResponseEntity<>(json,HttpStatus.valueOf(status));

	}

	@PostMapping("/addUser")
	@Transactional
	public @ResponseBody String addUser(HttpServletRequest request, @RequestParam String firstName,
										@RequestParam String lastName, @RequestParam String userName, @RequestParam String email,
										@RequestParam String password, @RequestParam String taxCountry, @RequestParam String nationality,
										@RequestParam String dateOfBirth, @RequestParam String address, @RequestParam String walletAddress,
										@RequestParam double amount, @RequestParam String currencyType,
										@RequestParam String sourceOfFunds,
										@RequestParam(value = "telegramName", required = false) String telegramName,
										@RequestParam(value = "twitterName", required = false) String twitterName,
										@RequestParam(value = "facebookProfile", required = false) String facebookProfile,
										@RequestParam(value = "linkedinProfile", required = false) String linkedinProfile,
										@RequestParam ("proofOfResidence") MultipartFile proofOfResidence,
										@RequestParam("selfie") MultipartFile selfie,
										@RequestParam("passportFront") MultipartFile passFront,
										@RequestParam(value = "passportBack", required = false) MultipartFile passBack,
										@RequestParam String captcha) throws IOException {

		String uri = "https://www.google.com/recaptcha/api/siteverify";

		//MultiValueMap<String, Object> vars = new LinkedMultiValueMap<String, Object>();
		Map<String, String> parms = new HashMap<String, String>();
		//log.info("using api_key: [{}]", apiKey);
		parms.put("secret",capchtaKey);
		parms.put("response",captcha);

		log.info("Captcha: {}",parms);

		ResponseEntity<Map> response = restTemplateBuilder.build()
				.postForEntity(uri+"?secret={secret}&response={response}",
						parms, Map.class, parms);
		//restTemplate.postForEntity(uri, null, String.class, vars);

		log.info("Response from google: {}", response);

		Map<String, Object> responseBody =
				response.getBody();

		if ((Boolean)responseBody.get("success") == false) {
			return new String("Wrong captcha!");
		}

		String remoteAddr = request.getHeader("X-Forwarded-For");
		if (remoteAddr == null) {
			remoteAddr = request.getRemoteAddr();
		}
		log.info("remote address: {}", remoteAddr);
		String browserLocation = getIpLocation(remoteAddr);

		//System.out.println("Password from userController: " + password);

		UserPayload userPayload = new UserPayload(userName,firstName,lastName,email,password,"user");

		UserData u = UserCreator.createUser(userPayload);

		//System.out.println("u.password: " + u.getPassword());

		Long validTime = System.currentTimeMillis() + 3600L * 365L * 24L * 1000L;
		//log.info("Expiration timestamp: [{}].", validTime);




		Role r = Role.builder()
				.expirationTimestamp(validTime)
				.roleName("user")
				.userName(u.getUsername())
				.build();

//		log.info("Role [{}] for user [{}] is valid for [{}] milliseconds.", r.getRoleName(),
//                r.getUserName(),
//                r.getExpirationTimestamp());


//		Iterable<UserData> compareData = userDataRepository.findAll();
//		for (UserData v : compareData) {
////			System.out.println(v.getEmail());
//			if (v.getEmail().equals(u.getEmail())) {
//				return new String("UserData with " + u.getEmail() + " already exists.");
//			}
//		}

		UserData sameEmail = userDataRepository.findByEmail(u.getEmail());

		if (sameEmail != null)
			return new String("UserData with " + u.getEmail() + " already exists.");

		if (userDataRepository.findByUserName(u.getUserName()) != null) {
			return new String("UserData with "  + u.getUserName() + " already exists.");
		}

		if (dateOfBirth.contains("/")) {
			String[] components =dateOfBirth.split("/");
			dateOfBirth=components[2] + "-" + components[1] + "-" + components[0];
		}


		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		try {
			date = format.parse(dateOfBirth);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		//BufferedImage resizedImage = new BufferedImage()

		Date registrationDate = new Date();

		Long registrationTimestamp = registrationDate.getTime();

		UserDetails ud;
		if (passBack != null){
			ud = new UserDetails(taxCountry,
					nationality,
					date,
					address,
					walletAddress,
					amount,
					currencyType,
					sourceOfFunds,
					registrationTimestamp,
					true,
					true,
					true,
					true,
					true,
					true,
					true,
					true,
					telegramName,
					twitterName,
					linkedinProfile,
					facebookProfile,
					proofOfResidence.getBytes(),
					selfie.getBytes(),
					passFront.getBytes(),
					passBack.getBytes()
			);
		} else {
			ud = new UserDetails(taxCountry,
					nationality,
					date,
					address,
					walletAddress,
					amount,
					currencyType,
					sourceOfFunds,
					registrationTimestamp,
					true,
					true,
					true,
					true,
					true,
					true,
					true,
					true,
					telegramName,
					twitterName,
					linkedinProfile,
					facebookProfile,
					proofOfResidence.getBytes(),
					selfie.getBytes(),
					passFront.getBytes()
			);
		}

		Status st = new Status(u);
		RiskResult rr = new RiskResult(u);
		st.setIpLocation(browserLocation);
		u.setStatus(st);
		u.setRiskResult(rr);

		u.setDetails(ud);
		u.addRole(r);
		u.setStatus(st);
		//r.setUserData(u);

		ud.setUserData(u);

//		System.out.println("Generated password: " + u.getPassword());

		userDataRepository.save(u);

		return "Success";
	}

	@GetMapping(path = "/getAllUser")
	//@Transactional
	public @ResponseBody Iterable<UserDataWithoutBinary> getAllUser() {
		Collection<UserDataWithoutBinary>userList = userDataRepository.findAllWithoutBinary();

		List<UserDataWithoutBinary> retList = new ArrayList<>();

		userList.forEach( u -> {
			boolean adminRole = false;
			u.setDetails(userDetailsRepository.findByUserDataWithoutBinary(new UserData(u)));
			u.setRole(roleRepository.findByUserName(u.getUserName()));
			u.setStatus(statusRepository.findByUserData(new UserData(u)));
			u.setResult(riskResultRepository.findByUserData(new UserData(u)));
			List<Role> roles = u.getRoles();

			for (Role r : roles) {
				if ("admin".equals(r.getRoleName())) {
					adminRole = true;
				}
			}
			if (!adminRole)
				retList.add(u);

		});

		return retList;
	}

	@GetMapping(path = "/getDetails")
    @Transactional
    public @ResponseBody UserData getDetails(HttpServletRequest request) {
        String token = request.getHeader("X-Auth-Token");
        UserData actUserData = accessTokenManager.getUser(token);

        UserData u = userDataRepository.findByUserName(actUserData.getUserName());

        return u;
    }

	@GetMapping(path = "/getUserDetails")
	@Transactional
	public @ResponseBody
	UserData getUserDetails(@RequestParam String userName,
                            HttpServletRequest request) {

        UserData actUserData = userDataRepository.findByUserName(userName);

		return actUserData;
	}

	@PostMapping(path="/setWordList")
    public @ResponseBody String[] setWordList(@RequestParam String email,
                                                  @RequestParam String[] wordList) {
        UserData u = userDataRepository.findByEmail(email);
        List <String> lowerWordList = new ArrayList<>();
        for (String w : wordList) {
            lowerWordList.add(w.toLowerCase());
        }
        u.getDetails().setWordList(lowerWordList.toArray(new String[lowerWordList.size()]));
        userDataRepository.save(u);

	    return lowerWordList.toArray(new String[lowerWordList.size()]);
    }

    @PostMapping(path="/setWordMatch")
	public @ResponseBody boolean setWordMatch(@RequestParam String email,
											  @RequestParam boolean wordMatch) {
		UserData u = userDataRepository.findByEmail(email);

		u.getStatus().setWordMatch(wordMatch);

		userDataRepository.save(u);

		return u.getStatus().getWordMatch();
	}

	@PostMapping(path="/getWordMatch")
	public @ResponseBody boolean setWordMatch(@RequestParam String email) {

		UserData u = userDataRepository.findByEmail(email);

		return u.getStatus().getWordMatch();
	}

	@GetMapping(path = "/getAllUserDetails")
	public @ResponseBody Iterable<UserData> getAllUserDetails() {
		Iterable<UserData> allUser = userDataRepository.findAll();
		allUser.forEach( u -> {
			UserDetails actDetails = userDetailsRepository.findByUserData(u);
			Status actStatus = statusRepository.findByUserData(u);
			RiskResult actResult = riskResultRepository.findByUserData(u);
			//log.info("UserData risk for user [{}] is [{}]", u.getUserName(),actResult.getRiskScore());
			u.setDetails(actDetails);
			u.setStatus(actStatus);
			u.setRiskResult(actResult);
		});
		//return userDataRepository.findAll();
		return allUser;
	}

	@GetMapping(path= "/sendMessage")
	@Transactional
	public @ResponseBody String sendMessage(@RequestParam String fromName,
											@RequestParam String toName,
											@RequestParam String text) {
		UserData fromUserData = userDataRepository.findByUserName(fromName);
		if (fromUserData.getIsMuted()) {
			return("You're muted. Cant't send a message!");
		}
		//UserData to = userDataRepository.findByUserName(toName);
		Message actMessage = new Message(fromName, toName, text);

		messageRepository.save(actMessage);
		return("Message sent.");
	}

	@GetMapping(path = "/getMessagesForUser")
	@Transactional
	public @ResponseBody List<Message> getMessagesForUser(@RequestParam String userName) {

		UserData userData = userDataRepository.findByUserName(userName);
		List<Message> fromMessages = messageRepository.findByFromAddrOrderByTimestampAsc(userName);
		List<Message> toMessages = messageRepository.findByToAddrOrderByTimestampAsc(userName);

		List<Message> result = fromMessages;
		result.addAll(toMessages);

		Map<Long,Message> resultMap = new HashMap<>();
		result.forEach( r -> {
			log.info("adding [{}]", r.getText());
			resultMap.put(r.getTimestamp(),r);
		});
		Map<Long,Message> sortedResult = resultMap.entrySet().stream()
				.sorted(Map.Entry.comparingByKey())
				.collect(Collectors.toMap(Map.Entry::getKey,Map.Entry::getValue,
						(oldValue, newValue) -> oldValue,LinkedHashMap::new));



		return new ArrayList<>(sortedResult.values());
	}

	@GetMapping(path = "/muteUser")
	@Transactional
	public @ResponseBody String muteUser(@RequestParam String userName) {
		UserData userData = userDataRepository.findByUserName(userName);
		userData.setIsMuted(true);
		return("UserData " + userName + " is muted.");
	}

	@PostMapping(path="/changePassword")
	@Transactional
	public @ResponseBody String changePassword(HttpServletRequest request,
											   @RequestParam String oldPassword,
											   @RequestParam String newPassword) {
		String token = request.getHeader("X-Auth-Token");
		UserData actUserData = accessTokenManager.getUser(token);

		//log.info("UserData password: [{}]", actUserData.getPassword());
		//log.info("Old password: [{}]", oldPassword);

		if (UserPasswordManager.passwordsMatch(actUserData.getPassword(), actUserData.getPasswordSalt(),oldPassword)) {
			Map<String, String> pswd = UserPasswordManager.hashPasswordShiro(newPassword);
			actUserData.setPassword(pswd.get("hash"));
			actUserData.setPasswordSalt(pswd.get("salt"));

			userDataRepository.save(actUserData);

			return "Password for " + actUserData.getUserName() + " successfully changed.";
		}
		return "Couldn't change password for user " + actUserData.getUserName();
	}

	@PostMapping(path="/getAdmins")
	@Transactional
	public @ResponseBody
	List getAdmins() {
		List<String> admins = new ArrayList<>();
		Iterable<UserData> user = userDataRepository.findAll();
		user.forEach( a -> {
			List<Role> roles = a.getRoles();
			roles.forEach(r -> {
				if ("admin".equals(r.getRoleName())) {
					//log.info("User role: {}", a.getUserName());
					admins.add(a.getUsername());
				}
			});
		});
		return admins;
	}

	public String getEncoding(byte[] image) throws IOException{
		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        Long timestamp = System.currentTimeMillis();
		builder.addBinaryBody("image", image, ContentType.DEFAULT_BINARY, "image.jpg");
      
        HttpEntity entity = builder.build();
		MultipartHttpFetcher fetcher = new MultipartHttpFetcher();
		HttpFetcherResponse res = fetcher.doRequest(builder,"/faceEncoder");
		
		return(res.getBody());
	}

	public String getComparison(String image1, String image2) throws IOException {
		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        Long timestamp = System.currentTimeMillis();
		//builder.addBinaryBody("image", image, ContentType.DEFAULT_BINARY, "image.jpg");
		builder.addTextBody("image1",image1);
		builder.addTextBody("image2",image2);
		
        HttpEntity entity = builder.build();
		MultipartHttpFetcher fetcher = new MultipartHttpFetcher();
		HttpFetcherResponse res = fetcher.doRequest(builder,"/faceCompare");
		
		return(res.getBody());
	}

	@PostMapping(path = "/faceMatch")
	@Transactional
	public @ResponseBody String faceMatch(@RequestParam String email) throws IOException {
		UserData u = userDataRepository.findByEmail(email);

		byte[] pic = u.getDetails().getPassportFront();
		String faceHash = u.getDetails().getFaceHash().replace("b'","").replace("'","");
		String picHash = getEncoding(pic).replace("b'","").replace("'","");
		
		String compRes = getComparison(faceHash,picHash);

		u.getStatus().getRecognitionResult().setFaceMatch(Boolean.parseBoolean(compRes));

		return(compRes);
	}

	@GetMapping(path="/getWordList")
    @Transactional
    public @ResponseBody List<String> getWordList(@RequestParam String email,
                                                  @RequestParam int numberOfWords) {

	    List<String> retVal = new ArrayList<String>();

	    for (int i = 0; i<numberOfWords; ++i) {
	        Random r = new Random();
	        int rand = r.nextInt((26-1) + 1) + 1;
            retVal.add(alphabet.get(rand).toLowerCase());
        }

        UserData u = userDataRepository.findByEmail(email);
	    u.getDetails().setWordList(retVal.toArray(new String[retVal.size()]));

        return retVal;
    }

}
