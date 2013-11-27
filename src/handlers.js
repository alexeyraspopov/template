text = function(element, scope, attrs){
	observe(scope, attrs.text, function(value){
		element.textContent = value;
	});
};

model = function(element, scope, attrs){
	observe(scope, attrs.model, function(value){
		element.value = value;
	});

	element.addEventListener('change', function(){
		scope[attrs.model] = this.value;
	});
};