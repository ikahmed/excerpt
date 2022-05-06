package com.ikhlaq.backend.repositories;

import java.util.List;

import com.ikhlaq.backend.dao.entities.Account;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
//import com.ikhlaq.be.dao.entities.AccountDetail;

public interface AccountRepository extends
		CrudRepository<Account, Integer> {
	
	@Query("SELECT acc FROM Account acc  WHERE acc.parent=:parent and acc.activity= true")
	public List<Account> findAllAccountsByParent(@Param("parent") int parent);
	

	@Modifying
	@Query("update Account a set a.pointsBalance = :point where a.accountId = :accountId")
	@Transactional
	int setPointsBalanceByAccountId(@Param("accountId") int accountId, @Param("point") Long point);

}
