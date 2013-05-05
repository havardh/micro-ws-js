(function ($) {

	var url = 'spotify';

	function make_action(action) {
		var $status = this.$div.find('input[name=status]');
		return function () {
			$.ajax({
				url: url,
				method: 'POST',
				dataType: 'json',
				data: {method: action},
				success:function (data) {
					var msg = data.spotify.stderr;
					var start = msg.indexOf('m:') + 3;

					$status.val(msg.substring(start));
				}
			});
		};
	}

	function make_listener(action) {
		var callback = make_action.call(this, action);
		this.$div.find('button[name='+action+']').click(callback);
	}

	var actions = ['prev', 'play', 'pause', 'next', 'status'];

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