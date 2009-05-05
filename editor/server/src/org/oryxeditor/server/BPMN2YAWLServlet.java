package org.oryxeditor.server;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import de.hpi.bpmn.BPMNDiagram;
import de.hpi.bpmn.rdf.BPMN11RDFImporter;
import de.hpi.bpmn.rdf.BPMNRDFImporter;

import de.hpi.bpmn2yawl.BPMN2YAWLConverter;
import de.hpi.bpmn2yawl.BPMN2YAWLSyntaxChecker;

/**
 * Copyright (c) 2009 Armin Zamani
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
public class BPMN2YAWLServlet extends HttpServlet {
	private static final long serialVersionUID = -4589304713944851993L;

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

		try {
			System.out.println("Hello, I am the Servlet.");
			//TODO correct mime type??
			res.setContentType("application/xhtml");

			String rdf = req.getParameter("data");

			DocumentBuilder builder;
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			builder = factory.newDocumentBuilder();
			Document document = builder.parse(new ByteArrayInputStream(rdf.getBytes("UTF-8")));
			
			processDocument(document, res.getWriter());
			
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}

	protected void processDocument(Document document, PrintWriter writer) {
		String type = new StencilSetUtil().getStencilSet(document);
		BPMNDiagram diagram = null;
		
		if (type.equals("bpmn.json"))
			diagram = new BPMNRDFImporter(document).loadBPMN();
		else if (type.equals("bpmn1.1.json"))
			diagram = new BPMN11RDFImporter(document).loadBPMN();

		//Syntax-Checking
		BPMN2YAWLSyntaxChecker checker = new BPMN2YAWLSyntaxChecker(diagram);
		checker.checkSyntax();
		
		BPMN2YAWLConverter converter = new BPMN2YAWLConverter();
		converter.translate(diagram);
		
		System.out.println("Hello world, I am the BPMN2YAWLservlet.");
	}
}
