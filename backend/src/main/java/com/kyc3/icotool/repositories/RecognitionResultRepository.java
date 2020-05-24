package com.kyc3.icotool.repositories;

import com.kyc3.icotool.dataTypes.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;

public interface RecognitionResultRepository  extends JpaRepository<RecognitionResult, Long>{
    @Nullable
    RecognitionResult findByStatus(Status status);
}


