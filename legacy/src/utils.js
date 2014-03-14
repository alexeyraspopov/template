// TODO: use only one observer per object
// TODO: unobserve function
function observe(target, path, callback){
	// TODO: create observer for each token (observers chain)
	// TODO: check object existence
	target = targetByPath(target, path);

	Object.observe(target.object, function(changes){
		changes.filter(function(record){
			return record.name === target.key;
		}).forEach(function(record){
			callback(record.object[record.name]);
		});
	});

	callback(target.object[target.key]);
}

function write(target, path, value){
	target = targetByPath(target, path);
	target.object[target.key] = value;
}

function tokenize(path){
	var tokens = path.split('.');

	return {
		list: tokens,
		name: tokens.pop() || path
	};
}

function targetByPath(target, path){
	var tokens = tokenize(path);

	target = tokens.list.reduce(function(target, key){
		return target[key];
	}, target);

	return {
		object: target,
		key: tokens.name
	};
}