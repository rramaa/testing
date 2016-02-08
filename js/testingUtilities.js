'use strict';

Box.Application.stopAll = sinon.stub().returns(null);
Box.Application.startAll = sinon.stub().returns(null);
Box.Application.context = sinon.stub().returns(null);

var contextReal = null;
var applicationReal = null;
var testObject = new Object();

var toReturn = {};
toReturn['error'] = [];
toReturn['warning'] = [];
var Utilities = function() {

};
Utilities.prototype.handleRealServices = function(serviceArray) {
    if ($.type(serviceArray) == 'array') {
        return serviceArray;
    } else {
        toReturn.error.push("Real services list is not array");
        return [];
    }
};
Utilities.prototype.handleFakeServices = function(sandbox, serviceArray) {
    if ($.type(serviceArray) == 'array') {
        var service = new Object();
        for (var key in serviceArray) {
            for (var serviceName in serviceArray[key]) {
                if (service[serviceName]) {
                    toReturn.warning.push('Duplicate Services detected in fake services array');
                } else {
                    service[serviceName] = new Object();
                    if (serviceArray[key][serviceName].stubs) {
                        var stubFunctions = serviceArray[key][serviceName].stubs;
                        for (var funNames in stubFunctions) {
                            if ($.isEmptyObject(stubFunctions[funNames])) {
                                service[serviceName][funNames] = sandbox.stub().returns(null);
                            } else {
                                var stub = sandbox.stub().returns(null);
                                for (var params in stubFunctions[funNames]) {
                                    stub.withArgs(params).returns(stubFunctions[funNames][params]);
                                }
                                service[serviceName][funNames] = stub;
                            }
                        }
                    }
                }
            }
        }
        return service;
    } else {
        toReturn.error.push("Real services list is not array");
        return [];
    }
};
Utilities.prototype.QUnitTestForMocks=function(){

}