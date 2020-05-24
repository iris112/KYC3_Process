package com.kyc3.icotool.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import com.kyc3.icotool.AccessToken;


@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long>{
	@Nullable
	AccessToken findByToken(String token);
    
}
