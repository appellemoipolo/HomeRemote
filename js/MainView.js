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
			'click; section .groupActivator': function (__event) {
				toggleScenario(__event.currentTarget.id);
			},
			'click; section > section button': function(__event){
				toggleDevice(__event.currentTarget.id);
			}
		}

	});

	function toggleDevice(__deviceName) {
		var zwave = new zwaveModule.Zwave(main.homeAutomationServerAddress);

		var device = main.devices.filter(function(__data){
			return __data.name === __deviceName;
		})[0]; // Looking for the first device [0] having the good name

		zwave.updateAndGetDevice(device).done(function(__data){
			if (__data.data.level.value != device.maximalValue) {
				zwave.setDevice(device, device.maximalValue).done(function(__data) {
					console.log('on');
					setButtonStatus(__deviceName, true);
				});
			} else {
				zwave.setDevice(device, 0).done(function(__data) {
					console.log('off');
					setButtonStatus(__deviceName, false);
				});
			}
		});
	}

	function toggleScenario(__scenarioName) {
		var zwave = new zwaveModule.Zwave(main.homeAutomationServerAddress);

		var scenario = main.scenarios.filter(function(__data){
			return __data.name === __scenarioName;
		})[0]; // Looking for the first scenario [0] having the good name

		if (!scenario.hasOwnProperty('devices')) {
			alert('Scénario sans éléments');
		};

		var scenarioDevices = scenario.devices;

		var devicesOn = [];
		var devicesOff = [];

		var devicesCheckedStatus = [];

		for (var i = 0; i < scenarioDevices.length; i++) {
			var deviceCheckedStatus = (function(__scenarioDevice) {
				var deferredStatus = new $.Deferred();
				if (__scenarioDevice.hasOwnProperty('name')) {
					var device = main.devices.filter(function(__data){
						return __data.name === __scenarioDevice.name;
					})[0]; // Looking for the first device [0] having the good name

					zwave.updateAndGetDevice(device).done(function(__data){
						console.log('get ' + i);

						if (__data.data.level.value > 0) {
							devicesOn.push(device);
						} else {
							devicesOff.push(device);
						}

						deferredStatus.resolve();
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
					zwave.setDevice(device, device.maximalValue).done(function() {
						console.log('on');
						setButtonStatus(__scenarioName, true);
					});
				}
			} else {
				for (var i = 0; i < devicesOn.length; i++) {
					var device = devicesOn[i];
					zwave.setDevice(device, 0).done(function() {
						console.log('off');
						setButtonStatus(__scenarioName, false);
					});
				}
			}
		})
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
