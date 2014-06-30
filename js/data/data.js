var main = main || {};
(function () {

    main.homeAutomationServerAddress = '10.0.1.191:8083';

    main.devices = [
        new zwaveModule.Device('Table', 'fa-lightbulb-o', '17', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('Bulle', 'fa-lightbulb-o', '30', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('TV', 'fa-lightbulb-o', '16', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('Bar', 'fa-lightbulb-o', '44', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('Indirect', 'fa-lightbulb-o', '6', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('Ruban', 'fa-lightbulb-o', '9', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('Buche', 'fa-lightbulb-o', '7', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('Terrasse', 'fa-lightbulb-o', '20', '0', '0x26', '30', true, 2000),
        new zwaveModule.Device('Arrosage', 'fa-tint', '34', '0', '0x25', '255', false, 0),
        new zwaveModule.Device('Plafond', 'fa-lightbulb-o', '21', '0', '0x26', '30', true, 5000),
        new zwaveModule.Device('Chevet', 'fa-lightbulb-o', '32', '0', '0x26', '30', true, 5000)
    ];

    main.zwaveZones = [
        new zwaveModule.Zone('Salon', 'fa-th'),
        new zwaveModule.Zone('Miam', 'fa-cutlery'),
        new zwaveModule.Zone('Télé', 'fa-video-camera'),
        new zwaveModule.Zone('Cuisine', 'fa-beer'),
        new zwaveModule.Zone('Dehors', 'fa-sun-o'),
        new zwaveModule.Zone('Chambre', 'fa-cloud'),
    ];

    main.zwaveZones[0].devices([
        main.devices[0],
        main.devices[1],
        main.devices[2],
        main.devices[3],
        main.devices[4],
        main.devices[5],
        main.devices[6],
        main.devices[7]
    ]);

    main.zwaveZones[1].devices([
        main.devices[0],
        main.devices[1]
    ]);

    main.zwaveZones[2].devices([
       main.devices[2]
    ]);

    main.zwaveZones[3].devices([
        main.devices[3],
        main.devices[4],
        main.devices[5]
    ]);

    main.zwaveZones[4].devices([
        main.devices[6],
        main.devices[7],
        main.devices[8]
    ]);

    main.zwaveZones[5].devices([
        main.devices[9],
        main.devices[10]
    ]);

})();