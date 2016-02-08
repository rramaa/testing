'use strict';

function startTesting(utilityFunctions) {
    for (var modules in testObject) {
        (function(modules) {
            if ($.type(modules) !== 'string') {
                toReturn.error.push("Module Name is not a string");
                testObject[modules] = {};
            }
            QUnit.module('modules/' + modules, {
                beforeEach: function() {
                    this.sandbox = sinon.sandbox.create();
                    var context = contextReal;
                    if (testObject[modules].prerequisites) {
                        var realServices = [];
                        if (testObject[modules].prerequisites.realServices) {
                            realServices = utilityFunctions.handleRealServices(testObject[modules].prerequisites.realServices);
                        }
                        var fakeServices = new Object();
                        if (testObject[modules].prerequisites.fakeServices) {
                            fakeServices = utilityFunctions.handleFakeServices(this.sandbox, testObject[modules].prerequisites.fakeServices);
                        }
                        context = new Box.TestServiceProvider(fakeServices, realServices);
                        context.broadcast = this.sandbox.stub().returns(null);
                    }
                    this.module = new Box.Application.getModuleForTest(modules, context);
                    this.module.init();
                },
                afterEach: function() {
                    this.module.destroy();
                    this.sandbox.verifyAndRestore();
                }
            });
            if (testObject[modules].functions) {
                for (var funNames in testObject[modules].functions) {
                    (function(funNames) {
                        var testName = funNames + "/test";
                        if (testObject[modules].functions[funNames].name) {
                            if ($.type(testObject[modules].functions[funNames].name) !== 'string') {
                                toReturn.warning.push("Name of Function not a string");
                            } else {
                                testName = testObject[modules].functions[funNames].name;
                            }
                        }
                        var funObject = testObject[modules].functions[funNames];
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
                                                assert[assertion](obj.module[funNames].apply(obj.module, testCase.input), name);
                                            } else {
                                                assert[assertion](obj.module[funNames].apply(obj.module, testCase.input), testCase.output, name);
                                            }
                                            asyncArray[asyncArray.length - 1]();
                                        }, time);
                                    } else {
                                        if (assertion == 'ok' || assertion == 'notOk') {
                                            assert[assertion](this.module[funNames].apply(this.module, testCase.input), name);
                                        } else {
                                            assert[assertion](this.module[funNames].apply(this.module, testCase.input), testCase.output, name);
                                        }
                                    }
                                }
                            });
                        } else if (funObject.mocks == true) {
                            QUnit.test(testName, function(assert) {
                                assert.expect(0);
                                var testCase = funObject.testCases;
                                this.sandbox.mock(this.module).expects(testCase[0].expects);
                                this.module[funNames].apply(this.module, testCase[0].input);
                            });
                        }
                    })(funNames);
                }
            }
        })(modules);
    }
    return toReturn;
}

function getTestCases() {
    $.ajax('modules-test.json').then(function(data) {
            try {
                testObject = data;
            } catch (e) {
                console.log("Invalid Json");
                testObject = {};
            }
        },
        function() {
            console.log("Missing Test File");
            testObject = {};
        }).always(function() {
        startTesting(new Utilities());
    });
}

function makeRealContext() {
    contextReal = new Box.TestServiceProvider({}, serviceList.list);
    contextReal.broadcast = sinon.stub().returns(null);
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
    makeRealContext();
    getTestCases();
});
