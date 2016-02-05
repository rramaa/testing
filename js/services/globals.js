Box.Application.addService('globals',function(application){
	'use strict';
	var globalVars=[];
	globalVars['categories']=null;
	globalVars['accounts']=null;
	globalVars['currentAccount']=0;
	globalVars['transactions']=null;
	return{
		update:function(key,data){
			// if(globalVars[key]){
			// 	return false;
			// }
			if(data){
				globalVars[key]=data;
			}
			else{
				return globalVars[key];
			}
		}
	};
});