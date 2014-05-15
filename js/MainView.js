(function() {
	brite.registerView('MainView', {emptyParent:true}, {

		create: function(){
			return render('tmpl-MainView');
		},

		postDisplay: function(){
			var view = this;

			// Display the two sub-views
			brite.display('Scene', view.$el.find('.MainView-content'));
		},

		events: {
			'click; button': function(event){
				console.log(event);

				var buttonClicked = event.currentTarget;

				toggle(buttonClicked.id);
			}
		}

	});

	function toggle(__deviceId, __callback){
		var zwave = new zwaveModule.Zwave(main.homeAutomationServerAddress);

		var scenario = main.scenarios.filter(function(data){
			return data.name === __deviceId;
		})[0]; // Looking for the first scenario [0] having the good name

		zwave.update(scenario.deviceId, scenario.deviceInstance, scenario.deviceCommand, function(){
			zwave.get(scenario.deviceId, scenario.deviceInstance, scenario.deviceCommand, function(data){
				console.log(data);

				if (data.data.level.value != scenario.deviceMaximmalValue) {
					zwave.set(scenario.deviceId, scenario.deviceInstance, scenario.deviceCommand, scenario.deviceMaximmalValue, function() {
						console.log('on');
						toggleButton(__deviceId, true);
					});
				} else {
					zwave.set(scenario.deviceId, scenario.deviceInstance, scenario.deviceCommand, 0, function(){
						console.log('off');
						toggleButton(__deviceId, false);
					});
				}
			});
		});
	}

	function toggleButton(__buttonId, __value){
		if (__value) {
			$('#' + __buttonId).addClass('on');
			$('#' + __buttonId).removeClass('off');
		} else {
			$('#' + __buttonId).addClass('off');
			$('#' + __buttonId).removeClass('on');
		}
	}

})();
