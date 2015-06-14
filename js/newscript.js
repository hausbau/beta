//window.game_data = data.game_data;


var ajaxhandle = {
	data: null,
	getrespons: null,
	get: function(params) {

	}
}

var Timer = {
	init_servertime: null,
	init_localtime: null,
	tickObjects: {},
	setServertime: function(servertime) {
		this.init_servertime = servertime;
	},
	getLocalTime: function() {
		return new Date().getTime();
	},
	init: function(servertime) {
		this.setServertime(servertime);
		this.init_localtime = this.getLocalTime();
		this.tickallObjects();
	},
	getElapsedTime: function() {
		return this.getLocalTime() - Timer.init_localtime;
	},
	getServertime: function() {
		return this.init_servertime + this.getElapsedTime();
	},
	tickallObjects: function() {
		for (var i in Timer.tickObjects) {
			if (Timer.tickObjects[i].hasOwnProperty('start')) {
				Timer.tickObjects[i].start();
			};
		};

		//Ticker xD
		var now = Timer.getServertime();
		var nexttick = 1000 - (now % 1000);
		setTimeout(Timer.tickallObjects, nexttick);
	}
};


Timer.tickObjects.res = {
	start: function() {
		if (!gamedata.wood) return;
		var max	= 400000;
		$(".res").each(function() {
			var speed = parseFloat($(this).attr("title"));
			var current = 1000;
			var element = $(this).attr("id");
			Timer.tickObjects.res.resupdate(element, current, max, speed);
		});
	},
	resupdate: function(element, start, max, speed) {
		now = Math.min(Math.floor(start+speed*(Timer.getElapsedTime() / 1e3)), max);	
		$("#"+element).html(now);
	}
}

Timer.tickObjects.servertime = {
	
}