package com.ikhlaq.backend;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.SessionTrackingMode;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.ikhlaq.backend.handler.CustomAccessDeniedHandler;
import com.ikhlaq.backend.utils.LogUtils;

@Configuration
@EnableWebSecurity()
@EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled=true)
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	 @Autowired
	 @Qualifier("authenticationProvider")
	 AuthenticationProvider authenticationProvider;
	 
	 @Autowired
	 public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
	        auth.authenticationProvider(authenticationProvider);
	 }
	 
	 @Bean
	 public AccessDeniedHandler accessDeniedHandler(){
	     return new CustomAccessDeniedHandler();
	 }

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		String[] resources = { "/css/**", "/js/**", "/images/**", "/fonts/**" ,"/assets/**","/*.js","/*.js.map","favicon.ico" };
		http.authorizeRequests().antMatchers(HttpMethod.POST, postPublicApi).permitAll().antMatchers(HttpMethod.GET, getPublicApi).permitAll().
		antMatchers(resources).permitAll().antMatchers("/**").authenticated().and().formLogin()
		.loginPage("/login").loginProcessingUrl("/").usernameParameter("username")
		.passwordParameter("password").failureUrl("/login?error").successForwardUrl("/index").and().logout(). // logout configuration
		logoutUrl("/logout").logoutSuccessUrl("/login").permitAll().and()
		.addFilterBefore(new RecaptchaResponseFilter(), BasicAuthenticationFilter.class)
		.addFilterBefore(new XSSFilter(), BasicAuthenticationFilter.class).exceptionHandling().accessDeniedHandler(accessDeniedHandler()).accessDeniedPage("/error").authenticationEntryPoint(new RestAuthenticationEntryPoint()).
		 and().sessionManagement().maximumSessions(1)
    	.expiredUrl("/login?expired=2")
    	.sessionRegistry(sessionRegistry());
		http.csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
}

	@Bean
    SessionRegistry sessionRegistry() {			
        return new SessionRegistryImpl();
    }
	
    @Bean
    public static ServletListenerRegistrationBean httpSessionEventPublisher() {		//(5)
        return new ServletListenerRegistrationBean(new HttpSessionEventPublisher());
    }
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurerAdapter() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**");
			}
		};
	}
}

class RestAuthenticationEntryPoint implements AuthenticationEntryPoint{

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
			throws IOException, ServletException {
		if(request.getRequestURL().toString().contains("/html/")) {
			response.sendError( HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized" );
		}
		else{
			response.sendRedirect("/login");
		}
		
	}
}