Box.Application.addService('db',function(application){
	'use strict';
	var Category=function(id,name){
		this.id=id;
		this.name=name;
	};
	var Categories=function(){
		this.count=0;
		this.data=[];
	};
	var Accounts=function(){
		this.count=0;
		this.data=[];
	};
	var AccountInfo=function(id,name){
		this.id=id;
		this.name=name;
	};
	var Transaction=function(){
	}
	var AllTransactions=function(){
		this.count=0;
	};
	var categories,accounts,info,transactions,utilities;
	return{
		getData:function(key){
			var data=localStorage.getItem(key);
			data=JSON.parse(data);
			if(data)
				return data;
			else if(key=='accounts'){
				data=this.initializeAccount();
			}
			else if(key=='categories'){
				data=this.initializeCategories();
			}
			else if(key=='transactions'){
				data=this.initializeTransactions(this.getData('accounts'));
			}
		},
		setData:function(key,data){
			localStorage.setItem(key,JSON.stringify(data));
		},
		initializeTransactions:function(account){
			utilities=application.getService('utilities');
			var day=utilities.getCurrentDateCode();
			var trans=new Transaction();
			trans[day]=[];
			transactions=new AllTransactions();
			transactions[account.data[0].id]=trans;
			this.setData("transactions",transactions);
			return transactions;
		},
		initializeCategories:function(){
			categories=new Categories();
			categories.data.push(new Category(categories.count,"Miscellaneous"));
			categories.count++;
			this.setData("categories",categories);
			return categories;
		},
		initializeAccount:function(){
			accounts=new Accounts();
			accounts.data.push(new AccountInfo(accounts.count,"Cash"));
			accounts.count++;
			this.setData("accounts",accounts);
			return accounts;
		}
	};
});