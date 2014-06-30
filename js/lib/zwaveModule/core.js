var zwaveModule = zwaveModule || {};

(function () {

    function Core(__serverAddress) {
        this._serverAddress = __serverAddress;
    }

    //    var fibaroAutomaticMovingTimer = http: 10.0.1.191:8083/ZWaveAPI/Run/devices%5B20%5D.instances%5B0%5D.commandClasses%5B112%5D.data%5B10%5D.val.value 

    Core.prototype.getDevice = function (__device) {
        if (!(__device instanceof zwaveModule.Device)) {
            throw 'Device is not an instance of zwaveModule.Device';
        }

        var url = 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __device.id() + '].instances[' + __device.instance() + '].commandClasses[' + __device.commandClass() + ']';

        return ajaxGet(url);
    };

    Core.prototype.setDevice = function (__device, __value) {
        if (!(__device instanceof zwaveModule.Device)) {
            throw 'Device is not an instance of zwaveModule.Device';
        }

        var url = 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __device.id() + '].instances[' + __device.instance() + '].commandClasses[' + __device.commandClass() + '].Set(' + __value + ')';

        return ajaxGet(url);
    };

    Core.prototype.updateDevice = function (__device) {
        if (!(__device instanceof zwaveModule.Device)) {
            throw 'Device is not an instance of zwaveModule.Device';
        }

        var url = 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __device.id() + '].instances[' + __device.instance() + '].commandClasses[' + __device.commandClass() + '].Get()';
        // .instances%5B0%5D.commandClasses%5B112%5D.data%5B10%5D.val.value

        return ajaxGet(url);
    };

    Core.prototype.updateAndGetDevice = function (__device) {
        var result = $.Deferred();
        var self = this;

        self.updateDevice(__device).done(function (__data, __textStatus, __jqXHR) {
            self.getDevice(__device).done(function (__data, __textStatus, __jqXHR) {
                result.resolve(__data, __textStatus, __jqXHR);
            }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                result.reject(__jqXHR, __textStatus, __errorThrown);
            });
        }).fail(function (__jqXHR, __textStatus, __errorThrown) {
            result.reject(__jqXHR, __textStatus, __errorThrown);
        });

        return result.promise();
    };

    Core.prototype.updateAndGetDevices = function (__devices) {
        var result = $.Deferred();
        var self = this;

        for (var i = 0, l = __devices.length; i < l; i++) {
            (function (__device, __i) {
                self.updateAndGetDevice(__device).done(function (__data, __textStatus, __jqXHR) {
                    result.notify(__data, __textStatus, __jqXHR);

                    console.log(__i);

                    if (__i == l - 1) {
                        result.resolve('Jobs done');
                    }
                }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                    result.reject(__jqXHR, __textStatus, __errorThrown);
                });
            }(__devices[i], i));
        }

        return result.promise();
    }

    Core.prototype.setUpdateAndGetDevice = function (__device, __value) {
        var result = $.Deferred();
        var self = this;
        var MAXIMUM_REQUEST_NUMBER = 2;
        var currentRequestNumber = 0;

        self.setDevice(__device, __value).done(function (__data, __textStatus, __jqXHR) {
            result.notify(__data, __textStatus, __jqXHR);

            (function tryRequest() {
                setTimeout(function () {
                    self.updateAndGetDevice(__device).done(function (__data, __textStatus, __jqXHR) {
                        if (__data.data.level.value == __value) {
                            result.resolve(__data, __textStatus, __jqXHR);
                        } else if (currentRequestNumber == MAXIMUM_REQUEST_NUMBER) {
                            result.reject(__data, __textStatus, __jqXHR);
                        } else {
                            result.notify(__data, __textStatus, __jqXHR);
                            currentRequestNumber += 1;
                            tryRequest();
                        }
                    }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                        result.reject(__jqXHR, __textStatus, __errorThrown);
                    });
                }, __device.dimmingTime() * (__device.defaultOnValue() / 100)); // Formula because of fibaro dimming way
            })();

        }).fail(function (__jqXHR, __textStatus, __errorThrown) {
            result.reject(__jqXHR, __textStatus, __errorThrown);
        });

        return result.promise();
    };

    Core.prototype.toggleDevice = function (__device) {
        var result = $.Deferred();
        var self = this;

        $.when(self.updateAndGetDevice(__device)).done(function (__data, __textStatus, __jqXHR) {
            var newValue = __device.defaultOnValue();

            if (__data.data.level.value > 0) {
                newValue = 0;
            }

            self.setUpdateAndGetDevice(__device, newValue).done(function (__data, __textStatus, __jqXHR) {
                //                console.log('toggleDevice.done');
                //                console.log(__data);
                //                console.log(__textStatus);
                //                console.log(__jqXHR);
                result.resolve(__data, __textStatus, __jqXHR);
            }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                result.reject(__jqXHR, __textStatus, __errorThrown);
            }).progress(function (__data, __textStatus, __jqXHR) {
                //                console.log('toggleDevice.progress');
                //                console.log(__data);
                //                console.log(__textStatus);
                //                console.log(__jqXHR);
                result.notify(__data, __textStatus, __jqXHR);
            });
        }).fail(function (__jqXHR, __textStatus, __errorThrown) {
            result.reject(__jqXHR, __textStatus, __errorThrown);
        });

        return result.promise();
    };

    Core.prototype.toggleDevicesGroup = function (__group) {
        var result = $.Deferred();
        var self = this;

        var devicesWithOnStatus = [];
        var devicesWithOffStatus = [];

        var devicesWithCheckedStatus = [];

        var devicesToToggle = [];

        result.notify(__group);

        for (var i = 0, l = __group.devices().length; i < l; i++) {
            if (__group.devices()[i].togglableInGroup()) {
                devicesToToggle.push(__group.devices()[i]);
            }
        }

        for (var i = 0, l = devicesToToggle.length; i < l; i++) {
            var deviceWithCheckingStatus = (function (__groupDevice) {
                var deferredStatus = new $.Deferred();
                self.updateAndGetDevice(__groupDevice).done(function (__data, __textStatus, __jqXHR) {
                    if (__data.data.level.value > 0) {
                        devicesWithOnStatus.push(__groupDevice);
                    } else {
                        devicesWithOffStatus.push(__groupDevice);
                    }

                    deferredStatus.resolve(__data, __textStatus, __jqXHR);
                }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                    deferredStatus.reject(__jqXHR, __textStatus, __errorThrown);
                });

                return deferredStatus.promise();
            }(devicesToToggle[i])).done(function (__data, __textStatus, __jqXHR) {
                result.notify(__data, __textStatus, __jqXHR);
            }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                result.notify(__jqXHR, __textStatus, __errorThrown);
            });

            devicesWithCheckedStatus.push(deviceWithCheckingStatus);
        }

        var devicesUpdated = [];
        var toggleToZero = true;

        $.when.apply($, devicesWithCheckedStatus).then(function () {
            devicesToToggle = devicesWithOnStatus;

            if (devicesWithOffStatus.length > 0) {
                devicesToToggle = devicesWithOffStatus;
                toggleToZero = false;
            }

            for (var i = 0, l = devicesToToggle.length; i < l; i++) {
                var deviceUpdated = (function (__device) {
                    var deferredStatus = new $.Deferred();

                    var newValue = 0;

                    if (!toggleToZero) {
                        newValue = __device.defaultOnValue();
                    }

                    self.setUpdateAndGetDevice(__device, newValue).done(function (__data, __textStatus, __jqXHR) {
                        deferredStatus.resolve(__data, __textStatus, __jqXHR);
                    }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                        deferredStatus.reject(__jqXHR, __textStatus, __errorThrown);
                    }).progress(function (__data, __textStatus, __jqXHR) {
                        deferredStatus.notify(__data, __textStatus, __jqXHR);
                    });

                    return deferredStatus.promise();
                })(devicesToToggle[i]).done(function (__data, __textStatus, __jqXHR) {
                    result.notify(__data, __textStatus, __jqXHR);
                }).fail(function (__jqXHR, __textStatus, __errorThrown) {
                    result.notify(__jqXHR, __textStatus, __errorThrown);
                });

                devicesUpdated.push(deviceUpdated);
            }

            $.when.apply($, devicesUpdated).then(function () {
                result.resolve(!toggleToZero);
            }).fail(function () {
                result.reject();
            });

        }).fail(function () {
            result.reject();
        });

        return result.promise();
    };

    function ajaxGet(__url) {
        return $.ajax({
            url: __url,
            type: 'get'
        }).always(function (__data, __textStatus, __jqXHR) {
            logAjaxCallbacks(__url, __data, __textStatus, __jqXHR);
        });
    }

    function logAjaxCallbacks(__url, __data, __textStatus, __jqXHR) {
        //        console.log('zwaveModule ajax callback\nurl: ' + encodeURI(__url) + '\njqXHR: ' + JSON.stringify(__jqXHR) + '\nStatus: ' + __textStatus + '\nDone: ' + JSON.stringify(__data));
        //        console.log('zwaveModule ajax callback\nurl: ' + encodeURI(__url));
    }

    zwaveModule.Core = Core;
})();


