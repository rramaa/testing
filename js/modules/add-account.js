Box.Application.addModule('add-account',function(context){
	'use strict';
	var Account=function(id,name){
		this.id=id;
		this.name=name;
	};
	var moduleElement,utilities,accounts,db;
	return{
		messages:['addAccount'],
		init:function(){
			moduleElement=context.getElement();
			utilities=context.getService('utilities');
			db=context.getService('db');
			accounts=db.getData('accounts');
			$("#view-title").text("Add new Account");
			this.createAddAccount();
		},
		createAddAccount:function(){
			var div=utilities.createElement('div',null,null,'add-account-div');
			var input=utilities.createElement('input',null,null,null,'add-account-input');
			$(div).append(input);
			var button=utilities.createElement('button','Add Account',null,null,'add-account-button');
			$(div).append(button);
			$(moduleElement).append(div);
			return div;
		},
		addAccount:function(value){
			if((typeof value==='string')&& value!==''){
				value=utilities.cleanUp(value);
				value=utilities.capitalizeFirstLetter(value);
				if(utilities.isUnique(accounts,value)){
					var account=new Account(accounts.count,value);
					accounts.count++;
					accounts.data.push(account);
					db.setData('accounts',accounts);
					utilities.updateAccount();
					// utilities.updateCategory();
					context.broadcast('accountAdded',account);
				}
			}
			return accounts;
		},
		onclick:function(event,element,elementType){
			if(elementType=='add-account-button'){
				var inputEl=moduleElement.querySelector('[data-type="add-account-input"]');
				context.broadcast('addAccount',inputEl.value);
				inputEl.value="";
			}
		},
		onkeydown:function(event,element,elementType){
			if(event.keyCode==13){
				if(elementType=="add-account-input"){
					var inputEl=moduleElement.querySelector('[data-type="add-account-input"]');
					context.broadcast('addAccount',inputEl.value);
					element.value="";
				}
			}
		},
		onmessage:function(message,data){
			if(message='addAccount'){
				this.addAccount(data);
			}
		},
		destroy:function(){
			$(moduleElement).text("");
			$("#view-title").text("Choose an option from menu");
			moduleElement=null;
			utilities=null;
			accounts=null;
			db=null;
		}
	};
});