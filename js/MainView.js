(function() {
	brite.registerView("MainView", {emptyParent:true}, {

		create: function(){
			return render("tmpl-MainView");
		},

		postDisplay: function(){
			var view = this;

			// Display the two sub-views
			brite.display("Scene", view.$el.find(".MainView-content"));
		},

		events: {
			"click; button": function(event){
				console.log("click!");

				var zwave = new zwaveModule.Zwave('10.0.1.192:8083');
				zwave.setValue(44, 0, '0x26', 30);
				zwave.setValue(44, 0, '0x26', 0);
			}
		}

	});
})();
