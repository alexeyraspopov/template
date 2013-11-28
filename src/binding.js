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
	if(this.handler.bind){
		this.handler.bind(this.element, this.scope, this.element.dataset);
	}
};