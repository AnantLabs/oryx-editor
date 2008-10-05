/**
 * Copyright (c) 2008
 * Willi Tscheschner
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

// define namespace
if(!Repository) var Repository = {};
if(!Repository.Plugins) Repository.Plugins = {};

/**
 * Supplies filtering by model type (stencil set)
 * Note: Only stencil sets defined in the stencilsets.json can be selected as filter
 */

Repository.Plugins.TagInfo = {
	construct: function( facade ) {
		// Set the name
		this.name = Repository.I18N.TagInfo.name;

		this.dataUris = ["/tags"];
				
		// call Plugin super class
		arguments.callee.$.construct.apply(this, arguments); 

	},
	
	render: function( modelData ){
		
		var oneIsSelected = $H(modelData).keys().length !== 0;
		
		
		var buttons = [];
		
		var modelTags = $H(modelData).values().map(function( tags ){ return tags.userTags }).flatten().compact().uniq();
		modelTags.each(function(tag){
			buttons.push( new Ext.LinkButton({text:tag, click:this._onTagClick.bind(this, tag), style:'display:block'}) );
		}.bind(this))
		
		
		// Generate a new panel for the buttons
		var buttonsPanel = new Ext.Panel({
					style	: 'padding-bottom:10px;border:none;',
					items	: buttons
				})

		// Generate a new panel for the add form
		var addPanel = new Ext.Panel({
					layout	: 'absolute',
					style	: 'border:none;',
					height	: 40,
					items	: [
								new Ext.form.TextField({
											x		: 0, 
											y		: 0, 
											width	: 100,
											emptyText : 'New Tag',
											disabled  : oneIsSelected,  
										}),
								new Ext.Panel({
											x		: 100, 
											y		: 0,
											style	: 'border:none;',  
											items:[ new Ext.Button({
															text 	: 'Add',
															disabled 	: oneIsSelected, 
															listeners	: {
																click : function(){
																	this._addTag(Ext.getCmp('repository_taginfo_textfield').getValue())
																}.bind(this)
															}
														}) ]})
							]
				});


		var newPanel = new Ext.Panel({
					style	: 'padding:10px; border:none;', 
					items	: [buttonsPanel, addPanel]
				})
		
		// Removes the old child ...
		this.panel.remove( this.panel.getComponent(0) )
		// ... before the new child gets added		
		this.panel.add( panel );
		// Update layouting
		this.panel.doLayout();

	},
	
	_onTagClick: function( tag ){
		
		// TODO: Implementing the deletion of a tag
		
	},	
	
	_addTag: function( tagname ){
		
		if( !tagname || tagname.length <= 0 ){ return }
		// TODO: Implementing the adding of a new tag
		
	}
};

Repository.Plugins.TagInfo = Repository.Core.ContextPlugin.extend(Repository.Plugins.TagInfo);
