package com.kyc3.icotool.controller;

import javax.transaction.Transactional;

import com.itextpdf.text.BadElementException;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorker;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.tool.xml.html.Tags;
import com.itextpdf.tool.xml.parser.XMLParser;
import com.itextpdf.text.pdf.codec.Base64;
import com.itextpdf.tool.xml.pipeline.css.CSSResolver;
import com.itextpdf.tool.xml.pipeline.css.CssResolverPipeline;
import com.itextpdf.tool.xml.pipeline.end.PdfWriterPipeline;
import com.itextpdf.tool.xml.pipeline.html.AbstractImageProvider;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipeline;
import com.itextpdf.tool.xml.pipeline.html.HtmlPipelineContext;
import com.kyc3.icotool.dataTypes.*;
import com.kyc3.icotool.exceptions.NoContentException;
import com.kyc3.icotool.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;
import com.kyc3.icotool.riskEval.RiskEvaluator;

import java.io.FileOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Slf4j
@Controller
@RequestMapping(path = "/risk")
@EnableAsync
public class RiskEvalController {
	
	@Autowired
	private UserDataRepository userDataRepository;

	@Autowired
	UserDetailsRepository userDetailsRepository;

	@Autowired
	StatusRepository statusRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	RiskResultRepository riskResultRepository;

	@Autowired
	MrzObjectRepository mrzObjectRepository;
	
	//@Autowired
	RiskEvaluator myEval;
	
	//@Autowired
	//UserData actUser;
	
	@Value("${kyc3.apiKey}")
	String apiKey;
	
	@PostMapping(path = "/eval")
	@Transactional
	//@Async
	public @ResponseBody String evalRisk(@RequestParam String userName) {//UserData userIn) {
		
		//String userName = userIn.getFirstName().toLowerCase().trim() + " " + userIn.getLastName().toLowerCase().trim();
		
		UserData actUserData = userDataRepository.findByUserName(userName);
		if (actUserData == null) {
			throw new NoContentException("No user with userName " + userName + " found.");
		}
		UserDetails details = userDetailsRepository.findByUserData(actUserData);
		Status status = statusRepository.findByUserData(actUserData);
		RiskResult riskResult = riskResultRepository.findByUserData(actUserData);
		//List<Role> roles = roleRepository.findByUserName(userName);

		actUserData.setDetails(details);
		actUserData.setStatus(status);
		actUserData.setRiskResult(riskResult);
		//actUserData.setRoles(roles);

		log.info("UserData: [{}]", actUserData.getUserName());
		log.info("UserDetails: [{}]", actUserData.getDetails());
		log.info("Status: [{}]", actUserData.getStatus().getKycStatus());

		String tmpName = actUserData.getFirstName() + " " + actUserData.getLastName();//userName.replace(",", "").toLowerCase().trim();
		log.info("Checking for: [{}]", tmpName);
		//System.out.println(actUserData.getDetails().getNationality().toString());
		
//		Gson gson = new Gson();
//
//        /*
//         * Query KYC3 RestFul API to get sanction and pep list entries.
//         */
//        String sanctionString = "https://api.kyc3.com/rest/api/_getSanctionEntityDetails?api_key=Z2SBQ89dN8yoVDXZ&search_query=" + tmpName;
//        String pepString = "https://api.kyc3.com/rest/api/_getPepEntityDetails?api_key=Z2SBQ89dN8yoVDXZ&search_query=" + tmpName;
//
//        ResponseEntity<String> response = null;
//
//        RestTemplate sRestTemplate = new RestTemplate();
//        Entities sanctions = null;
//        Entities peps = null;
//
//        try {
//            response = sRestTemplate.getForEntity(sanctionString, String.class);
//            sanctions = gson.fromJson(response.getBody(),Entities.class);
//
//            response = sRestTemplate.getForEntity(pepString,String.class);
//            peps = gson.fromJson(response.getBody(),Entities.class);
//
//            //System.out.println(response.getBody().toString());
//        } catch (Exception e) {
//            e.printStackTrace();
//            System.out.println("Does not work!!");
//            throw new NoContentException("Pep or sanction check did not work.");
//        }
//
//        for (SanctionEntity e : sanctions.getSanctionedEntities()) {
//            if (e.getBirthDates() != null) {
//                for (String d : e.getBirthDates()) {
//                    System.out.println(RiskEvaluator.readDate(d).getTime());
//                }
//            }
//        }
		
		myEval = new RiskEvaluator(actUserData, userDataRepository,apiKey);

		String myRetval = myEval.evalRisk();
		
		return myRetval;
	}
	
