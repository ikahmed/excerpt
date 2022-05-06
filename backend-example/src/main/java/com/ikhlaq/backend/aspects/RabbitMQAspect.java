package com.ikhlaq.backend.aspects;

import com.ikhlaq.backend.dao.entities.Account;
import com.ikhlaq.backend.dao.entities.Notice;
import com.ikhlaq.backend.enums.RequestAction;
import com.ikhlaq.backend.exceptions.NotSupportedMessage;
import com.ikhlaq.backend.services.interfaces.RabbitMQSendService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Aspect
@Component
public class RabbitMQAspect {

    @Autowired
    private RabbitMQSendService rabbitMQSendService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Around("execution(* com.ikhlaq.be.services.impl.RegistrationServiceImpl.generateAccountForExpectedAccount(..) )")
    public Object aroundAccountCreation(ProceedingJoinPoint pjp) throws Throwable {

	Object[] obj = pjp.getArgs();

	Account account = (Account) pjp.proceed(new Object[] { obj[0], obj[1], obj[2], obj[3] });

	com.ikhlaq.backend.queue.dtos.Account acc = new com.ikhlaq.backend.queue.dtos.Account();
	try {
	    acc = acc.getAccountFromEntity(account);
	} catch (Exception ex) {
	    logger.error("Error while generating account dto from entity", ex);
	}
	try {
	    rabbitMQSendService.send(acc, RequestAction.ISSUE.getDescription());
	} catch (NotSupportedMessage e) {
	    logger.error("unsupported message ", e);
	} catch (Exception e) {
	    logger.error("Exception message ", e);
	}
	return account;
    }

    @Around("execution(* com.ikhlaq.be.services.impl.PermitServiceImpl.save(..) )")
    public Object aroundSavePermit(ProceedingJoinPoint pjp) throws Throwable {
	logger.info("After executing the permit  will go for sending to the queue");
	Object[] obj = pjp.getArgs();

	Permit permit = (Permit) pjp.proceed(new Object[] { obj[0] });

	com.ikhlaq.backend.queue.dtos.Permit permitDto = new com.ikhlaq.backend.queue.dtos.Permit();
	try {
	    permitDto = permitDto.getPermitFromEntity(permit);
	} catch (Exception ex) {
	    logger.error("Error while generating permitDto from entity", ex);
	}

	try {
	    rabbitMQSendService.send(permitDto, RequestAction.ISSUE.getDescription());
	} catch (NotSupportedMessage e) {
	    logger.error("unsupported message ", e);
	} catch (Exception e) {
	    logger.error("Exception message ", e);
	}
	return permit;
    }

    /**
     * @param pjp
     * @return Notice
     * @throws Throwable
     * Send to be queue whenever a Notice is added or updated 
     */
    @Around("execution(* com.ikhlaq.be.services.impl.NoticeServiceImpl.save(..) )")
    public Object aroundSaveNotice(ProceedingJoinPoint pjp) throws Throwable {
	logger.info("After executing save vessel will go for sending to the queue");
	Object[] obj = pjp.getArgs();

	Notice Notice = (Notice) pjp.proceed(new Object[] { obj[0] });

	com.ikhlaq.backend.queue.dtos.Notice NoticeDto = new com.ikhlaq.backend.queue.dtos.Notice();
	try {
	    NoticeDto = NoticeDto.getNoticeFromEntity(Notice);
	} catch (Exception ex) {
	    logger.error("Error while generating NoticeDto from entity", ex);
	}

	try {
	    rabbitMQSendService.send(NoticeDto, RequestAction.ISSUE.getDescription());
	} catch (NotSupportedMessage e) {
	    logger.error("unsupported message ", e);
	} catch (Exception e) {
	    logger.error("Exception message ", e);
	}
	return Notice;
    }

}
