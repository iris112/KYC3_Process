package com.kyc3.icotool.repositories;

import com.kyc3.icotool.dataTypes.LogEntity;
import com.kyc3.icotool.dataTypes.UserData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.Nullable;

public interface LogEntityRepository extends CrudRepository<LogEntity, Long> {

    @Nullable
    UserData findByUserName(String userName);

}
