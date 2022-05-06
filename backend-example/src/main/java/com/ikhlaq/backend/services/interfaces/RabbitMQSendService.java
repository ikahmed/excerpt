package com.ikhlaq.backend.services.interfaces;

import com.ikhlaq.backend.dtos.Request;
import com.ikhlaq.backend.exceptions.NotSupportedMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;


public interface RabbitMQSendService {
	
	public void send(Object object, String action, String type)
			throws NotSupportedMessage;
	public void send(Object object, String action) throws NotSupportedMessage;
	
	public RabbitTemplate getRabbitTemplate();
	
	public Request createRequest(String category, String action, String type);
}

