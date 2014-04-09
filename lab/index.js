var reactive = require('reactive'),
	template = require('template');

function unwrap(fn){
	// FIXME: update reactive
	return fn.isObservable ? fn() : fn;
}

function getTarget(source, keypath){
	// TODO: How can I observe full path?
	return new Function('_', 'return _.' + keypath.trim())(source);
}

template.adapter.observe = function(object, keypath, callback){
	var target = getTarget(object, keypath)

	target.isObservable && target.subscribe(callback);
};

template.adapter.unobserve = function(object, keypath, callback){
	var target = getTarget(object, keypath)

	target.isObservable && target.unsubscribe(callback);
};

template.adapter.get = function(object, keypath){
	return unwrap(getTarget(object, keypath));
};

template.adapter.set = function(object, keypath, value){
	getTarget(object, keypath)(value);
};
