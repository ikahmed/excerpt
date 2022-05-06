package com.ikhlaq.backend.dao.entities;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;


public class BEUser extends org.springframework.security.core.userdetails.User {
	
	private static final long serialVersionUID = 1L;
	


	public User getUser() {
		return user;
	}

	private final User user;

    public BEUser(User user, Collection<? extends GrantedAuthority> authorities) {
        super(user.getUsername(), user.getPassword(), authorities);
        this.user = user;
    }

    public BEUser(User user, Collection<? extends GrantedAuthority> authorities, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked) {
        super(user.getUsername(), user.getPassword(), user.getActivity(), accountNonExpired,  credentialsNonExpired, accountNonLocked, authorities);
        this.user = user;
    }


}
