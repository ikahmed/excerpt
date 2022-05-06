
package com.ikhlaq.backend.validator;

import java.io.File;
import java.io.IOException;

import org.apache.tika.Tika;
import org.springframework.web.multipart.MultipartFile;


public class FileTypeValidator {

    public static String detectMimeType(final File file) throws IOException {
	
	Tika tika = new Tika();
	// detecting the file type using detect method
	String filetype = tika.detect(file);

	return filetype;

    }

    public static String detectMimeType(final MultipartFile multipartFile) throws IOException {
	
	  Tika tika = new Tika();
	  String detectedType = tika.detect(multipartFile.getBytes());

	return detectedType;

    }

}
