(function () {
    brite.registerView('MainView', {
        emptyParent: true
    }, {

        create: function () {
            return render('tmpl-MainView');
        },

        postDisplay: function () {
            var view = this;

            // Display the two sub-views
            brite.display('Scene', view.$el.find('.MainView-content'));
        },

        events: {
            'click; section .groupActivator': function (__event) {
                toggleScenario(__event.currentTarget.id);
            },
            'click; section > section button': function (__event) {
                toggleDevice(__event.currentTarget.id);
            }
        }

    });

    function toggleDevice(__deviceName) {
        var zwave = new zwaveModule.Core(main.homeAutomationServerAddress);

        var device = main.devices.filter(function (__data) {
            return __data.name() === __deviceName;
        })[0]; // Looking for the first device [0] having the good name

        zwave.toggleDevice(device).done(function (__data) {
            if (__data.data.level.value > 0) {
                setButtonStatus(__deviceName, true);
            } else {
                setButtonStatus(__deviceName, false);
            }

            setButtonInBusyMode(__deviceName, false);
        }).fail(function (__data) {
            zwave.updateAndGetDevice(device);
            setButtonInBusyMode(__deviceName, false);
        }).progress(function (__data) {
            setButtonInBusyMode(__deviceName, true);
        });
    }

    function toggleScenario(__scenarioName) {
        var zwave = new zwaveModule.Core(main.homeAutomationServerAddress);

        var scenario = main.scenarios.filter(function (__data) {
            return __data.name === __scenarioName;
        })[0]; // Looking for the first scenario [0] having the good name

        zwave.toggleScenario(scenario).done(function (__data) {
            console.log(__data.data.level.value);
            //            if (__data.data.level.value > 0) {
            //                setButtonStatus(__scenarioName, true);
            //            } else {
            //                setButtonStatus(__scenarioName, false);
            //            }
        });
    }

    function setButtonInBusyMode(__buttonId, __bool) {
        if (__bool) {
            $('#' + __buttonId).addClass('animation-busy');
        } else {
            $('#' + __buttonId).removeClass('animation-busy');
        }
    }

    function setButtonStatus(__buttonId, __bool) {
        if (__bool) {
            $('#' + __buttonId).addClass('on');
            $('#' + __buttonId).removeClass('off');
        } else {
            $('#' + __buttonId).addClass('off');
            $('#' + __buttonId).removeClass('on');
        }
    }

})();