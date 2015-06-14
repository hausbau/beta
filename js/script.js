var Timer = {
	init_servertime: null,
	init_localtime: null,
	addservertime: 0,
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
	getElapsedTimeData: function() {
		this.getLocalTime - Timer.init_localtime - Timer.addservertime;
	},
	tickallObjects: function() {
		for (var i in Timer.tickObjects) {
			if (Timer.tickObjects[i].hasOwnProperty('start')) {
				Timer.tickObjects[i].start();
			};
		};
		var now = Timer.getServertime();
		var nexttick = 1000 - (now % 1000);
		setTimeout(Timer.tickallObjects, nexttick);
	},
	reset: function() {
		this.addservertime += this.getElapsedTimeData();
		for (var i in Timer.tickObjects) {
			if (Timer.tickObjects[i].hasOwnProperty('restart')) {
				Timer.tickObjects[i].restart(); 
			};
		}
	}
};

var Formating = {
	tohis: function(time) {
		var lefttime = null;
		var days = Math.floor(time / 86400);
		var hours = Math.floor(time / 3600) % 24;
		var minutes = Math.floor(time / 60) % 60;
		var seconds = Math.floor(time) % 60;
		if (minutes <= 9) { minutes = "0"+minutes; };
		if (seconds <= 9) { seconds = "0"+seconds; };

		lefttime = hours+":"+minutes+":"+seconds;
		return lefttime;
	}
};

Timer.tickObjects.res = {
	oldressorces: {},
	start: function() {
		Timer.tickObjects.res.startprod('rwood');
		Timer.tickObjects.res.startprod('rstone');
		Timer.tickObjects.res.startprod('riron');
	},

	startprod: function(element) {
		max = parseInt(gamedata.village.maxstorage);
		speed = parseFloat(gamedata.village.speed[element]);
		current = Timer.tickObjects.res.getres(element);
		this.resupdate(element, current, max, speed);
	},

	getres: function(element) {
		if (Timer.tickObjects.res.oldressorces.hasOwnProperty(element)) {
			return this.oldressorces[element];
		};
		return this.init(element);
	},

	init: function(element) {
		start = parseFloat(gamedata.village[element]);
		return Timer.tickObjects.res.oldressorces[element] = start;
	},

	resupdate: function(element, start, max, speed) {
		now = Math.min(Math.floor(start+speed*(Timer.getElapsedTime() / 1e3)), max);
		$("#"+element).html(now);
	},
	restart: function() {
		Timer.tickObjects.res.oldressorces = {};
	}
}

/*Timer.tickObjects.timer2 = {
	start: function() {
		var data = { bid: "br" };
		var page = "recruit";
		ajaxhandle.post(data, page, null);	
	}	
}*/

Timer.tickObjects.timer = {
	start: function() {
		$(".timer").each(function() {
			var dur = parseInt($(this).attr("t"));
			var page = $(this).attr("p");
			var bid = $(this).data("bid");
			var now = Math.floor(Timer.getLocalTime() / 1e3);
			time = dur - now;
			if (time <= 0) {
				time = 0;
				var data = { bid: bid };
				ajaxhandle.post(data, page, null);
				return false;
			};
			$(this).text(Formating.tohis(time));
		});
	},
	restart: function() {
		this.start();
	}
}

Timer.tickObjects.servertime = {
	start: function() {	$("#serverTime").text(getTime(Timer.getLocalTime())); }
}


var ajaxhandle = {
	get: function(get,location) {
		url = this.getrequrl("GET", get, location);
		this.sendrequest("GET", {}, url);
	},
	post: function(post,location, get, callback) {
		if (get == undefined ) { get = {}; };
		url = this.getrequrl("POST", get, location);
		this.sendrequest("POST", post, url, callback);
	},
	sendrequest: function(method, post, url, callback) {
		$.ajax({
			async: true,
			url: url,
			type: method,
			data: post,
			dataType: "json",
			success: function(data) {
				ajaxhandle.prepeareresponse(data);
			},
			error: function(xhr, status) {
			}	
		});
	},
	getrequrl: function(method, getparams, location) {
		var file = "php/ajax/"+location+".php";
		url = file+"?"+$.param(getparams);
		return url;
	},
	prepeareresponse: function(data) {
		if (!data.hasOwnProperty("error") && !data.hasOwnProperty("content")) {
			console.log("Cant prepare the repsonse!");
			return false;
		};

		if (data.hasOwnProperty("errors") && data.errors != null) {
			console.log(data.errors);
			return false;
		};

		if (data.hasOwnProperty("content") && data.content != null) {
			$(".content").html(data.content);
		};

		if(data.hasOwnProperty("gamedata")) {
			gamedata = data.gamedata;
			Timer.reset();
		};
	}
}

