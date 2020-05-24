package com.kyc3.icotool;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import org.apache.shiro.codec.Hex;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.apache.shiro.util.ByteSource;
import org.apache.shiro.util.SimpleByteSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public final class UserPasswordManager {

	@Bean
	public static PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	private UserPasswordManager() {
    }
	
	//@Autowired
	private static PasswordEncoder passwordEncoder = passwordEncoder();

    //@Autowired
    //public UserPasswordManager(PasswordEncoder passwordEncoder) {
    //    passwordEncoder = passwordEncoder;
    //}

    public static String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    public static boolean verify(String encodedPassword, String rawPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public static Map<String, String> hashPasswordShiro(String password) {
    	String passwd = password;
        ByteSource randomSalt = generateSalt();
        String hashedPassword = computeHashedPassword(passwd, randomSalt);
        
//        System.out.println("Random Salt: " + randomSalt);
//        System.out.println("Hashed Password: " + hashedPassword);

        Map<String, String> pswds = new HashMap<String, String>();
        pswds.put("hash", hashedPassword);
        pswds.put("salt", randomSalt.toHex());
        
        return pswds;
    }

    private static ByteSource generateSalt() {
        SecureRandom random = new SecureRandom();

        byte randomSaltBytes[] = new byte[32];
        random.nextBytes(randomSaltBytes);

        return new SimpleByteSource(randomSaltBytes);
    }

    private static String computeHashedPassword(String plainTextPassword, ByteSource salt) {
//    	 System.out.println("Random Salt: " + salt);
//         System.out.println("Plain Password: " + plainTextPassword);
    	
    	Sha256Hash sha256Hash = new Sha256Hash(plainTextPassword, salt.getBytes());
        return sha256Hash.toHex();
    }

    public static boolean passwordsMatch(String dbStoredHashedPassword, String salt, String clearTextPassword) {
        ByteSource bsalt = ByteSource.Util.bytes(Hex.decode(salt));

        // NO SHIRO ENCRYPTION - NO SALT
        /*String hashedPassword = hashAndSaltPassword(clearTextPassword, bsalt);*/

        String hashedPassword = computeHashedPassword(clearTextPassword, bsalt);
//        System.out.println("Hashed Password: " + hashedPassword);
//        System.out.println("Stored Password: " + dbStoredHashedPassword);

        return hashedPassword.equals(dbStoredHashedPassword);
    }
}