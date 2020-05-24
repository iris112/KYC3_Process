package com.kyc3.icotool;

import com.kyc3.icotool.controller.UserCreator;
import com.kyc3.icotool.dataTypes.Role;
import com.kyc3.icotool.dataTypes.UserData;
import com.kyc3.icotool.payload.UserPayload;
import com.kyc3.icotool.repositories.RoleRepository;
import com.kyc3.icotool.repositories.UserDataRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.websocket.WebSocketService;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.tx.Contract;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.ConnectException;
import java.math.BigInteger;
import javax.annotation.PostConstruct;
import java.util.Arrays;

@SpringBootApplication
@Slf4j
public class Application {

    private Web3j web3j;
    private WebSocketService web3jService;
    public static final Event TRANSFER_EVENT = new Event("Transfer", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Uint256>() {}));
    ;

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    CommandLineRunner init (UserDataRepository userDataRepository, RoleRepository roleRepository) {
        return args -> {
            UserData adminUserData = null;
            UserData kyc3UserData = null;
            adminUserData = userDataRepository.findByUserName("admin");
            if (adminUserData == null) {
                Role r = Role.builder()
                        .expirationTimestamp(System.currentTimeMillis() + 3600*24*365*1000*1000)
                        .roleName("admin")
                        .userName("admin")
                        .build();
                UserPayload userPayload = new UserPayload("admin", "", "", "", "administrator", "admin");
                adminUserData = UserCreator.createUser(userPayload);
                adminUserData.addRole(r);
                userDataRepository.save(adminUserData);

                Role re = Role.builder()
                .expirationTimestamp(System.currentTimeMillis() + 3600*24*365*1000*1000)
                .roleName("admin")
                .userName("kyc3")
                .build();
                UserPayload kyc3userPayload = new UserPayload("kyc3", "", "", "email", "TpZXIVBcPLH9n6T9947K8w==", "admin");
                kyc3UserData = UserCreator.createUser(kyc3userPayload);
                kyc3UserData.addRole(re);
                userDataRepository.save(kyc3UserData);
            }
        };
    }

    @PostConstruct
    public void listen() {
        try {
            web3jService = new WebSocketService("wss://ropsten.infura.io/ws", true);
            web3jService.connect();
            web3j = Web3j.build(web3jService);
        } catch (IOException e) {
            log.error("Error connect websocket", e);
        }

        // EthFilter filter = new EthFilter(DefaultBlockParameterName.EARLIEST, DefaultBlockParameterName.LATEST, "0xd4a079232c97d40a3a47e0973c49f297e50d2eb6");
        // filter.addSingleTopic(EventEncoder.encode(TRANSFER_EVENT));

        // web3j.ethLogFlowable(filter).subscribe(transLog -> {
        //     // log.info("New Transfer: log={}", transLog);
        //     // Contract.EventValuesWithLog eventValues = Contract.extractEventParametersWithLog(TRANSFER_EVENT, transLog);
        //     // String from = (String) eventValues.getIndexedValues().get(0).getValue();
        //     // String to = (String) eventValues.getIndexedValues().get(1).getValue();
        //     // BigInteger value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();

        //     // log.info("New Transfer: block={}, from={}, to={}, value={}, Data={}", transLog.getBlockNumber(), from, to, value, transLog.getData());
        // });

        // web3j.transactionFlowable().subscribe(tx -> {
        //     log.info("New tx: id={}, block={}, from={}, to={}, value={}", tx.getHash(), tx.getBlockHash(), tx.getFrom(), tx.getTo(), tx.getValue().intValue());
        // });

        log.info("Subscribed");
    }
}
