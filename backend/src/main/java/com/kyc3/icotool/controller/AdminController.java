package com.kyc3.icotool.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.kyc3.icotool.dataTypes.LogEntity;
import com.kyc3.icotool.dataTypes.Role;
import com.kyc3.icotool.dataTypes.UserData;
import com.kyc3.icotool.dataTypes.UserDataWithoutBinary;
import com.kyc3.icotool.payload.UserPayload;
import com.kyc3.icotool.repositories.LogEntityRepository;
import com.kyc3.icotool.repositories.UserDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.SecureRandom;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@Slf4j
@RequestMapping(path = "/admin")
public class AdminController {

    @Autowired
    private UserDataRepository userDataRepository;

    @Autowired
    private LogEntityRepository logEntityRepository;

    @PostMapping(path="/deleteUser")
    @Transactional
    public @ResponseBody
    String delUser(@RequestParam String userName) {
        log.info("Calling delUser...");
        UserData thisUserData = userDataRepository.findByUserName(userName);
        if (thisUserData == null) {
            return "Not found.";
        }
        LogEntity logEntity = new LogEntity(thisUserData);

        log.info("Creating LogEntity for user {}.", thisUserData.getUserName());

        logEntityRepository.save(logEntity);
        log.info("Deleting user: {}", userName);

        //userDataRepository.delete(user);
        userDataRepository.deleteByUserName(userName);

        return "Success.";
    }

    @PostMapping(path="/editUserData")
    @Transactional
    public @ResponseBody UserData editUserData(@RequestParam String userName,
                                               @RequestParam String firstName,
                                               @RequestParam String lastName, @RequestParam String email,
                                               @RequestParam String taxCountry, @RequestParam String nationality,
                                               @RequestParam String dateOfBirth, @RequestParam String address, @RequestParam String walletAddress,
                                               @RequestParam double amount, @RequestParam String currencyType,
                                               @RequestParam String sourceOfFunds,
                                               @RequestParam(value = "telegramName", required = false) String telegramName,
                                               @RequestParam(value = "twitterName", required = false) String twitterName,
                                               @RequestParam(value = "facebookProfile", required = false) String facebookProfile,
                                               @RequestParam(value = "linkedinProfile", required = false) String linkedinProfile) throws IOException {

        DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        try {
            date = format.parse(dateOfBirth);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        UserData actUser = userDataRepository.findByUserName(userName);
        actUser.setFirstName(firstName);
        actUser.setLastName(lastName);
        actUser.setEmail(email);
        actUser.getDetails().setTaxCountry(taxCountry);
        actUser.getDetails().setNationality(nationality);
        actUser.getDetails().setDateOfBirth(date);
        actUser.getDetails().setAddress(address);
        actUser.getDetails().setWalletAddress(walletAddress);
        actUser.getDetails().setamount(amount);
        actUser.getDetails().setCurrencyType(currencyType);
        actUser.getDetails().setSourceOfFunds(sourceOfFunds);
        actUser.getDetails().setTelegramName(telegramName);
        actUser.getDetails().setTwitterName(twitterName);
        actUser.getDetails().setFacebookProfile(facebookProfile);
        actUser.getDetails().setLinkedinProfile(linkedinProfile);

        userDataRepository.save(actUser);

        return actUser;
    }


    @PostMapping(path="/createAdmin")
    @Transactional
    public @ResponseBody Map createAdmin(@RequestParam String adminName,
                                           @RequestParam String adminEmail) {
        Map<String,String> retVal = new HashMap<>();
        UserData admin = userDataRepository.findByUserName(adminName);
        UserData adminByEmail = userDataRepository.findByEmail(adminEmail);
        String password ="";
        if (admin == null && adminByEmail == null) {
            byte[] bytes = new byte[16];
            new SecureRandom().nextBytes(bytes);
            password = new String(Base64.encodeBase64(bytes));
            Role adminRole = Role.builder()
                    .expirationTimestamp(System.currentTimeMillis() + 3600 * 24 * 365 * 1000 * 1000)
                    .roleName("admin")
                    .userName(adminName)
                    .build();
            UserPayload userPayload = new UserPayload(adminName, "", "", adminEmail, password, "admin");
            admin = UserCreator.createUser(userPayload);
            admin.addRole(adminRole);
            userDataRepository.save(admin);
            retVal.put("password",password);
        } else {
            retVal.put("error","User with same userName or email address already exists.");
        }

        return retVal;
    }

    @PostMapping(path="/genQr")
    @Transactional
    public @ResponseBody byte[] generateQr(@RequestParam String text,
                                           @RequestParam int width,
                                           @RequestParam int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        log.info("{}",text);
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG",pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();

        return pngData;
    }

    @GetMapping(path="/getWordForUser")
    @Transactional
    public @ResponseBody String[] getWordForUser(@RequestParam String email) {
        UserData u = userDataRepository.findByEmail(email);
        return u.getDetails().getWordList();
    }
}
