Box.Application.addModule('new-transaction',function(context){
	'use strict';
	var Transaction=function(id,type,category,amount,description,timestamp){
		this.id=id;
		this.type=type;
		this.category=category;
		this.amount=amount;
		this.description=description;
		this.timestamp=timestamp;
	};
	var moduleElement,utilities,db,transactions,category,type,currentAccount,globalVars;
	return{
		messages:['addTransaction'],
		init:function(){
			moduleElement=context.getElement();
			utilities=context.getService('utilities');
			db=context.getService('db');
			globalVars=context.getService('globals');
			transactions=db.getData('transactions');
			// categories=db.getData('categories');
			this.createNewTransaction();
			$("#view-title").text("New Transaction");
			currentAccount=globalVars.update('currentAccount');
			// console.log(context.setGlobalConfig('currentAccount',1));
			console.log(currentAccount);
		},
		createNewTransaction:function(){
			// type,category,mode,description,submit
			var div=utilities.createElement('div',null,null,'new-transaction-div');
			var text=utilities.createElement('span','Expense/Income:');
			$(div).append(text);
			var elem=utilities.createDropdownElement('type');
			$(div).append(elem);
			$(div).append($('<br>'));
			var text=utilities.createElement('span','Category:');
			$(div).append(text);
			var elem=utilities.createDropdownElement('category');
			$(div).append(elem);
			$(div).append($('<br>'));
			var text=utilities.createElement('span','Amount: ');
			$(div).append(text);
			var elem=utilities.createElement('input',null,null,null,"input-amount");
			$(div).append(elem);
			$(div).append($('<br>'));
			var text=utilities.createElement('span','Description:');
			$(div).append(text);
			var elem=utilities.createElement('textarea',null,null,null,'input-description');
			$(div).append(elem);
			$(div).append($('<br>'));

			var text=utilities.createElement('span','Date(Leave blank if NA):');
			$(div).append(text);
			var elem=utilities.createElement('input',null,null,null,'input-date','dd-mm-yyyy');
			$(div).append(elem);
			$(div).append($('<br>'));

			var elem=utilities.createElement('button',"Submit",null,null,'btn-submit-transaction');
			$(div).append(elem);
			$(moduleElement).append(div);
			console.log($(moduleElement));
		},
		addTransaction:function(data){
			var day;
			console.log(data.date);
			if(data.date){
				var temp=utilities.validateDay(data.date);
				if(temp[0])
				{
					day=temp[1];
				}
				else{
					day=utilities.getCurrentDateCode();
				}
			}
			else{
				day=utilities.getCurrentDateCode();
			}
			var time=utilities.getCurrentTimeCode();
			if(!(parseInt(data.amount) && parseInt(data.type)>0 && parseInt(data.category)>=0))
				return;
			if(!transactions[currentAccount])
				transactions[currentAccount]={};
			if(!transactions[currentAccount][day])
				transactions[currentAccount][day]=[];
			transactions[currentAccount][day].push(new Transaction(transactions.count,data.type,data.category,data.amount,data.description,time));
			transactions.count++;
			// console.log(day);
			db.setData('transactions',transactions);
		},
		onclick:function(event,element,elementType){
			if(parseInt(elementType) || elementType==='0'){
				var parent=element.parentNode.parentNode.parentNode;
				if(parent.getAttribute('data-type')=='select-type'){
					type=elementType;
					parent.childNodes[0].innerHTML=element.innerHTML+"<span class=caret></span>";
				}
				else if(parent.getAttribute('data-type')=='select-category'){
					category=elementType;
					parent.childNodes[0].innerHTML=element.innerHTML+"<span class=caret></span>";
				}
			}
			else if(elementType=='btn-submit-transaction'){
				var amount=moduleElement.querySelector('[data-type="input-amount"]');
				if(amount.value=="" || !(category) || !(type))
					return;
				var description=moduleElement.querySelector('[data-type="input-description"]');
				var date=moduleElement.querySelector('[data-type="input-date"]');
				var data={};
				data['type']=type;
				data['category']=category;
				data['amount']=amount.value;
				data['description']=description.value;
				data['date']=date.value;
				amount.value=description.value="";
				this.addTransaction(data);
			}
		},
		onkeydown:function(event,element,elementType){
			if(elementType=="input-amount"){
				console.log(event.keyCode);
				if(!((event.keyCode>=48 && event.keyCode<=57)||event.keyCode==190||event.keyCode==9||event.keyCode==8||(event.keyCode>=37 && event.keyCode<=40)))
					event.preventDefault();
			}
			if(elementType=='input-date'){
				console.log(event.keyCode);
				if(!((event.keyCode>=48 && event.keyCode<=57)||event.keyCode==189||event.keyCode==9||event.keyCode==8||(event.keyCode>=37 && event.keyCode<=40)))
					event.preventDefault();
			}
		},
		onmessage:function(message,data){
			if(message=='addTransaction'){
				this.addTransaction(data);
			}
		},
		destroy:function(){
			$(moduleElement).text("");
			moduleElement=null;
			utilities=null;
			db=null;
			transactions=null;
			category=null;
			type=null;
			currentAccount=null;
			globalVars=null;
			$("#view-title").text("Choose an option from menu");
		}
	};
});