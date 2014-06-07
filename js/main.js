brite.viewDefaultConfig.loadTmpl = true;
brite.viewDefaultConfig.loadCss = true;

$(document).ready(function(){
	brite.display('MainView','#pageBody');
});

Handlebars.templates = Handlebars.templates || {};
function render(templateName,data){
	var tmpl = Handlebars.templates[templateName];
	if (!tmpl){
		tmpl = Handlebars.compile($('#' + templateName).html());
		Handlebars.templates[templateName] = tmpl;
	}
	return tmpl(data);
}

var main = main || {};
(function() {

	main.homeAutomationServerAddress = '10.0.1.191:8083';

	main.scenarios = [
		{name: 'Bar', deviceId: '44', deviceInstance: '0', deviceMaximmalValue: '30', deviceCommand: '0x26'},
		{name: 'Cuisine', deviceId: '6', deviceInstance: '0', deviceMaximmalValue: '30', deviceCommand: '0x26'},
		{name: 'Frigo', deviceId: '7', deviceInstance: '0', deviceMaximmalValue: '30', deviceCommand: '0x26'}
	];

})();
