package com.ikhlaq.backend;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory.CacheMode;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitConfig {

	@Value("${spring.rabbitmq.virtualHost}")
	private String virtualHost;

	@Value("${spring.rabbitmq.port}")
	private int port;

	@Value("${spring.rabbitmq.sessionCacheSize}")
	private int sessionCacheSize;

	@Value("${spring.rabbitmq.username}")
	private String username;

	@Value("${spring.rabbitmq.password}")
	private String password;

	@Value("${spring.rabbitmq.host}")
	private String host;

	@Value("${spring.rabbitmq.recieveQueueName}")
	private String recieveQueueName;

	@Value("${spring.rabbitmq.sendQueueName}")
	private String sendQueueName;

	@Value("${spring.rabbitmq.concurrent.consumers}")
	public int concurrent_consumers;

	@Value("${spring.rabbitmq.max.concurrent.consumers}")
	public int max_concurrent_consumers;

	@Bean
	public ConnectionFactory connectionFactory() {
		CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory(
				host);
		cachingConnectionFactory.setUsername(username);
		cachingConnectionFactory.setPassword(password);
		cachingConnectionFactory.setVirtualHost(virtualHost);
		cachingConnectionFactory.setPort(port);
		cachingConnectionFactory.setConnectionCacheSize(sessionCacheSize);
		cachingConnectionFactory.setCacheMode(CacheMode.CONNECTION);
		return cachingConnectionFactory;
	}

	@Bean
	public AmqpAdmin amqpAdmin() {
		return new RabbitAdmin(connectionFactory());
	}

	@Bean
	public RabbitTemplate rabbitTemplate() {
		RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory());
		rabbitTemplate.setRoutingKey(sendQueueName);
		rabbitTemplate.setChannelTransacted(true);
		rabbitTemplate.setMessageConverter(jsonMessageConverter());
		return rabbitTemplate;
	}

	@Bean
	public Queue recieveQueue() {
		return new Queue(recieveQueueName);
	}

	@Bean
	public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory() {
		SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
		factory.setConnectionFactory(connectionFactory());
		factory.setConcurrentConsumers(concurrent_consumers);
		factory.setMaxConcurrentConsumers(max_concurrent_consumers);
		factory.setMessageConverter(jsonMessageConverter());
		return factory;
	}

	@Bean
	public MessageConverter jsonMessageConverter() {
		final Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
		return converter;
	}

}
