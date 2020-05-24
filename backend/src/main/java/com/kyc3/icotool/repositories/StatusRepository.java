package com.kyc3.icotool.repositories;

import com.kyc3.icotool.dataTypes.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;

import com.kyc3.icotool.dataTypes.Status;

public interface StatusRepository extends JpaRepository<Status, Long>{
	@Nullable
	Status findByUserData(UserData userData);
}
