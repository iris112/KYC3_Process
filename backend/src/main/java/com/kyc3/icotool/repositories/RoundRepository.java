package com.kyc3.icotool.repositories;

import java.util.Collection;
import java.util.Optional;

import com.kyc3.icotool.dataTypes.Round;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.Nullable;

import javax.transaction.Transactional;

public interface RoundRepository extends JpaRepository<Round, Long> {

    @Nullable
    Round findById(int id);

    // @Query("SELECT u FROM Round u WHERE u.startTimestamp <= :currentTimestamp and u.endTimestamp >= :currentTimestamp")
    // Round findActiveRound(@Param("currentTimestamp") Long currentTimestamp);

    @Query("SELECT u FROM Round u WHERE u.active = 'true'")
    Round findActiveRound();

    // @Query("select new com.kyc3.icotool.dataTypes.Round(u.id,u.discount,u.tokens,u.startTimestamp,u.endTimestamp,u.round) from Round u where u.startTimestamp >= :currentTimestamp and u.endTimestamp <= :currentTimestamp")
    // Collection<Round> findActiveRound(@Param("currentTimestamp") Long currentTimestamp);
}