var uorders = {
	init: function() {
		this.getunit();
	},

	getunit: function() {
		$(".content").on('click', '.btn-recruit', function() {
			var bid = $(this);
			var units = $(".recruit").serializeArray();
			uorders.recruit(units, bid.data("bid"));
			return false;
		});
	},

	recruit: function(units, bid) {
		var data = {
			units: units,
			vid: gamedata.village.vid,
			mode: "recruit",
			bid: bid
		}

		ajaxhandle.post(data, "recruit", function(data) {

		});
	}
}
var borders = {

	init: function() {
		this.getbuild();
		this.getcbuild();
	},

	getbuild: function() {
		$(".content").on('click', '.btn-build', function() {
			var builditem = $(this);
			borders.build(builditem.data("bid"));
		});
	},

	getcbuild: function() {
		$(".content").on('click', '.btn-cbuild', function() {
			var builditem = $(this);
			borders.cbuild(builditem.data("bid"));
		});
	},

	build: function(bid) {
		var data = {
			bid: bid,
			vid: gamedata.village.vid,
			mode: "build"
		}

		ajaxhandle.post(data, "building", function(data) {
			console.log(data.error);
		});
	},
	cbuild: function(bid) {
		var data = {
			bid: bid,
			vid: gamedata.village.vid,
			mode: "cancel"
		}

		ajaxhandle.post(data, "building", function(data) {

		});
	}
}

/*resttime = function() {
	var nowtime = getLocalTime();
	$('.timer').each(function() {
		var build = $(this).attr("build");
		if (build == undefined) { build = null; };
		var p = $(this).attr('p');
		var endtime = $(this).attr('t');
		var newtime = endtime - nowtime;;
		if (newtime <= 0 ) { newtime = 0; };
		if (newtime <= 0 && p != "none") {
			$(this).parent().remove();
			$.ajax({
				url: "php/ajax/"+p+".php",
				type : "get",
				data: { p:p, build:build }
			}).success(function(msg) {
				var obj = jQuery.parseJSON(msg);
				$(".content").html(obj.content);
				return false;
			});
		};
		$(this).html(toHiS(newtime));
	});
}
*/
function getTime(timestamp) {
	var time = new Date(timestamp);
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();
	if (seconds <= 9) { seconds = "0"+seconds; };
	if (minutes <= 9) { minutes = "0"+minutes; };
	if (hours <= 9) { hours = "0"+hours; };
	var formattedTime = hours + ':' + minutes + ':' + seconds;
	return formattedTime;
}

$(".recruit").on("submit", function() {
	var mode = $(this).attr('mode');
	var build = $(this).attr('build');
	var units = $(this).serializeArray();
	$.ajax({
		url: 'php/ajax/recruit.php',
		type : 'get',
		data: { units:units, mode:mode, build:build }
	}).success(function(msg) {
		var content = jQuery.parseJSON(msg);
		$('.content').html(content.content);
		$('#wood').text(content.newress['wood']);
		$('#iron').text(content.newress['iron']);
		$('#stone').text(content.newress['stone']);
	});
	return false;
});

$(".recruitloop a").on("click",function() {
	var mode = $(this).attr('mode');
	var build = $(this).attr('build');
	var id = $(this).attr('id');
	$.ajax({
		url: 'php/ajax/recruit.php',
		type : 'get',
		data: { id:id, mode:mode, build:build }
	}).success(function(msg) {
		var content = jQuery.parseJSON(msg);
		$('.content').html(content.content);
		$('#wood').text(content.newress['wood']);
		$('#iron').text(content.newress['iron']);
		$('#stone').text(content.newress['stone']);
	});
	return false;
});

function villageinfo(name,vname) {
	var info = "<table>";
	info += "<tr><th colspan='2'>"+vname+"</th></tr>";
	info += "<tr><td width='20%'>Punkte: </td><td>0</td></tr>";
	info += "<tr><td width='20%'>Besitzer: </td><td>"+name+"</td></tr>";
	info += "</table>";
	$(".popup").html(info);
	var infobox = $(".popup");
	if(infobox.css("display") == "none") {
		$('.field').mousemove(function(e){
			$('.popup').html(info);
			$('.popup').show();
			$('.popup').css({"top":(e.pageY + 15) + "px", "left":(e.pageX + 15) + "px"});
			e.preventDefault();
		});				
	} else {
		$('.field').mouseout(function() {
			$('.popup').hide();
			$(".popup").html("");
		});				
	}
}

