/***************************************
 * Copyright (c) 2008
 * Ole Eckermann
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
****************************************/

package org.b3mn.poem;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse; 

import org.b3mn.poem.handler.HandlerBase;



import com.sun.org.apache.xalan.internal.xsltc.compiler.Pattern;

public class PoEMServlet extends HttpServlet {
	private static final long serialVersionUID = -9128262564769832181L;
	
	public PoEMServlet() {
	}
	
	// Returns the identity of the model that is referenced in the request URL or null if 
	// the request doesn't contain an id
	protected Identity getObjectIdentity(String path) {
		// Extract id from the request URL 
		Pattern pattern = Pattern.compile("(\\/([0-9]+))?\\/([^\\/]+\\/?)$");
		Matcher matcher = pattern.matcher(path);
		String id = matcher.group(2);
		// If the request doesn't contain an id
		if (id != null) {
			return null;
		}
		else {
			// TODO: Seems to be quick and dirty
			return Identity.instance("data/model/"+id);
		}
	}
	
	// Returns an initialized instance of the requested handler  
	protected HandlerBase getHandler(String path) {
		// Extract handler name from the request URL 
		Pattern pattern = Pattern.compile("(\\/([0-9]+))?\\/([^\\/]+\\/?)$");
		Matcher matcher = pattern.matcher(path);
		String name = matcher.group(3);
		// If the request doesn't contain an id
		if (name != null) {
			return null;
		}
		else {
			// Get class name of the handler from the database
			String className = (String) Persistance.getSession().
			createSQLQuery("SELECT className FROM plugin WHERE rel= :rel")
			.setString("rel", name)
			.uniqueResult();
			Persistance.commit();
			// If handler exists 
			if (className != null ) {
				// Create new handler instance with Java reflection
				Class handlerClass = Class.forName(className);
				// TODO: Check if handlerClass is derived from HandlerBase and use 
				// java.lang.reflect.Constructor.newInstance() to create the instance
				return (HandlerBase) handlerClass.newInstance();
			}
			else {
				return null; // TODO: May implement an handler exception 
			}
				
		}
		
	}

	protected void dispatch(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException {
		String openId =  (String) request.getSession().getAttribute("openid"); 
		Identity subject = Identity.instance(openId);
		Identity object = this.getObjectIdentity(request.getPathInfo());
		HandlerBase handler = this.getHandler(request.getPathInfo()); 
		handler.setServletContext(this.getServletContext()); // Initialize handler with ServletContext
		if (request.getMethod().equals("GET")) {
			handler.doGet(request, response, subject, object);
		}
		if (request.getMethod().equals("POST")) {
			handler.doPost(request, response, subject, object);
		}
		if (request.getMethod().equals("PUT")) {
			handler.doPut(request, response, subject, object);
		}
		if (request.getMethod().equals("DELETE")) {
			handler.doDelete(request, response, subject, object);
		}
	}
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		dispatch(request,response);
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		dispatch(request,response);
	}
	
	@Override
	protected void doPut(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		dispatch(request,response);
	}
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		dispatch(request,response);
	}

}