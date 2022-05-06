package com.ikhlaq.basic;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


public class Compressor {

    static final int BUFFER = 2048;

    public void compress(String path,String zipfilename) {
        try {
            BufferedInputStream origin = null;
            File compressedFile = new File(zipfilename);
            FileOutputStream dest = new FileOutputStream(compressedFile);
            ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
            byte data[] = new byte[BUFFER];
            File f = new File(path);
            if(!f.isDirectory()) {
                f.mkdir();
            }

            String files[] = f.list();

            for (int i = 0; i < files.length; i++) {
                FileInputStream fi = new FileInputStream(path+File.separator+files[i]);
                origin = new BufferedInputStream(fi, BUFFER);
                ZipEntry entry = new ZipEntry(files[i]);
                out.putNextEntry(entry);
                int count;
                while ((count = origin.read(data, 0, BUFFER)) != -1) {
                    out.write(data, 0, count);
                }
                origin.close();
            }
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}