Box.Application.addModule('summary',function(context){
	'use strict';
	var moduleElement,utilities,db;
	return{
		init:function(){
			moduleElement=context.getElement();
			utilities=context.getService('utilities');
			db=context.getService('db');
			$("#view-title").text("View Summary");
		},
		destroy:function(){
			$(moduleElement).text("");
			$("#view-title").text("Choose an option from menu");
			moduleElement=null;
			utilities=null;
			db=null;
		}
	};
});