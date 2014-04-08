var reactive = require('reactive'),
	template = require('template');


function getTarget(source, keypath){
	return keypath.split('.').reduce(function(source, key){
		return source[key];
	}, source);
}

template.adapter.observe = function(object, keypath, callback){
	getTarget(object, keypath).subscribe(callback);
};

template.adapter.unobserve = function(object, keypath, callback){
	getTarget(object, keypath).unsubscribe(callback);
};

template.adapter.get = function(object, keypath){
	return getTarget(object, keypath)();
};

template.adapter.set = function(object, keypath, value){
	getTarget(object, keypath)(value);
};
