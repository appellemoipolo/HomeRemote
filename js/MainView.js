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
			'click; section .groupActivator': function(event){
				var buttonClicked = event.currentTarget;
				toggleScene(buttonClicked.id);
			},
			'click; section > section button': function(event){
				var buttonClicked = event.currentTarget;
				toggle(buttonClicked.id);
			}
		}

	});

	function toggleScene(__deviceId, __callback) {
		var zwave = new zwaveModule.Zwave(main.homeAutomationServerAddress);

		var scenario = main.scenarios.filter(function(data){
			return data.name === __deviceId;
		})[0]; // Looking for the first scenario [0] having the good name

		if (!scenario.hasOwnProperty('devices')) {
			alert('Scène sans éléments');
		};

		var scenarioDevices = scenario.devices;

		var devicesOn = [];
		var devicesOff = [];

		var devicesCheckedStatus = [];

		for (var i = 0; i < scenarioDevices.length; i++) {
			var deviceCheckedStatus = (function(scenarioDevice) {
				var deferredStatus = new $.Deferred();
				if (scenarioDevice.hasOwnProperty('name')) {
					var device = main.devices.filter(function(data){
						return data.name === scenarioDevice.name;
					})[0]; // Looking for the first device [0] having the good name

					zwave.update(device.deviceId, device.deviceInstance, device.deviceCommand, function(){
						zwave.get(device.deviceId, device.deviceInstance, device.deviceCommand, function(data){
							console.log('get ' + i);

							if (data.data.level.value > 0) {
								devicesOn.push(device);
							} else {
								devicesOff.push(device);
							}

							deferredStatus.resolve();
						})
					})
				}

				return deferredStatus.promise();
			}(scenarioDevices[i]));

			devicesCheckedStatus.push(deviceCheckedStatus);
		}

		$.when.apply($, devicesCheckedStatus).then(function(){
			console.log(devicesOn);
			console.log(devicesOff);

			if(devicesOff.length > 0){
				for (var i = 0; i < devicesOff.length; i++) {
					var device = devicesOff[i];
					zwave.set(device.deviceId, device.deviceInstance, device.deviceCommand, device.deviceMaximmalValue, function() {
						console.log('on');
						setButtonStatus(__deviceId, true);
					});
				}
			} else {
				for (var i = 0; i < devicesOn.length; i++) {
					var device = devicesOn[i];
					zwave.set(device.deviceId, device.deviceInstance, device.deviceCommand, 0, function() {
						console.log('off');
						setButtonStatus(__deviceId, false);
					});
				}
			}
		})
	}

	function toggle(__deviceId, __callback){
		var zwave = new zwaveModule.Zwave(main.homeAutomationServerAddress);

		var device = main.devices.filter(function(data){
			return data.name === __deviceId;
		})[0]; // Looking for the first device [0] having the good name

		zwave.update(device.deviceId, device.deviceInstance, device.deviceCommand, function(){
			zwave.get(device.deviceId, device.deviceInstance, device.deviceCommand, function(data){
				console.log(data);

				if (data.data.level.value != device.deviceMaximmalValue) {
					zwave.set(device.deviceId, device.deviceInstance, device.deviceCommand, device.deviceMaximmalValue, function() {
						console.log('on');
						setButtonStatus(__deviceId, true);
					});
				} else {
					zwave.set(device.deviceId, device.deviceInstance, device.deviceCommand, 0, function(){
						console.log('off');
						setButtonStatus(__deviceId, false);
					});
				}
			});
		});
	}

	function setButtonStatus(__buttonId, __value){
		if (__value) {
			$('#' + __buttonId).addClass('on');
			$('#' + __buttonId).removeClass('off');
		} else {
			$('#' + __buttonId).addClass('off');
			$('#' + __buttonId).removeClass('on');
		}
	};

})();
