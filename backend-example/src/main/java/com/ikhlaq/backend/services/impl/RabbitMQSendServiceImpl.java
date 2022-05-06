package com.ikhlaq.backend.services.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import com.ikhlaq.backend.dtos.Request;
import com.ikhlaq.backend.enums.RequestActionType;
import com.ikhlaq.backend.exceptions.NotSupportedMessage;
import com.ikhlaq.backend.services.interfaces.RabbitMQSendService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class RabbitMQSendServiceImpl implements RabbitMQSendService {

	@Autowired
	RabbitTemplate rabbitTemplate;

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public void send(Object object, String action, String type)
			throws NotSupportedMessage {

		logger.info("sending message to a queue: action is " + action);

		rabbitTemplate.convertAndSend(object, new MessagePostProcessor() {

			@Override
			public Message postProcessMessage(Message message)
					throws AmqpException {
				message.getMessageProperties().setContentEncoding("UTF-8");

				message.getMessageProperties().setHeader(
						"Request",
						getJsonOfRequest(createRequest(object.getClass()
								.getSimpleName(), action, type)));
               
                message.getMessageProperties().setHeader("ReferenceId", UUID.randomUUID());
				message.getMessageProperties().setContentType(
						MessageProperties.CONTENT_TYPE_JSON);
				return message;
			}
		});

	}

	@Override
	public void send(Object object, String action) throws NotSupportedMessage {
		send(object, action, RequestActionType.TRANSACTION.getDescription());
	}

	@Override
	public RabbitTemplate getRabbitTemplate() {
		return rabbitTemplate;

	}

	@Override
	public Request createRequest(String category, String action, String type) {
		Request request = new Request();
		request.setCategory(category);
		request.setAction(action);
		request.setType(type);
		
		String pattern = "yyyy-MM-dd HH:mm:ss";
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);

		String date = simpleDateFormat.format(new Date());
		
		request.setTime(date);
		return request;

	}

	private String getJsonOfRequest(Request request) {
		String str = "";
		ObjectMapper mapper = new ObjectMapper();
		try {
			str = mapper.writeValueAsString(request);
		} catch (JsonProcessingException e) {
			logger.error("Failed to convert request object into json ", e);
		}
		return str;
	}

}
