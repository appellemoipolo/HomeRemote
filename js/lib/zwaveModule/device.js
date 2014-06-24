var zwaveModule = zwaveModule || {};

(function () {

    function Device(__name, __icon, __id, __instance, __commandClass, __maximalValue, __dimmingTime) {
        this.name(__name);
        this.icon(__icon);
        this.id(__id);
        this.instance(__instance);
        this.commandClass(__commandClass);
        this.maximalValue(__maximalValue);
        this.dimmingTime(__dimmingTime);
    }

    Device.prototype.name = function (__value) {
        if (typeof __value === 'undefined') {
            return this._name;
        } else {
            this._name = __value;
        }
    }

    Device.prototype.icon = function (__value) {
        if (typeof __value === 'undefined') {
            return this._icon;
        } else {
            this._icon = __value;
        }
    }

    Device.prototype.id = function (__value) {
        if (typeof __value === 'undefined') {
            return this._id;
        } else {
            this._id = __value;
        }
    }

    Device.prototype.instance = function (__value) {
        if (typeof __value === 'undefined') {
            return this._instance;
        } else {
            this._instance = __value;
        }
    }

    Device.prototype.maximalValue = function (__value) {
        if (typeof __value === 'undefined') {
            return this._maximalValue;
        } else {
            this._maximalValue = __value;
        }
    }

    Device.prototype.commandClass = function (__value) {
        if (typeof __value === 'undefined') {
            return this._commandClass;
        } else {
            this._commandClass = __value;
        }
    }

    Device.prototype.dimmingTime = function (__value) {
        if (typeof __value === 'undefined') {
            return this._dimmingTime;
        } else {
            this._dimmingTime = __value;
        }
    }

    zwaveModule.Device = Device;

})();