package com.ikhlaq.backend.web.controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.FileUploadBase.FileSizeLimitExceededException;
import org.apache.tomcat.util.http.fileupload.FileUploadBase.SizeLimitExceededException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.ikhlaq.backend.exceptions.AuthException;
import com.ikhlaq.backend.exceptions.DataValidationException;
import com.ikhlaq.backend.exceptions.DateException;
import com.ikhlaq.backend.exceptions.definiteException;

@RestControllerAdvice
@EnableWebMvc
public class ExceptionController {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@ExceptionHandler(value = { NoHandlerFoundException.class })
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ModelAndView handleNoHandlerFoundException(Exception ex,
			HttpServletRequest req) {
		logger.error("Request: " + req.getRequestURL() + " raised " + ex);

		ModelAndView mav = new ModelAndView();
		mav.addObject("exception", ex);
		mav.addObject("url", req.getRequestURL());
		mav.setViewName("index");
		return mav;

	}
	
	@ExceptionHandler(value = { AccessDeniedException.class })
	@ResponseStatus(HttpStatus.UNAUTHORIZED)
	public ModelAndView accessDeniedException(Exception ex,
			HttpServletRequest req) {
		logger.error("Request: " + req.getRequestURL() + " accessDeniedException " + ex);

		ModelAndView mav = new ModelAndView();
		mav.addObject("exception", ex);
		mav.addObject("url", req.getRequestURL());
		mav.setViewName("error");
		return mav;

	}
	
	@ExceptionHandler(Throwable.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String exception(final Throwable throwable, final Model model) {
        String errorMessage = (throwable != null ? throwable.getMessage() : "Unknown error");
        model.addAttribute("errorMessage", errorMessage);
        return "error";
    }

	@ExceptionHandler(value = { Exception.class })
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> unknownException(Exception ex,
			HttpServletRequest req) {
		logger.error("ExceptionController", ex);
		Map<String, String> error = new HashMap<>();
		error.put("path", req.getContextPath());
		error.put("message", "Some internal error occured");
		return error;

	}
	

	@ExceptionHandler(value = { AuthException.class })
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> authException(Exception ex,
			HttpServletRequest req) {
		logger.error("ExceptionController: AuthException", ex);
		Map<String, String> error = new HashMap<>();
		error.put("path", req.getContextPath());
		error.put("message", ex.getMessage());
		return error;

	}

	@ExceptionHandler(value = { DataValidationException.class })
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> dataValidationException(Exception ex,
			HttpServletRequest req) {
		logger.error("ExceptionController: DataValidationException", ex);
		Map<String, String> error = new HashMap<>();
		error.put("path", req.getContextPath());
		error.put("message", ex.getMessage());
		return error;

	}
	@ExceptionHandler(value = { definiteException.class })
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> definiteException(Exception ex,
			HttpServletRequest req) {
		logger.error("ExceptionController: definiteException", ex);
		Map<String, String> error = new HashMap<>();
		error.put("path", req.getContextPath());
		error.put("message", ex.getMessage());
		return error;

	}
	
	@ExceptionHandler(value = { DateException.class })
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> dataException(Exception ex,
			HttpServletRequest req) {
		logger.error("ExceptionController: DateException", ex);
		Map<String, String> error = new HashMap<>();
		error.put("path", req.getContextPath());
		error.put("message", ex.getMessage());
		return error;

	}
	
	@ExceptionHandler(value = { MultipartException.class, SizeLimitExceededException.class, FileSizeLimitExceededException.class })
	@ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
	public Map<String, String> fileException(Exception ex,
			HttpServletRequest req) {
		logger.error("ExceptionController: MultipartException", ex);
		Map<String, String> error = new HashMap<>();
		error.put("path", req.getContextPath());
		error.put("message", Result.VALIDATION_FAILURE_FILE_SIZE_LIMIT);
		return error;

	}
	

	@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Data integrity violation")
	@ExceptionHandler(DataIntegrityViolationException.class)
	public void conflict() {

	}

	@ExceptionHandler(value = { IllegalArgumentException.class })
	public void handleIllegalArgumentException(IllegalArgumentException e,
			HttpServletResponse response) throws IOException {
		response.sendError(HttpStatus.BAD_REQUEST.value());
	}
}