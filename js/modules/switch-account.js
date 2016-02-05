Box.Application.addModule('switch-account',function(context){
	'use strict';
	var moduleElement,utilities,accounts,db,globals,changeTo;
	return{
		messages:['switchAccount'],
		init:function(){
			moduleElement=context.getElement();
			utilities=context.getService('utilities');
			db=context.getService('db');
			accounts=db.getData('accounts');
			globals=context.getService('globals');
			$("#view-title").text("Switch Account");
			this.createSwitchAccount();
		},
		createSwitchAccount:function(){
			var div=utilities.createElement('div',null,null,'switch-account-div');
			var input=utilities.createDropdownElement('account');
			$(div).append(input);
			var button=utilities.createElement('button','Switch Account',null,null,'switch-account-button');
			$(div).append(button);
			$(moduleElement).append(div);
		},
		changeAccount:function(newAccount,fromUI){
			if(fromUI){
				globals.update('currentAccount',newAccount);
				for(var key in accounts.data){
					if(accounts.data[key].id==newAccount){
						$("#account-selected").text(accounts.data[key].name);
					}
				}
			}
			else{
				for(var key in accounts.data){
					if(accounts.data[key].name.toUpperCase()==newAccount.toUpperCase()){
						$("#account-selected").text(accounts.data[key].name);
						globals.update('currentAccount',accounts.data[key].id);
						changeTo=accounts.data[key].id;
						var elem=moduleElement.querySelector('[type="button"]');
						// elem.innerHTML=accounts.data[key].name+"<span class=caret></span>";
					}
				}
			}
		},
		onclick:function(event,element,elementType){
			if(parseInt(elementType)|| elementType==='0'){
				// $("#account-selected")
				var parent=element.parentNode.parentNode.parentNode;
				parent.childNodes[0].innerHTML=element.innerHTML+"<span class=caret></span>";
				changeTo=elementType;
			}
			else if(elementType=='switch-account-button'){
				this.changeAccount(changeTo,true);
			}
		},
		onmessage:function(message,data){
			if(message='switchAccount'){
				this.changeAccount(data);
			}
		},
		destroy:function(){
			$(moduleElement).text("");
			$("#view-title").text("Choose an option from menu");
			moduleElement=null;
			utilities=null;
			accounts=null;
			db=null;
			globals=null;
			changeTo=null;
		}
	};
});