	@PostMapping(path = "/evalList")
	@Transactional
	//@Async
	//@EnableAsync
	public @ResponseBody String evalRiskList(@RequestParam String userNames) {
		
		String[] names = userNames.split(",");
		int counter = 0;

		for (String name : names) {
			try {
				counter += 1;
				evalRisk(name);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		return new String(Integer.toString(counter));
	}


	@PostMapping(path = "/saveComment")
	@Transactional
	public @ResponseBody String saveComment(@RequestParam String comment, @RequestParam String userName) {
		UserData actUserData = userDataRepository.findByUserName(userName);
		actUserData.getStatus().setComment(comment);
		userDataRepository.save(actUserData);
		return ("saved.");
	}

	@PostMapping(path = "/setKycStatus")
	@Transactional
	public @ResponseBody String setKycStatus(@RequestParam String userName, @RequestParam int kycStatus) {
		UserData actUserData = userDataRepository.findByUserName(userName);
		actUserData.getStatus().setKycStatus(kycStatus);
		userDataRepository.save(actUserData);
		return ("done.");
	}

	@PostMapping(path = "/setIdentityDocumentStatus")
	@Transactional
	public @ResponseBody String setIdentityDocumentStatus(@RequestParam String userName, @RequestParam String status) {
		UserData actUserData = userDataRepository.findByUserName(userName);
		actUserData.getStatus().setIdentityDocumentStatus(status);
		userDataRepository.save(actUserData);
		return ("done.");
	}

	@PostMapping(path = "/setProofOfResidenceStatus")
	@Transactional
	public @ResponseBody String setProofOfResidenceStatus(@RequestParam String userName, @RequestParam String status) {
		UserData actUserData = userDataRepository.findByUserName(userName);
		actUserData.getStatus().setProofOfResidenceStatus(status);
		userDataRepository.save(actUserData);
		return ("done.");
	}

	// Helper class for parsing base64 images in <img> tag into pdf
	class Base64ImageProvider extends AbstractImageProvider {
 
        @Override
        public Image retrieve(String src) {
            int pos = src.indexOf("base64,");
            try {
                if (src.startsWith("data") && pos > 0) {
                    byte[] img = Base64.decode(src.substring(pos + 7));
                    return Image.getInstance(img);
                }
                else {
                    return Image.getInstance(src);
                }
            } catch (BadElementException ex) {
                return null;
            } catch (IOException ex) {
                return null;
            }
        }
 
        @Override
        public String getImageRootPath() {
            return null;
        }
    }

	@PostMapping(path="/getPdfReport")
	@Transactional
	public @ResponseBody String getPdfReport(@RequestParam String htmlInput) throws IOException, DocumentException {

	log.info("URL parameter: {}", htmlInput);
	
	Document document = new Document();
	PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream("html.pdf"));
	document.open();
	CSSResolver cssResolver = XMLWorkerHelper.getInstance().getDefaultCssResolver(true);
	HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);
	htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());
	htmlContext.setImageProvider(new Base64ImageProvider());
	PdfWriterPipeline pdf = new PdfWriterPipeline(document, writer);
	HtmlPipeline html = new HtmlPipeline(htmlContext, pdf);
	CssResolverPipeline css = new CssResolverPipeline(cssResolver, html);
	XMLWorker worker = new XMLWorker(css, true);
	XMLParser p = new XMLParser(worker);
	p.parse(new ByteArrayInputStream(htmlInput.getBytes()));
	document.close();

	FileSystemResource resource = new FileSystemResource("html.pdf");
	byte[] content = new byte[(int)resource.contentLength()];

	IOUtils.read(resource.getInputStream(),content);

	// Had to be done like this because there are two libraries with the same name
	org.apache.commons.codec.binary.Base64 base = new org.apache.commons.codec.binary.Base64();
	String pdfString = base.encodeBase64String(content);

	//log.info("pdfString = {}", pdfString);

	return pdfString;
	}
}
