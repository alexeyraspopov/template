function Binding(element, scope, handler){
	this.element = element;
	this.scope = scope;
	this.handler = handler;

	// TODO: use routine only with two arguments: element, value
	// TODO: observe value for binding for calling routine
	this.handler.routine(element, scope, element.dataset);
}

Binding.prototype.bind = function(){
	if(this.handler.bind){
		this.handler.bind(this.element, this.scope, this.element.dataset);
	}
};