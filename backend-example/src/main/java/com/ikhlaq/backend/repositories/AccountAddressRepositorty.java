package com.ikhlaq.backend.repositories;


import com.ikhlaq.backend.dao.entities.Account;
import org.springframework.data.repository.CrudRepository;


public interface AccountAddressRepositorty extends
CrudRepository<AccountAddress, Integer>  {

	AccountAddress findByAccount(Account account);
}

