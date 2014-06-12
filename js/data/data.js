var main = main || {};
(function () {

    main.homeAutomationServerAddress = '10.0.1.191:8083';

    // main.scenarios = [
    //   {name: 'Bar', deviceId: '44', deviceInstance: '0', deviceMaximmalValue: '30', deviceCommand: '0x26'},
    //   {name: 'Cuisine', deviceId: '6', deviceInstance: '0', deviceMaximmalValue: '30', deviceCommand: '0x26'},
    //   {name: 'Frigo', deviceId: '7', deviceInstance: '0', deviceMaximmalValue: '30', deviceCommand: '0x26'}
    // ];

    main.devices = [
        {
            name: 'Bar',
            id: '44',
            instance: '0',
            maximalValue: '30',
            commandClass: '0x26'
        },
        {
            name: 'Plan',
            id: '6',
            instance: '0',
            maximalValue: '30',
            commandClass: '0x26'
        },
        {
            name: 'Frigo',
            id: '7',
            instance: '0',
            maximalValue: '30',
            commandClass: '0x26'
        },
        {
            name: 'Mur',
            id: '44',
            instance: '0',
            maximalValue: '30',
            commandClass: '0x26'
        },
        {
            name: 'Bulle',
            id: '6',
            instance: '0',
            maximalValue: '30',
            commandClass: '0x26'
        },
        {
            name: 'Poutre',
            id: '7',
            instance: '0',
            maximalValue: '30',
            commandClass: '0x26'
        }
  ];

    main.scenarios = [
        {
            name: 'Cuisine',
            devices: [
                {
                    name: 'Bar'
                },
                {
                    name: 'Plan'
                },
                {
                    name: 'Frigo'
                },
    ]
        },
        {
            name: 'Salon',
            devices: [
                {
                    name: 'Mur'
                },
                {
                    name: 'Bulle'
                },
                {
                    name: 'Poutre'
                }
    ]
        }
  ];

})();