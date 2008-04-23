class Testdata < ActiveRecord::Migration
  def self.up   
    execute %q{
      insert into "identity" (uri) values ('https://openid.hpi.uni-potsdam.de/user/mathias.weske');
      insert into "identity" (uri) values ('https://openid.hpi.uni-potsdam.de/user/hagen.overdick');
      insert into "identity" (uri) values ('https://openid.hpi.uni-potsdam.de/user/gero.decker');
      insert into "identity" (uri) values ('https://openid.hpi.uni-potsdam.de/user/martin.czuchra');
      insert into "identity" (uri) values ('https://openid.hpi.uni-potsdam.de/user/ole.eckermann');
      
      insert into "identity" (uri) values ('/data/model/1');
      insert into "identity" (uri) values ('/data/model/2');
      insert into "identity" (uri) values ('/data/model/3');
      insert into "identity" (uri) values ('/data/model/4');
      insert into "identity" (uri) values ('/data/model/5');
      insert into "identity" (uri) values ('/data/model/6');
      insert into "identity" (uri) values ('/data/model/7');
      insert into "identity" (uri) values ('/data/model/8');
      insert into "identity" (uri) values ('/data/model/9');
      insert into "identity" (uri) values ('/data/model/10');
    }
    
    execute %q{
      insert into "structure" (hierarchy, ident_id) select 'U21', id from identity where uri = 'https://openid.hpi.uni-potsdam.de/user/mathias.weske';
      insert into "structure" (hierarchy, ident_id) select 'U22', id from identity where uri = 'https://openid.hpi.uni-potsdam.de/user/hagen.overdick';
      insert into "structure" (hierarchy, ident_id) select 'U23', id from identity where uri = 'https://openid.hpi.uni-potsdam.de/user/gero.decker';
      insert into "structure" (hierarchy, ident_id) select 'U24', id from identity where uri = 'https://openid.hpi.uni-potsdam.de/user/martin.czuchra';
      insert into "structure" (hierarchy, ident_id) select 'U25', id from identity where uri = 'https://openid.hpi.uni-potsdam.de/user/ole.eckermann';
    }
    
    execute %q{
      insert into "structure" (hierarchy, ident_id) select 'U251', id from identity where uri = '/data/model/1';
      insert into "structure" (hierarchy, ident_id) select 'U252', id from identity where uri = '/data/model/2';
      insert into "structure" (hierarchy, ident_id) select 'U253', id from identity where uri = '/data/model/3';
      insert into "structure" (hierarchy, ident_id) select 'U254', id from identity where uri = '/data/model/4';
      insert into "structure" (hierarchy, ident_id) select 'U255', id from identity where uri = '/data/model/5';
      insert into "structure" (hierarchy, ident_id) select 'U256', id from identity where uri = '/data/model/6';
      insert into "structure" (hierarchy, ident_id) select 'U257', id from identity where uri = '/data/model/7';
      insert into "structure" (hierarchy, ident_id) select 'U258', id from identity where uri = '/data/model/8';
      insert into "structure" (hierarchy, ident_id) select 'U259', id from identity where uri = '/data/model/9';
      insert into "structure" (hierarchy, ident_id) select 'U25A', id from identity where uri = '/data/model/10';
    }
    
    execute %q{
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U251', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U252', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U253', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U254', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U255', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U256', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U257', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U1', 'U258', 'http://b3mn.org/http', 'read';
      insert into "interaction" (subject, object, scheme, term) select 'U21', 'U251', 'http://b3mn.org/http', 'write';
    }

    
    execute %q{
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'bpmn', 'MyProcess', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/bpmn/bpmn.json"/></div>'
      	from identity where uri = '/data/model/1';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'bpmn', 'Example', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/bpmn/bpmn.json"/></div>'
      	from identity where uri = '/data/model/2';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'bpmn', 'New Process', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/bpmn/bpmn.json"/></div>'
      	from identity where uri = '/data/model/3';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'bpmn', 'Brot kaufen', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/bpmn/bpmn.json"/></div>'
      	from identity where uri = '/data/model/4';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'bpmn', 'Amazon', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/bpmn/bpmn.json"/></div>'
      	from identity where uri = '/data/model/5';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'bpmn', 'Fachstudie', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/bpmn/bpmn.json"/></div>'
      	from identity where uri = '/data/model/6';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'bpmn', 'Elaboration', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/bpmn/bpmn.json"/></div>'
      	from identity where uri = '/data/model/7';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'epc', 'Test', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/epc/epc.json"/></div>'
      	from identity where uri = '/data/model/8';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'epc', 'TheAnyProcess', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/epc/epc.json"/></div>'
      	from identity where uri = '/data/model/9';
      insert into "representation"(ident_id, type, title, summary, mime_type, content)
        select id, 'epc', 'Some Process', 'Ganz tolles Ding!', 'application/xhtml+xml', '<div id="oryxcanvas" class="-oryx-canvas"><span class="oryx-mode">writeable</span><span class="oryx-mode">fullscreen</span><a rel="oryx-stencilset" href="/oryx/stencilsets/epc/epc.json"/></div>'
      	from identity where uri = '/data/model/10';
    }

 
  end
end