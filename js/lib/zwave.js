console.log('zwaveModule loading...');

var zwaveModule = zwaveModule || {};

(function (){

  function Zwave(__serverAddress) {
    this._serverAddress = __serverAddress;
  };

  Zwave.prototype.set = function (__deviceId, __instance, __commandClass, __value, __callback){
    $.ajax({
      url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __deviceId + '].instances[' + __instance + '].commandClasses[' + __commandClass + '].Set(' + __value + ')',
      type: 'get'
    })
    .done(function(data, textStatus, jqXHR) {
      logAjaxCallbacks(data, textStatus, jqXHR);
      if (__callback) {
        return __callback(data);
      }
    })
    .fail(function(data, textStatus, jqXHR) {
      logAjaxCallbacks(data, textStatus, jqXHR);
      if (__callback) {
        return __callback(data);
      }
    });
  };

  Zwave.prototype.update = function (__deviceId, __instance, __commandClass, __callback) {
    $.ajax({
      url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __deviceId + '].instances[' + __instance + '].commandClasses[' + __commandClass + '].Get()',
      type: 'get'
    })
    .done(function(data, textStatus, jqXHR) {
      logAjaxCallbacks(data, textStatus, jqXHR);
      if (__callback) {
        return __callback(data);
      }
    })
    .fail(function(data, textStatus, jqXHR) {
      logAjaxCallbacks(data, textStatus, jqXHR);
      if (__callback) {
        return __callback(data);
      }
    });
  };

  Zwave.prototype.get = function (__deviceId, __instance, __commandClass, __callback) {
    $.ajax({
      url: 'http://' + this._serverAddress + '/ZWaveAPI/Run/devices[' + __deviceId + '].instances[' + __instance + '].commandClasses[' + __commandClass + ']',
      type: 'get'
    })
    .done(function(data, textStatus, jqXHR) {
      logAjaxCallbacks(data, textStatus, jqXHR);
      if (__callback) {
        return __callback(data);
      }
    })
    .fail(function(data, textStatus, jqXHR) {
      logAjaxCallbacks(data, textStatus, jqXHR);
      if (__callback) {
        return __callback(data);
      }
    });
  };

  function logAjaxCallbacks(__data, __textStatus, __jqXHR) {
    console.log('zwaveModule ajax callback\njqXHR.status: ' + __jqXHR.status + '\nStatus: ' + __textStatus + '\nDone: ' + __data);
  };

  zwaveModule.Zwave = Zwave;
})();

// Zwave.prototype.getDevices = function (callback){
//   request.get('http://' + this.address + '/ZWaveAPI/Run/devices', function (err, response, body){
//
//     if(err){
//       callback(err);
//     } else {
//       callback(null, JSON.parse(body), response);
//     }
//
//   });
// };
//
// Zwave.prototype.getDevice = function (deviceId, callback){
//   request.get('http://' + this.address + '/ZWaveAPI/Run/devices[' + deviceId + ']', function (err, response, body){
//
//     if(err){
//       callback(err);
//     } else {
//       callback(null, JSON.parse(body), response);
//     }
//
//   });
// };
//
// Zwave.prototype.getDeviceCommandClasses = function (deviceId, instance, callback){
//   request.get('http://' + this.address + '/ZWaveAPI/Run/devices[' + deviceId + '].instances['+instance+'].commandClasses', function (err, response, body){
//
//     if(err){
//       callback(err);
//     } else {
//       callback(null, JSON.parse(body), response);
//     }
//
//   });
// };
//
// Zwave.prototype.getDeviceCommandClass = function (deviceId, instance, commandClass, callback){
//   request.get('http://' + this.address + '/ZWaveAPI/Run/devices[' + deviceId + '].instances['+instance+'].commandClasses['+ commandClass+']', function (err, response, body){
//
//     if(err){
//       callback(err);
//     } else {
//       callback(null, JSON.parse(body), response);
//     }
//
//   });
// };
