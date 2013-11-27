// TODO: work with nested key paths
// TODO: use only one observer per object
// TODO: unobserve function
function observe(target, path, callback){
	Object.observe(target, function(changes){
		changes.filter(function(record){
			return record.name === path;
		}).forEach(function(record){
			callback(record.object[record.name]);
		});
	});
}