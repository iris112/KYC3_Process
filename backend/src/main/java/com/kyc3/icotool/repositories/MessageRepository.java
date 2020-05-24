package com.kyc3.icotool.repositories;

import com.kyc3.icotool.dataTypes.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Nullable
    List<Message> findByFromAddrOrderByTimestampAsc(String fromAddr);

    @Nullable
    List<Message> findByToAddrOrderByTimestampAsc(String toAddr);
}
