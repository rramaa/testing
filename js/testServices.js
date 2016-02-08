'use strict';

function startTesting(utilityFunctions) {
    for (var services in testObject) {
        (function(services) {
            if ($.type(services) !== 'string') {
                toReturn.error.push("Service Name is not a string");
                testObject[services] = {};
            }
            QUnit.module('services/' + services, {
                beforeEach: function() {
                    this.sandbox = sinon.sandbox.create();
                    var application = applicationReal;
                    if (testObject[services].prerequisites) {
                        var realServices = [];
                        if (testObject[services].prerequisites.realServices) {
                            realServices = utilityFunctions.handleRealServices(testObject[services].prerequisites.realServices);
                        }
                        var fakeServices = new Object();
                        if (testObject[services].prerequisites.fakeServices) {
                            fakeServices = utilityFunctions.handleFakeServices(this.sandbox, testObject[services].prerequisites.fakeServices);
                        }
                        application = new Box.TestServiceProvider(fakeServices, realServices);
                        application.broadcast = this.sandbox.stub().returns(null);
                    }
                    console.log(application);
                    this.service = new Box.Application.getServiceForTest(services, application);
                },
                afterEach: function() {
                    this.sandbox.verifyAndRestore();
                }
            });
            if (testObject[services].functions) {
                for (var funNames in testObject[services].functions) {
                    (function(funNames) {
                        var testName = funNames + "/test";
                        if (testObject[services].functions[funNames].name) {
                            if ($.type(testObject[services].functions[funNames].name) !== 'string') {
                                toReturn.warning.push("Name of Function not a string");
                            } else {
                                testName = testObject[services].functions[funNames].name;
                            }
                        }
                        var funObject = testObject[services].functions[funNames];
                        if (!funObject.mocks) {
                            QUnit.test(testName, function(assert) {
                                var numberOfAsserts = 0;
                                if (funObject.testCases) {
                                    numberOfAsserts = funObject.testCases.length;
                                }
                                var asyncArray = [];
                                assert.expect(numberOfAsserts);
                                for (var k = 0; k < numberOfAsserts; k++) {
                                    if (funObject.async) {
                                        asyncArray.push(assert.async());
                                    }
                                    var testCase = funObject.testCases[k];
                                    if ($.type(testCase.input) != 'array') {
                                        testCase.input = [];
                                        toReturn.error.push("Enter an array of inputs");
                                    }
                                    var name = testCase.name || ("Test Case " + (k + 1));
                                    var assertion;
                                    if ($.type(testCase.output == 'object')) {
                                        if (testCase.assertion) {
                                            if (!(testCase.assertion == 'propEqual' || testCase.assertion == 'notPropEqual')) {
                                                assertion = 'propEqual';
                                            } else {
                                                assertion = testCase.assertion;
                                            }
                                        } else {
                                            assertion = 'propEqual';
                                        }
                                    } else {
                                        assertion = testCase.assertion || 'deepEqual';
                                    }
                                    if (funObject.async) {
                                        var obj = this;
                                        var time = testCase.callbackTime || 1000;
                                        if (isNaN(time)) {
                                            time = 1000;
                                        }
                                        setTimeout(function() {
                                            if (assertion == 'ok' || assertion == 'notOk') {
                                                assert[assertion](obj.service[funNames].apply(obj.service, testCase.input), name);
                                            } else {
                                                assert[assertion](obj.service[funNames].apply(obj.service, testCase.input), testCase.output, name);
                                            }
                                            asyncArray[asyncArray.length - 1]();
                                        }, time);
                                    } else {
                                        if (assertion == 'ok' || assertion == 'notOk') {
                                            assert[assertion](this.service[funNames].apply(this.service, testCase.input), name);
                                        } else {
                                            assert[assertion](this.service[funNames].apply(this.service, testCase.input), testCase.output, name);
                                        }
                                    }
                                }
                            });
                        } else if (funObject.mocks == true) {
                            var testCase = funObject.testCases;
                            utilityFunctions.QUnitTestForMocks(testCase[0].expects);
                            QUnit.test(testName, function(assert) {
                                assert.expect(0);
                                this.sandbox.mock(this.service).expects(testCase[0].expects);
                                this.service[funNames].apply(this.service, testCase[0].input);
                            });
                        }
                    })(funNames);
                }
            }
        })(services);
    }
    return toReturn;
}

function getTestCases() {
    $.ajax('services-test.json').then(function(data) {
            try {
                testObject = data;
            } catch (e) {
                console.log("Invalid Json");
                testObject = {};
            }
        },
        function() {
            console.log("File not found");
            testObject = {};
        }).always(function() {
        console.log(startTesting(new Utilities()));
    });
}

function makeRealApplication() {
    applicationReal = new Box.TestServiceProvider({}, serviceList.list);
    applicationReal.broadcast = sinon.stub().returns(null);
}


var serviceList = new Object();
$.ajax('serviceList.json').then(function(data) {
        try {
            serviceList = data;
        } catch (e) {
            console.log("Invalid Service List");
            serviceList['list'] = [];
        }
    },
    function() {
        console.log("Missing Service List");
        serviceList.list = [];
    }).always(function() {
    makeRealApplication();
    getTestCases();
});