// var zwaveModule = zwaveModule || {};
//
// (function (){
//
//   function Zwave(__serverAddress) {
//     this._serverAddress = __serverAddress;
//   };
//
//   Zwave.prototype.set = function (__deviceId, __instance, __commandClass, __value, __callback){
//     $.ajax({
//       url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __deviceId + '].instances[' + __instance + '].commandClasses[' + __commandClass + '].Set(' + __value + ')',
//       type: 'get'
//     })
//     .done(function(data, textStatus, jqXHR) {
//       logAjaxCallbacks(data, textStatus, jqXHR);
//       if (__callback) {
//         return __callback(data);
//       }
//     })
//     .fail(function(data, textStatus, jqXHR) {
//       logAjaxCallbacks(data, textStatus, jqXHR);
//       if (__callback) {
//         return __callback(data);
//       }
//     });
//   };
//
//   Zwave.prototype.update = function (__deviceId, __instance, __commandClass, __callback) {
//     $.ajax({
//       url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __deviceId + '].instances[' + __instance + '].commandClasses[' + __commandClass + '].Get()',
//       type: 'get'
//     })
//     .done(function(data, textStatus, jqXHR) {
//       logAjaxCallbacks(data, textStatus, jqXHR);
//       if (__callback) {
//         return __callback(data);
//       }
//     })
//     .fail(function(data, textStatus, jqXHR) {
//       logAjaxCallbacks(data, textStatus, jqXHR);
//       if (__callback) {
//         return __callback(data);
//       }
//     });
//   };
//
//   Zwave.prototype.get = function (__deviceId, __instance, __commandClass, __callback) {
//     $.ajax({
//       url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __deviceId + '].instances[' + __instance + '].commandClasses[' + __commandClass + ']',
//       type: 'get'
//     })
//     .done(function(data, textStatus, jqXHR) {
//       logAjaxCallbacks(data, textStatus, jqXHR);
//       if (__callback) {
//         return __callback(data);
//       }
//     })
//     .fail(function(data, textStatus, jqXHR) {
//       logAjaxCallbacks(data, textStatus, jqXHR);
//       if (__callback) {
//         return __callback(data);
//       }
//     });
//   };
//
//   function logAjaxCallbacks(__data, __textStatus, __jqXHR) {
//     console.log('zwaveModule ajax callback\njqXHR.status: ' + __jqXHR.status + '\nStatus: ' + __textStatus + '\nDone: ' + __data);
//   };
//
//   zwaveModule.Zwave = Zwave;
// })();
//
// // Zwave.prototype.getDevices = function (callback){
// //   request.get('http://' + this.address + '/ZWaveAPI/Run/devices', function (err, response, body){
// //
// //     if(err){
// //       callback(err);
// //     } else {
// //       callback(null, JSON.parse(body), response);
// //     }
// //
// //   });
// // };
// //
// // Zwave.prototype.getDevice = function (deviceId, callback){
// //   request.get('http://' + this.address + '/ZWaveAPI/Run/devices[' + deviceId + ']', function (err, response, body){
// //
// //     if(err){
// //       callback(err);
// //     } else {
// //       callback(null, JSON.parse(body), response);
// //     }
// //
// //   });
// // };
// //
// // Zwave.prototype.getDeviceCommandClasses = function (deviceId, instance, callback){
// //   request.get('http://' + this.address + '/ZWaveAPI/Run/devices[' + deviceId + '].instances['+instance+'].commandClasses', function (err, response, body){
// //
// //     if(err){
// //       callback(err);
// //     } else {
// //       callback(null, JSON.parse(body), response);
// //     }
// //
// //   });
// // };
// //
// // Zwave.prototype.getDeviceCommandClass = function (deviceId, instance, commandClass, callback){
// //   request.get('http://' + this.address + '/ZWaveAPI/Run/devices[' + deviceId + '].instances['+instance+'].commandClasses['+ commandClass+']', function (err, response, body){
// //
// //     if(err){
// //       callback(err);
// //     } else {
// //       callback(null, JSON.parse(body), response);
// //     }
// //
// //   });
// // };