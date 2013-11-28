// TODO: use only one observer per object
// TODO: unobserve function
function observe(target, path, callback){
	var tokens = path.split('.'),
		name = tokens.pop() || path;

	// TODO: create observer for each token (observers chain)
	// TODO: check object existence
	if(tokens.length){
		target = tokens.reduce(function(target, key){
			return target[key];
		}, target);
	}

	Object.observe(target, function(changes){
		changes.filter(function(record){
			return record.name === name;
		}).forEach(function(record){
			callback(record.object[record.name]);
		});
	});

	callback(target[name]);
}