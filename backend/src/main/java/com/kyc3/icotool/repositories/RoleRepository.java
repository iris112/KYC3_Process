package com.kyc3.icotool.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;

import com.kyc3.icotool.dataTypes.Role;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long>{
	@Nullable
	//Role findByRoleName(UserData user);
	//Optional<List<Role>> findByUserName(String userName);
	List<Role> findByUserName(String userName);
}