package org.oryxeditor.server;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.fop.svg.PDFTranscoder;

public class AlternativesRenderer extends HttpServlet {

    private static final long serialVersionUID = 8526319871562210085L;

    private String basefilename;
    private String inFile;
    private String outFile;

    protected void doPost(HttpServletRequest req, HttpServletResponse res) {

	String resource = req.getParameter("resource");
	String data = req.getParameter("data");
	String format = req.getParameter("format");

	String tmpFolder = this.getServletContext().getRealPath("/")
		+ File.separator + "tmp" + File.separator;

	this.basefilename = String.valueOf(System.currentTimeMillis());
	this.inFile = tmpFolder + this.basefilename + ".svg";
	this.outFile = tmpFolder + this.basefilename + ".pdf";

	System.out.println(inFile);

	try {

	    // store model in temporary svg file.
	    BufferedWriter out = new BufferedWriter(new FileWriter(inFile));
	    out.write(data);
	    out.close();
	    makePDF();
	    res.getOutputStream().print("./tmp/" + this.basefilename + ".pdf");

	} catch (Exception e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }

    protected void makePDF() throws TranscoderException, IOException {

	PDFTranscoder transcoder = new PDFTranscoder();

	InputStream in = new java.io.FileInputStream(inFile);

	try {
	    TranscoderInput input = new TranscoderInput(in);

	    // Setup output
	    OutputStream out = new java.io.FileOutputStream(outFile);
	    out = new java.io.BufferedOutputStream(out);
	    try {
		TranscoderOutput output = new TranscoderOutput(out);

		// Do the transformation
		transcoder.transcode(input, output);
	    } finally {
		out.close();
	    }
	} finally {
	    in.close();
	}
    }

}
