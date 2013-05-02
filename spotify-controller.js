(function ($) {

	var url = 'spotifies';

	function make_action(action) {

		return function () {
			$.post(url, {method: action});
		};
	}

	function make_listener(action) {
		var callback = make_action(action);
		this.$div.find('button[name='+action+']').click(callback);
	}

	var actions = ['prev', 'play', 'pause', 'next'];

	function listeners() {
		for (var i in actions) {
			make_listener.call(this, actions[i]);
		}
	}

	var spotify = {
		create: function () {
			return Object.create(spotify);
		},
		init: function () {
			this.$div = $('#spotify-controller');
			listeners.call(this);
		}
	};

	$(document).ready(function () {
		var S = spotify.create();
		S.init();
	});

}(jQuery));