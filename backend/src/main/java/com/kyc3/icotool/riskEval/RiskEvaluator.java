package com.kyc3.icotool.riskEval;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.kyc3.icotool.controller.HttpFetcherResponse;
import com.kyc3.icotool.controller.MultipartHttpFetcher;
import com.kyc3.icotool.dataTypes.CountryRisk;
import com.kyc3.icotool.dataTypes.Entities;
import com.kyc3.icotool.dataTypes.MrzObject;
import com.kyc3.icotool.dataTypes.RecognitionResult;
import com.kyc3.icotool.dataTypes.SanctionEntity;
import com.kyc3.icotool.dataTypes.Status;
import com.kyc3.icotool.dataTypes.UserData;
import com.kyc3.icotool.exceptions.NoContentException;
import com.kyc3.icotool.repositories.UserDataRepository;

import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

// @Component
@Slf4j
public class RiskEvaluator {

	@Setter 
	@Getter
	@lombok.Value
	public static class PersonValue {
		MrzObject mrzVal;
		RecognitionResult faceMatch;
		Entities sanction;
		Entities pep;
	}

	// @Autowired
	private UserDataRepository userDataRepository;

	private UserData userData;
	private String apiKey;

	//private RiskResult riskResult; // = new RiskResult();
	private List<SanctionEntity> sanctions;
	private List<SanctionEntity> peps;

	public RiskEvaluator(UserData userDataIn,
			UserDataRepository userRepoIn,
			//List<SanctionEntity> entitiesIn,
			//List<SanctionEntity> pepIn,
			@Value("${kyc3.apiKey") String apiKey){
		this.userData = userDataIn;
		//this.riskResult = new RiskResult(this.userData);
		this.userDataRepository = userRepoIn;
		//this.sanctions = entitiesIn;
		//this.peps = pepIn;
		this.apiKey = apiKey;
	}

	public static List<String> dateFormats = new ArrayList<String>() {{
		add("yyyy-MM-dd");
		add("dd MMM yyyy");
		add("dd/MM/yyyy");
		add("dd.MM.yyyy");
		add("yyyy");
		add("yyyy-MM-dd'T'h:m:s");
		add("dd.MM.yyyy");
		add("yyyy/MM/dd");
	}};

