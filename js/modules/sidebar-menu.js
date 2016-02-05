Box.Application.addModule('sidebar-menu',function(context){
	'use strict';
	var db,moduleElement,prevModule,modules,accounts,categories,transactions;
	return{
		messages:['startModule'],
		init:function(){
			$("#view-title").text("Choose an option from menu");
			modules=document.getElementById('content');
			db=context.getService('db');
			accounts=db.getData('accounts');
			categories=db.getData('categories');
			transactions=db.getData('transactions');
			// $("#account-selected").text(accounts.data[0].name);
			moduleElement=context.getElement();
			// $("#view-title").text("Add new Category");
		},
		startModule:function(moduleName,moduleToStop){
			if(moduleToStop){
				Box.Application.stopAll(modules);
				moduleToStop=document.querySelector('[data-module-name="'+moduleToStop+'"]');
				moduleToStop.removeAttribute('data-module');
				moduleToStop.removeAttribute("class");
			}
			var moduleToStart=document.querySelector('[data-module-name="'+moduleName+'"]');
			moduleToStart.setAttribute('data-module',moduleName);
			moduleToStart.setAttribute("class","show");
			Box.Application.startAll(modules);
			prevModule=moduleToStart.getAttribute('data-module-name');
			return [moduleToStart.getAttribute('data-module'), moduleToStart.getAttribute('class')];
		},
		onclick:function(event,element,elementType){
			if(elementType!=""){
				context.broadcast('startModule',elementType);
			}
		},
		onmessage:function(message,data){
			if(message=='startModule'){
				this.startModule(data,prevModule);
			}
		},
		destroy:function(){
			db=null;
			moduleElement=null;
			modules=null;
			accounts=null;
			categories=null;
			transactions=null;
			prevModule=null;
		}
	};
});