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
                setButtonClick(__event.currentTarget.id);
                toggleGroup(__event.currentTarget.id);
            },
            'click; section > section button': function (__event) {
                setButtonClick(__event.currentTarget.id);
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

    function toggleGroup(__groupName) {
        var zwave = new zwaveModule.Core(main.homeAutomationServerAddress);

        var group = main.zwaveZones.filter(function (__data) {
            return __data.name() === __groupName;
        })[0]; // Looking for the first scenario [0] having the good name

        zwave.toggleDevicesGroup(group).done(function (__data) {
            console.log(__data);
            setButtonStatus(__groupName, __data);

            setButtonInBusyMode(__groupName, false);
        }).fail(function (__jqXHR, __textStatus, __errorThrown) {

        }).progress(function (__data, __textStatus, __jqXHR) {
            //            console.log(__data, __textStatus, __jqXHR);
            if (__data.hasOwnProperty('data') && __data.data.hasOwnProperty('name')) {
                var device = main.devices.filter(function (__deviceData) {
                    // name: "devices.20.instances.0.commandClasses.38.data"
                    return __data.data.name.split('.')[1] === __deviceData.id();
                })[0];

                if (__data.data.level.value > 0) {
                    setButtonStatus(device.name(), true);
                } else {
                    setButtonStatus(device.name(), true);
                }
            }

            setButtonInBusyMode(__groupName, true);
        });
    }

    function setButtonClick(__buttonId) {
        $('#' + __buttonId).addClass('active');
        setTimeout(function () {
            $('#' + __buttonId).removeClass('active');
        }, 1000);
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