package com.kyc3.icotool.repositories;

import java.util.Collection;
import java.util.Optional;

import com.kyc3.icotool.dataTypes.UserDataWithoutBinary;
import com.kyc3.icotool.dataTypes.UserData;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.Nullable;

import javax.transaction.Transactional;

public interface UserDataRepository extends CrudRepository<UserData, Long> {

    /**
     *   private Long id;
     *     private String userName;
     *     private String firstName;
     *     private String lastName;
     *     private String email;
     *     private String password;
     *     private String passwordSalt;
     *     private long createdAt;
     *     private boolean isMuted = false;
     *     //private UserDetails details; // = new UserDetails(this);
     *     private RiskResult riskResult; // = new RiskResult(this);
     *     private Status status;// = new Status(this);
     *     private List<Role> role = new ArrayList<Role>();
     * @return
     */

    //@Nullable
    //@Query(value="select u.user_name from users u where not u.user_name='admin'", nativeQuery = true)
    @Query("select new com.kyc3.icotool.dataTypes.UserDataWithoutBinary(u.id,u.userName," +
            "u.firstName,u.lastName,u.email,u.password,u.passwordSalt,u.createdAt,u.isMuted) from UserData u where not u.userName='admin'")
    Collection<UserDataWithoutBinary> findAllWithoutBinary();

    @Nullable
    UserData findByUserName(String userName);

    @Nullable
    UserData findByEmail(String email);

    @Nullable
    Optional<UserData> findById(Long id);

    @Modifying
    @Transactional
    public void deleteByUserName(String userName);
}

