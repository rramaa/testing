'use strict';
Box.Application.stopAll=sinon.stub().returns(null);
Box.Application.startAll=sinon.stub().returns(null);

var contextReal=new Box.TestServiceProvider({
},['db','utilities','globals']);
contextReal.broadcast=sinon.stub().returns(null);

var testObject=new Object();
$.ajax('tests.json',{
	dataType:'json',
	success:function(data){
		try{
			testObject=data;
		}catch(e){
			console.log("Invalid Json");
			testObject={};
		}
	},
	error:function(){
		console.log("Error");
		testObject={};
	},
	complete:function(){
		startTesting();
	}
});
function startTesting(){
	var toReturn={};
	toReturn['error']=[];
	for(var modules in testObject){
		if(typeof modules!=='string'){
			toReturn.error.push("Module Name is not a string");
			continue;
		}
		QUnit.module('modules/'+modules,{
			beforeEach:function(){
				this.sandbox=sinon.sandbox.create();
				var context=contextReal;
				if(testObject[modules].hasOwnProperty('prerequisites')){
					var fakeServices={},realServices=[];
					if(testObject[modules].prerequisites.hasOwnProperty('realServices')){
						realServices=testObject[modules].prerequisites.realServices;
							if(!(realServices instanceof Array)){
							toReturn.error.push("Real Services list is not an Array");
							realServices=[];
						}
					}
					var service=new Object();
					if(testObject[modules].prerequisites.hasOwnProperty('fakeServices')){
						fakeServices=testObject[modules].prerequisites.fakeServices;
						if(!(fakeServices instanceof Array)){
							toReturn.error.push("Fake Services list is not an Array");
							fakeServices={};
						}
						for(var key in fakeServices){
							for(var serviceName in fakeServices[key]){
								service[serviceName]={};
								if(fakeServices[key][serviceName].hasOwnProperty('stubs')){
									for(var funNames in fakeServices[key][serviceName].stubs){
										if($.isEmptyObject(fakeServices[key][serviceName].stubs[funNames])){
											service[serviceName][funNames]=this.sandbox.stub().returns(null);
										}
										else{
											var stub=this.sandbox.stub().returns(null);
											for(var params in fakeServices[key][serviceName].stubs[funNames]){
												stub.withArgs(params).returns(fakeServices[key][serviceName].stubs[funNames][params]);
											}
											service[serviceName][funNames]=stub;
											// console.log(stub('accounts'));
										}
									}
								}
							}
						}
					}
					context=new Box.TestServiceProvider(service,realServices);
					context.broadcast=this.sandbox.stub().returns(null);
				}
				this.module=new Box.Application.getModuleForTest(modules,context);
				// console.log(context);
				this.module.init();
			},
			afterEach:function(){
				this.module.destroy();
				this.sandbox.verifyAndRestore();
			}
		});
		QUnit.test('test',function(assert){
			assert.deepEqual(this.module.startModule("calculator"),["calculator","show"],"Test");
		})
	}
	return toReturn;
}












//

// QUnit.module('modules/add-category',{
// 	beforeEach:function(){
// 		this.sandbox=sinon.sandbox.create();
// 		var dbFake={
// 			getData:getDataStub,
// 			setData:setDataStub
// 		};
// 		var contextFake=new Box.TestServiceProvider({
// 			'db':dbFake
// 		},['utilities']);
// 		contextFake.broadcast=this.sandbox.stub().returns(null);
// 		this.module=new Box.Application.getModuleForTest('add-category',contextFake);
// 		this.module.init();
// 	},
// 	afterEach:function(){
// 		this.module.destroy();
// 		this.sandbox.verifyAndRestore();
// 	}
// });
// QUnit.test('message',function(assert){
// 	assert.expect(0);
// 	this.sandbox.mock(this.module).expects('addCategory');
// 	this.module.onmessage('addCategory','test');
// });
// // 
// QUnit.test('Add Category',function(assert){
// 	assert.propEqual(this.module.addCategory('test Category'),{"count":2,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"}]},"test Category");
// 	assert.propEqual(this.module.addCategory('test category'),{"count":2,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"}]},"test category");
// 	assert.propEqual(this.module.addCategory('testing'),{"count":3,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"},{"id":2,"name":"Testing"}]},"testing");
// 	assert.propEqual(this.module.addCategory('   tes '),{"count":4,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"},{"id":2,"name":"Testing"},{"id":3,"name":"Tes"}]},"   tes ");
// 	assert.propEqual(this.module.addCategory('<script>'),{"count":5,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"},{"id":2,"name":"Testing"},{"id":3,"name":"Tes"},{"id":4,"name":"&lt;script&gt;"}]},"<script>");
// 	assert.propEqual(this.module.addCategory(''),{"count":5,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"},{"id":2,"name":"Testing"},{"id":3,"name":"Tes"},{"id":4,"name":"&lt;script&gt;"}]},"Empty String");
// 	assert.propEqual(this.module.addCategory(34),{"count":5,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"},{"id":2,"name":"Testing"},{"id":3,"name":"Tes"},{"id":4,"name":"&lt;script&gt;"}]},"Number");
// 	assert.propEqual(this.module.addCategory(accounts),{"count":5,"data":[{"id":0,"name":"Miscellaneous"},{"id":1,"name":"Test Category"},{"id":2,"name":"Testing"},{"id":3,"name":"Tes"},{"id":4,"name":"&lt;script&gt;"}]},"Object");
// });






