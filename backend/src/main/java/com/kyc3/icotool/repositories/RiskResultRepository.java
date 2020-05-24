package com.kyc3.icotool.repositories;

import com.kyc3.icotool.dataTypes.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;

import com.kyc3.icotool.dataTypes.RiskResult;

public interface RiskResultRepository  extends JpaRepository<RiskResult, Long>{
	@Nullable
	RiskResult findByUserData(UserData userData);
}


