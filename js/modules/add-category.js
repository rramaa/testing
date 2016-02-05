Box.Application.addModule('add-category',function(context){
	'use strict';
	var Category=function(id,name){
		this.id=id;
		this.name=name;
	};
	var moduleElement,utilities,categories,db;
	return{
		messages:['addCategory'],
		init:function(){
			moduleElement=context.getElement();
			utilities=context.getService('utilities');
			db=context.getService('db');
			categories=db.getData('categories');
			$("#view-title").text("Add new Category");
			this.createAddCategory();
		},
		createAddCategory:function(){
			var div=utilities.createElement('div',null,null,'add-category-div');
			var input=utilities.createElement('input',null,null,null,'add-category-input');
			$(div).append(input);
			var button=utilities.createElement('button','Add Category',null,null,'add-category-button');
			$(div).append(button);
			$(moduleElement).append(div);
		},
		addCategory:function(value){
			if((typeof value==="string")&& value!==""){
				value=utilities.cleanUp(value);
				value=utilities.capitalizeFirstLetter(value);
				if(utilities.isUnique(categories,value)){
					var category=new Category(categories.count,value);
					categories.count++;
					categories.data.push(category);
					db.setData('categories',categories);
					// console.log(categories);
					utilities.updateCategory();
					context.broadcast('categoryAdded',category);
				}
			}
			return categories;
		},
		onclick:function(event,element,elementType){
			if(elementType=='add-category-button'){
				var inputEl=moduleElement.querySelector('[data-type="add-category-input"]');
				context.broadcast('addCategory',inputEl.value);
				inputEl.value="";
			}
		},
		onmessage:function(message,data){
			if(message='addCategory'){
				this.addCategory(data);
			}
		},
		onkeydown:function(event,element,elementType){
			if(event.keyCode==13){
				if(elementType=="add-category-input"){
					var inputEl=moduleElement.querySelector('[data-type="add-category-input"]');
					context.broadcast('addCategory',inputEl.value);
					element.value="";
				}
			}
		},
		destroy:function(){
			$(moduleElement).text("");
			$("#view-title").text("Choose an option from menu");
			moduleElement=null;
			utilities=null;
			categories=null;
			db=null;
		}
	};
});