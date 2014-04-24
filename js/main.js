brite.viewDefaultConfig.loadTmpl = true;
brite.viewDefaultConfig.loadCss = true;

Handlebars.templates = Handlebars.templates || {};  
function render(templateName,data){
	var tmpl = Handlebars.templates[templateName];
	if (!tmpl){
		tmpl = Handlebars.compile($("#" + templateName).html());
		Handlebars.templates[templateName] = tmpl;
	}
	return tmpl(data);
}

$(document).ready(function(){
	brite.display("MainView","#pageBody");
});