Box.Application.addService('utilities',function(application){
	'use strict';
	var Color=function(name,hash){
	this.name=name;
	this.hash=hash;
	}
	var Colors=[];
	Colors.push(new Color("Select Color","undefined"));
	Colors.push(new Color("","e5e5ff"));
	Colors.push(new Color("","ffe5f6"));
	Colors.push(new Color("","c6ecc6"));
	Colors.push(new Color("","ffffb3"));
	Colors.push(new Color("","ffcccc"));
	Colors.push(new Color("","ebccff"));
	Colors.push(new Color("","fff2cc"));
	Colors.push(new Color("","ccd9ff"));
	var db=application.getService('db');
	var categories=db.getData('categories');
	var accounts=db.getData('accounts');
	var dropdownParameters=function(divDataType,buttonDisplay,anchorDisplay,anchorDataType){
		this.divDataType=divDataType;
		this.buttonDisplay=buttonDisplay;
		this.anchorDisplay=anchorDisplay;
		this.anchorDataType=anchorDataType;
	};
	var Dropdowns=[];
	var catArray=[[],[]];
	for(var key in categories.data){
		catArray[0].push(categories.data[key].name);
		catArray[1].push(categories.data[key].id);
	}
	var accountArray=[[],[]];
	for(var key in accounts.data){
		accountArray[0].push(accounts.data[key].name);
		accountArray[1].push(accounts.data[key].id);
	}
	Dropdowns['type']=new dropdownParameters("select-type",'Expense/Income',['Expense','Income'],[1,2]);
	Dropdowns['category']=new dropdownParameters("select-category",'Select Category',catArray[0],catArray[1]);
	Dropdowns['account']=new dropdownParameters("select-account",'Switch Account',accountArray[0],accountArray[1]);
	// console.log(catArray);
	var parseAsText=function(content){
			return content.replace(/(&)/g,"&amp;").replace(/(<)/g,"&lt;").replace(/(>)/g,"&gt;").replace(/(")/g,"&quot;").replace(/(')/g,"&#039;");
		};
	return {
		isUnique:function(data,toFind){
			for(var key in data.data){
				if(data.data[key].name.toUpperCase()==toFind.toUpperCase())
					return false;
			}
			return true;
		},
		validateDay:function(date){
			date=date.split('-');
			if(date.length==3){
				date=new Date(date[2],date[1]-1,date[0]);
				if(date!="Invalid Date"){
					return [true,this.getCurrentDateCode(date)];
				}
			}
			return false;
		},
		capitalizeFirstLetter:function(text){
			if(text){
				return text.charAt(0).toUpperCase() + text.slice(1);
			}
			else
				return "";
		},
		getCurrentDateCode:function(inputDate){
			if(inputDate){
				return inputDate.getYear().toString()+'-'+inputDate.getMonth().toString()+'-'+inputDate.getDate().toString();
			}
			else{
				var date=new Date();
				return date.getYear().toString()+'-'+date.getMonth().toString()+'-'+date.getDate().toString();
			}
		},
		getCurrentTimeCode:function(){
			var date=new Date();
			return date.getTime().toString();
		},
		changeUrl:function(URL){
			return URL.toLowerCase().replace(" ","-");
		},
		cleanUp:function(content){
			return parseAsText(content.trim());
		},
		// parseAsText:function(content){
		// 	return content.replace(/(&)/g,"&amp;").replace(/(<)/g,"&lt;").replace(/(>)/g,"&gt;").replace(/(")/g,"&quot;").replace(/(')/g,"&#039;");
		// },
		parseAsHTML:function(content){
			return content.replace(/(&lt;)/g,'<').replace(/(&gt;)/g,'>').replace(/(&amp;)/g,'&').replace(/(&quot;)/g,'\"').replace(/(&#039;)/g,'\'');
		},
		getColor:function(id){
			return Colors[id].hash;
		},
		getCategory:function(id){
			return categories.data[id].name;
		},
		updateCategory:function(){
			categories=db.getData('categories');
			catArray[0].push(categories.data[categories.count-1].name);
			catArray[1].push(categories.data[categories.count-1].id);
			Dropdowns['category']=new dropdownParameters("select-category",'Select Category',catArray[0],catArray[1]);
		},
		updateAccount:function(){
			accounts=db.getData('accounts');
			accountArray[0].push(accounts.data[accounts.count-1].name);
			accountArray[1].push(accounts.data[accounts.count-1].id);
			Dropdowns['account']=new dropdownParameters("select-account",'Switch Account',accountArray[0],accountArray[1]);
		},
		createElement:function(type,innerHTML,id,Class,dataType,placeholder){
			var element=document.createElement(type);
			if(innerHTML || innerHTML==0)
				element.innerHTML=innerHTML;
			if(id || id==0)
				element.setAttribute('id',id);
			if(Class)
				element.setAttribute('class',Class);
			if(dataType || dataType==0)
				element.setAttribute('data-type',dataType);
			if(placeholder)
				element.setAttribute('placeholder',placeholder);
			return element;
		},
		createDropdownElement:function(type){
			var frag=document.createDocumentFragment();
			var div,button,data;
			div=this.createElement('div',null,null,"dropdown",Dropdowns[type].divDataType);
			button=this.createElement('button',Dropdowns[type].buttonDisplay,null,"btn btn-primary dropdown-toggle");
			frag.appendChild(div);
			button.setAttribute("type","button");
			button.setAttribute("data-toggle","dropdown");
			div.appendChild(button);
			var span=this.createElement('span',null,null,'caret');
			button.appendChild(span);
			var ul=this.createElement('ul',null,null,"dropdown-menu");
			div.appendChild(ul);
			for(var key in Dropdowns[type].anchorDisplay){
				var li=this.createElement('li');
				var a;
				a=this.createElement('a',Dropdowns[type].anchorDisplay[key],null,null,Dropdowns[type].anchorDataType[key]);
				li.appendChild(a);
				ul.appendChild(li);
			}
			return frag;
		}
	};
});