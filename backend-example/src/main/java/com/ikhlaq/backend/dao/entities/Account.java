package com.ikhlaq.backend.dao.entities;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;



import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class Account implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer accountId;

	@JsonIgnore
	private Byte status;

	@JsonIgnore
	private String foriegnName;

	@JsonIgnore
	private String foriegnShortName;

	@JsonIgnore
	private Short businessType;

	@JsonIgnore
	private Short legalEntityType;

	@JsonIgnore
	private Integer parentId;

	@JsonIgnore
	private String englishName;

	@JsonIgnore
	private String englishShortName;

	@JsonIgnore
	private Long ministryNumber;

	@JsonIgnore
	private Byte systemId;

	@JsonIgnore
	private Integer createdBy;
	
	private Long pointsBalance;
	
	@JsonIgnore
	@Temporal(TemporalType.TIMESTAMP)
	private Date creationDate;

	@JsonIgnore
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdateDate;

	@JsonIgnore
	private Integer lastUpdatedBy;

	@JsonIgnore
	private Boolean activity;
	

	@JsonIgnore
	@OneToOne(mappedBy = "account", fetch = FetchType.LAZY ,cascade = CascadeType.ALL)
	private AccountAddress accountAddress;

	@JsonIgnore
	@OneToMany(mappedBy = "account",cascade = CascadeType.ALL)
	private List<Registration> registrations;

	public Account() {
	}

	public Integer getAccountId() {
		return accountId;
	}

	public void setAccountId(Integer accountId) {
		this.accountId = accountId;
	}

	public Byte getStatus() {
		return status;
	}

	public void setStatus(Byte status) {
		this.status = status;
	}

	public Long getministryNumber() {
		return ministryNumber;
	}

	public void setministryNumber(Long ministryNumber) {
		this.ministryNumber = ministryNumber;
	}

	public Byte getSystemId() {
		return systemId;
	}

	public void setSystemId(Byte systemId) {
		this.systemId = systemId;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public Boolean isActivity() {
		return activity;
	}

	public void setActivity(Boolean activity) {
		this.activity = activity;
	}

	public List<Registration> getRegistrations() {
		return this.registrations;
	}

	public void setRegistrations(List<Registration> registrations) {
		this.registrations = registrations;
	}

	public Registration addRegistration(Registration registration) {
		getRegistrations().add(registration);
		registration.setAccount(this);
		return registration;
	}

	public Registration removeRegistration(Registration registration) {
		getRegistrations().remove(registration);
		registration.setAccount(null);
		return registration;
	}

	public String getForiegnName() {
		return foriegnName;
	}

	public void setForiegnName(String foriegnName) {
		this.foriegnName = foriegnName;
	}

	public String getForiegnShortName() {
		return foriegnShortName;
	}

	public void setForiegnShortName(String foriegnShortName) {
		this.foriegnShortName = foriegnShortName;
	}

	public Short getBusinessType() {
		return businessType;
	}

	public void setBusinessType(Short businessType) {
		this.businessType = businessType;
	}

	public Short getLegalEntityType() {
		return legalEntityType;
	}

	public void setLegalEntityType(Short legalEntityType) {
		this.legalEntityType = legalEntityType;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public String getEnglishName() {
		return englishName;
	}

	public void setEnglishName(String englishName) {
		this.englishName = englishName;
	}

	public String getEnglishShortName() {
		return englishShortName;
	}

	public void setEnglishShortName(String englishShortName) {
		this.englishShortName = englishShortName;
	}

	public Integer getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Integer createdBy) {
		this.createdBy = createdBy;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public Integer getLastUpdatedBy() {
		return lastUpdatedBy;
	}

	public void setLastUpdatedBy(Integer lastUpdatedBy) {
		this.lastUpdatedBy = lastUpdatedBy;
	}

	public Long getPointsBalance() {
		return pointsBalance;
	}

	public void setPointsBalance(Long pointsBalance) {
		this.pointsBalance = pointsBalance;
	}

	public Boolean getActivity() {
		return activity;
	}

	public AccountAddress getAccountAddress() {
		return accountAddress;
	}

	public void setAccountAddress(AccountAddress accountAddress) {
		this.accountAddress = accountAddress;
	}

}