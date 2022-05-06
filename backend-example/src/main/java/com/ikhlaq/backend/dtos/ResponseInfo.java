package com.ikhlaq.backend.dtos;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="ResponseInfo")
public class ResponseInfo {

	private String RequestID;
	private short Result;
	private String ResultMessage;
	private boolean ResultBool;

	public ResponseInfo(String RequestID, short Result, String ResultMessage, boolean ResultBool){
		this.RequestID = RequestID;
		this.Result = Result;
		this.ResultMessage = ResultMessage;
		this.ResultBool = ResultBool;
	}
	
	public ResponseInfo(){
		
	}
	
	@XmlElement(name="RequestID",required=false)
	public String getRequestID() {
		return RequestID;
	}
	public void setRequestID(String requestID) {
		RequestID = requestID;
	}
	@XmlElement(name="Result")
	public short getResult() {
		return Result;
	}
	public void setResult(short result) {
		Result = result;
	}
	@XmlElement(name="ResultMessage")
	public String getResultMessage() {
		return ResultMessage;
	}
	public void setResultMessage(String resultMessage) {
		ResultMessage = resultMessage;
	}
	@XmlElement(name="ResultBool")
	public boolean isResultBool() {
		return ResultBool;
	}
	public void setResultBool(boolean resultBool) {
		ResultBool = resultBool;
	}
	
}
