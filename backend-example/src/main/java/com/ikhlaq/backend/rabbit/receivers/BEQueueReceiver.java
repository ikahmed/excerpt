package com.ikhlaq.backend.rabbit.receivers;

import com.ikhlaq.backend.dtos.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.ikhlaq.backend.queue.be_ikhlaq.dtos.escrowPerson;
import com.ikhlaq.backend.queue.be_ikhlaq.dtos.escrowVehicle;
import com.ikhlaq.backend.queue.be_ikhlaq.dtos.PrintPermit;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class BEQueueReceiver {
	
	@Autowired
	PermitService permitService;
	

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@RabbitListener(id = "recieveQueue", containerFactory = "rabbitListenerContainerFactory", queues = "#{recieveQueue}")
	public void handleMessage(@Payload Object message,
			@Header("Request") String requestStr) throws Exception {


		ObjectMapper mapper = new ObjectMapper();

		Request request = mapper.readValue(requestStr, Request.class);

		try {
			if (request.getCategory().equalsIgnoreCase("permit")) {
				Permit printPermit =(Permit)message;
				permitService.updatePermitWithPrintPermit(printPermit);
         
			}else if(request.getCategory().equalsIgnoreCase("escrowVehicle")) {
				EscrowVehicle escrowVehicle  =(escrowVehicle)message;
				permitService.saveescrowVehicle(escrowVehicle);
				
			}else if(request.getCategory().equalsIgnoreCase("escrowPerson")) {
				EscrowPerson escrowPerson =(escrowPerson)message;
				permitService.saveescrowPerson(escrowPerson);
				
			}
			

		} catch (Exception e) {
			logger.error("Error in reading the queue", e);
			throw e;
		}
	}
}
