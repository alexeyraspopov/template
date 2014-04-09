require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"h852ID":[function(require,module,exports){
// TODO: observable.fn
'use strict';

var deps, recording;

function record(cell){
	if(recording && deps.indexOf(cell) < 0){
		deps.push(cell);
	}
}

function startRecord(){
	deps = [];
	recording = true;
}

function getDeps(){
	recording = false;

	return deps;
}

exports.observable = function(value){
	var cell, subscribers;

	cell = function(newValue){
		var changed;

		if(arguments.length){
			changed = cell.comparator(value, newValue);
			value = newValue;

			if(changed){
				cell.notify(value);
			}
		}

		record(cell);

		return value;
	};

	cell.isObservable = true;

	cell.comparator = function(value, newValue){
		return value !== newValue;
	};

	subscribers = [];

	cell.subscribe = function(fn){
		if(subscribers.indexOf(fn) < 0){
			subscribers.push(fn);
		}
	};

	cell.unsubscribe = function(fn){
		var index = subscribers.indexOf(fn);

		if(index > -1){
			subscribers.splice(index, 1);
		}
	};

	cell.notify = function(data){
		subscribers.forEach(function(fn){
			fn(data);
		});
	};

	cell.extend = function(options){
		Object.keys(options).filter(function(key){
			return exports.extenders.hasOwnProperty(key);
		}).forEach(function(key){
			exports.extenders[key](cell, options[key]);
		});

		return cell;
	};

	return cell;
};

exports.computed = function(read){
	var data = exports.observable();

	startRecord();
	data(read());

	getDeps().forEach(function(cell){
		cell.subscribe(function(){
			data(read());
		});
	});

	return data;
};

exports.extenders = {
	notify: function(cell, option){
		cell.comparator = option === 'always' ? function(){
			return true;
		} : cell.comparator;
	}
};

},{}],"reactive":[function(require,module,exports){
module.exports=require('h852ID');
},{}],"iVDqJA":[function(require,module,exports){
/* jshint browser:true */
'use strict';

var bindings = {
	'value': {
		bind: function(element, publish){ element.addEventListener('change', publish); },
		unbind: function(element, publish){ element.removeEventListener('change', publish); },
		routine: function(element, value){ element.value = value; }
	},
	'text': { routine: function(element, value){ element.innerText = value; } },
	'html': { routine: function(element, value){ element.innerHTML = value; } },

	// TODO: what if handler was changed? Should I remove prev listener?
	'on-*': { routine: function(element, value, args){ element.addEventListener(args[0], value); } },
	'*': { routine: function(element, value, args){ element.setAttribute(args[0], value); } }
};

var adapter = {
	// object, keypath, callback
	observe: function(){},

	// object, keypath, callback
	unobserve: function(){},

	// object, key
	get: function(){},

	// object, key, value
	set: function(){}
};

function createTreeWalker(root){
	var filter = { acceptNode: function(){ return NodeFilter.FILTER_ACCEPT; } },
		walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filter, false);

	return walker;
}

function Binder(key, binder){
	this.name = new RegExp(key.replace(/\-/g, '').replace(/\*/g, '(.+)'));

	Object.keys(binder).forEach(function(key){
		this[key] = binder[key];
	}, this);
}

Binder.prototype.routine = function(){};
Binder.prototype.bind = function(){};
Binder.prototype.unbind = function(){};

function getBindings(){
	return Object.keys(bindings).map(function(key){
		return new Binder(key, bindings[key]);
	});
}

function compile(root, model){
	var walker = createTreeWalker(root),
		node = walker.currentNode,
		bindings = getBindings();

	do{
		bind(node, model, bindings);
		node = walker.nextNode(); // .nextSibling();
	}while(node);
}

function bind(node, model, bindings){
	Object.keys(node.dataset).forEach(function(key){
		var handler = bindings.find(function(handler){
			return handler.name.test(key);
		});

		if(handler){
			handle(node, key, model, handler);
		}
	});
}

function handle(node, type, model, handler){
	var args = handler.name.exec(type),
		keypath = node.dataset[args.splice(0, 1)];

	args = args.map(function(key){
		return key.toLowerCase();
	});

	adapter.observe(model, keypath, function(){
		handler.routine(node, adapter.get(model, keypath), args);
	});

	handler.bind(node, function(){
		adapter.set(model, keypath, node.value);
	}, args);

	handler.routine(node, adapter.get(model, keypath), args);
}

exports.compile = compile;
exports.handlers = bindings;
exports.adapter = adapter;

},{}],"template":[function(require,module,exports){
module.exports=require('iVDqJA');
},{}],5:[function(require,module,exports){
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

},{"reactive":"h852ID","template":"iVDqJA"}]},{},[5])