	private byte[] downsizeImage(byte[] image, int newWidthIn) throws IOException {
		if (image != null) {
			InputStream in = new ByteArrayInputStream(image);
			BufferedImage originalImage = ImageIO.read(in);

			int height = originalImage.getHeight();
			int width = originalImage.getWidth();

			if (width <= newWidthIn) {
				return image;
			}

			int newWidth = newWidthIn;
			int newHeight = (int) ((double) height / (double) width * newWidth);

			Image retImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_DEFAULT);
			BufferedImage retImageBuff = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_3BYTE_BGR);
			retImageBuff.getGraphics().drawImage(retImage, 0, 0, null);
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ImageIO.write(retImageBuff, "jpg", baos);
			//baos.flush();
			byte[] retBytes = baos.toByteArray();
			//baos.close();
			return retBytes;
		}
		return image;
	}


	public static Date readDate(String dateString) {
		Date retVal = new Date();
		String tmpString = dateString.trim();

		if (tmpString.contains("ca.")) {
			tmpString = tmpString.replace("ca.", "").trim();
		}
		if (tmpString.contains("years")) {
			tmpString = tmpString.substring(0,tmpString.indexOf("(")).trim();
		}

		//System.out.println(tmpString);

		for (String df : dateFormats) {
			//System.out.println(df);
			DateFormat format = new SimpleDateFormat(df);
			try {
				retVal = format.parse(tmpString);
				break;
			} catch (Exception e) {
            }
		}

		return retVal;
	}

	protected static long minDoBDistance(UserData u, SanctionEntity sE) {
		List<Long> doBOffsets = new ArrayList<Long>();
		if (sE == null || sE.getBirthDates() == null)
			return Long.MAX_VALUE;
		for (String doB : sE.getBirthDates()){
			doBOffsets.add(Math.abs(Math.abs(u.getDetails().getDateOfBirth().getTime())
					- Math.abs(readDate(doB).getTime())));
		}
		return Collections.min(doBOffsets);
	}


	protected static boolean nameCompare(UserData u, SanctionEntity sE) {
		String firstNames[] = u.getFirstName().split(" ");
		String lastNames[] = u.getLastName().split(" ");

		boolean equalFirst = false;
		boolean equalLast = false;

		for (String fName : firstNames) {
			if (sE == null)
				break;
			if ((sE.getEntityName()!=null && sE.getEntityName().contains(fName))
					|| sE.getDescription()!= null && sE.getDescription().contains(fName)) {
				equalFirst = true;
				break;
			}
			if  (sE.getAkaNames() == null)
				break;
			for (String akaName : sE.getAkaNames()) {
				if (akaName != null && akaName.contains(fName)) {
					equalFirst = true;
					break;
				}
			}
			if (equalFirst == true)
				break;
		}

		for (String fName : lastNames) {
			if (sE == null)
				break;
			if ((sE.getEntityName() != null && sE.getEntityName().contains(fName))
					|| sE.getDescription() != null && sE.getDescription().contains(fName)) {
				equalLast = true;
				break;
			}
			if (sE.getAkaNames() == null) {
				break;
			}
			for (String akaName : sE.getAkaNames()) {
				if (akaName != null && akaName.contains(fName)) {
					equalLast = true;
					break;
				}
			}
			if (equalLast == true)
				break;
		}
        return equalLast && equalFirst;

    }

	protected static boolean countryCompare(UserData u, SanctionEntity sE) {
		List<String> birthplaces = sE.getBirthPlaces();
		List<String> addresses = sE.getAddresses();
        return birthplaces != null && birthplaces.contains(u.getDetails().getNationality()) ||
                addresses != null && addresses.contains(u.getDetails().getNationality());

    }

    private String personCheck(byte[] idFront,
							   byte[] idBack, // can be null
							   byte[] selfie,
							   String queryString) throws IOException {
        log.info("Getting all necessary information for apikey {}", apiKey);

		log.info("query_string: {}", queryString);

		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
        Long timestamp = System.currentTimeMillis();
		builder.addBinaryBody("passportFront", idFront, ContentType.DEFAULT_BINARY, "passportFront.jpg");
		if (idBack != null) {
			builder.addBinaryBody("passportBack", idBack, ContentType.DEFAULT_BINARY, "passportBack.jpg");
		}
		builder.addBinaryBody("file1",selfie,ContentType.DEFAULT_BINARY,"file1.jpg");
		builder.addBinaryBody("file2",selfie,ContentType.DEFAULT_BINARY,"file2.jpg");
		builder.addBinaryBody("file3",selfie,ContentType.DEFAULT_BINARY,"file3.jpg");
		builder.addBinaryBody("file4",selfie,ContentType.DEFAULT_BINARY,"file4.jpg");
		builder.addBinaryBody("file5",selfie,ContentType.DEFAULT_BINARY,"file5.jpg");

		builder.addTextBody("search_query", queryString);

		HttpEntity entity = builder.build();
		MultipartHttpFetcher fetcher = new MultipartHttpFetcher();
        HttpFetcherResponse res = fetcher.doRequest(builder,"/idCheck");
		
// 	   // String uri = "https://api.kyc3.com/rest/api/_getPersonCheck?api_key=" + apiKey;
//         String uri = "https://simplewebui.int.amlapi.com/rest/api/_getPersonCheck?api_key=" + apiKey;

//         //MrzObject response = null;
//         String tempFileName1 = "/tmp/idFront.jpg";
//         String tempFileName2 = "/tmp/idBack.jpg";
//         String tempFileName3 = "/tmp/selfie.jpg";

//         //File tempFile = null;

//         FileOutputStream fos =null;
//         try {
//             //tempFile = File.createTempFile(tempFileName);
//             fos = new FileOutputStream(tempFileName1);
//             fos.write(idFront);
//             fos.close();
//             if (idBack != null) {
//                 fos = new FileOutputStream(tempFileName2);
//                 fos.write(idBack);
//                 fos.close();
//             }
//             fos = new FileOutputStream(tempFileName3);
//             fos.write(selfie);
//             fos.close();
//         } catch (Exception e1) {
//             // TODO Auto-generated catch block
//             e1.printStackTrace();
//             ;
//         }

//         MultiValueMap<String, Object> vars = new LinkedMultiValueMap<String, Object>();
//         Map<String, String> parms = new HashMap<String, String>();
//         log.info("personCheck using api_key: [{}]", apiKey);
//         parms.put("api_key",apiKey);

//         vars.add("passportFront", new FileSystemResource(tempFileName1));
//         //log.info("Passport Back size: " + idBack.length);
//         if (idBack != null && idBack.length != 0) {
//             vars.add("passportBack", new FileSystemResource(tempFileName2));
//         } else {
//             log.info("No passport back side.");

//         }
// // } else {
// //        	vars.add("passportBack", null);
// //		}
//         vars.add("file1", new FileSystemResource(tempFileName3));
//         vars.add("file2", new FileSystemResource(tempFileName3));
//         vars.add("file3", new FileSystemResource(tempFileName3));
//         vars.add("file4", new FileSystemResource(tempFileName3));
//         vars.add("file5", new FileSystemResource(tempFileName3));
//         vars.add("search_query", new String(queryString));

//         RestTemplate sRestTemplate = new RestTemplate();

//         String response = null;
//         try {
//             response = sRestTemplate.postForObject(uri, vars, String.class, parms);
//             //response = sRestTemplate.postForEntity(uri, null, String.class, vars);
//         } catch(Exception e) {
//             e.printStackTrace();
//             ;
//         }

//         //System.out.println(response);

         return res.getBody();
    }


    private String readMrz(byte[] idFront,
                           byte[] idBack) {
		log.info("Getting MRZ with apiKey [{}]", apiKey);
		String uri = "https://api.kyc3.com/rest/api/_mrzExtractor?api_key=" + apiKey;

        //MrzObject response = null;
        String tempFileName = "/tmp/passport.jpg";
        //File tempFile = null;
        FileOutputStream fos =null;
        try {
            //tempFile = File.createTempFile(tempFileName);
            fos = new FileOutputStream(tempFileName);
            if (idBack != null)
                fos.write(idBack);
            else
                fos.write(idFront);
            fos.close();
        } catch (Exception e1) {
            // TODO Auto-generated catch block
            //e1.printStackTrace();
            ;
        }

        MultiValueMap<String, Object> vars = new LinkedMultiValueMap<String, Object>();
        Map<String, String> parms = new HashMap<String, String>();
        log.info("using api_key: [{}]", apiKey);
        parms.put("api_key",apiKey);

        vars.add("passportFront", new FileSystemResource(tempFileName));

        RestTemplate sRestTemplate = new RestTemplate();

        String response = "";
        try {
            response = sRestTemplate.postForObject(uri, vars, String.class, parms);
            //restTemplate.postForEntity(uri, null, String.class, vars);
        } catch(Exception e) {
            //e.printStackTrace();
            ;
        }

        //System.out.println(response);

        return response;
	}

	private String faceCompare(byte[] selfie, byte[] idFace) {
		String uri = "https://api.kyc3.com/rest/api/_faceRecognizer?api_key=" + apiKey;

		String tempFileName1 = "/tmp/selfie.jpg";
		String tempFileName2 = "/tmp/idFace.jpg";

		FileOutputStream fos =null;
		try {
			fos = new FileOutputStream(tempFileName1);
			fos.write(selfie);
			fos.close();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			fos = new FileOutputStream(tempFileName2);
			fos.write(idFace);
			fos.close();
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		MultiValueMap<String, Object> vars = new LinkedMultiValueMap<String, Object>();
		Map<String, String> parms = new HashMap<String, String>();
		parms.put("api_key",apiKey);

	    vars.add("file1", new FileSystemResource(tempFileName1));
	    vars.add("file2", new FileSystemResource(tempFileName1));
	    vars.add("file3", new FileSystemResource(tempFileName1));
	    vars.add("file4", new FileSystemResource(tempFileName1));
	    vars.add("file5", new FileSystemResource(tempFileName1));
	    vars.add("passportFront", new FileSystemResource(tempFileName2));

	    RestTemplate sRestTemplate = new RestTemplate();

	    String response = "";
		try {
			response = sRestTemplate.postForObject(uri, vars, String.class,parms);
					//restTemplate.postForEntity(uri, null, String.class, vars);
		} catch(Exception e) {
			//e.printStackTrace();
			;
		}

		System.out.println(response);

		return response;
	}


	public String evalRisk() { //Entities sanctions, Entities peps) {

		int sanctionCounter = 0;
		int pepCounter = 0;
		long minDPep = Long.MAX_VALUE;
		long minDSanction = Long.MAX_VALUE;
		boolean sNameCheck = false;
		boolean pNameCheck = false;
		boolean sCountryCompare = false;
		boolean pCountryCompare = false;
		int pepScore = 1;
		int sanctionScore = 1;
		//RiskResult riskResult = new RiskResult(this.userData);

        boolean liveliness = false; //userData.getStatus().getRecognitionResult().isLiveliness();
        boolean facematch = false; //userData.getStatus().getRecognitionResult().isFaceMatch();

		try {
			liveliness = userData.getStatus().getRecognitionResult().isLiveliness();
		} catch (Exception e) {
			;
		}
		try { 
			facematch = userData.getStatus().getRecognitionResult().isFaceMatch();
		} catch (Exception e) {
			;
		}

		String personDataJson = null;
		try {
        	personDataJson  = personCheck(userData.getDetails().getPassportFront(),
                userData.getDetails().getPassportBack(),
                userData.getDetails().getSelfie(),
                userData.getFirstName() + " " + userData.getLastName());
		} catch (Exception e) {
			e.printStackTrace();
		}

		PersonValue personData = new Gson().fromJson(personDataJson, PersonValue.class);

        Gson gson = new Gson();
		Entities mySanctions = null;
		Entities myPep = null;

		try {
			mySanctions = personData.getSanction();
			//System.out.println(personData.get("sanction").getClass().toString());
			//mySanctions = gson.fromJson(personData.get("sanction").toString(),Entities.class);
			//mySanctions = personData.get("sanction").toString();
		} catch (Exception e) {
			;
		}

		// for (SanctionEntity e : mySanctions.getSanctionedEntities()) {
        //     if (e.getBirthDates() != null) {
        //         for (String d : e.getBirthDates()) {
        //             System.out.println(RiskEvaluator.readDate(d).getTime());
        //         }
        //     }
        // }

		try {
			sanctions = mySanctions.getSanctionedEntities();
		}
		catch (Exception e) {
			e.printStackTrace();
		}

		try {
			//System.out.println(personData.get("peps"));
			//myPep = gson.fromJson(personData.get("pep").toString(),Entities.class);
			myPep = personData.getPep();
		} catch (Exception e) {
			e.printStackTrace();
		}

		// for (SanctionEntity e : myPep.getSanctionedEntities()) {
		// 	if (e.getBirthDates() != null) {
		// 		for (String d : e.getBirthDates()) {
		// 			System.out.println(RiskEvaluator.readDate(d).getTime());
		// 		}
		// 	}
		// }

		try {
			peps = mySanctions.getSanctionedEntities();
		} catch (Exception e) {
			;
		}
		//String test = personData.get("mrzVal");
        //log.info("mrz data {}" , mrzData);

		if (sanctions != null){
			for (SanctionEntity sE : sanctions) {
				minDSanction = minDoBDistance(userData,sE);
				sNameCheck = nameCompare(userData,sE);
				sCountryCompare = countryCompare(userData,sE);
				System.out.println(minDSanction + "," + sNameCheck + ", " + sCountryCompare);

				if (sNameCheck == true) {
					System.out.println("Namecheck True");
					sE.setRiskResult(userData.getRiskResult());
					if (sCountryCompare == true && minDSanction == 0) {
						System.out.println("CountryCompare True, BirthdayMatch");
						sanctionScore = Math.max(sanctionScore,3);
						userData.getRiskResult().addSanctionDetail(sE);
					}
					if (sCountryCompare == true && Math.abs(minDSanction) > 0) {
						if (Math.abs(minDSanction) < 2*3600*24*365) {
							sanctionScore = Math.max(sanctionScore,2);
							userData.getRiskResult().addSanctionDetail(sE);
						}
					}
					if (sCountryCompare == false) {
						if (minDSanction == 0) {
							sanctionScore = Math.max(sanctionScore,3);
							userData.getRiskResult().addSanctionDetail(sE);
						}

						if (minDSanction < 0.5*3600*24*365) {
							sanctionScore = Math.max(sanctionScore,2);
							userData.getRiskResult().addSanctionDetail(sE);
						}
					}
				}
			}
		}
		if (peps != null){
			for (SanctionEntity sE : peps) {
				minDPep = minDoBDistance(userData,sE);
				pNameCheck = nameCompare(userData,sE);
				pCountryCompare = countryCompare(userData,sE);
				if (pNameCheck == true) {
					sE.setRiskResult(userData.getRiskResult());
					pepScore = 2;
					userData.getRiskResult().addPepDetail(sE);
				}
			}
		}


		System.out.println("Sanction Score: " + sanctionScore + " PepScore: " + pepScore);

		userData.getRiskResult().setPepScore(pepScore);
		userData.getRiskResult().setSanctionScore(sanctionScore);

		//{"residenceLevel": 0.6, "pepIncrease": 0.2, "corruptionLevel": 0.6}
		//retVal.riskScore = float(format(float(countryRisk.corruptionRisk) * corruptionLevel * 2 * 10
		// * ( 1 + (retVal.highestPepScore * (pepIncrease)))
		// + float(countryRisk.mlRisk) * (1.0-corruptionLevel) * 2 * 10,'.2f'))

		double corruptionLevel = 0.6;
		double pepIncrease = 0.2;

		ResponseEntity<String> response = null;
		//Gson gson = new Gson();
		gson = new Gson();
		CountryRisk countryRisk = null;
		System.out.println(apiKey);
		String countryRiskUrl = "https://api.kyc3.com/rest/api/_getCountryRisk?api_key=" + apiKey + "&iso_country_code=" + userData.getDetails().getNationality();
		RestTemplate sRestTemplate = new RestTemplate();
		try {
			response = sRestTemplate.getForEntity(countryRiskUrl, String.class);
			countryRisk = gson.fromJson(response.getBody(),CountryRisk.class);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Does not work!!");
		}

		userData.getRiskResult().setCountryRisk(countryRisk.getTotalRisk());
		log.info("countryRisk: [{}]", countryRisk.getCorruptionRisk());
		log.info("pepScore: [{}]", pepScore);
		log.info("AmlRisk: [{}]",countryRisk.getAmlRisk());
		userData.getRiskResult().setRiskScore(countryRisk.getCorruptionRisk() * corruptionLevel * 2.0 * 10.0 *
				( 1 + (pepScore * pepIncrease)) + countryRisk.getAmlRisk() * (1.0 - corruptionLevel) * 2 * 10);

		log.info("Risk result: [{}]", userData.getRiskResult().getRiskScore());

		Status actStatus = userData.getStatus();
		//String mrzString =  personData.get("mrzVal").toString();

		//log.info("MRZ return object: {}", mrzString);

		//System.out.println(mrzString);
		MrzObject mrz = new MrzObject();
		try {
			gson = new GsonBuilder().setLenient().create(); //new Gson();
			//mrz = gson.fromJson(mrzString, MrzObject.class);
			mrz = personData.getMrzVal();
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (mrz == null) {
			mrz = new MrzObject();
		}
		// mrz.setStatus(actStatus);
		// actStatus.setMrz(mrz);

		actStatus.setUserData(userData);

		// String faceRec = personData.get("faceMatch").toString();
		// if (faceRec.contains("message")) {
		// 	String[] faceRecSplit = faceRec.split(", message");
		// 	faceRec = faceRecSplit[0] + "}";
		// }
		// log.info("faceRec return object: {}", faceRec);
		try {
			//actStatus.setRecognitionResult(recognitionResult);
			gson = new Gson();
			//RecognitionResult recResult = gson.fromJson(faceRec, RecognitionResult.class);
			RecognitionResult recResult = personData.getFaceMatch();
			actStatus.setRecognitionResult(recResult);
		} catch (Exception e) {
			e.printStackTrace();
		}

        if (userData.getDetails().getSelfie().length == 0) {
            userData.getStatus().getRecognitionResult().setLiveliness(liveliness);
            userData.getStatus().getRecognitionResult().setFaceMatch(facematch);
        }

		userDataRepository.save(userData);

		// if (userData.getStatus().getMrz() == null)
		// 	throw new NoContentException("No MRZ found.");
		// else if (userData.getStatus().getRecognitionResult() == null)
		// 	throw new NoContentException("Pictures could not be analyzed.");
		// //return new ResponseEntity(HttpStatus.OK);

		return userData.getUserName();
	}

	public UserData getUserData() {
		return userData;
	}

	public void setUserData(UserData userData) {
		this.userData = userData;
	}

}