buildupgrade = function(page, mode, id) {
	$.ajax({
		url: "php/ajax/building.php",
		type : "POST",
		data: { p:page, m:mode, id:id }
	}).success(function(msg) {
		/*
		var content = jQuery.parseJSON(msg);
		$(".content").html(content.content);
		$("#wood").text(content.newress["wood"]);
		$("#iron").text(content.newress["iron"]);
		$("#stone").text(content.newress["stone"]);
		*/
	});	
}

/*

var BuildingMain = {
	BUILD_ERROR_REQ: 1,
	BUILD_ERROR_POP: 2,
	BUILD_ERROR_QUEUE: 3,
	BUILD_ERROR_RES: 4,
	BUILD_ERROR_QUEUE_RES: 5,
	upgrade_building_link: '',
	downgrade_building_link: '',
	link_reduce_buildtime: '',
	link_cancel: '',
	confirm_queue: false,
	mode: 0,
	request_id: 0,
	last_request_id: 0,
	buildings: null,
	order_count: 0,
	init: function() {
		BuildingMain.init_buildbuttons();
		$(window.TribalWars).on('resource_change', function() {
			setTimeout(BuildingMain.updateBuildableState, 1)
		});
		OrderProgress.initProgress()
	},
	updateBuildableState: function() {
		var order_count = $('#buildqueue_wrap').length == 0 ? 0 : BuildingMain.order_count,
			new_timers = 0;
		$.each(BuildingMain.buildings, function(building_id, building) {
			var $build_options = $('#main_buildrow_' + building_id).find('.build_options'),
				previous_error = parseInt($build_options.data['error']),
				could_afford = $build_options.data('could-afford');
			if (!$build_options) return;
			var error_text, error_code, can_afford = Village.canAfford(building.wood, building.stone, building.iron);
			if (!building.can_build && building.level) {
				error_code = BuildingMain.BUILD_ERROR_REQ;
				error_text = building.error
			} else if (order_count > 1 && !premium) {
				if (can_afford.afford == Village.AFFORD_TYPE_NOW) {
					error_code = BuildingMain.BUILD_ERROR_QUEUE;
					error_text = 'Schleife ist derzeit voll'
				} else {
					error_code = BuildingMain.BUILD_ERROR_RES;
					error_text = can_afford.when
				}
			} else if (building.pop && building.pop > parseInt(game_data.village.pop_max) - parseInt(game_data.village.pop)) {
				error_code = BuildingMain.BUILD_ERROR_POP;
				error_text = building.error
			} else if (can_afford.afford != Village.AFFORD_TYPE_NOW) {
				error_code = BuildingMain.BUILD_ERROR_RES;
				error_text = can_afford.when
			};
			if (error_code == BuildingMain.BUILD_ERROR_RES && building.hasOwnProperty('wood_cheap')) {
				var can_afford_cheap = Village.canAfford(building.wood_cheap, building.stone_cheap, building.iron_cheap),
					$bcr_button = $build_options.find('.btn-bcr');
				if (can_afford_cheap.afford == Village.AFFORD_TYPE_NOW && $bcr_button.hasClass('btn-bcr-disabled')) {
					$bcr_button.removeClass('btn-bcr-disabled')
				} else if (can_afford_cheap.afford != Village.AFFORD_TYPE_NOW && !$bcr_button.hasClass('btn-bcr-disabled')) $bcr_button.addClass('btn-bcr-disabled')
			};
			if (typeof error_text == 'undefined' && building.hasOwnProperty('wood_queue_factor')) {
				var can_afford_with_queue = Village.canAfford(building.wood_queue_factor, building.stone_queue_factor, building.iron_queue_factor);
				if (can_afford_with_queue.afford != Village.AFFORD_TYPE_NOW) {
					error_code = BuildingMain.BUILD_ERROR_QUEUE_RES;
					error_text = 'Zu wenig Rohstoffe fÃ¼r die Bauschleife'
				}
			};
			var $build_button = $build_options.find('.btn-build'),
				$build_error = $build_options.find('.inactive');
			if (typeof error_text != 'undefined') {
				$build_button.hide();
				$build_error.show();
				if ($build_error.html() != error_text) $build_error.html(error_text)
			} else {
				$build_button.show();
				$build_error.hide()
			}
		})
	},
	init_buildbuttons: function() {
		$('#building_wrapper').on('click', '.btn-build', function() {
			var $this = $(this);
			BuildingMain.build($this.data('building'));
			return false
		});
		$('#building_wrapper').on('click', '.btn-bcr', function() {
			var $this = $(this);
			if ($this.hasClass('btn-bcr-disabled')) return false;
			BuildingMain.build_reduced($this.data('cost'), $this.data('building'));
			return false
		})
	},
	init_buildqueue: function(url) {
		$("#buildqueue").sortable({
			axis: 'y',
			handle: '.bqhandle',
			helper: function(e, tr) {
				var $originals = tr.children(),
					$helper = tr.clone();
				$helper.children().each(function(index) {
					$(this).width($originals.eq(index).width())
				});
				return $helper
			},
			stop: function(event, ui) {
				var el = ui.item;
				$.ajax({
					dataType: 'json',
					type: 'get',
					url: url,
					data: $("#buildqueue").sortable('serialize'),
					success: function(data) {
						if (data.error) {
							UI.InfoMessage(data.error, 2e3, true);
							$("#buildqueue").sortable('cancel');
							return
						};
						BuildingMain.init_buildqueue(url);
						BuildingMain.update_all(data)
					}
				})
			}
		});
		$("#buildqueue").sortable('option', 'items', '.sortable_row')
	},
	init_mobilebuildqueue: function(url) {
		MDS.orderableQueue.init($('#buildqueue_wrap').find('div').first(), url, function(data) {
			BuildingMain.update_all(data)
		})
	},
	build: function(building_id, cheap) {
		var updateBuildQueue = function() {
			var current_request_id = ++BuildingMain.request_id,
				data = {
					id: building_id,
					force: 1,
					destroy: BuildingMain.mode,
					source: game_data.village.id
				};
			if (typeof cheap != "undefined") data.cheap = 1;
			var url = BuildingMain.mode == 0 ? BuildingMain.upgrade_building_link : BuildingMain.downgrade_building_link;
			TribalWars.post(url, {}, data, function(data) {
				if (current_request_id > BuildingMain.last_request_id) {
					BuildingMain.last_request_id = current_request_id;
					BuildingMain.update_all(data);
					UI.SuccessMessage('Der Bauauftrag wurde erfolgreich eingestellt.')
				}
			})
		};
		if (BuildingMain.confirm_queue && this.mode == 0) {
			var msg = 'AuftrÃ¤ge in der Bauschleife kosten extra. Dennoch bauen?',
				buttons = [{
					text: "BestÃ¤tigen",
					callback: updateBuildQueue,
					confirm: true
				}];
			UI.ConfirmationBox(msg, buttons)
		} else updateBuildQueue();
		return false
	},
	destroy: function(building_id) {
		return BuildingMain.build(building_id)
	},
	build_reduced: function(cost, building) {
		Premium.check('BuildCostReduction', cost, function() {
			return BuildingMain.build(building, 1)
		});
		return false
	},
	cancel: function(order_id, spent_pp) {
		var msg;
		if (spent_pp) {
			msg = 'Willst du den Bauauftrag wirklich abbrechen? Wenn du Premium-Punkte fÃ¼r diesen Bauvorgang ausgegeben hast, werden diese bei Abbruch nicht zurÃ¼ckerstattet.'
		} else msg = 'Willst du den Bauauftrag wirklich abbrechen?';
		var cancelBuildingCallback = function() {
				TribalWars.post(BuildingMain.link_cancel, null, {
					id: order_id,
					destroy: BuildingMain.mode
				}, function(response) {
					BuildingMain.update_all(response)
				})
			},
			buttons = [{
				text: 'BestÃ¤tigen',
				callback: cancelBuildingCallback,
				confirm: true
			}];
		UI.ConfirmationBox(msg, buttons);
		return false
	},
	change_order: function(order_id, feature_id, cost) {
		var confirmChangeOrderCallback = function() {
			TribalWars.get(BuildingMain.link_change_order, {
				id: order_id,
				destroy: BuildingMain.mode
			}, function(data) {
				BuildingMain.update_all(data)
			})
		};
		Premium.check(feature_id, cost, confirmChangeOrderCallback);
		return false
	},
	update_all: function(data) {
		if (data.reload) {
			document.location.reload();
			return
		};
		var queue_wrapper = $('#buildqueue_wrap');
		if (queue_wrapper.length === 1) {
			if (data.building_orders) {
				queue_wrapper.replaceWith(data.building_orders)
			} else queue_wrapper.remove()
		} else $('#building_wrapper').before(data.building_orders); if (data.next_buildings) {
			$('#building_wrapper').replaceWith(data.next_buildings);
			$('.inactive img').fadeTo(0, 0.5);
			BuildingMain.init_buildbuttons()
		};
		if (typeof data.confirm_queue !== 'undefined') BuildingMain.confirm_queue = data.confirm_queue;
		if (typeof data.population !== 'undefined') $('#pop_current_label').html(data.population);
		startTimer();
		if (typeof QuestArrows !== 'undefined') QuestArrows.init();
		OrderProgress.initProgress();
		UI.ToolTip('.tooltip')
	}
}
*/