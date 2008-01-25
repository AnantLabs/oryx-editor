/**
 * Copyright (c) 2006
 * Martin Czuchra, Nicolas Peters, Daniel Polak, Willi Tscheschner
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
 **/

/**
 * Init namespace
 */
if(!ORYX) {var ORYX = {};}
if(!ORYX.Core) {ORYX.Core = {};}
if(!ORYX.Core.StencilSet) {ORYX.Core.StencilSet = {};}

/**
 * This class represents a stencil set. It offers methods for accessing
 *  the attributes of the stencil set description JSON file and the stencil set's
 *  stencils.
 */
ORYX.Core.StencilSet.StencilSet = Clazz.extend({

	/**
	 * Constructor
	 * @param source {URL} A reference to the stencil set specification.
	 *
	 */
	construct: function(source) {
		arguments.callee.$.construct.apply(this, arguments);

		if(!source) {throw "ORYX.Core.StencilSet.StencilSet(construct): Parameter 'source' is not defined."; }
		
		if(source.endsWith("/")) {
			source = source.substr(0, source.length-1);
		}

		this._source = source;
		this._baseUrl = source.substring(0, source.lastIndexOf("/")+1);
		
		this._jsonObject;

		this._stencils = new Hash();

		new Ajax.Request(source, {asynchronous:false, method:'get', onSuccess:this._init.bind(this), onFailure:this._cancelInit.bind(this)});
	},
	
	/**
	 * @param {ORYX.Core.StencilSet.StencilSet} stencilSet
	 * @return {Boolean} True, if stencil set has the same namespace.
	 */
	equals: function(stencilSet) {
		return (this.namespace() === stencilSet.namespace());
	},

	stencils: function() {
		return this._stencils.values();
	},

	nodes: function() {
		return this._stencils.values().findAll(function(stencil) {			return (stencil.type() === 'node')		});
	},

	edges: function() {
		return this._stencils.values().findAll(function(stencil) {			return (stencil.type() === 'edge')		});
	},

	stencil: function(id) {
		return this._stencils[id];
	},

	title: function() {
		return this._jsonObject.title;
	},

	description: function() {
		return this._jsonObject.description;
	},

	namespace: function() {
		return this._jsonObject.namespace;
	},
	
	jsonRules: function() {
		return this._jsonObject.rules;
	},
	
	source: function() {
		return this._source;
	},

	__handleStencilset: function(response) {
		
		try {
			// using eval instead of prototype's parsing,
			// since there are functions in this JSON.
			eval("this._jsonObject =" + response.responseText);
		} catch (e) {
			throw "Stenciset corrupt: "+e;
		}
		
		// assert it was parsed.
		if(!this._jsonObject) {
			throw "Error evaluating stencilset. It may be corrupt.";}

		with(this._jsonObject) {
			
			// assert there is a namespace.
			if(!namespace || namespace === "")
				throw "Namespace definition missing in stencilset.";

			if(!(stencils instanceof Array)) throw "Stencilset corrupt.";

			// assert namespace ends with '#'.
			if(!namespace.endsWith("#"))
				namespace = namespace + "#";

			// assert title and description are strings.
			if(!title) title = "";
			if(!description) description = "";
		}
	},
	
	/**
	 * This method is called when the HTTP request to get the requested stencil
	 * set succeeds. The response is supposed to be a JSON representation
	 * according to the stencil set specification.
	 * @param {Object} response The JSON representation according to the
	 * 			stencil set specification.
	 */
	_init: function(response) {

		// init and check consistency.
		this.__handleStencilset(response);
		
		// init each stencil
		$A(this._jsonObject.stencils).each((function(stencil) {

			// instantiate normally.
			var oStencil = new ORYX.Core.StencilSet.Stencil(
				stencil, this.namespace(), this._baseUrl, this);
			this._stencils[oStencil.id()] = oStencil;

		}).bind(this));
	},

	_cancelInit: function(response) {
		throw "ORYX.Core.StencilSet.StencilSet(_cancelInit): Requesting stencil set file failed.";	},

	toString: function() { return "StencilSet " + this.title() + " (" + this.namespace() + ")"; }
});