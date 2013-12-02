text = {
	routine: function(element, value){
		element.textContent = value;
	}
};

model = {
	publish: true,
	bind: function(element, publish){
		element.addEventListener('change', publish);
	},
	value: function(element){
		return element.value;
	},
	routine: function(element, value){
		element.value = value;
	}
};

show = {
	routine: function(element, value){
		element.style.visibility = value ? 'visible' : 'hidden';
	}
};

hide = {
	routine: function(element, value){
		show.routine(element, !value);
	}
};

checked = {
	publish: true,
	bind: model.bind,
	value: function(element){
		return element.checked;
	},
	routine: function(element, value){
		element.checked = !!value;
	}
}