var zwaveModule = zwaveModule || {};

(function () {

    function Zone(__name, __icon) {
        this.name(__name);
        this.icon(__icon);
    }

    Zone.prototype.name = function (__value) {
        if (typeof __value === 'undefined') {
            return this._name;
        } else {
            this._name = __value;
        }
    }

    Zone.prototype.icon = function (__value) {
        if (typeof __value === 'undefined') {
            return this._icon;
        } else {
            this._icon = __value;
        }
    }

    Zone.prototype.devices = function (__value) {
        if (typeof __value === 'undefined') {
            return this._devices;
        } else {
            if (__value instanceof Array) {
                if (__value.length > 0) {
                    for (var i = 0, l = __value.length; i < l; i++) {
                        if (!(__value[i] instanceof zwaveModule.Device)) {
                            throw 'Device ' + i + ' is not a instance of zwaveModule.Device';
                        }
                    }
                }

                this._devices = __value;
            } else {
                throw 'Devices should be an Array of zwaveModule.Device'
            }
        }
    }

    zwaveModule.Zone = Zone;

})();