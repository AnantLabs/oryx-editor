module Handler
  class RepositoryHandler < DefaultHandler
    def doGet(interaction)
      
      java_script_includes = ['log', 'application', 'repository', 'model_properties']
      stylesheet_links = ['openid', 'repository', 'model_properties']
      ext_path = '/poem-backend-1.0/ext/'
      
      interaction.response.setStatus(200)
      out = interaction.response.getWriter
      
      out.println('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">')
      out.println('<html>')
      out.println('<head>')
      out.println('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">')
    	out.println('<link rel="stylesheet" type="text/css" href="' + ext_path + 'resources/css/ext-all.css">')
    	out.println('<link rel="stylesheet" type="text/css" href="' + ext_path + 'resources/css/xtheme-gray.css">')
      out.println('<script type="text/javascript" src="' + ext_path + 'adapter/ext/ext-base.js"></script>')
      out.println('<script type="text/javascript" src="' + ext_path + 'ext-all-debug.js"></script>')
      java_script_includes.each do |java_script|
        out.println('<script type="text/javascript" src="/poem-backend-1.0/javascripts/' + java_script + '.js"></script>')
      end
      stylesheet_links.each do |stylesheet|
        out.println('<link rel="stylesheet" type="text/css" href="/poem-backend-1.0/stylesheets/' + stylesheet + '.css">')
      end
      out.println('<script type="text/javascript">Ext.onReady(function(){Repository.app.init("' + interaction.subject.getUri + '");});</script>')  
      out.println('<title>Oryx - Repository</title>')
      out.println('</head>')
      out.println('<body>')
      out.println('</body>')
      out.println('</html>')
    end
  end
  
  class TypeHandler < DefaultHandler
    def doGet(interaction)
      interaction.response.setStatus(200)
      out = interaction.response.getWriter
      
      output = ActiveSupport::JSON.encode(
      [
          {:id => "bpmn", :title => "BPMN", :description => "Business Process Model Notation", :uri => "/stencilsets/bpmn/bpmn.json", :icon_url => "/poem-backend-1.0/images/silk/flag_orange.png"},
          {:id => "petrinet", :title => "Petri Net", :description => "Petri Net", :uri => "/stencilsets/petrinets/petrinet.json", :icon_url => "/poem-backend-1.0/images/silk/flag_green.png"},
          {:id => "epc", :title => "EPC", :description => "Event-Driven Process Chain", :uri => "/stencilsets/epc/epc.json", :icon_url => "/poem-backend-1.0/images/silk/flag_red.png"},
          {:id => "workflow", :title => "Workflow Net", :description => "Workflow Net", :uri => "/stencilsets/workflownets/workflownets.json", :icon_url => "/poem-backend-1.0/images/silk/flag_blue.png"}
      ])
      out.print(output);

    end
  end
end