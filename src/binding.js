function Binding(type, element, scope, handler){
	this.type = type;
	this.scope = scope;
	this.element = element;
	this.handler = handler;

	observe(scope, element.dataset[type], function(value){
		handler.routine(element, value, scope);
	});
}

Binding.prototype.bind = function(){
	if(this.handler.publish){
		this.handler.bind(this.element, this.publish.bind(this));
	}
};

Binding.prototype.publish = function(){
	write(scope, this.element.dataset[this.type], this.handler.value(this.element));
};