// QUnit.module('services/utilities',{
// 	beforeEach:function(){
// 		this.sandbox=sinon.sandbox.create();
// 		var dbFake={
// 			getData:getDataStub,
// 			setData:setDataStub
// 		};
// 		var applicationFake=new Box.TestServiceProvider({
// 			'db':dbFake
// 		});
// 		this.service=Box.Application.getServiceForTest('utilities',applicationFake);
// 		// console.log(this.service);
// 	},
// 	afterEach:function(){
// 		this.sandbox.verifyAndRestore();
// 	}
// });
// QUnit.test('Validate Day',function(assert){
// 	assert.deepEqual(this.service.validateDay("12-02-2016"),[true,"116-1-12"],"12-02-2016");
// 	assert.deepEqual(this.service.validateDay("12-2-2016"),[true,"116-1-12"],"12-2-2016");
// 	assert.deepEqual(this.service.validateDay("30-2-2016"),[true,"116-2-1"],"30-2-2016");
// 	assert.deepEqual(this.service.validateDay("12-2-201-6"),false,"12-2-201-6");
// 	assert.deepEqual(this.service.validateDay("122-2016"),false,"122-2016");
// 	assert.deepEqual(this.service.validateDay("12w-2-2016"),false,"12w-2-2016");
// 	assert.deepEqual(this.service.validateDay("1222016"),false,"1222016");
// });





// QUnit.module('modules/calculator',{
// 	beforeEach:function(){
// 		var utilitiesFake={
// 			createElement:sinon.stub().returns(null)
// 		};
// 		console.log(utilitiesFake);
// 		var contextFake=new Box.TestServiceProvider({
// 			'utilities':utilitiesFake
// 		});
// 		this.module=Box.Application.getModuleForTest('calculator',contextReal);
// 		this.div=this.module.init();
// 		this.sandbox=sinon.sandbox.create();
// 	},
// 	afterEach:function(){
// 		this.module.destroy();
// 		this.sandbox.verifyAndRestore();
// 	}
// });
// QUnit.test('DOM test',function(assert){
// 	var fixture=$('#qunit-fixture');
// 	fixture.append(this.module.createCalculator());
// 	assert.deepEqual($("button",fixture).length,18,"No of buttons");
// 	assert.deepEqual($("textarea",fixture).length,1,"No of screens");
// });
// QUnit.test('test functionality',function(assert){
// 	assert.deepEqual(this.module.deletePrevious(),"","Delete previous on an empty expression");
// 	assert.deepEqual(this.module.addToExpression(2),"2","Insert 2 to expression");
// 	assert.deepEqual(this.module.addToExpression("/"),"2/","Insert / to expression");
// 	assert.deepEqual(this.module.addToExpression("8"),"2/8","Insert 8 to expression");
// 	assert.deepEqual(this.module.evaluateExpression(),0.25,"Get Answer of 2/8");
// 	assert.deepEqual(this.module.addToExpression('2/'),"2/","Insert 2/ to expression");
// 	assert.deepEqual(this.module.evaluateExpression(),undefined,"Evaluate invalid expression");
// 	assert.deepEqual(this.module.deletePrevious(),"2","Delete Previous");
// 	assert.deepEqual(this.module.addToExpression('*'),"2*","Insert * to expression");
// 	assert.deepEqual(this.module.addToExpression('100'),"2*100","Insert 100 to expression");
// 	assert.deepEqual(this.module.evaluateExpression(),200,"Evaluate expression");
// 	assert.deepEqual(this.module.deletePrevious(),"","Delete previous expression");
// 	assert.deepEqual(this.module.addToExpression('2+3'),"2+3","Insert 2+3 to expression");
// 	assert.deepEqual(this.module.deleteAll(),"","Clear expression");
// });
// QUnit.test('Equal click Event',function(assert){
// 	assert.expect(0);
// 	this.sandbox.mock(this.module).expects('evaluateExpression');
// 	var target=this.module.createCalculator().childNodes[14];
// 	var event=$.Event('click',{
// 		target:target
// 	});
// 	this.module.onclick(event,target,'=');
// });
// QUnit.test('Delete Previous click Event',function(assert){
// 	assert.expect(0);
// 	this.sandbox.mock(this.module).expects('deletePrevious');
// 	var target=this.module.createCalculator().childNodes[17];
// 	var event=$.Event('click',{
// 		target:target
// 	});
// 	// $(target).click();
// 	this.module.onclick(event,target,'C');
// });
// QUnit.test('Delete All click Event',function(assert){
// 	assert.expect(0);
// 	this.sandbox.mock(this.module).expects('deleteAll');
// 	var target=this.module.createCalculator().childNodes[18];
// 	var event=$.Event('click',{
// 		target:target
// 	});
// 	this.module.onclick(event,target,'CE');
// });