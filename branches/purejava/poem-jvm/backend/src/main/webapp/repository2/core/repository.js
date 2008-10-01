/**
 * Copyright (c) 2008
 * Bj�rn Wagner, Sven Wagner-Boysen
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

// init repository namespace

if(!Repository) var Repository = {};
if(!Repository.Core) Repository.Core = {};




Repository.Core.Repository = {
		construct : function(modelUris, currentUser) {
			arguments.callee.$.construct.apply(this, arguments); // call super class constructor
			this._currentUser = currentUser;
			this._publicUser = 'public';
			this._modelCache = new Repository.Core.DataCache(modelUris);

			
			// Event handler
			this._viewChangedHandler = new EventHandler();
			this._selectionChangedHandler = new EventHandler();
			this._filterChangedHandler = new EventHandler();
			
			// Plugin facade
			this._facade = null;
			
			// Model arrays
			this._filteredModels = this._modelCache.getIds();
			this._selectedModels = new Array();
			this._displayedModels = new Array();
			
			this._filters = new Hash();
			this._sorts = new Array();
			this._currentSort = -1;
			
			// UI
			this._controls = new Object();
			
			this._plugins = [];
			this._views = new Hash();
			this._currentView = "";
			
			this._bootstrapUI();
			this._loadPlugins();
			
		},
		
		getFacade : function() {
			if (!this._facade) {
				this._facade = {
						// Event handler
						registerOnViewChanged : this._viewChangedHandler.registerCallback.bind(this._viewChangedHandler),
						registerOnSelectionChanged : this._selectionChangedHandler.registerCallback.bind(this._selectionChangedHandler),
						registerOnFilterChanged : this._filterChangedHandler.registerCallback.bind(this._filterChangedHandler),
						
						modelCache : this._modelCache,
						
						applyFilter : this.applyFilter.bind(this),
						removeFilter : this.removeFilter.bind(this),
						getFilteredModels : this.getFilteredModels.bind(this),
						
						changeSelection : this.changeSelection.bind(this),
						getSelectedModels : this.getSelectedModels.bind(this),
						
						getDisplayedModels: this.getDisplayedModels.bind(this),						
						setDisplayedModels: this.setDisplayedModels.bind(this),
						
						
						createNewModel : this.createNewModel.bind(this),
						openModelInEditor : this.openModelInEditor.bind(this),
						
						registerPlugin: this.registerPlugin.bind(this)
				};
			}
			return this._facade;
		},
		
		
		isPublicUser: function() {
			return this._currentUser == this.publicUser;
		},
		
		applyFilter : function(name, parameters) {
			this._filters.set(name, parameters);
			var params = this._filters.clone();
			if (this._currentSort != -1) {
				params.put('sort', this._sorts[this._currentSort]);
			}
			new Ajax.Request("filter", 
					 {
						method: "get",
						asynchronous : false,
						onSuccess: function(transport) {
							this._filteredModels = eval(response.responseText);
							this._filterChangedHandler.invoke(this._filteredModels);
						}.bind(this),
						parameters : params,
					});
		},
		
		removeFilter : function(name) {
			if (this._filters.get(name) != undefined) {
				this._filters.unset(name);
				this.updateFilteredIds();
			}
		},
		
		updateFilteredIds : function() {
			if (this._filters.keys().length > 0) {
				var filterResult = this._filters.get(this._filters.keys()[0]);
				// filterresult is somehow an intersection between the results of all filters
				filterResult.each(function(pair) {
					var modelId = pair.value;
					this._filters.each(function(filterPair){
						var result = filterPair.value;
						if (result.indexOf(modelId) == -1) {
							filterResult = filterResult.without(modelId);
							return;
						}
					}.bind(this));
				}.bind(this));
				this._filterChangedHandler.invoke(filterResult);
				this._filteredModels = filterResult;
			} else {

			}
		},
		
		getFilteredModels : function(){
			return this._filteredModels;
		},		
		
		getViews : function(){
			return this._views;
		},
		
		_switchView : function(view) {
			if(this._currentView instanceof Repository.Core.ViewPlugin)
				this._currentView.disable();
			
			view.enable();
			view.preRender(this.getDisplayedModels());
			this._currentView = view;
		},
		
		changeSelection : function(selectedIds) {
			selArray =  $A(selectedIds); // Make sure that it's an array
			if (selArray.length > 1) {
				selArray = selArray.reduce(); // remove double entries
			}
			this._selectedModels = selArray;
			this._selectionChangedHandler.invoke(selArray);
		},
		
		getSelectedModels : function() {
			return this._selectedModels;
		},
		
		getDisplayedModels : function() {
			return this._displayedModels;
		},
		
		setDisplayedModels : function(modelIds) {
			displArray =  $A(modelIds); // Make sure that it's an array
			if (displArray.length > 1) {
				displArray = displArray.reduce(); // remove double entries
			}
			this._displayedModels = displArray;
		},
		
		createNewModel : function(stencilsetUrl) {
			
			var callback = function() {
				var url = './new' + '?stencilset=' + stencilsetUrl;
				var editor = window.open(url);
				
				window.setTimeout(function(){
					if (!editor || !editor.opener || editor.closed) {
						Ext.MessageBox.alert(Repository.I18N.Repository.windowTitle, Repository.I18N.Repository.windowTimeoutMessage).setIcon(Ext.MessageBox.QUESTION)
					}
				}, 5000);
			}
		
			if(this.isPublicUser()){
	
				Ext.Msg.show({
				   title: Repository.I18N.Repository.noSaveTitle,
				   msg: Repository.I18N.Repository.noSaveMessage,
				   buttons: Ext.Msg.YESNO,
				   fn: function(btn, text){
				   		if(btn == Repository.I18N.Repository.yes){
							callback();
						}
				   }
				});
						
			} else {
				callback();
			}
		},
		
		openModelInEditor : function (model_id) {
		
		},
		
		/**
		 * register plugin on panel for this plugin type and returns a panel, where the plugin can render itselfs. 
		 * @param {Object} plugin
		 */
		registerPlugin: function(plugin) {
			var pluginPanel = null;
			if(plugin instanceof Repository.Core.ContextPlugin) {
				pluginPanel = this._registerPluginOnPanel(plugin.name, "right");
			} else {
				if(plugin instanceof Repository.Core.ContextFreePlugin) {
					pluginPanel = this._registerPluginOnPanel(plugin.name, "left");
				} else {
					if(plugin instanceof Repository.Core.ViewPlugin) {
						return pluginPanel = this._registerPluginOnView(plugin, "view");
					}
				}
			}
			
			plugin.toolbarButtons.each(function(button) {
				this._registerButtonOnToolbar(button);
			}.bind(this));
			
			return pluginPanel;
		},
		
		_registerPluginOnPanel : function(pluginName, panelName) {
			panel = this._controls[panelName + 'Panel'];
			if (!panel) return null; // Panel doesn't exist
			var pluginPanel = new Ext.Panel({
				pluginName : pluginName,
                title: pluginName,
                collapsible: true,
                collapsed: false,
                split : true
			});
			pluginPanel = panel.add(pluginPanel);
			panel.doLayout(); // Force rendering to display image and generate body
			return pluginPanel;
		},
		
		_registerButtonOnToolbar : function(buttonConfig) {
			if (buttonConfig) {
				if ((buttonConfig.text != undefined) && (typeof(buttonConfig.handler) == "function")) {
					var menu = null;
					// if the button should be added to a sub menu try to find it and create it if it isn't there
					if (buttonConfig.menu != undefined) {
						this._controls.toolbar.items.each(function(item) {
							if ((item.text == buttonConfig.menu) && (item.menu != undefined)) {
								menu = item.menu;
							}
						});
						// If no menu exists
						if (menu == null) {
							menu = new Ext.menu.Menu({items : []});
							this._controls.toolbar.addButton({
									//id : buttonConfig.menu,
									iconCls: 'some_class_that_does_not_exist_but_fixes-rendering', // do not remove!
									text : buttonConfig.menu, 
									menu : menu
								});
							menu.render();
						}
						menu.addMenuItem({
							text : buttonConfig.text,
							handler : buttonConfig.handler,
							icon : buttonConfig.icon,
							
						});
					} else {
						this._controls.toolbar.addButton(new Ext.Toolbar.Button({
							text : buttonConfig.text,
							handler : buttonConfig.handler,
							iconCls: 'some_class_that_does_not_exist_but_fixes-rendering', // do not remove!
							icon : buttonConfig.icon
						}));
					}
				}
			}
		},
		
		_registerPluginOnView : function(plugin) {
			// TODO: check if all values are passed and check whether the plugin already exists
			
			this._registerButtonOnToolbar({
				text : plugin.name, 
				icon : plugin.icon, 
				menu : Repository.I18N.Repository.viewMenu, 
				handler : function() {this._switchView(plugin)}.bind(this)
			});
			
			return this._controls.viewPanel;
		},
		
		_loadPlugins : function() {
			
			this._plugins.push(new Repository.Plugins.NewModel(this.getFacade()));
			this._plugins.push(new Repository.Plugins.TypeFilter(this.getFacade()));
			this._plugins.push(new Repository.Plugins.TableView(this.getFacade()));

			var startView = new Repository.Plugins.DebugView(this.getFacade());
			this._plugins.push(startView);
			this._switchView(startView);
			/**this._plugins.push(new Repository.Plugins.ModelTypeFilter(this.getFacade()));
			this._plugins.push(new Repository.Plugins.NewModelControls(this.getFacade()));
			this._plugins.push(new Repository.Plugins.DebugView(this.getFacade()));
			this._plugins.push(new Repository.Plugins.ModelTagInfo(this.getFacade()));
			this.switchView('Debug View');**/
		},
		
		
		/* This functions defines and initialize the basic UI components
		 * 
		 */
		_bootstrapUI : function() {
			
			Ext.QuickTips.init();
			
			test_tpl = new Ext.XTemplate('<div id="oryx_repository_header"> <tpl if="isPublicUser"> PUBLIC </tpl><tpl if="!isPublicUser">  NOT PUBLIC </tpl></div>');
			
			// View panel
			this._controls.viewPanel = new Ext.Panel({ 
                region: 'north',
                height : 400
            });
			// Left panel
			this._controls.leftPanel = new Ext.Panel({ 
                region: 'west',
                title: Repository.I18N.Repository.leftPanelTitle,
                collapsible: true,
                collapsed: false,
                split : true,			            		
            });
			// Right panel
			this._controls.rightPanel = new Ext.Panel({ 
                region: 'east',
                title: Repository.I18N.Repository.rightPanelTitle,
                collapsible: true,
                collapsed: false,
                split : true,		            		
            });			
			// Bottom panel
			this._controls.bottomPanel = new Ext.Panel({ 
                region: 'south',
                title: Repository.I18N.Repository.bottomPanelTitle,
                collapsible: true,
                collapsed: false,
                split : true,
                hidden : true,		            		
            });
			// Toolbar
			this._controls.toolbar = new Ext.Toolbar({
				region : "south",
				items : []
			});
			
			
			// center panel, contains view panel and bottom panel
			this._controls.centerPanel = new Ext.Panel({
				region : 'center',
				items : [this._controls.viewPanel, this._controls.bottomPanel]
			});
			
			this._viewport = new Ext.Viewport({
					layout: 'border',
					margins : '0 0 0 0',
					defaults: {}, // default config for all child widgets
					items: [ 
					        new Ext.Panel({ // Header panel for login and toolbar
								region : 'north',
								height : 60,
								margins : '0 0 0 0',
								border : true,
								items :[{ // Header with logo and login
							                region: 'north',
							                html: Repository.Templates.login.apply({currentUser : this._currentUser, isPublicUser : this._currentUser=='public'}),
							                height: 30
							           },
							           this._controls.toolbar
							    ] // Toolbar
							}), // Panel 
							this._controls.centerPanel,
				            this._controls.leftPanel,	
						    this._controls.rightPanel
					       ]
			});
		}
};

Repository.Core.Repository = Clazz.extend(Repository.Core.Repository);
