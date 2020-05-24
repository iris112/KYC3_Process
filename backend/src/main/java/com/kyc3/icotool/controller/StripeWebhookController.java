package com.kyc3.icotool.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.model.Source;
import com.stripe.net.Webhook;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.TimeUnit;


@Slf4j
@RestController
@RequestMapping("/stripe/webhook")
public class StripeWebhookController {

    @PostMapping
    public void processWebHook(@RequestHeader("Stripe-Signature") String stripeSignature, @RequestBody String json) throws SignatureVerificationException {
        String stripeWebhookSecret="whsec_QmJ1bh6E9wIyAM3GpzAHO80xjjvqcXBE";

        Event event = Webhook.constructEvent(json, stripeSignature, stripeWebhookSecret);
        String eventType = event.getType();

        log.info("EVENT TYPE: {} ", eventType);
        System.out.println(event);

        if(eventType.equals("charge.succeeded")){
            System.out.println("Payment succeeded, trigger contract.");
        }


    }
}
