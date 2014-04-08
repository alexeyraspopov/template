var reactive = require('../bower_components/reactive/index.js'),
	template = require('../index.js');


function getTarget(source, keypath){
	return keypath.split('.').reduce(function(source, key){
		return source[key];
	}, source);
}

template.adapter.observe = function(object, keypath, callback){
	object = getTarget(object, keypath);
	object.subscribe(callback);
};

template.adapter.unobserve = function(object, keypath, callback){
	object = getTarget(object, keypath);
	object.unsubscribe(callback);
};

template.adapter.get = function(object, keypath){
	object = getTarget(object, keypath);
	return object();
};

template.adapter.set = function(object, keypath, value){
	object = getTarget(object, keypath);
	object(value);
};

template.compile(viewport, { name: reactive.observable('Alex') });
