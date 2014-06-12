var zwaveModule = zwaveModule || {};

(function (){

  function Zwave(__serverAddress) {
    this._serverAddress = __serverAddress;
  };

  Zwave.prototype.getDevice = function (__device) {
    return $.ajax({
      url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __device.id + '].instances[' + __device.instance + '].commandClasses[' + __device.commandClass + ']',
      type: 'get'
    }).always(function(__data, __textStatus, __jqXHR) {
      logAjaxCallbacks(__data, __textStatus, __jqXHR);
    });
  };

  Zwave.prototype.setDevice = function (__device, __value) {
    return $.ajax({
      url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __device.id + '].instances[' + __device.instance + '].commandClasses[' + __device.commandClass + '].Set(' + __value + ')',
      type: 'get'
    }).always(function(__data, __textStatus, __jqXHR) {
      logAjaxCallbacks(__data, __textStatus, __jqXHR);
    });
  };

  Zwave.prototype.updateDevice = function (__device) {
    return $.ajax({
      url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __device.id + '].instances[' + __device.instance + '].commandClasses[' + __device.commandClass + '].Get()',
      type: 'get'
    }).always(function(__data, __textStatus, __jqXHR) {
      logAjaxCallbacks(__data, __textStatus, __jqXHR);
    });
  };

  Zwave.prototype.updateAndGetDevice = function (__device) {
    var result = $.Deferred();
    var self = this;

    self.updateDevice(__device).done(function(__data, __textStatus, __jqXHR){
      self.getDevice(__device).done(function(__data, __textStatus, __jqXHR){
        result.resolve(__data, __textStatus, __jqXHR);
      }).fail(function(__data, __textStatus, __jqXHR){
        result.reject(__data, __textStatus, __jqXHR);
      });
    }).fail(function(__data, __textStatus, __jqXHR){
      result.reject(__data, __textStatus, __jqXHR);
    });

    return result.promise();
  };

  Zwave.prototype.setUpdateAndGetDevice = function(__device, __value) {
    var result = $.Deferred();
    var self = this;

    self.setDevice(__device, __value).done(function (__data, __textStatus, __jqXHR){
      self.updateAndGetDevice(__device).done(function(__data, __textStatus, __jqXHR) {
        result.resolve(__data, __textStatus, __jqXHR);
      }).fail(function(__data, __textStatus, __jqXHR){
        result.reject(__data, __textStatus, __jqXHR);
      });
    }).fail(function(__data, __textStatus, __jqXHR){
      result.reject(__data, __textStatus, __jqXHR);
    });

    return result;
  }

  Zwave.prototype.toggleDevice = function (__device) {
    var result = $.Deferred();
    var self = this;

    self.updateAndGetDevice(__device).done(function(__data, __textStatus, __jqXHR) {
      var newValue = __device.maximalValue;

      if (__data.data.level.value > 0) {
        newValue = 0;
      }

      self.setUpdateAndGetDevice(__device, newValue).done(function(__data, __textStatus, __jqXHR) {
        result.resolve(__data, __textStatus, __jqXHR);
      }).fail(function(__data, __textStatus, __jqXHR){
        result.reject(__data, __textStatus, __jqXHR);
      });
    }).fail(function(__data, __textStatus, __jqXHR){
      result.reject(__data, __textStatus, __jqXHR);
    });

    return result;
  };

  Zwave.prototype.toggleScenario = function (__scenario) {
    var result = $.Deferred();
    var self = this;

    if (!__scenario.hasOwnProperty('devices')) {
      result.reject('Scenario without devices');
    }

    var scenarioDevices = __scenario.devices;

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

          self.updateAndGetDevice(device).done(function(__data, __textStatus, __jqXHR){
            if (__data.data.level.value > 0) {
              devicesOn.push(device);
            } else {
              devicesOff.push(device);
            }

            deferredStatus.resolve();
          }).fail(function(__data, __textStatus, __jqXHR){
            result.reject(__data, __textStatus, __jqXHR);
          });
        }

        return deferredStatus.promise();
      }(scenarioDevices[i]));

      devicesCheckedStatus.push(deviceCheckedStatus);
    }

    $.when.apply($, devicesCheckedStatus).then(function(){
      var devicesToToggle = devicesOn;
      var toggleToZero = true;

      if(devicesOff.length > 0) {
        devicesToToggle = devicesOff;
        toggleToZero = false;
      }

      for (var i = 0; i < devicesToToggle.length; i++) {
        var device = devicesToToggle[i];
        var newValue = 0;

        if (!toggleToZero) {
          newValue = device.maximalValue;
        }

        self.setUpdateAndGetDevice(device, newValue).done(function(__data, __textStatus, __jqXHR) {
          if (i < devicesToToggle.length - 1) {
            result.notify(__data, __textStatus, __jqXHR);
          } else {
            result.resolve(__data, __textStatus, __jqXHR);
          }
        }).fail(function(__data, __textStatus, __jqXHR){
          result.reject(__data, __textStatus, __jqXHR);
        });
      }
    });

    return result;
  };

  function logAjaxCallbacks(__data, __textStatus, __jqXHR) {
    console.log('zwaveModule ajax callback\njqXHR: ' + JSON.stringify(__jqXHR) + '\nStatus: ' + __textStatus + '\nDone: ' + JSON.stringify(__data));
  };

  zwaveModule.Zwave = Zwave;
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
