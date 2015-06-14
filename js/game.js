
function createHelper(settings) {
	if (helper.parent) return;
	helper.parent = $('<div id="' + settings.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>').appendTo(document.body).hide();
	if ($.fn.bgiframe) helper.parent.bgiframe();
	helper.title = $('h3', helper.parent);
	helper.body = $('div.body', helper.parent);
	helper.url = $('div.url', helper.parent)
}

function settings(element) {
	return $.data(element, "tooltip")
}

function handle(event) {
	if (settings(this).delay) {
		tID = setTimeout(show, settings(this).delay)
	} else show();
	track = !!settings(this).track;
	$(document.body).bind('mousemove', update);
	update(event)
}

function save() {
	if ($.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler)) return;
	current = this;
	title = this.tooltipText;
	if (settings(this).bodyHandler) {
		helper.title.hide();
		var bodyContent = settings(this).bodyHandler.call(this);
		if (bodyContent.nodeType || bodyContent.jquery) {
			helper.body.empty().append(bodyContent)
		} else helper.body.html(bodyContent);
		helper.body.show()
	} else if (settings(this).showBody) {
		var parts = title.split(settings(this).showBody);
		helper.title.html(parts.shift()).show();
		helper.body.empty();
		for (var i = 0, part;
			(part = parts[i]); i++) {
			if (i > 0) helper.body.append("<br/>");
			helper.body.append(part)
		};
		helper.body.hideWhenEmpty()
	} else {
		helper.title.html(title).show();
		helper.body.hide()
	}; if (settings(this).showURL && $(this).url()) {
		helper.url.html($(this).url().replace('http://', '')).show()
	} else helper.url.hide(); if (settings(this).fixPNG) helper.parent.fixPNG();
	handle.apply(this, arguments)
}

function show() {
	tID = null;
	if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
		if (helper.parent.is(":animated")) {
			helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity)
		} else helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade)
	} else helper.parent.show();
	helper.parent.addClass(settings(current).extraClass);
	update()
}

function update(event) {
	if ($.tooltip.blocked) return;
	if (event && event.target.tagName == "OPTION") return;
	if (!track && helper.parent.is(":visible")) $(document.body).unbind('mousemove', update);
	if (current == null) {
		$(document.body).unbind('mousemove', update);
		return
	};
	if (!$.contains(document.documentElement, current)) {
		$(document.body).unbind('mousemove', update);
		helper.parent.hide().css("opacity", "");
		return
	};
	helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
	var left = helper.parent[0].offsetLeft,
		top = helper.parent[0].offsetTop;
	if (event) {
		left = event.pageX + settings(current).left;
		top = event.pageY + settings(current).top;
		var right = 'auto';
		if (settings(current).positionLeft) {
			right = $(window).width() - left;
			left = 'auto'
		};
		helper.parent.css({
			left: left,
			right: right,
			top: top
		})
	};
	var v = viewport(),
		h = helper.parent[0];
	if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
		left -= h.offsetWidth + 20 + settings(current).left;
		helper.parent.css({
			left: left + 'px'
		}).addClass("viewport-right")
	};
	if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
		top -= h.offsetHeight + 20 + settings(current).top;
		helper.parent.css({
			top: top + 'px'
		}).addClass("viewport-bottom")
	}
}

function viewport() {
	return {
		x: $(window).scrollLeft(),
		y: $(window).scrollTop(),
		cx: $(window).width(),
		cy: $(window).height()
	}
}

function hide(event) {
if ($.tooltip.blocked) return;
if (tID) clearTimeout(tID);
current = null;
var tsettings = settings(this)

function complete() {
	helper.parent.removeClass(tsettings.extraClass).hide().css("opacity", "")
};
if ((!IE || !$.fn.bgiframe) && tsettings.fade) {
	if (helper.parent.is(':animated')) {
		helper.parent.stop().fadeTo(tsettings.fade, 0, complete)
	} else helper.parent.stop().fadeOut(tsettings.fade, complete)
} else complete(); if (settings(this).fixPNG) helper.parent.unfixPNG()
}
})(jQuery);

function setImageTitles() {
	$('img').each(function() {
		var alt = $(this).attr('alt');
		if (!$(this).attr('title') && alt != '') $(this).attr('title', alt)
	})
}

function setCookie(name, value) {
	document.cookie = name + "=" + value
}

function popup(url, width, height) {
	var wnd = window.open(url, "popup", "width=" + width + ",height=" + height + ",left=150,top=150,resizable=yes");
	wnd.focus()
}

function popup_scroll(url, width, height) {
	var wnd = window.open(url, "popup", "width=" + width + ",height=" + height + ",left=150,top=100,resizable=yes,scrollbars=yes");
	wnd.focus()
}

function getTime(element) {
	if (seconds = element.data('seconds')) return seconds;
	if (!element.html() || element.html().length == 0) return -1;
	if (element.html().indexOf('<a ') != -1) return -1;
	var part = element.html().split(":");
	for (var j = 1; j < 3; j++)
		if (part[j].charAt(0) == "0") part[j] = part[j].substring(1, part[j].length);
	var hours, days;
	if (isNaN(part[0])) {
		var day_part = part[0].split(/[a-z\s]+/i);
		hours = parseInt(day_part[1], 10);
		days = parseInt(day_part[0], 10)
	} else {
		hours = parseInt(part[0], 10);
		days = 0
	};
	var minutes = parseInt(part[1], 10),
		seconds = parseInt(part[2], 10),
		time = days * 3600 * 24 + hours * 60 * 60 + minutes * 60 + seconds;
	return time
}

function getLocalTime() {
	var now = new Date();
	return Math.round(now.getTime() / 1e3)
}

function getLocalTimeAsFloat() {
	var now = new Date();
	return now.getTime() / 1e3
}

function startTimer() {
	Timing.resetTickHandlers()
}

function setRes(type, amount) {
	game_data.village[type] = amount;
	game_data.village[type + '_float'] = amount;
	index = type == 'wood' ? 0 : (type == 'stone' ? 2 : 4);
	game_data.village.res[index] = amount;
	Timing.resetTickHandlers()
}

function changeResStyle(element, style) {
	if (!element.hasClass(style)) element.removeClass('res').removeClass('warn').removeClass('warn_90').addClass(style)
}

function number_format(number, thousands_sep) {
	var sNumber = number.toString(),
		length = (number > 0) ? 3 : 4;
	if (sNumber.length <= length) return sNumber;
	var split = new Array();
	do {
		var index = sNumber.length - 3;
		split.push(sNumber.slice(index, sNumber.length));
		sNumber = sNumber.substring(0, index)
	} while (sNumber.length > 3);
	split.reverse();
	for (index in split)
		if (split.hasOwnProperty(index)) sNumber += thousands_sep + split[index];
	return sNumber
}

function incrementDate() {
	currentDate = $('#serverDate').html();
	splitDate = currentDate.split('/');
	date = splitDate[0];
	month = splitDate[1] - 1;
	year = splitDate[2];
	dateObject = new Date(year, month, date);
	dateObject.setDate(dateObject.getDate() + 1);
	dateString = '';
	date = dateObject.getDate();
	month = dateObject.getMonth() + 1;
	year = dateObject.getFullYear();
	if (date < 10) dateString += "0";
	dateString += date + "/";
	if (month < 10) dateString += "0";
	dateString += month + "/";
	dateString += year;
	$('#serverDate').html(dateString)
}

function getTimeString(time, clamp) {
	time = Math.floor(time);
	var hours = Math.floor(time / 3600);
	if (clamp) hours = hours % 24;
	var minutes = Math.floor(time / 60) % 60,
		seconds = time % 60,
		timeString = hours + ":";
	if (minutes < 10) timeString += "0";
	timeString += minutes + ":";
	if (seconds < 10) timeString += "0";
	timeString += seconds;
	return timeString
}

function formatTime(element, time, clamp) {
	var timeString = getTimeString(time, clamp);
	$(element).html(timeString);
	if ($(element).attr('id') == 'serverTime' && timeString == '0:00:00') incrementDate()
}

function partialReload() {
	$(document).trigger('partial_reload_start');
	var url = document.location.href.replace(/action=\w*/, '').replace(/#.*$/, '') + '&_partial';
	TribalWars.fetch(url)
}

function selectAll(form, checked) {
	for (var i = 0; i < form.length; i++) form.elements[i].checked = checked
}

function changeBunches(form) {
	var sum = 0;
	for (var i = 0; i < form.length; i++) {
		var select = form.elements[i];
		if (select.className == 'select_all') continue;
		if (select.selectedIndex != null) sum += parseInt(select.value, 10)
	};
	$('#selectedBunches_bottom').text(sum);
	$('#selectedBunches_top').text(sum)
};
var max = true

function selectAllMax(form, textMax, textNothing) {
	for (var i = 0; i < form.length; i++) {
		var select = form.elements[i];
		if (select.selectedIndex != null)
			if (max) {
				select.selectedIndex = select.length - 2
			} else select.value = 0
	};
	max = max ? false : true;
	anchor = document.getElementById('select_anchor_top');
	anchor.firstChild.nodeValue = max ? textMax : textNothing;
	anchor = document.getElementById('select_anchor_bottom');
	anchor.firstChild.nodeValue = max ? textMax : textNothing;
	changeBunches(form)
}

function delete_village_group(confirmMsg, deletionURL) {
	var handleDelete = function() {
			window.location.href = deletionURL
		},
		buttons = [{
			text: 'BestÃ¤tigen',
			callback: handleDelete,
			confirm: true
		}];
	UI.ConfirmationBox(confirmMsg, buttons)
}

function insertCoord(form, element, prefix) {
	var part = element.value.split("|");
	if (part.length != 2) return;
	var x = parseInt(part[0], 10),
		y = parseInt(part[1], 10);
	prefix = prefix || '';
	form[prefix + 'x'].value = x;
	form[prefix + 'y'].value = y;
	var $enhanced = $(form).find('.target-input input[type=text]');
	if ($enhanced) $enhanced.val(x + '|' + y)
}

function insertUnit(input, count, all_units) {
	input = $(input);
	if (input.is(':disabled')) return;
	if (count != input.val() || all_units) {
		input.val(count)
	} else input.val('')
}

function insertNumber(input, count) {
	var val = parseInt($(input).val(), 10);
	if (isNaN(val)) val = 0;
	if (typeof count == 'object') count = parseInt($(count).text().replace("(", ''), 10);
	if (input.value != count) {
		if (count > 0) {
			$(input).val(count + val)
		} else $(input).val(0)
	} else $(input).val('');
	$(input).trigger('change');
	return false
}

function insertBBcode(textareaID, startTag, endTag) {
	BBCodes.insert(startTag, endTag);
	return false
}

function inlinePopupClose() {
	if ($('#inline_popup') !== null) {
		$('#inline_popup').removeClass('show');
		setTimeout(function() {
			$('#inline_popup').addClass('hidden')
		}, 300)
	}
}

function selectTarget(x, y, prefix) {
	prefix = prefix || '';
	var elements = $('form[name="units"], form[name="market"]')[0];
	elements[prefix + 'x'].value = x;
	elements[prefix + 'y'].value = y;
	inlinePopupClose();
	$("div[id$='_cont']").hide()
}

function insertAdresses(to, check) {
	window.opener.document.forms.header.to.value += to;
	if (check) {
		var mass_mail = window.opener.document.forms.header.mass_mail;
		if (mass_mail) mass_mail.checked = 'checked'
	}
}

function insertMoral(moral) {
	window.opener.document.getElementById('moral').value = moral
}

function resetAttackerPoints(points) {
	document.getElementById('attacker_points').value = points
}

function resetDefenderPoints(points) {
	document.getElementById('defender_points').value = points
}

function resetDaysPlayed(days) {
	document.getElementById('days_played').value = days
}

function editGroup(group_id) {
	var href = window.opener.location.href;
	href = href.replace(/&action=edit_group&edit_group=\d+&h=([a-z0-9]+)/, '');
	href = href.replace(/&edit_group=\d+/, '');
	overview = window.opener.document.getElementById('overview');
	if (overview && overview.value.search(/(combined|prod|units|buildings|tech)/) != -1) window.opener.location.href = encodeURI(href + '&edit_group=' + group_id);
	window.close()
}

function toggleExtended() {
	var extended = document.getElementById('extended');
	if (extended.style.display == 'block') {
		extended.style.display = 'none';
		document.getElementsByName('extended')[0].value = 0
	} else {
		extended.style.display = 'block';
		document.getElementsByName('extended')[0].value = 1
	}
}

function resizeIGMField(type) {
	field = document.getElementsByName('text')[0];
	old_size = parseInt(field.getAttribute('rows'), 10);
	if (type == 'bigger') {
		field.setAttribute('rows', old_size + 3)
	} else if (type == 'smaller')
		if (old_size >= 4) field.setAttribute('rows', old_size - 3)
}

function escape_id(myid) {
	return '#' + myid.replace('^#', '').replace('[', '\\[').replace(']', '\\]')
}

function editToggle(label, edit) {
	$(escape_id(edit)).toggle();
	$(escape_id(label)).toggle();
	var inputs = $(escape_id(edit)).find("input");
	inputs.each(function() {
		var input = $(this),
			inputType = input.attr("type"),
			isTextInput = ((typeof inputType === 'undefined') || inputType == "text");
		if (isTextInput) {
			input.focus();
			input.select()
		}
	})
}

function toggle_element(id) {
	if (id.substring(0, 1) !== '#') id = '#' + id;
	$(id).toggle()
}

function toggle_button(element_id, target) {
	var elem = $(element_id);
	if (!target) target = this;
	target = $(target);
	if (elem.css('display') == 'none') {
		target.addClass('active');
		elem.show()
	} else {
		target.removeClass('active');
		elem.hide()
	}
}

function toggle_visibility(id) {
	return toggle_element(id)
}

function toggle_visibility_by_class(classname, display) {
	if (display == 'table-row') display = '';
	$("." + classname).each(function() {
		if ($(this).css('display') == 'none') {
			$(this).css('display', display)
		} else $(this).css('display', 'none')
	})
}

function urlEncode(string) {
	return encodeURIComponent(string)
}

function escapeHtml(string) {
	return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function unescapeHtml(string) {
	return string.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
}

function renameAttack(new_attack_name, default_name, attack_name) {
	var name = $('#' + new_attack_name).val();
	if (name.length > 0) {
		$('#' + default_name).html(escapeHtml(name));
		$('#' + attack_name).val(name)
	}
}

function inlinePopupReload(name, url, options) {
	$.ajax({
		url: url,
		cache: false,
		onRequest: function() {
			if (options.empty_errors) $('#error').empty();
			$('#inline_popup_content').empty();
			$('#inline_popup_content').append($("<img>").attr('src', image_base + '/throbber.gif').attr('alt', 'Loading...'))
		},
		success: function(reponseText) {
			$('#inline_popup_content').empty();
			$('#inline_popup_content').html(reponseText);
			UI.init()
		}
	})
}

function inlinePopup(event, name, url, options, text, header) {
	var doc = $(document),
		popup = $('#inline_popup'),
		mx, my;
	if (event) {
		mx = event.clientX;
		my = event.clientY
	} else if (window.event) {
		mx = window.event.clientX;
		my = window.event.clientY
	} else {
		mx = (doc.width() / 2) - popup.width();
		my = doc.scrollTop - 800
	};
	var constraints = {
			min: {
				x: 0,
				y: 60
			},
			max: {
				x: doc.width() - options.offset_x,
				y: doc.height() - options.offset_y
			}
		},
		pos = {
			x: mx + options.offset_x,
			y: my + options.offset_y
		};
	pos.x = (pos.x < constraints.min.x) ? constraints.min.x : pos.x;
	pos.x = (pos.x > constraints.max.x) ? constraints.max.x : pos.x;
	pos.y = (pos.y < constraints.min.y) ? constraints.min.y : pos.y;
	pos.y = (pos.y > constraints.max.y) ? constraints.max.y : pos.y;
	if (typeof mobile !== "undefined" && mobile) {
		pos.x = 0;
		pos.y = doc.scrollTop();
		popup.css('width', '100%');
		popup.css('border-left', '0px');
		popup.css('border-right', '0px')
	};
	popup.css('left', pos.x + 'px');
	popup.css('top', pos.y + 'px');
	$('#inline_popup').removeClass('hidden');
	if (url) {
		$('#inline_popup').addClass('show');
		inlinePopupReload(name, url, options)
	} else if (text) {
		$('#inline_popup_content').html(text);
		$('#inline_popup').addClass('show')
	};
	if (header) $('#inline_popup_title').text(header);
	return false
}

function add_forum_share(edit_input, forum_id, url) {
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		data: {
			ally_tag: $('#' + edit_input).val(),
			forum_id: forum_id
		},
		success: function(data) {
			if (data.error) {
				$('#error').empty();
				$('#error').html(data.error);
				$('#error').css('display', '')
			} else {
				$('#shared_' + forum_id).empty();
				$('#shared_' + forum_id).html(data.new_shares);
				$('#add_shares_link_' + forum_id).css('display', 'none');
				$('#edit_shares_link_' + forum_id).css('display', '')
			}
		}
	})
}

function remove_forum_shares(label_text, forum_id, url) {
	var remove = [];
	$('#checkboxes input').each(function(i, box) {
		if ($(box).is(':checked')) remove.push($(box).val())
	});
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		data: {
			remove: $.makeArray(remove),
			forum_id: forum_id
		},
		success: function(data) {
			if (data.error) {
				$('#error').empty();
				$('#error').html(data.error);
				$('#error').css('display', '')
			} else {
				$('#' + label_text).empty();
				if (data.new_shares) {
					$('#' + label_text).html(data.new_shares)
				} else {
					$('#add_shares_link_' + forum_id).css('display', '');
					$('#edit_shares_link_' + forum_id).css('display', 'none')
				};
				inlinePopupClose()
			}
		}
	})
}

function bb_color_picker_gencaller(fn, arg) {
	var f = function() {
		fn(arg)
	};
	return f
}

function bb_color_set_color(col) {
	var g = $("#bb_color_picker_preview"),
		inp = $("#bb_color_picker_tx");
	g.css('color', "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")");
	var rr = col[0].toString(16),
		gg = col[1].toString(16),
		bb = col[2].toString(16);
	rr = rr.length < 2 ? "0" + rr : rr;
	gg = gg.length < 2 ? "0" + gg : gg;
	bb = bb.length < 2 ? "0" + bb : bb;
	inp.val("#" + rr + gg + bb)
}

function bb_color_pick_color(colordiv) {
	var col = colordiv.data('rgb');
	for (var l = 0; l < 6; l++)
		for (var h = 1; h < 6; h++) {
			var cell = $("#bb_color_picker_" + h + l);
			if (!cell) alert("bb_color_picker_" + h + l);
			var ll = l / 3.0,
				hh = h / 4.5;
			hh = Math.pow(hh, 0.5);
			var light = Math.max(0, (255 * ll - 255)),
				r = Math.floor(Math.max(0, Math.min(255, (col[0] * ll * hh + 255 * (1 - hh)) + light))),
				g = Math.floor(Math.max(0, Math.min(255, (col[1] * ll * hh + 255 * (1 - hh)) + light))),
				b = Math.floor(Math.max(0, Math.min(255, (col[2] * ll * hh + 255 * (1 - hh)) + light)));
			cell.css('background-color', "rgb(" + r + "," + g + "," + b + ")");
			cell.data('rgb', [r, g, b]);
			cell.unbind('click').click(function() {
				bb_color_picker_gencaller(bb_color_set_color, $(this).data('rgb'))
			})
		}
}

function bb_color_picker_textchange() {
	var inp = $("#bb_color_picker_tx"),
		g = $("#bb_color_picker_preview");
	try {
		g.css('color', inp.val())
	} catch (e) {}
}

function bb_color_picker_toggle(assign) {
	var inp = $("#bb_color_picker_tx");
	inp.unbind('keyup').keyup(function() {
		bb_color_picker_textchange()
	});
	if (assign) {
		insertBBcode('message', '[color=' + inp.val() + ']', '[/color]');
		toggle_element('bb_color_picker');
		return
	};
	var colors = [$("#bb_color_picker_c0"), $("#bb_color_picker_c1"), $("#bb_color_picker_c2"), $("#bb_color_picker_c3"), $("#bb_color_picker_c4"), $("#bb_color_picker_c5")];
	colors[0].data('rgb', [255, 0, 0]);
	colors[1].data('rgb', [255, 255, 0]);
	colors[2].data('rgb', [0, 255, 0]);
	colors[3].data('rgb', [0, 255, 255]);
	colors[4].data('rgb', [0, 0, 255]);
	colors[5].data('rgb', [255, 0, 255]);
	for (i = 0; i <= 5; i++) colors[i].unbind('click').click(function() {
		bb_color_picker_gencaller(bb_color_pick_color, $(this))
	});
	bb_color_pick_color(colors[0]);
	toggle_element('bb_color_picker')
}

function get_sitter_player() {
	var t_regexp = /(\?|&)t=(\d+)/,
		matches = t_regexp.exec(location.href + "");
	if (matches) {
		return parseInt(matches[2], 10)
	} else return false
}

function igm_to_show(url) {
	$.get(url, function(data) {
		var popup = $('#igm_to_content');
		popup.html(data);
		UI.Draggable(popup.parent(), {
			savepos: false
		})
	});
	$('#igm_to').css('display', 'inline')
}

function igm_to_hide() {
	$('#igm_to').hide()
}

function igm_to_insert_adresses(list) {
	$('#to').val($('#to').val() + list)
}

function igm_to_insert_group(id, url) {
	var val = $('#to').val();
	$.ajax({
		url: url,
		data: {
			group_id: id
		},
		dataType: 'json',
		success: function(data) {
			if (data.code) {
				var players = '';
				$(data.data).each(function(index) {
					players += this.member_name + ';'
				});
				$('#to').val(val + players)
			}
		},
		type: 'get'
	})
}

function igm_to_addresses_clear() {
	$('#to').val("")
}

function xProcess(xelement, yelement) {
	xelement = $("#" + xelement);
	yelement = $("#" + yelement);
	var xvalue = xelement.val(),
		yvalue = yelement.val(),
		x, y;
	if (xvalue.indexOf("|") != -1) {
		var xypart = xvalue.split("|");
		x = parseInt(xypart[0], 10);
		if (xypart[1].length !== 0) y = parseInt(xypart[1], 10);
		xelement.val(x);
		yelement.val(y).focus();
		return
	};
	if (xvalue.length === 3 && yvalue.length === 0) {
		yelement.focus()
	} else if (xvalue.length > 3) {
		x = xvalue.substr(0, 3);
		y = xvalue.substring(3);
		xelement.val(x);
		yelement.val(y).focus()
	}
}

function _(t) {
	if (lang[t]) {
		return lang[t]
	} else return t
}

function textCounter(field, countfield, charlimit) {
	if (field.value.length > charlimit) field.value = field.value.substring(0, charlimit);
	try {
		document.getElementById(countfield).innerHTML = '%1/%2'.replace(/%2/, charlimit).replace(/%1/, field.value.length)
	} catch (e) {}
}

function selectAllUnits(opposite) {
	$('.unitsInput').each(function(i, e) {
		var maxUnits = $(this).next('a').html();
		maxUnits = maxUnits.substr(1).substr(0, maxUnits.length - 2);
		if (maxUnits > 0 && opposite) {
			insertUnit(e, maxUnits, opposite)
		} else insertUnit(e, '', opposite)
	})
}

function toggle_spoiler(ref) {
	var display_value = ref.parentNode.getElementsByTagName('div')[0].getElementsByTagName('span')[0].style.display;
	if (display_value == 'none') {
		ref.parentNode.getElementsByTagName('div')[0].getElementsByTagName('span')[0].style.display = 'block'
	} else ref.parentNode.getElementsByTagName('div')[0].getElementsByTagName('span')[0].style.display = 'none'
}

function center_target(x, y, target_id) {
	var height = $(target_id).getStyle("height");
	height = height.replace(/px/g, "");
	height = height / 2;
	y -= height;
	var width = $(target_id).getStyle("width");
	width = width.replace(/px/g, "");
	width = width / 2;
	x -= width;
	if (x < 0) x = 0;
	if (y < 0) y = 0;
	$(target_id).setStyle("left", x + "px");
	$(target_id).setStyle("top", y + "px")
}

function s(text) {
	if (arguments.length > 1 && typeof arguments[1] == 'object') return s.apply(s, [arguments[0]].concat(arguments[1]));
	for (var i = 1; i < arguments.length; i++) text = text.split('%' + i).join(arguments[i]);
	return text
}

function autoresize_textarea(selector, max_rows) {
	var textarea = $(selector);
	if (!textarea.length) return;
	max_rows = max_rows || 40;
	var current_rows = textarea[0].rows;
	textarea.keydown(function() {
		var rows = this.value.split('\n'),
			row_count = rows.length;
		for (var x = 0; x < rows.length; x++)
			if (rows[x].length >= textarea[0].cols) row_count += Math.floor(rows[x].length / textarea[0].cols);
		row_count += 2;
		row_count = Math.min(row_count, max_rows);
		if (row_count > current_rows) this.rows = row_count
	})
}

function load_append(link, to) {
	if (typeof to == 'undefined') to = document.body;
	$.ajax({
		url: link,
		dataType: 'json',
		success: function(data) {
			if (data.error) {
				UI.ErrorMessage(data.error)
			} else $(to).append(data)
		}
	})
}

function load_into(link, to) {
	if (typeof to == 'undefined') to = document.body;
	$.ajax({
		url: link,
		success: function(data) {
			if (data.error) {
				UI.ErrorMessage(data.error)
			} else $(to).html(data).show()
		}
	})
};
var villageDock = {
	saveLink: false,
	loadLink: null,
	docked: null,
	bindClose: function() {
		$('#closelink_group_popup').click(function() {
			villageDock.saveDockMode(0)
		})
	},
	saveDockMode: function(onoff) {
		if (!villageDock.saveLink) return;
		var data = {
			dock: onoff
		};
		ajaxSimple(villageDock.saveLink, null, data);
		villageDock.docked = onoff
	},
	open: function(event) {
		if (villageDock.docked == 0) villageDock.saveDockMode(1);
		UI.AjaxPopup(event, 'group_popup', villageDock.loadLink, "DÃ¶rfergruppen", villageDock.callback, null, 320, 380, null, null, ['#open_groups', '#close_groups']);
		$('#close_groups, #open_groups').toggle();
		return false
	},
	close: function(event) {
		if (villageDock.docked == 1) villageDock.saveDockMode(0);
		$('#close_groups, #open_groups').toggle();
		$('#group_popup').toggle();
		return false
	},
	callback: function(response, target) {
		VillageGroups.villageSelect.handleGroupData(response, target);
		if (villageDock.saveLink) villageDock.bindClose()
	}
}

function ajaxSimple(url, target, data, defaultText) {
	$.ajax({
		url: url,
		data: data,
		dataType: 'html',
		success: function(msg) {
			if (0 == msg.length) msg = defaultText;
			$('#' + target).html(msg)
		}
	})
}; /**** game/UI.js ****/
var UI;
(function() {
	'use strict';
	UI = {
		AutoComplete: {
			url: null,
			source: function(request, response) {
				var autoType = (this.element).data('type');
				if (request.term.indexOf(';') !== -1) response([]);
				$.post(UI.AutoComplete.url, {
					type: autoType,
					text: request.term
				}, function(data) {
					response(data)
				}, 'json')
			},
			handleFocus: function(event, ui) {
				UI.AutoComplete.highlightMenuItem(ui.item.label)
			},
			highlightMenuItem: function(label) {
				var $items = $('.ui-autocomplete.ui-menu > li > a');
				$.each($items, function(key, item) {
					var $item = $(item);
					if ($item.html() == label) {
						$item.addClass('selected')
					} else $item.removeClass('selected')
				})
			},
			extension_targeted_suggestions: {
				_renderMenu: function(ul, items) {
					var autocomplete = this,
						results = items[0];
					if (results.targeted.length > 0) {
						$.each(results.targeted, function(index, item) {
							autocomplete._renderItemData(ul, item)
						});
						ul.append('<li><hr/></li>')
					};
					$.each(results.common, function(index, item) {
						autocomplete._renderItemData(ul, item)
					})
				}
			}
		},
		Throbber: $('<img alt="Laden..." title="Laden..." />').attr("src", "/graphic/throbber.gif"),
		init: function() {
			if (typeof game_data === 'undefined') return;
			this.initUIElements();
			$('.evt-confirm').click(UI.getConfirmHandler());
			$('.error_box').click(function() {
				$(this).fadeOut(500, function() {
					$(this).remove()
				})
			});
			this.InitProgressBars();
			$.widget('ui.autocomplete', $.ui.autocomplete, UI.AutoComplete.extension_targeted_suggestions);
			if (typeof mobile !== 'undefined' && !mobile) $('.autocomplete').autocomplete({
				minLength: 2,
				source: UI.AutoComplete.source,
				focus: UI.AutoComplete.handleFocus
			});
			UI.ToolTip('.tooltip');
			UI.ToolTip('.tooltip-delayed', {
				delay: 400
			});
			UI.checkForMessages()
		},
		initUIElements: function() {
			$('#premium_points_buy').click(function(e) {
				Premium.buy();
				e.preventDefault()
			})
		},
		initOverflowTooltips: function() {
			$('.overflow_tooltip').each(function() {
				if (this.offsetWidth < this.scrollWidth) UI.ToolTip(this)
			})
		},
		InitProgressBars: function() {
			$('.progress-bar').each(function() {
				var $this = $(this),
					label = $this.children(":first").html(),
					$bar = $this.find('div');
				if ($bar[0].style.width === '100%') $bar.addClass('full');
				$bar.first().append($('<span>' + label + '</span>').addClass('label').css('width', $this.width() + 'px'))
			})
		},
		checkForMessages: function() {
			var success_message = $.cookie('success_message');
			if (success_message) UI.SuccessMessage(success_message.replace(/\+/g, ' '));
			$.removeCookie('success_message')
		},
		Image: function(src, options) {
			var attr = {
				src: image_base + src
			};
			$.extend(attr, options);
			return $('<img alt="" />').attr(attr)
		},
		ToolTip: function(el, UserOptions) {
			if (mobile) return;
			var defaults = {
				showURL: false,
				track: true,
				fade: 100,
				delay: 0,
				showBody: ' :: ',
				extraClass: 'tooltip-style'
			};
			$(el).tooltip($.extend(defaults, UserOptions))
		},
		DatePicker: function(el, UserOptions) {
			var defaults = {
				showButtonPanel: true,
				dateFormat: 'yy-mm-dd',
				showAnim: 'fold',
				showOtherMonths: true,
				selectOtherMonths: true
			};
			$(el).datepicker($.extend(defaults, UserOptions))
		},
		Draggable: function(el, UserOptions) {
			var defaults = {
					savepos: true,
					cursor: 'move',
					handle: $(el).find("div:first"),
					appendTo: 'body',
					containment: [0, 60]
				},
				options = $.extend(defaults, UserOptions);
			$(el).draggable(options);
			if (options.savepos) $(el).bind('dragstop', function() {
				var doc = $(document),
					x = $(el).offset().left - doc.scrollLeft(),
					y = $(el).offset().top - doc.scrollTop();
				$.cookie('popup_pos_' + $(el).attr('id'), x + 'x' + y)
			})
		},
		Sortable: function(el, UserOptions) {
			var defaults = {
				cursor: 'move',
				handle: $(el).find("div:first"),
				opacity: 0.6,
				helper: function(e, ui) {
					ui.children().each(function() {
						$(this).width($(this).width())
					});
					return ui
				}
			};
			$(el).sortable($.extend(defaults, UserOptions))
		},
		ErrorMessage: function(message, fade_out_time, container) {
			return UI.InfoMessage(message, fade_out_time, 'error', container)
		},
		SuccessMessage: function(message, fade_out_time, container) {
			return UI.InfoMessage(message, fade_out_time, 'success', container)
		},
		InfoMessage: function(message, fade_out_time, additional_class, container) {
			$('.autoHideBox').remove();
			fade_out_time = fade_out_time || 2e3;
			var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
			container = container || (fullscreenElement || $('body'));
			if (additional_class === true) additional_class = 'error';
			$("<div/>", {
				"class": (additional_class ? "autoHideBox " + additional_class : "autoHideBox"),
				click: function() {
					$(this).remove()
				},
				html: "<p>" + message + "</p>"
			}).appendTo(container).delay(fade_out_time).fadeOut('slow', function() {
				$(this).remove()
			})
		},
		ConfirmationBox: function(msg, buttons, id) {
			$('#fader').remove();
			var clickEvent = 'click';
			id = id || "confirmation-box";
			if ($('#' + id).length !== 0) return;
			buttons.push({
				text: 'Abbrechen',
				callback: function() {},
				cancel: true
			});
			$("<div id='fader'><div class='confirmation-box' id='" + id + "' role='dialog' aria-labelledby='confirmation-msg'><div><p id='confirmation-msg' class='confirmation-msg'>" + msg + "</p><div class='confirmation-buttons'></div></div></div></div>").appendTo("body").css('z-index', '14999');
			var confirmationBox = $('#' + id),
				buttonContainer = confirmationBox.find('.confirmation-buttons');
			$('#mNotifyContainer').hide();
			var callbackWrapper = function(callback) {
				return function() {
					$('#fader > .confirmation-box').parent().hide();
					$('#mNotifyContainer').show();
					callback();
					$(document).off('keydown.confirmbox');
					return false
				}
			};
			$(buttons).each(function(index, button) {
				var el = $("<button class='btn btn-default' aria-label'" + button.text + "'>" + button.text + "</button>").bind(clickEvent, callbackWrapper(button.callback)).appendTo(buttonContainer);
				if (index === 0) el.focus();
				if (button.confirm === true) el.addClass("evt-confirm-btn").addClass('btn-confirm-yes');
				if (button.cancel === true) {
					el.addClass("evt-cancel-btn").addClass('btn-confirm-no');
					$(document).on('keydown.confirmbox', null, 'esc', callbackWrapper(button.callback))
				}
			})
		},
		getConfirmHandler: function(msg) {
			return function(event) {
				event.preventDefault();
				var el = $(event.target);
				if (!el.hasClass('evt-confirm')) el = el.parents('.evt-confirm');
				var message = msg || el.data('confirm-msg');
				if (el.is('input, button')) UI.confirmSubmit(event, message);
				if (el.is('a')) UI.confirmLink(event, message);
				return false
			}
		},
		confirmLink: function(event, msg) {
			var handleOk = function() {
				var href = $(event.target).attr("href");
				if (typeof href === "undefined") href = $(event.target).closest("a").attr("href");
				window.location = href
			};
			UI.addConfirmBox(msg, handleOk)
		},
		confirmSubmit: function(event, msg) {
			var submitButton = $(event.target),
				buttonName = submitButton.attr("name"),
				buttonValue = submitButton.attr("value");
			if (buttonName && buttonValue) {
				$('submit-value-container').remove();
				submitButton.before("<input id='submit-value-container' type='hidden' name='" + buttonName + "' value='" + buttonValue + "' />")
			};
			var handleOk = function() {
				$(event.target).closest("form").submit()
			};
			UI.addConfirmBox(msg, handleOk)
		},
		addConfirmBox: function(msg, callback) {
			var buttons = [{
				text: "OK",
				callback: callback,
				confirm: true
			}];
			UI.ConfirmationBox(msg, buttons)
		},
		AjaxPopup: function(event, target, url, titleText, handler, UserOptions, width, height, x, y, toToggle) {
			var topmenu_height = $(".top_bar").height(),
				defaults = {
					dataType: 'json',
					saveDragPosition: true,
					container: '#ds_body'
				},
				options = $.extend(defaults, UserOptions);
			if (options.reload || ($('#' + target).length === 0)) {
				var button = null;
				if (event && (!x || !y)) {
					if (event.srcElement) {
						button = event.srcElement
					} else button = event.target;
					var offset = $(button).offset();
					if (!x) x = offset.left;
					if (!y) y = offset.top + $(button).height() + 1
				};
				if (!height) height = 'auto';
				if (!width) width = 'auto';
				var toggleSelector = '#' + target;
				if (typeof toToggle !== 'undefined')
					if (toToggle.length > 0) {
						var key;
						for (key in toToggle)
							if (toToggle.hasOwnProperty(key)) toggleSelector = toggleSelector + ', ' + toToggle[key]
					};
				var successCallback = function(msg) {
					var container = null;
					if ($('#' + target).length === 0) {
						container = $('<div>').attr('id', target).addClass('popup_style').css({
							width: width,
							position: 'fixed'
						});
						var menu = $('<div>').attr('id', target + '_menu').addClass('popup_menu').html(titleText + '<a id="closelink_' + target + '" href="#">X</a>'),
							content = $('<div>').attr('id', target + '_content').addClass('popup_content').css('height', height).css('overflow-y', 'auto');
						container.append(menu).append(content);
						UI.Draggable(container, {
							savepos: options.saveDragPosition
						});
						container.bind("dragstart", function() {
							document.onselectstart = function(event) {
								event.preventDefault()
							}
						});
						container.bind("dragstop", function() {
							document.onselectstart = function(event) {
								$(event.target).trigger('select')
							}
						});
						$(options.container).append(container);
						$("#closelink_" + target).click(function(event) {
							event.preventDefault();
							$(toggleSelector).toggle()
						})
					} else container = $('#' + target); if (handler) {
						handler.call(this, msg, $('#' + target + '_content'))
					} else $('#' + target + '_content').html(msg); if ($.cookie('popup_pos_' + target)) {
						var pos = $.cookie('popup_pos_' + target).split('x');
						x = parseInt(pos[0], 10);
						y = parseInt(pos[1], 10)
					} else if (options.saveDragPosition) $.cookie('popup_pos_' + target, x + 'x' + y);
					if (!mobile) {
						var popup_height = container.outerHeight(),
							popup_width = container.outerWidth(),
							window_width = $(window).width(),
							window_height = $(window).height();
						if (y + popup_height > window_height) y = window_height - popup_height;
						if (x + popup_width > window_width) x = window_width - popup_width;
						if (x < 0) x = 0;
						if (y < topmenu_height) y = topmenu_height;
						container.css('top', y).css('left', x);
						var recalcConstraints = function(container, topmenu_height) {
							var min_x = 0,
								max_y = $(document).height() - $(container).outerHeight(),
								max_x = $(document).width() - $(container).outerWidth(),
								contain_in = [min_x, topmenu_height, max_x, max_y];
							container.draggable("option", "containment", contain_in)
						};
						recalcConstraints(container, topmenu_height);
						$(window).resize(function() {
							recalcConstraints(container, topmenu_height)
						})
					};
					if (mobile) {
						var mobile_styles = {
							position: 'absolute',
							top: $(window).scrollTop() + 'px',
							left: '0px',
							height: 'auto',
							width: 'auto',
							overflow: 'auto'
						};
						container.css(mobile_styles);
						$('#' + target + '_content').css({
							height: 'auto'
						})
					};
					container.show();
					UI.init()
				};
				if (options.dataType === 'json') {
					TribalWars.get(url, {}, successCallback)
				} else $.ajax({
					url: url,
					dataType: options.dataType,
					success: successCallback
				})
			} else $('#' + target).show()
		},
		Notification: {
			enabled: false,
			WIDGET_HEIGHT: 76,
			SHOW_TIME: 6e3,
			_stack: {},
			show: function(img, title, content, callback) {
				if (!this.enabled) return;
				var html = '<div class="side-notification"><div class="img-container"><img src="' + img + '" alt="" /></div><div class="content"><strong>' + title + '</strong><p>' + content + '</p></div></div>',
					$container = $('#side-notification-container');
				if (!$container.length) $container = $('<div id="side-notification-container"></div>').appendTo('body');
				var slot = null;
				for (var i = 0; i < 10; i++)
					if (!this._stack.hasOwnProperty(i)) {
						slot = i;
						break
					};
				if (slot === null) return;
				var $notification = $(html);
				$notification.css({
					bottom: (slot * this.WIDGET_HEIGHT) + 'px',
					'z-index': 12200 - slot
				}).on('click', callback);
				$notification.prependTo($container).addClass('side-notification-visible');
				this._stack[slot] = $notification;
				var self = this;
				setTimeout(function() {
					delete self._stack[slot];
					var end = function() {
						$notification.remove()
					};
					if (Modernizr.cssanimations) {
						$notification.removeClass('side-notification-visible').addClass('side-notification-hide');
						$notification.on('animationend webkitAnimationEnd', function() {
							$notification.remove()
						})
					} else end()
				}, this.SHOW_TIME)
			},
			debug: function() {
				this.show('/user_image.php?award=award1&level=4', 'Achievement unlocked!', 'Demolisher (Gold - Level 4) - Destroy 10.000 building levels using catapults')
			}
		},
		FormAbandon: {
			active: false,
			verify: function(e) {
				if (UI.FormAbandon.active) {
					e.stopImmediatePropagation();
					return 'Einige Informationen wurden noch nicht gespeichert. MÃ¶chtest du diese Seite wirklich verlassen?'
				}
			},
			init: function() {
				$(window).on('beforeunload', UI.FormAbandon.verify);
				$('form').change(function() {
					UI.FormAbandon.active = true
				});
				$('form').submit(function() {
					UI.FormAbandon.active = false
				})
			}
		}
	}
}());
$(document).ready(function() {
	UI.init()
}); /**** game/BBCodes.js ****/
var BBCodes = {
	target: null,
	ajax_unit_url: null,
	ajax_building_url: null,
	init: function(options) {
		BBCodes.target = $(options.target);
		BBCodes.ajax_unit_url = options.ajax_unit_url;
		BBCodes.ajax_building_url = options.ajax_building_url
	},
	insert: function(start_tag, end_tag, force_place_outside) {
		var input = BBCodes.target[0];
		input.focus();
		if (typeof document.selection != 'undefined') {
			var range = document.selection.createRange(),
				ins_text = range.text;
			range.text = start_tag + ins_text + end_tag;
			range = document.selection.createRange();
			if (ins_text.length > 0 || true == force_place_outside) {
				range.moveStart('character', start_tag.length + ins_text.length + end_tag.length)
			} else range.move('character', -end_tag.length);
			range.select()
		} else if (typeof input.selectionStart != 'undefined') {
			var start = input.selectionStart,
				end = input.selectionEnd,
				ins_text = input.value.substring(start, end),
				scroll_pos = input.scrollTop;
			input.value = input.value.substr(0, start) + start_tag + ins_text + end_tag + input.value.substr(end);
			var pos;
			if (ins_text.length > 0 || true === force_place_outside) {
				pos = start + start_tag.length + ins_text.length + end_tag.length
			} else pos = start + start_tag.length;
			input.setSelectionRange(start + start_tag.length, end + start_tag.length);
			input.scrollTop = scroll_pos
		};
		return false
	},
	colorPickerToggle: function(assign) {
		var inp = $('#bb_color_picker_tx').first();
		inp.unbind('keyup').keyup(function() {
			var inp = $('#bb_color_picker_tx').first(),
				g = $('#bb_color_picker_preview').first();
			try {
				g.css('color', inp.val())
			} catch (e) {}
		});
		if (assign) {
			BBCodes.insert('[color=' + $(inp).val() + ']', '[/color]');
			$('#bb_color_picker').toggle();
			return false
		};
		var colors = [$('#bb_color_picker_c0').first(), $('#bb_color_picker_c1').first(), $('#bb_color_picker_c2').first(), $('#bb_color_picker_c3').first(), $('#bb_color_picker_c4').first(), $('#bb_color_picker_c5').first()];
		colors[0].data('rgb', [255, 0, 0]);
		colors[1].data('rgb', [255, 255, 0]);
		colors[2].data('rgb', [0, 255, 0]);
		colors[3].data('rgb', [0, 255, 255]);
		colors[4].data('rgb', [0, 0, 255]);
		colors[5].data('rgb', [255, 0, 255]);
		for (var i = 0; i <= 5; i++) colors[i].unbind('click').click(function() {
			BBCodes.colorPickColor($(this).data('rgb'))
		});
		BBCodes.colorPickColor(colors[0].data('rgb'));
		$('#bb_color_picker').toggle();
		return false
	},
	colorPickColor: function(col) {
		for (var l = 0; l < 6; l++)
			for (var h = 1; h < 6; h++) {
				var cell = $('#bb_color_picker_' + h + l).first();
				if (!cell) alert('bb_color_picker_' + h + l);
				var ll = l / 3.0,
					hh = h / 4.5;
				hh = Math.pow(hh, 0.5);
				var light = Math.max(0, 255 * ll - 255),
					r = Math.floor(Math.max(0, Math.min(255, (col[0] * ll * hh + 255 * (1 - hh)) + light))),
					g = Math.floor(Math.max(0, Math.min(255, (col[1] * ll * hh + 255 * (1 - hh)) + light))),
					b = Math.floor(Math.max(0, Math.min(255, (col[2] * ll * hh + 255 * (1 - hh)) + light)));
				cell.css('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
				cell.data('rgb', [r, g, b]);
				cell.unbind('click').click(function() {
					BBCodes.colorSetColor($(this).data('rgb'))
				})
			}
	},
	colorSetColor: function(color) {
		var g = $('#bb_color_picker_preview').first(),
			inp = $('#bb_color_picker_tx').first();
		g.css('color', 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')');
		var rr = color[0].toString(16),
			gg = color[1].toString(16),
			bb = color[2].toString(16);
		rr = rr.length < 2 ? '0' + rr : rr;
		gg = gg.length < 2 ? '0' + gg : gg;
		bb = bb.length < 2 ? '0' + bb : bb;
		inp.val('#' + rr + gg + bb)
	},
	placePopups: function() {
		var sizeButton = $('#bb_button_size > span'),
			colorButton = $('#bb_button_color > span'),
			sizePopup = $('#bb_sizes'),
			colorPopup = $('#bb_color_picker'),
			window_width = $(document).width();
		if (!window_width) window_width = document.body.clientWidth;
		if (sizeButton.length > 0) sizePopup.offset({
			left: sizeButton.offset().left,
			top: sizeButton.offset().top + sizeButton.height() + 2
		});
		if (colorButton.length > 0) {
			var x = colorButton.offset().left + colorButton.width() - colorPopup.width();
			if (/MSIE 7/.test(navigator.userAgent)) x = x - 200;
			colorPopup.offset({
				left: x,
				top: colorButton.offset().top + colorButton.height() + 2
			})
		}
	},
	closePopups: function() {
		$('#bb_sizes').hide();
		$('#bb_color_picker').hide()
	},
	setTarget: function(target) {
		BBCodes.target = target;
		$('#bb_popup_container').children().hide();
		var popup = $('#bb_popup_container').detach();
		$('.bb_popup_container').remove();
		target.before(popup)
	},
	ajaxPopupToggle: function(event, popupId, url, title) {
		var picker = $('#' + popupId);
		if (picker && picker.is(':visible')) {
			picker.hide()
		} else UI.AjaxPopup(event, popupId, url, title, null, {
			container: '#bb_popup_container'
		}, 200)
	},
	unitPickerToggle: function(event) {
		BBCodes.ajaxPopupToggle(event, 'unit_picker', BBCodes.ajax_unit_url, 'Einheiten')
	},
	buildingPickerToggle: function(event) {
		BBCodes.ajaxPopupToggle(event, 'building_picker', BBCodes.ajax_building_url, 'GebÃ¤ude')
	}
}; /**** game/ScriptAPI.js ****/
var ScriptAPI = {
	active: [],
	url: '',
	version: null,
	register: function(scriptname, compatible, author, email) {
		var checkParam = function(key, value) {
			if (!value) throw 'ScriptAPI: parameter (\'' + key + '\') requires a value.'
		};
		if (ScriptAPI.url === '') return;
		checkParam('scriptname', scriptname);
		checkParam('author', author);
		checkParam('email', email);
		if (compatible == '8.20' || compatible == '8.21') compatible = true;
		if (typeof compatible == 'object' && ($.inArray(8.2, compatible) != -1 || $.inArray(8.21, compatible) != -1)) compatible = true;
		compatible = compatible === true;
		var script = {
				scriptname: scriptname,
				version: 0,
				author: author,
				email: email,
				broken: false
			},
			existing = false;
		for (var i in ScriptAPI.active)
			if (ScriptAPI.active[i].scriptname == scriptname) {
				existing = true;
				script = ScriptAPI.active[i]
			};
		if (!existing) {
			ScriptAPI.active.push(script);
			ScriptAPI.save(script)
		};
		if (!script.broken && !compatible) {
			script.broken = true;
			ScriptAPI.notify(script);
			throw 'Version incompatible!'
		}
	},
	notify: function(script) {
		var scriptlink = $('<li>').text(escapeHtml(script.scriptname) + ' ');
		scriptlink.append($('<a>').attr('href', escapeHtml('mailto:' + script.email)).text('(Autor: ' + escapeHtml(script.author) + ')'));
		$('#script_list').append(scriptlink);
		$('#script_warning').show()
	},
	save: function(script) {
		$.post(ScriptAPI.url, script)
	}
}; /**** game/Premium.js ****/
var Premium = {
	check: function(feature, costs, okayCallback, days, save) {
		if (days == 'undefined') days = 0;
		if (save == 'undefined') save = 0;
		var url = '/game.php?screen=api&ajax=check_premium&feature=' + feature + '&costs=' + costs + '&days=' + days + '&save=' + save;
		if (game_data.player.sitter > 0) url += '&t=' + game_data.player.id;
		TribalWars.get(url, null, function(response) {
			if (response.insufficient_pp) {
				Dialog.show('pp', response.insufficient_pp);
				return
			};
			if (response.prompt) {
				var checkDisablePrompt = function() {
						var $pp_prompt = $('#pp_prompt');
						if ($pp_prompt.length && $pp_prompt.is(':checked')) {
							Premium.setPromptState(response.set_prompt_link, 0, okayCallback);
							return
						} else if ($pp_prompt.length && !$pp_prompt.is(':checked') && response.current_prompt_state == 0) {
							Premium.setPromptState(response.set_prompt_link, 1, okayCallback);
							return
						};
						okayCallback()
					},
					buttons = [{
						text: 'BestÃ¤tigen',
						callback: checkDisablePrompt,
						confirm: true
					}];
				UI.ConfirmationBox(response.prompt, buttons, false, []);
				return
			};
			okayCallback()
		})
	},
	setPromptState: function(link, state, callback) {
		TribalWars.get(link + '&prompt=' + state, {}, function() {
			callback()
		})
	},
	buy: function(extra_params) {
		if (mobile) {
			TribalWars.redirect('premium', {
				mode: 'use'
			});
			return
		};
		Dialog.close();
		var params = $.extend({
			ajax: 'buy_premium'
		}, extra_params);
		TribalWars.get('api', params, function(data) {
			if (data.popup) {
				$(document.body).append(data.popup)
			} else if (data.easypay) Premium.showEasyPay(data.easypay)
		})
	},
	showEasyPay: function(link) {
		if ($('#pay_frame').length) return;
		var iframe_width = 244,
			iframe_height = 530,
			$iframe = $('<iframe id="pay_frame" style="position: absolute; width: ' + iframe_width + 'px; height: ' + iframe_height + 'px" frameborder="0" src="' + link + '" />'),
			space_on_left = $('#main_layout').offset().left,
			x_pos, y_pos = $('#topContainer').height() + 10;
		if (space_on_left > iframe_width) {
			x_pos = space_on_left - iframe_width
		} else x_pos = $('#premium_points_buy').offset().left - (iframe_width / 2);
		$iframe.css({
			zIndex: 1e3,
			top: y_pos + 'px',
			left: x_pos + 'px'
		});
		$iframe.on('load', function() {
			TribalWars.hideLoadingIndicator()
		});
		TribalWars.showLoadingIndicator();
		$('body').append($iframe);
		$(window).off('message', Premium.handleMessage).on('message', Premium.handleMessage)
	},
	handleMessage: function(e) {
		if (e.originalEvent.data == 'close_easypay_window') {
			$('#pay_frame').remove()
		} else if (e.originalEvent.data == 'open_payment_window') {
			$('#pay_frame').remove();
			Premium.buy({
				force: 'full'
			})
		}
	},
	showFeatureTrialNotification: function() {
		Dialog.fetch('feature_trial', 'premium', {
			ajax: 'trial_dialog'
		})
	},
	closeBuy: function() {
		$('#fader,#payment_box').remove()
	},
	features: {
		init: function() {
			$('.feature-selector').removeAttr('checked').change(Premium.features.selectOffer);
			$('.premium_use').click(Premium.features.clickOption);
			Premium.features.selectSingleOffers()
		},
		selectSingleOffers: function() {
			var count = {};
			$('.feature-selector').each(function() {
				var row = $(this).data('row');
				if (!count.hasOwnProperty(row)) count[row] = 0;
				count[row] ++
			});
			$.each(count, function(row, count) {
				if (count > 1) return;
				$('.feature-selector[data-row=' + row + ']').prop('checked', 'checked').trigger('change')
			})
		},
		selectOffer: function() {
			var $this = $(this),
				cost = $this.data('costs'),
				row = $this.data('row'),
				can_save = $this.data('can-save'),
				$row = $('#feature_' + row),
				$options = $row.find('.options'),
				cost_string = '';
			if (cost == 0) {
				cost_string = 'Kostenlos'
			} else cost_string = '%1 Punkte'.replace('%1', cost) + ' <span class="icon coinbag" />';
			$row.find('.cost').html(cost_string);
			$options.find('.na').hide();
			var $btns = $row.find('.btns');
			if (!can_save) $btns.find('.btn-type-save').hide();
			$btns.fadeIn();
			$options.find('input[name=offer]').val($this.val())
		},
		clickOption: function(e) {
			e.preventDefault();
			var $form = $(this).closest('form'),
				offer_id = $form.find('input[name=offer]').val(),
				$offer = $('#offer_' + offer_id),
				days = $offer.data('days'),
				costs = $offer.data('costs'),
				feature = $offer.data('feature'),
				cb = function() {
					$form.submit()
				},
				name = $(this).attr('name');
			$form.find('input[name=use_type]').val(name);
			Premium.check(feature, costs, cb, days, name == 'activate' ? 0 : 1)
		},
		toggleAutoExtend: function(box) {
			TribalWars.get('premium', {
				ajax: 'auto_renew',
				feature: box.value,
				active: box.checked ? 1 : 0
			}, function(data) {
				var msg;
				if (data.active) {
					msg = 'Deine Einstellungen wurden gespeichert. Dieses Feature wird nun automatisch verlÃ¤ngert.'
				} else msg = 'Deine Einstellungen wurden gespeichert. Dieses Feature wird nun nicht mehr automatisch verlÃ¤ngert.'; if (data.extended_now) {
					msg += ' Dein premium-Feature wurde nun erneuert.';
					document.location.reload();
					$.cookie('success_message', msg)
				} else UI.SuccessMessage(msg)
			})
		}
	}
}; /**** game/quests.js ****/
var Quests = {
	el: null,
	init: function() {
		$('.quest').click(function() {
			Quests.open($(this).data('id'))
		});
		$('.quest').not('.finished').not('.ignore').each(function() {
			var $this = $(this),
				goals_completed = parseInt(Quests.numberOfSetBits($this.data('progress'))),
				goals_total = parseInt(Quests.numberOfSetBits($this.data('goals')));
			if (goals_completed) $this.find('.quest_progress').show().css('width', (goals_completed / goals_total * 100) + '%')
		});
		if (!mobile && !window.game_data.admin) {
			$('.quest.finished').not('.opened').each(function() {
				Quests.open($(this).data('id'))
			});
			if (typeof QuestArrows != 'undefined') QuestArrows.init()
		}
	},
	complete: function(quest_id, complete_url) {
		Dialog.close();
		TribalWars.get(complete_url, null, function(data) {
			if (data.reward) {
				UI.SuccessMessage("Aufgabe abgeschlossen. Du erhÃ¤ltst:" + '<br /><br />' + data.reward, 3e3)
			} else UI.SuccessMessage("Aufgabe abgeschlossen.", 3e3);
			$('#quest_' + quest_id).remove();
			if (mobile) {
				$('#quest-container').hide()
			} else {
				var detailed = data.detailed;
				$.each(detailed, function(i, reward) {
					if (reward.hasOwnProperty('resources')) $.each(reward.resources, function(res, amount) {
						TribalWars.showResourceIncrease(res, amount)
					})
				})
			}
		})
	},
	open: function(quest_id) {
		var $quest = $('#quest_' + quest_id);
		if (!$quest.length) return;
		if (!mobile) $quest.addClass('spin');
		Quests.load($quest.data('url'), quest_id);
		$quest.addClass('opened')
	},
	load: function(url, quest_id) {
		TribalWars.get('api', {
			ajax: 'quest_show',
			quest: quest_id
		}, function(data) {
			$('#quest_' + quest_id).removeClass('spin');
			if (mobile) {
				$('#quest-container').html(data).show();
				$('#quest-close').show();
				$('#mobileQuests').show();
				document.location.replace('#mobileQuests')
			} else {
				Dialog.show('quest', data);
				$('#quest_' + quest_id).removeClass('spin')
			}
		}, function() {
			$('#quest_' + quest_id).removeClass('spin')
		})
	},
	numberOfSetBits: function(i) {
		i = i - ((i >> 1) & 0x55555555);
		i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
		return (((i + (i >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24
	},
	markAsCompleted: function(id) {
		$el = $('#quest_' + id);
		if ($el.length) $el.addClass('finished').find('img').show()
	},
	markAsOpened: function(id) {
		$el = $('#quest_' + id);
		if ($el.length) {
			$el.addClass('opened');
			if (typeof QuestArrows != 'undefined') QuestArrows.init()
		}
	}
}; /**** game/VillageContext.js ****/
var VillageContext = {
	claim_enabled: false,
	_button_order: {
		pa_own: ['info', 'recruit', 'map', 'overview', '', 'market', 'place'],
		pa_other: ['info', 'claim', 'map', '', 'fav', 'market', 'place'],
		free_own: ['info', '', 'map', 'overview', '', 'market', 'place'],
		free_other: ['info', '', 'map', '', '', 'market', 'place']
	},
	_circlePos: [
		[-12, -12],
		[-12, -49],
		[20, -30],
		[20, 6],
		[-11, 25],
		[-44, 6],
		[-44, -30],
		[20, -30],
		[20, 6]
	],
	_requires_extra: ['claim', 'fav'],
	_buttons_created: [],
	_open: false,
	_urls: {},
	_current_anchor: null,
	_titles: {
		info: 'Dorfinformationen',
		recruit: 'Rekrutierung',
		map: 'Auf Karte anzeigen',
		overview: 'DorfÃ¼bersicht',
		market: 'Rohstoffe schicken',
		place: 'Truppen schicken',
		claim: 'Dorf reservieren',
		unclaim: '',
		fav: 'Zu den Favoriten hinzufÃ¼gen',
		unfav: 'Aus den Favoriten entfernen'
	},
	init: function() {
		if (typeof mobile != 'undefined' && mobile) return;
		$('.village_anchor').not('.contexted').each(VillageContext.enableContext)
	},
	enableContext: function() {
		var $markup = $('<a class="ctx" href="#"></a>');
		$(this).append($markup).addClass('contexted');
		$markup.click(VillageContext.toggleForVillage)
	},
	toggleForVillage: function() {
		var $anchor = $(this).parent(),
			village_id = $anchor.data('id'),
			player_id = $anchor.data('player'),
			el_position = $(this).offset(),
			position = [el_position.left + 6, el_position.top + 6];
		VillageContext.beginShow($(this), position, village_id, player_id);
		return false
	},
	hide: function() {
		if (VillageContext._current_anchor) {
			VillageContext._current_anchor.removeClass('spin');
			VillageContext._current_anchor = null
		};
		$('.village_ctx').hide();
		$('body').unbind('click', VillageContext.hide);
		VillageContext._open = false
	},
	beginShow: function($spinner, position, village_id, player_id) {
		if (this._open) this.hide();
		VillageContext._current_anchor = $spinner;
		var button_order, me = this;
		if (premium) {
			button_order = (player_id == game_data.player.id) ? this._button_order['pa_own'] : this._button_order['pa_other']
		} else button_order = (player_id == game_data.player.id) ? this._button_order['free_own'] : this._button_order['free_other'];
		var requires_extra = false;
		$.each(this._requires_extra, function(i, v) {
			if (requires_extra || $.inArray(v, button_order) != -1) {
				requires_extra = true;
				return
			}
		});
		if (requires_extra) {
			VillageContext._current_anchor.addClass('spin');
			$.getJSON('/game.php?screen=api&ajax=village_context', {
				id: village_id
			}, function(data) {
				if (data.error) {
					UI.ErrorMessage(data.error);
					return
				};
				me.show(position, village_id, player_id, button_order, data)
			})
		} else this.show(position, village_id, player_id, button_order, null)
	},
	show: function(position, village_id, player_id, button_order, extra_data) {
		var me = this,
			circle_pos = this._circlePos;
		$(button_order).each(function(k, v) {
			if (v == '') return;
			if ((v == 'market' || v == 'place') && village_id == game_data.village.id) {
				return
			} else if (v === 'claim')
				if (!game_data.player.ally || !VillageContext.claim_enabled) return;
			if (v == 'fav' && extra_data.fav) v = 'unfav';
			if (v == 'claim' && extra_data.claim) v = 'unclaim';
			if (v == 'unclaim') me._titles[v] = extra_data.unclaim_title;
			var title = me._titles[v],
				url = me._urls[v].replace(/__village__/, village_id).replace(/__owner__/, player_id).replace(/__source__/, game_data.village.id),
				$btn;
			if ($.inArray(v, me._buttons_created) == -1) {
				$btn = $('<a class="village_ctx" id="ctx_' + v + '" title="' + title + '" href=""></a>');
				me._buttons_created.push(v)
			} else $btn = $('#ctx_' + v); if (url.match(/json/)) {
				me.ajaxRegister($btn, v, url)
			} else $btn.attr('href', url);
			$btn.attr('title', title);
			$btn.appendTo('body').css('left', (position[0] + circle_pos[k][0]) + 'px').css('top', (position[1] + circle_pos[k][1]) + 'px').stop().css('opacity', 0).show().fadeTo(120, 1.0)
		});
		VillageContext._current_anchor.removeClass('spin');
		$('body').bind('click', VillageContext.hide);
		this._open = true
	},
	ajaxRegister: function($btn, v, url) {
		$btn.unbind('click').click(function(e) {
			e.preventDefault();
			var now = new Date().getTime();
			if (this._last && (now - this._last < 900)) return;
			this._last = now;
			$.ajax({
				url: url,
				dataType: 'json',
				success: function(data) {
					VillageContext.ajaxDone(v, data)
				}
			});
			return false
		})
	},
	ajaxDone: function(key, data) {
		this.hide();
		switch (key) {
			case 'claim':
			case 'unclaim':
				if (!data.code) {
					UI.ErrorMessage(data.error);
					break
				};
				if (data.notice) UI.InfoMessage(data.notice);
				if (data.type == 'delete') {
					UI.SuccessMessage('Die Reservierung wurde gelÃ¶scht');
					if (data.id) {
						$('#reservation_' + data.id).fadeOut();
						if (game_data.screen == 'info_player') $('#reservation_' + data.village).hide()
					}
				} else {
					UI.SuccessMessage('Das Dorf wurde reserviert.');
					if (game_data.screen == 'info_player') {
						lock_icon = $('#reservation_' + data.village);
						lock_icon.attr('src', "http://dsde.innogamescdn.com/8.27/22085/graphic/map/reserved_player.png?abc9c");
						lock_icon.attr('title', ' :: von dir reserviert');
						UI.ToolTip(lock_icon);
						lock_icon.show()
					}
				};
				break;
			case 'fav':
			case 'unfav':
				if (!data.code) {
					UI.ErrorMessage(data.error, null, message_container);
					break
				};
				if (key == 'fav') {
					UI.SuccessMessage('Dorf wurde zu den Favoriten hinzugefÃ¼gt.')
				} else UI.SuccessMessage('Dorf wurde aus den Favoriten entfernt.');
				break
		}
	}
}; /**** game/Favicon.js ****/
var Favicon = {
	update: function() {
		var canvas = document.createElement('canvas'),
			ctx, img = document.createElement('img'),
			link = document.getElementById('favicon').cloneNode(true),
			incs = Number(game_data.player.incomings);
		if (!typeof canvas.getContext === 'function' || !typeof canvas.fillText === 'function') return;
		var numberString = '';
		if (incs < 100) {
			numberString = incs.toString()
		} else if (incs < 1e3) {
			numberString = '99+'
		} else if (incs < 1e4) {
			numberString = incs.toString().substring(0, 1) + 'k'
		} else numberString = ': O'; if (canvas.getContext) {
			img.onload = function() {
				canvas.height = canvas.width = 16;
				ctx = canvas.getContext('2d');
				if (incs !== 0) {
					var fontSize = 8,
						xPos = 2.5,
						yPos = 11;
					if (numberString.length === 1) {
						fontSize = 12;
						xPos = 4.5;
						yPos = 12.3
					} else if (numberString.length === 2) {
						fontSize = 10;
						xPos = 1.5;
						yPos = 11
					};
					ctx.drawImage(this, 0, 0);
					ctx.font = 'bold ' + fontSize + 'px "helvetica", sans-serif';
					ctx.fillStyle = '#333333';
					ctx.fillText(numberString, xPos, yPos);
					link.href = canvas.toDataURL('image/png')
				} else link.href = image_base + 'favicon.png';
				var current = document.getElementById('favicon');
				current.parentNode.removeChild(current);
				document.head.appendChild(link)
			};
			img.src = '/graphic/favicon_lit.png'
		}
	}
};
$(function() {
	if (!document.getElementById('favicon') || typeof game_data === 'undefined' || (typeof mobile !== 'undefined' && mobile) || game_data.player.incomings === 0) return;
	Favicon.update()
}); /**** game/WorldSwitch.js ****/
var WorldSwitch = {
	worldsURL: '',
	loaded: false,
	init: function() {
		$('.evt-world-selection-toggle').click(function() {
			var hidden = $('#world_selection_popup').css('display') == 'none';
			if (hidden) {
				WorldSwitch.show()
			} else WorldSwitch.hide()
		})
	},
	hide: function() {
		$('#world_selection_clicktrap').hide();
		$('#world_selection_popup').hide()
	},
	show: function() {
		var showCallback = function() {
			$('#world_selection_clicktrap').show();
			$('#world_selection_popup').show();
			$('#world_selection_popup').css('left', ($('#footer .evt-world-selection-toggle').offset().left - 10) + 'px')
		};
		if (!WorldSwitch.loaded) {
			$.getJSON(WorldSwitch.worldsURL, function(data) {
				$('#servers-list-block').html(data.html);
				showCallback();
				WorldSwitch.loaded = true
			})
		} else showCallback()
	}
};
 /**** game/general.js ****/
$(window).load(function() {
	var view = $(window);
	if (navigator.platform != 'iPad' && navigator.platform != 'iPhone' && navigator.platform != 'iPod') {
		$("#SkyScraperAd, #SkyScraperAdLeft").css("height", view.height() - 85 + "px");
		view.bind("scroll resize", function() {
			$("#SkyScraperAd, #SkyScraperAdLeft").css("height", view.height() - 85 + "px")
		})
	} else {
		var skyScraperAd = $("#SkyScraperAd");
		skyScraperAd.css("position", "absolute");
		skyScraperAd.css("height", view.height() - 85 + "px");
		skyScraperAd.css("top", Math.max(view.scrollTop() + 10, 60) + "px");
		var offset = $("#SkyScraperAdCell").offset();
		skyScraperAd.css("left", offset.left + "px");
		window.setTimeout("repositionAd()", 100)
	};
	var skyLeft = $("#SkyScraperAdLeft");
	skyLeft.css('margin-left', '-' + (skyLeft.width() - 5) + 'px')
})

function repositionAd() {
	var view = $(window),
		skyScraperAd = $("#SkyScraperAd");
	skyScraperAd.css("height", view.height() - 85 + "px");
	skyScraperAd.css("top", Math.max(view.scrollTop() + 10, 60) + "px");
	var offset = $("#SkyScraperAdCell").offset();
	skyScraperAd.css("left", offset.left + "px");
	window.setTimeout("repositionAd()", 100)
};
$(document).ready(function() {
	if (typeof mobile_on_normal != 'undefined' && mobile_on_normal) {
		$("#footer").css("position", "static").css("margin-top", "10px");
		$("body").css("padding-bottom", 0)
	}
})

function supportsFixed() {
	var testDiv = document.createElement("div");
	testDiv.id = "testingPositionFixed";
	testDiv.style.position = "fixed";
	testDiv.style.top = "0px";
	testDiv.style.right = "0px";
	document.body.appendChild(testDiv);
	var offset = 1,
		supported = false;
	if (typeof testDiv.offsetTop == "number")
		if (testDiv.offsetTop != null)
			if (testDiv.offsetTop != "undefined") offset = parseInt(testDiv.offsetTop);
	if (offset === 0) supported = true;
	document.body.removeChild(testDiv);
	return supported
}

function selectVillage(id, group_id) {
	var href = window.location.href;
	if (href.search(/village=\w*/) != -1) {
		href = href.replace(/village=\w*/, 'village=' + id)
	} else href += '&village=' + id;
	href = href.replace(/action=\w*/, '');
	if (href.search(/group=\w*/) != -1) {
		href = href.replace(/group=\w*/, 'group=' + group_id)
	} else href += '&group=' + group_id;
	window.location.href = encodeURI(href)
}; /**** game/TribalWars.js ****/

var TribalWars = {
	_script: '/game.php',
	_loadedJS: [],
	_onLoadHandler: null,
	_inputCache: {},
	_previousData: {},
	_settings: {
		sound: false
	},
	_tabID: null,
	_tabActive: true,
	_tabTimeout: false,
	_lastActivity: null,
	_lastSound: 0,
	fetch: function(url) {
		this.registerOnLoadHandler(null);
		this.cacheInputVars();
		this.showLoadingIndicator();
		$.getJSON(url, function(data) {
			TribalWars.hideLoadingIndicator();
			TribalWars.handleResponse(data)
		})
	},
	get: function(location, get_params, success_callback, error_callback) {
		var url = this.buildURL('GET', location, get_params);
		this.request('GET', url, {}, success_callback, error_callback)
	},
	post: function(location, get_params, post_data, success_callback, error_callback) {
		var url = this.buildURL('POST', location, get_params);
		this.request('POST', url, post_data, success_callback, error_callback)
	},
	request: function(method, url, params, success_callback, error_callback) {
		this.showLoadingIndicator();
		$.ajax({
			url: url + '&client_time=' + Math.round(Timing.getCurrentServerTime() / 1e3),
			data: params,
			type: method,
			dataType: 'json',
			headers: {
				'TribalWars-Ajax': 1
			},
			success: function(data) {
				TribalWars.hideLoadingIndicator();
				TribalWars.handleResponse(data, success_callback, error_callback)
			},
			error: function(xhr, status) {
				TribalWars.hideLoadingIndicator();
				if (xhr.readyState == 0) return;
				UI.ErrorMessage('Anfrage fehlgeschlagen. Es kÃ¶nnen technische Probleme vorliegen.');
				if (typeof error_callback == 'function') error_callback()
			}
		})
	},
	redirect: function(location, params) {
		var url = TribalWars.buildURL('GET', location, params);
		window.location.href = url
	},
	buildURL: function(method, input, params) {
		var url = '';
		if (typeof input == 'string')
			if (input.charAt() == '/') {
				url = input;
				if (typeof params == 'object') input = params
			} else input = $.extend({
				screen: input
			}, params);
		if (url == '')
			if (game_data.hasOwnProperty('village')) {
				url = TribalWars._script + '?village=' + game_data.village.id
			} else url = TribalWars._script + '?village=';
		if (typeof input == 'object' && input != null) url += '&' + $.param(input);
		if (method == 'POST' && url.indexOf('h=') == -1) url += '&h=' + window.csrf_token;
		if (game_data.player.sitter > 0) url += '&t=' + game_data.player.id;
		return url
	},
	handleResponse: function(data, callback, error_callback) {
		TribalWars._previousData = $.extend(true, {}, window.game_data);
		if (!data.hasOwnProperty('error') && !data.hasOwnProperty('response') && !data.hasOwnProperty('content')) {
			UI.ErrorMessage('Anfrage fehlgeschlagen. Es kÃ¶nnen technische Probleme vorliegen.');
			return
		};
		if (data.error) {
			UI.ErrorMessage(data.error);
			if (typeof error_callback == 'function') error_callback();
			return
		};
		if (data.time_diff) UI.InfoMessage(data.time_diff);
		if (data.content) $('#content_value').html(data.content);
		if (data.content) {
			UI.ToolTip('.tooltip');
			TribalWars.contentLoaded()
		};
		if (data.game_data) {
			var screen = window.game_data.screen;
			window.game_data = data.game_data;
			window.game_data.screen = screen;
			setTimeout(function() {
				Timing.resetTickHandlers()
			}, 10)
		};
		if (data.quests) $('#questlog').html(data.quests);
		if (data.response === 'partial_reload') {
			$(document).trigger('partial_reload_end')
		} else if (data.response) callback(data.response);
		if (mobile) {
			TribalWars.updateHeaderOnMobile()
		} else TribalWars.updateHeader()
	},
	handleGameData: function(data) {
		TribalWars._previousData = $.extend(true, {}, window.game_data);
		window.game_data.player = $.extend(window.game_data.player, data.player);
		if (mobile) {
			TribalWars.updateHeaderOnMobile()
		} else TribalWars.updateHeader()
	},
	showLoadingIndicator: function() {
		$('#loading_content').show()
	},
	hideLoadingIndicator: function() {
		$('#loading_content').hide()
	},
	updateHeader: function() {
		if (window.game_data.hasOwnProperty('village')) {
			$('#storage').text(game_data.village.storage_max);
			$('#pop_current_label').text(game_data.village.pop);
			$('#pop_max_label').text(game_data.village.pop_max);
			if (this._previousData.player.rank != game_data.player.rank) {
				var $rank_rank = $('#rank_rank').html(game_data.player.rank_formatted);
				if (this._previousData.player.rank > game_data.player.rank) {
					$rank_rank.addClass('increased');
					setTimeout(function() {
						$rank_rank.removeClass('increased')
					}, 100)
				}
			};
			if (this._previousData.player.points != game_data.player.points) {
				var $rank_points = $('#rank_points').html(game_data.player.points_formatted);
				if (this._previousData.player.points < game_data.player.points) {
					$rank_points.addClass('increased');
					setTimeout(function() {
						$rank_points.removeClass('increased')
					}, 100)
				}
			}
		};
		$('#premium_points').text(game_data.player.pp);
		var $new_mail = $('#new_mail'),
			mail_faded = $new_mail.hasClass('new_mail_faded'),
			new_mails = parseInt(game_data.player.new_igm);
		if (new_mails > 0 && mail_faded) {
			$new_mail.removeClass('new_mail_faded').addClass('new_mail')
		} else if (new_mails === 0 && !mail_faded) $new_mail.hide();
		$('.badge-mail').text(new_mails ? ' (' + new_mails + ')' : '');
		var $new_report = $('#new_report'),
			report_faded = $new_report.hasClass('new_report_faded'),
			new_reports = parseInt(game_data.player.new_report);
		if (new_reports > 0 && report_faded) {
			$new_report.removeClass('new_report_faded').addClass('new_report')
		} else if (new_reports === 0 && !report_faded) $new_report.hide();
		$('.badge-report').text(new_reports ? ' (' + new_reports + ')' : '');
		var new_posts = parseInt(game_data.player.new_forum_post),
			new_ally_invites = parseInt(game_data.player.new_ally_invite),
			new_ally_applications = parseInt(game_data.player.new_ally_application),
			new_ally_items = new_posts + new_ally_invites + new_ally_applications,
			$tribe_forum = $('#tribe_forum_indicator');
		if ($tribe_forum.hasClass('no_new_post') && new_posts) {
			$tribe_forum.removeClass('no_new_post').addClass('new_post').attr('title', 'Neuer Beitrag im Stammesforum')
		} else if ($tribe_forum.hasClass('new_post') && !new_posts) $tribe_forum.removeClass('new_post').addClass('no_new_post').attr('title', 'Kein neuer Beitrag im Stammesforum');
		$('.badge-ally-forum-post').text(new_posts ? ' (' + new_posts + ')' : '');
		$('.badge-ally-application').text(new_ally_applications ? ' (' + new_ally_applications + ')' : '');
		$('.badge-ally-invite').text(new_ally_invites ? ' (' + new_ally_invites + ')' : '');
		$('#menu_counter_ally').text(new_ally_items ? ' (' + new_ally_items + ')' : '');
		var new_buddy_requests = parseInt(game_data.player.new_buddy_request),
			new_items = parseInt(game_data.player.new_items),
			new_profile_items = new_buddy_requests + new_items;
		$('.badge-buddy').text(new_buddy_requests ? ' (' + new_buddy_requests + ')' : '');
		$('.badge-inventory').text(new_items ? ' (' + new_items + ')' : '');
		$('#menu_counter_profile').text(new_profile_items ? ' (' + new_profile_items + ')' : '');
		var $commands = $('#header_commands');
		if (game_data.player.incomings !== this._previousData.player.incomings) {
			if (!$commands.hasClass('has_incomings') && parseInt(game_data.player.incomings) > 0) {
				$commands.addClass('has_incomings')
			} else if ($commands.hasClass('has_incomings') && parseInt(game_data.player.incomings) === 0) $commands.removeClass('has_incomings');
			$('#incomings_amount').text(game_data.player.incomings);
			Favicon.update()
		};
		if (window.premium && parseInt(game_data.player.supports) !== parseInt(this._previousData.player.supports)) {
			if (!$commands.hasClass('has_supports') && parseInt(game_data.player.supports) > 0) {
				$commands.addClass('has_supports')
			} else if ($commands.hasClass('has_supports') && parseInt(game_data.player.supports) === 0) $commands.removeClass('has_supports');
			$('#supports_amount').text(game_data.player.supports)
		}
	},
	updateHeaderOnMobile: function() {
		$('#storage').text(game_data.village.storage_max);
		$('#pop_current_label').text(game_data.village.pop);
		$('#pop_max_label').text(game_data.village.pop_max);
		var $new_mail = $('#notify_mail');
		if ($new_mail.css('display') == 'none' && parseInt(game_data.player.new_igm) == 1) {
			$new_mail.show()
		} else if ($new_mail.css('display') != 'none' && parseInt(game_data.player.new_igm) == 0) $new_mail.hide();
		var $new_report = $('#notify_report');
		if ($new_report.css('display') == 'none' && parseInt(game_data.player.new_report) == 1) {
			$new_report.show()
		} else if ($new_report.css('display') != 'none' && parseInt(game_data.player.new_report) == 0) $new_report.hide();
		var $tribe_forum = $('#notify_forum');
		if (parseInt(game_data.player.new_forum_post) == 1) {
			$tribe_forum.show()
		} else $tribe_forum.hide();
		var $incomings = $('#notify_incomings');
		if (parseInt(game_data.player.incomings) > 0) {
			$incomings.show()
		} else $incomings.hide();
		$incomings.find('.mNotifyNumber').last().text(game_data.player.incomings);
		var $supports = $('#notify_supports');
		if (parseInt(game_data.player.supports) > 0) {
			$supports.show()
		} else $supports.hide();
		$supports.find('.mNotifyNumber').last().text(game_data.player.supports)
	},
	cacheInputVars: function() {
		this._inputCache = {};
		var cachedCount = 0;
		$('#content_value').find('input[type=text]:visible').each(function() {
			var $this = $(this);
			if ($this.attr('id')) {
				if (++cachedCount > 20) return false;
				TribalWars._inputCache['#' + $this.attr('id')] = $this.val()
			} else if ($this.attr('name')) {
				if (++cachedCount > 20) return false;
				TribalWars._inputCache['input[name=' + $this.attr('name').replace('[', '\\[').replace(']', '\\]') + ']'] = $this.val()
			}
		})
	},
	restoreInputVars: function() {
		var $content = $('#content_value');
		$.each(this._inputCache, function(sel, val) {
			$content.find(sel).val(val)
		})
	},
	contentLoaded: function() {
		if (this._onLoadHandler) this._onLoadHandler();
		TribalWars.restoreInputVars()
	},
	registerOnLoadHandler: function(handler) {
		this._onLoadHandler = handler
	},
	shouldPartialLoad: function() {
		return true
	},
	showResourceIncrease: function(resource, amount) {
		var $current = $('#' + resource),
			current_offset = $current.offset(),
			$gain = $('<span id="' + resource + '_gain"></span>').text('+' + amount);
		$gain.css({
			top: (current_offset.top - 8) + 'px',
			left: (current_offset.left - 3) + 'px'
		});
		$gain.appendTo($('body'));
		$gain.animate({
			top: (current_offset.top - 20) + 'px'
		}, 1600, 'linear', function() {
			$(this).delay(500).fadeOut().remove()
		})
	},
	dev: function() {
		TribalWars.get('dev', {
			ajax: 'options'
		}, function(data) {
			$(data.options).insertAfter('.server_info')
		})
	},
	playSound: function(filename) {
		if (!TribalWars._settings.sound) return;
		if (new Date().getTime() - TribalWars._lastSound < 6e4) return;
		var html = '<audio autoplay><source src="' + image_base + '/sound/' + filename + '.ogg" type="audio/ogg" /><source src="' + image_base + '/sound/' + filename + '.mp3" type="audio/mpeg" /></audio>',
			$el = $(html).appendTo('body');
		setTimeout(function() {
			$el.remove()
		}, 1500);
		TribalWars._lastSound = new Date().getTime()
	},
	setSetting: function(setting, value, callback) {
		TribalWars.post('settings', {
			ajaxaction: 'toggle_setting'
		}, {
			setting: setting,
			value: value ? 1 : 0
		}, function(result) {
			TribalWars._settings = $.extend(TribalWars._settings, result);
			callback()
		})
	},
	initTab: function(tabID) {
		if (!Modernizr.localstorage) return;
		this._tabID = tabID;
		TribalWars.setActivityHappened();
		$('body').on('click keydown mouseenter', function() {
			TribalWars.setActivityHappened();
			if (TribalWars._tabTimeout) {
				TribalWars.setActiveTab();
				TribalWars._tabTimeout = false
			}
		});
		if (!document.hidden) TribalWars.setActiveTab();
		$(document).on('visibilitychange', function() {
			TribalWars.setActivityHappened();
			if (document.hidden) {
				TribalWars.setInactiveTab()
			} else TribalWars.setActiveTab()
		})
	},
	setActiveTab: function() {
		localStorage.setItem('activetab', JSON.stringify([this._tabID, new Date().getTime()]));
		localStorage.setItem('lastactivetab', this._tabID);
		TribalWars._tabActive = true;
		TribalWars._tabTimer = setTimeout(function() {
			if (TribalWars.getIdleTime() < 18e4) {
				TribalWars.setActiveTab()
			} else TribalWars._tabTimeout = true
		}, 1e3)
	},
	setInactiveTab: function() {
		if (TribalWars._tabTimer) clearInterval(TribalWars._tabTimer);
		localStorage.setItem('activetab', JSON.stringify(false));
		TribalWars._tabActive = false
	},
	isTabActive: function() {
		return !document.hidden
	},
	isAnyTabActive: function() {
		if (!this._tabID) return true;
		var tab_info = JSON.parse(localStorage.getItem('activetab'));
		return tab_info && new Date().getTime() - tab_info[1] < 2500 && this.getIdleTime() < 18e4
	},
	wasLastActiveTab: function() {
		return this._tabID == localStorage.getItem('lastactivetab')
	},
	setActivityHappened: function() {
		TribalWars._lastActivity = new Date().getTime()
	},
	getIdleTime: function() {
		return new Date().getTime() - TribalWars._lastActivity
	},
	track: function(event, params) {
		TribalWars.post('tracking', {
			ajaxaction: 'track'
		}, {
			event: event,
			params: params
		})
	}
};

/**** game/Village.js ****/
var Village = {
	AFFORD_TYPE_NOW: 1,
	AFFORD_TYPE_COUNTDOWN: 2,
	AFFORD_TYPE_FUTURE: 3,
	AFFORD_TYPE_NEVER: 4,
	canAfford: function(wood, stone, iron) {
		var village = game_data.village,
			can_afford = village.wood >= wood && village.stone >= stone && village.iron >= iron;
		if (can_afford) return {
			afford: Village.AFFORD_TYPE_NOW,
			when: ''
		};
		var storage_max = game_data.village.storage_max;
		if (wood > storage_max || stone > storage_max || iron > storage_max) return {
			afford: Village.AFFORD_TYPE_NEVER,
			when: 'Der Speicher ist zu klein.'
		};
		var missing_wood = wood - village.wood_float,
			missing_stone = stone - village.stone_float,
			missing_iron = iron - village.iron_float,
			wood_time = (missing_wood / village.wood_prod),
			stone_time = (missing_stone / village.stone_prod),
			iron_time = (missing_iron / village.iron_prod),
			max_time = Math.max(wood_time, stone_time, iron_time),
			error;
		if (max_time <= 120) {
			error = 'Genug Rohstoffe in %s';
			error = error.replace('%s', '<span class="timer_replace">' + getTimeString(Math.round(max_time)) + '</span>');
			return {
				afford: Village.AFFORD_TYPE_COUNTDOWN,
				when: error
			}
		} else {
			error = 'Genug Rohstoffe %s';
			error = error.replace('%s', Format.date(getLocalTimeAsFloat() + max_time));
			return {
				afford: Village.AFFORD_TYPE_FUTURE,
				when: error
			}
		}
	}
}; /**** game/Format.js ****/
var Format = {
	date: function(timestamp, show_seconds) {
		var local_offset_from_utc = new Date().getTimezoneOffset() * 60,
			adjusted_timestamp = timestamp + local_offset_from_utc + window.server_utc_diff,
			date = new Date(adjusted_timestamp * 1e3),
			year = date.getYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			seconds = date.getSeconds(),
			pad = function(n) {
				n = '' + n;
				return n.length == 1 ? '0' + n : n
			},
			date_string;
		if (game_data.market == 'us') {
			date_string = pad(month) + '.' + pad(day) + '.'
		} else date_string = pad(day) + '.' + pad(month) + '.';
		var time_string = pad(hours) + ':' + pad(minutes) + (show_seconds === true ? ':' + pad(seconds) : ''),
			today = new Date(new Date().getTime() + local_offset_from_utc * 1e3 + window.server_utc_diff * 1e3),
			tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		if (today.getDate() == date.getDate()) {
			return 'heute um %s Uhr'.replace('%s', time_string)
		} else if (tomorrow.getDate() == date.getDate()) {
			return 'morgen um %s'.replace('%s', time_string)
		} else return 'am %1 um %2'.replace('%1', date_string).replace('%2', time_string)
	},
	time: function(timestamp, show_seconds) {
		var time = new Date(timestamp),
			time_string = '';
		time_string += Format.padLead(time.getHours(), 2);
		time_string += ':' + Format.padLead(time.getMinutes(), 2);
		if (show_seconds) time_string += ':' + Format.padLead(time.getSeconds(), 2);
		return time_string
	},
	buildTime: function(timestamp) {
		var time_string = '',
			days = Math.floor(timestamp / 24 / 60 / 60 / 1e3);
		time_string += (days > 0) ? days + ':' : '';
		var hours = Math.floor(timestamp / 60 / 60 / 1e3) % 24;
		time_string += (days > 0) ? Format.padLead(hours, 2) : hours;
		var minutes = Math.floor(timestamp / 60 / 1e3) % 60;
		time_string += ':' + Format.padLead(minutes, 2);
		var seconds = Math.floor(timestamp / 1e3) % 60;
		time_string += ':' + Format.padLead(seconds, 2);
		return time_string
	},
	padLead: function(n, digits) {
		var string = n.toString();
		for (var i = string.length; i < digits; i++) string = "0" + string;
		return string
	}
}; /**** game/Dialog.js ****/
var Dialog = {
	MAX_WIDTH: 820,
	closeCallback: null,
	show: function(id, content, closeCallback, options) {
		var options = $.extend({
			class_name: '',
			close_from_fader: true
		}, options);
		this.closeCallback = closeCallback;
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement,
			container = fullscreenElement || 'body',
			$container = $('.popup_box_container'),
			$box, $fader, $content, show_anim = false;
		if (!$container.length) {
			show_anim = true;
			$container = $('<div class="popup_box_container" />');
			$box = $('<div class="popup_box" />').attr('id', 'popup_box_' + id).addClass(options.class_name).appendTo($container);
			$fader = $('<div class="fader" />').appendTo($container);
			$content = $('<div class="popup_box_content" />').appendTo($box);
			$container.appendTo($(container))
		} else {
			$box = $container.find('.popup_box');
			$content = $container.find('.popup_box_content');
			$box.css('width', 'auto')
		};
		$content.html(content);
		var height_buffer = 125;
		if ($(window).width() < 500 || $(window).height() < $content.height() + height_buffer) {
			$box.addClass('mobile');
			$(window).scrollTop(0)
		};
		var border_width = 40,
			min_width = 250,
			width = Math.min(this.MAX_WIDTH, $content.width(), $(window).width() - border_width);
		if (width < min_width) width = min_width;
		$box.css('width', width + 'px').css('margin-left', '-' + ((width + border_width) / 2) + 'px');
		var hotkey_hint = (!mobile && !mobiledevice && HotKeys.enabled) ? ' :: Keyboard Shortcut: <b>Esc</b>' : '',
			tooltip_class = (!mobile && !mobiledevice) ? 'tooltip-delayed' : '',
			$close = $('<a class="popup_box_close ' + tooltip_class + '" title="SchlieÃŸen' + hotkey_hint + '" href="#">&nbsp;</a>').prependTo($content);
		UI.ToolTip($close, {
			delay: 400
		});
		var close_elements = options.close_from_fader ? '.fader, .popup_box_close, .popup_closer' : '.popup_box_close, .popup_closer';
		$container.on('click', close_elements, function() {
			Dialog.close(true);
			return false
		});
		if (show_anim) setTimeout(function() {
			$box.addClass('show')
		}, 50)
	},
	close: function(by_user) {
		$('.popup_box_container').remove();
		if (Dialog.closeCallback) Dialog.closeCallback(by_user);
		inlinePopupClose();
		$('.popup_style').hide();
		return false
	},
	fetch: function(name, screen, get_params) {
		TribalWars.get(screen, get_params, function(data) {
			Dialog.show(name, data.dialog)
		})
	}
}; 
/**** game/VillageGroups.js ****/
var VillageGroups = {
	loadGroups: function(village_id, target, editing, saveCallback) {
		TribalWars.get('groups', {
			ajax: 'load_groups',
			village_id: village_id
		}, function(data) {
			VillageGroups.showGroups(data, target, editing, saveCallback)
		})
	},
	loadGroupsToggle: function(village_id, target, editing) {
		var $target = $('#' + target);
		$target.toggle();
		if ($target.is(':visible')) VillageGroups.loadGroups(village_id, target, editing)
	},
	showGroups: function(data, target, editing, saveCallback) {
		saveCallback = typeof saveCallback !== 'undefined' ? saveCallback : function() {};
		$('#' + target).empty();
		var to_display = $("<table>").attr('id', 'group_table').attr('width', '100%').addClass('vis'),
			tbody = $("<tbody>");
		to_display.append(tbody);
		$('#group_assiggment > tr').not('#header').remove();
		tbody.append($("<img>").attr('src', "graphic/throbber.gif").attr('alt', "Loading...").attr('id', 'throbber'));
		var form;
		if (editing) form = $("<form>").attr('id', "reassign_village_to_groups_form_" + target).attr('action', $("#group_assign_action").val()).attr('method', 'POST');
		for (var i = 0; i < data.result.length; i++)
			if (editing || data.result[i].in_group) {
				var table_row = $("<tr>"),
					table_col = $("<td>"),
					name = data.result[i].name,
					label = null;
				if (editing) {
					var checkbox = $("<input>").attr("type", "checkbox").attr("id", "checkbox_" + name).attr("name", "groups[]").attr("value", data.result[i].group_id).addClass("check");
					table_col.append(checkbox);
					if (data.result[i].in_group) checkbox.attr("checked", "checked");
					label = $("<label>").attr('for', 'checkbox_' + name).html(name)
				};
				var para = $("<p>").addClass("p_groups");
				if (label) {
					para.append(label)
				} else para.html(name);
				table_col.append(para);
				table_row.append(table_col);
				tbody.append(table_row)
			};
		if (editing) {
			to_display.appendTo(form);
			form.append($("<input>").attr('name', 'village_id').attr('type', 'hidden').val(data.village_id));
			form.append($("<input>").attr('name', 'mode').attr('type', 'hidden').val("village"));
			form.append($("<input>").attr('type', 'submit').attr('class', 'btn-default').val($("#group_submit_text").val()));
			$('#' + target).append(form)
		} else $('#' + target).append(to_display);
		$('#throbber').remove();
		if (editing) {
			form.unbind().on('submit', function() {
				TribalWars.post(form.attr('action'), {}, form.serialize(), function(data) {
					VillageGroups.showGroups(data, target, false, saveCallback);
					if (saveCallback) saveCallback(data, target)
				});
				return false
			})
		} else {
			var bottom_body = $("<tbody>"),
				bottom_table = $("<table>").attr('width', "100%").addClass('vis').css("margin-top", "-2px").append(bottom_body),
				bottom_row = $("<tr>"),
				bottom_col = $("<td>"),
				el = $("<a>").attr('href', '#').html($("#group_edit_village").val()).on('click', function() {
					VillageGroups.loadGroups(data.village_id, 'group_assignment', true, saveCallback);
					return false
				});
			bottom_col.append(el);
			bottom_row.append(bottom_col);
			bottom_body.append(bottom_row);
			$('#' + target).append(bottom_table)
		}
	},
	handleSaveFromOverview: function(data, target) {
		var groups = "",
			count = 0;
		if (data.result != null && data.result.length > 0) {
			for (var i = 0; i < data.result.length; i++)
				if (data.result[i].in_group) {
					groups += data.result[i].name + "; ";
					count++
				};
			groups = groups.substring(0, groups.lastIndexOf(";"));
			$("#assigned_groups_" + data.village_id + "_names").html(groups)
		} else {
			$("#assigned_groups_" + data.village_id + "_names").empty();
			var element = $('<span class="grey" style="font-style:italic"></span>');
			element.html($('#group_undefined').val());
			$("#assigned_groups_" + data.village_id + "_names").append(element)
		};
		$("#assigned_groups_" + data.village_id + "_count").html(count);
		if (mobile) {
			$('#group_edit_div_' + data.village_id).hide()
		} else $('#group_edit_tr_' + data.village_id).hide()
	},
	initOverviews: function() {
		$('#add_group_form').on('submit', function() {
			VillageGroups.createGroup($(this).find('#add_new_group_name').val());
			return false
		})
	},
	displayGroupInfo: function(data, target, show_all) {
		$('#' + target).empty();
		var throb = $("<img>").attr('src', '/graphic/throbber.gif');
		$('#' + target).append(throb);
		var to_display = $('<table>').addClass('vis').attr('id', 'group_table').width('100%'),
			tbody = $('<tbody>');
		to_display.append(tbody);
		var header = $('<tr>');
		tbody.append(header);
		var headline = $('<th>').width('100%').html($('#group_config_headline').val());
		header.append(headline);
		var form_events = new Array();
		for (var i = 0; i < data.result.length; i++) {
			if (!show_all && i == 5) {
				var remaining = data.result.length - 5,
					$tr = $('<tr><td><a href="#" /></td></tr>'),
					$a = $tr.find('a');
				if (remaining == 1) {
					$a.text('Zeige 1 weitere Gruppe')
				} else $a.text(s('Zeige %1 weitere Gruppen', remaining));
				$a.on('click', function() {
					VillageGroups.displayGroupInfo(data, target, true)
				});
				tbody.append($tr);
				break
			};
			var group_id = data.result[i].group_id,
				group_name = data.result[i].name,
				table_row = $('<tr>').attr('id', 'tr_group' + group_id),
				table_col = $('<td>').attr('id', 'show_group' + group_id),
				link_edit_group = $('<a>').attr('href', data.result[i].link).html(escapeHtml(group_name));
			if (data.last_selected != null && group_id == data.last_selected) table_col.addClass('selected');
			table_col.append(link_edit_group);
			table_row.append(table_col);
			var table_col2 = $('<td>').attr('id', 'rename_group' + group_id).css('display', 'none'),
				rename_form = $('<form>').attr('id', 'rename_group_form' + group_id).attr('class', 'rename_group_form').attr('action', $('#rename_group_link').val() + "&old_name=" + group_name).attr('method', 'post'),
				inp = $('<input>').attr('type', 'hidden').attr('name', 'group_id').attr('value', group_id);
			rename_form.append(inp);
			inp = $('<input>').attr('type', 'hidden').attr('name', 'mode').attr('value', $('#group_mode').val());
			rename_form.append(inp);
			inp = $('<input>').attr('type', 'text').attr('name', 'group_name').attr('value', group_name);
			rename_form.append(inp);
			inp = $('<input>').attr('type', 'submit').attr('class', 'btn-default').attr('value', $('#group_submit_text').val());
			rename_form.append(inp);
			table_col2.append(rename_form);
			table_row.append(table_col2);
			if (group_id != 0) {
				var delete_href = $('<a>').attr('href', '#').addClass('float_right').data('group-name', group_name);
				img = $('<img>').attr('src', '/graphic/delete_14.png').attr('title', $('#group_title_delete').val());
				delete_href.append(img);
				table_col.append(delete_href);
				delete_href.click(function(event) {
					var handleConfirmDelete = function() {
							VillageGroups.deleteGroup(VillageGroups.getGroupID(event))
						},
						msg = s($('#group_msg_confirm_delete').val(), $(this).data('group-name')),
						buttons = [{
							text: "BestÃ¤tigen",
							callback: handleConfirmDelete,
							confirm: true
						}];
					UI.ConfirmationBox(msg, buttons);
					return false
				});
				var rename_href = $('<a>').attr('href', '#').css('margin', '0 5px'),
					img = $('<img>').attr('src', '/graphic/rename.png').attr('title', $('#group_title_rename').val());
				rename_href.append(img);
				table_col.append(rename_href);
				rename_href.click(function(event) {
					var group_id = VillageGroups.getGroupID(event);
					toggle_element('#show_group' + group_id);
					toggle_element('#rename_group' + group_id);
					return false
				});
				form_events[i] = new Array();
				form_events[i]["group_id"] = group_id
			};
			tbody.append(table_row)
		};
		$('#' + target).empty().append(to_display).show();
		$('.rename_group_form').on('submit', function() {
			var group_id = $(this).find('input[name=group_id]').val(),
				name = $(this).find('input[name=group_name]').val();
			VillageGroups.renameGroup(group_id, name);
			return false
		})
	},
	reloadOverviewPage: function() {
		var group_param = location.href.match(/group=[0-9]*/),
			url = $('#start_edit_group_link').val().replace('group=0', group_param);
		$.ajax({
			url: url,
			dataType: 'html',
			success: function(msg) {
				if ($('#group_management_content').length > 0) {
					$('#group_management_content').html(msg)
				} else $('#paged_view_content').html(msg); if (typeof MDS != 'undefined') MDS.initToggleMenus();
				VillageGroups.initOverviews()
			}
		})
	},
	createGroup: function(name) {
		TribalWars.post('groups', {
			ajaxaction: 'create_group'
		}, {
			group_name: name
		}, function(data) {
			$('#add_new_group_name').val('');
			VillageGroups.reloadOverviewPage()
		})
	},
	deleteGroup: function(group_id) {
		TribalWars.post('groups', {
			ajaxaction: 'delete_group'
		}, {
			group_id: group_id
		}, function(data) {
			VillageGroups.reloadOverviewPage()
		})
	},
	renameGroup: function(group_id, name) {
		TribalWars.post('groups', {
			ajaxaction: 'rename_group'
		}, {
			group_name: name,
			group_id: group_id
		}, function(data) {
			VillageGroups.reloadOverviewPage()
		})
	},
	getGroupID: function(event) {
		var source = null;
		if (event.srcElement) {
			source = event.srcElement
		} else source = event.target;
		var row_id = $(source).parents('tr').first().attr('id');
		return parseInt(row_id.substr(8))
	},
	villageSelect: {
		init: function(target) {
			TribalWars.get('groups', {
				ajax: 'load_groups'
			}, function(data) {
				VillageGroups.villageSelect.handleGroupData(data, target)
			})
		},
		handleGroupData: function(response, target) {
			json_groups = response;
			if (typeof target != 'object') target = $("#" + target);
			var form = $("<form>").attr("id", "select_group_box").attr("action", $('#show_groups_villages_link').val()).attr("method", "POST"),
				par = $("<p>").attr("style", "margin: 0 0 10px 0; font-weight: bold;").html($("#group_popup_select_title").val()),
				select = $("<select>").attr("id", "group_id").attr("name", "group_id").css("margin-left", "3px"),
				hidden = $("<input>").attr("type", "hidden").attr("name", "mode").attr("value", $('#group_popup_mode').val());
			form.append(hidden);
			var selected = false;
			for (var i = 0; i < json_groups.result.length; i++) {
				var option = $("<option>").attr("value", json_groups.result[i].group_id).html(escapeHtml(json_groups.result[i].name));
				if (json_groups.group_id && json_groups.result[i].group_id == json_groups.group_id) {
					option.attr("selected", true);
					selected = true
				};
				select.append(option)
			};
			var content = $("<div>").attr("id", "group_list_content").css('overflow', 'auto');
			if (!mobile) content.css('height', '340px');
			par.append(select);
			form.append(par);
			target.empty();
			target.append(form).append(content);
			form.on('submit', function() {
				TribalWars.post('groups', {
					ajax: 'load_villages_from_group'
				}, {
					group_id: $('#group_id').val()
				}, function(data) {
					VillageGroups.villageSelect.showVillages(data.html, 'group_list_content')
				});
				return false
			});
			form.submit();
			$('#group_id').change(function() {
				$('#group_list_content').html(UI.Throbber);
				form.submit()
			})
		},
		showVillages: function(html_table, target) {
			$('#' + target).html(html_table);
			$('th.group_label').html($('#group_popup_villages_select').val());
			var selected = $('#selected_popup_village');
			if (selected.length) {
				var offsetTop = selected.position().top;
				$('#group_list_content').scrollTop(offsetTop - 60)
			}
		}
	}
};

/**** game/OrderProgress.js ****/
var OrderProgress = {
	didInitTicker: false,
	initProgress: function() {
		$('.order-progress').each(function() {
			var $container = $(this),
				data = $container.data('progress'),
				slot_speeds = [];
			$.each(data.progress, function(k, slot) {
				var seconds_worked = slot[0],
					percentage_complete = slot[1],
					$slot = $('<div />').css({
						width: (percentage_complete * 100) + '%'
					});
				$slot.data('seconds_worked', seconds_worked);
				$slot.data('percentage_complete', percentage_complete);
				$container.append($slot);
				slot_speeds.push(percentage_complete / seconds_worked)
			});
			var $slot = $('<div />');
			$container.append($slot);
			$container.data('slot_speeds', slot_speeds)
		});
		UI.ToolTip($('.order-progress').find('div'), {
			bodyHandler: OrderProgress.getTooltipBody
		});
		this.updateProgress();
		if (!this.didInitTicker) {
			this.didInitTicker = true;
			$(window.TribalWars).on('resource_change', function() {
				OrderProgress.updateProgress()
			})
		}
	},
	updateProgress: function() {
		$('.order-progress').each(function() {
			var $container = $(this),
				data = $container.data('progress'),
				slot_speeds = $container.data('slot_speeds');
			if (!slot_speeds) return;
			slot_speeds = slot_speeds.slice(0);
			var time_elapsed = Math.min(data.slot_elapsed + Math.max(Timing.getElapsedTimeSinceData() / 1e3, 0.1), data.slot_time),
				slot_percentage_complete = time_elapsed / data.slot_time,
				overall_percentage_complete = slot_percentage_complete * (1 - data.percentage_complete);
			slot_speeds.push(overall_percentage_complete / time_elapsed);
			var max_speed = Math.max.apply(Math, slot_speeds),
				min_speed = Math.min.apply(Math, slot_speeds),
				$slots = $container.find('div');
			$slots.each(function(k) {
				var $slot = $(this),
					strength;
				if (k == $slots.length - 1) {
					strength = ((overall_percentage_complete / time_elapsed) - min_speed) / (max_speed - min_speed);
					$slot.css('width', (overall_percentage_complete * 100) + '%');
					$slot.data('percentage_complete', overall_percentage_complete);
					$slot.data('seconds_worked', time_elapsed)
				} else strength = (($slot.data('percentage_complete') / $slot.data('seconds_worked')) - min_speed) / (max_speed - min_speed); if (slot_speeds.length == 1) {
					strength = 0
				} else if (isNaN(strength)) strength = 1;
				var color;
				if (strength == 0) {
					color = '#92c200'
				} else if (strength == 1) {
					color = '#577400'
				} else color = '#7aa104';
				$slot.css('background-color', color)
			})
		})
	},
	getTooltipBody: function() {
		var $this = $(this),
			percentage_complete = $this.data('percentage_complete'),
			seconds_worked = $this.data('seconds_worked');
		return s('%1% fertig in %2', Math.round(percentage_complete * 100), getTimeString(Math.round(seconds_worked)))
	}
};

/**** game/Timing.js ****/
var Timing = {
	tick_interval: 1e3,
	initial_server_time: null,
	initial_local_time: null,
	added_server_time: 0,
	offset_to_server: 0,
	offset_from_server: 0,
	paused: false,
	tickHandlers: {},
	init: function(server_time) {
		this.initial_server_time = Math.round(server_time * 1e3);
		if (this.supportsPerformanceAPI()) {
			this.offset_from_server = Date.now() - performance.timing.responseStart;
			this.offset_to_server = performance.timing.responseStart - performance.timing.fetchStart
		} 
		else this.initial_local_time = new Date().getTime();
		for (var i in Timing.tickHandlers) {
			if (!Timing.tickHandlers.hasOwnProperty(i)) continue;
			if (Timing.tickHandlers[i].hasOwnProperty('init')) Timing.tickHandlers[i].init()
		};

		var $st = $('#serverTime').click(function() {
			Timing.pause()
		});
		if (Timing.offset_to_server) $st.attr('title', 'Verbindungszeit zum Server: ' + Timing.offset_to_server + 'ms');
		this.doGlobalTick()
	},
	pause: function() {
		this.paused = !this.paused
	},
	supportsPerformanceAPI: function() {
		return Modernizr.performance && typeof window.performance == 'object' && typeof window.performance.now == 'function'
	},
	getReturnTimeFromServer: function() {
		return this.offset_from_server
	},
	getElapsedTimeSinceLoad: function() {
		if (this.supportsPerformanceAPI()) return performance.now() - this.getReturnTimeFromServer();
		return new Date().getTime() - Timing.initial_local_time
	},
	getElapsedTimeSinceData: function() {
		if (this.supportsPerformanceAPI()) return performance.now() - this.added_server_time - this.getReturnTimeFromServer();
		return new Date().getTime() - Timing.initial_local_time - this.added_server_time
	},
	getCurrentServerTime: function() {
		return this.initial_server_time + this.getElapsedTimeSinceLoad()
	},
	doGlobalTick: function(is_one_off) {
		if (!Timing.paused) {
			for (var i in Timing.tickHandlers) {
				if (!Timing.tickHandlers.hasOwnProperty(i)) continue;
				Timing.tickHandlers[i].tick()
			};
			$(window.TribalWars).trigger('resource_change')
		};
		if (!is_one_off) {
			var now = Math.round(Timing.getCurrentServerTime()),
				wait_for = Timing.tick_interval - (now % Timing.tick_interval) + 10;
			setTimeout(Timing.doGlobalTick, wait_for)
		}
	},
	resetTickHandlers: function() {
		this.added_server_time += this.getElapsedTimeSinceData();
		for (var i in Timing.tickHandlers) {
			if (!Timing.tickHandlers.hasOwnProperty(i)) continue;
			if (Timing.tickHandlers[i].hasOwnProperty('reset')) Timing.tickHandlers[i].reset()
		};
		this.doGlobalTick(true)
	}
};


Timing.tickHandlers.serverTime = {
	tick: function() {
		var $el = $('#serverTime'),
			now = Timing.getCurrentServerTime() / 1e3,
			adjusted_timestamp = now + window.server_utc_diff;
		$el.text(getTimeString(adjusted_timestamp, true))
	}
};

Timing.tickHandlers.resources = {
	start: {},
	lastFullState: false,
	tick: function() {
		if (!game_data.village) return;
		Timing.tickHandlers.resources.tickResource('wood');
		Timing.tickHandlers.resources.tickResource('stone');
		Timing.tickHandlers.resources.tickResource('iron');
		Timing.tickHandlers.resources.checkIfFull()
	},
	tickResource: function(resource_name) {
		var start = Timing.tickHandlers.resources.getOriginalValue(resource_name),
			max = parseInt(game_data.village.storage_max, 10),
			prod = parseFloat(game_data.village[resource_name + '_prod'], 10),
			current = Math.min(max, start + (prod * (Timing.getElapsedTimeSinceData() / 1e3))),
			$element = $('#' + resource_name);
		if ((current >= (max * 0.9)) && (current < max)) {
			changeResStyle($element, 'warn_90')
		} else if (current < max) {
			changeResStyle($element, 'res')
		} else changeResStyle($element, 'warn');
		game_data.village[resource_name + '_float'] = current;
		game_data.village[resource_name] = Math.floor(current);
		var index = resource_name == 'wood' ? 0 : (resource_name == 'stone' ? 2 : 4);
		game_data.village.res[index] = Math.floor(current);
		if (mobile) {
			if (current > 99999) {
				current = Math.floor(current / 1e3) + 'K'
			} else if (current > 9999) {
				current = Math.floor(current / 100) / 10 + 'K'
			} else current = Math.floor(current)
		} else current = Math.floor(current);
		$element.html(current)
	},
	checkIfFull: function() {
		var storage = parseInt(game_data.village.storage_max),
			full = game_data.village.wood >= storage || game_data.village.stone >= storage || game_data.village.iron > storage;
		if (full && !this.lastFullState) BrowserNotification.showNotification(BrowserNotification.NOTIFICATION_WAREHOUSE, [game_data.village.name]);
		this.lastFullState = full
	},
	initResource: function(resource_name) {
		var start = parseFloat(game_data.village[resource_name + '_float'], 10);
		return Timing.tickHandlers.resources.start[resource_name] = start
	},
	getOriginalValue: function(resource_name) {
		if (Timing.tickHandlers.resources.start.hasOwnProperty(resource_name)) return Timing.tickHandlers.resources.start[resource_name];
		return Timing.tickHandlers.resources.initResource(resource_name)
	},
	reset: function() {
		Timing.tickHandlers.resources.start = {}
	}
};
Timing.tickHandlers.timers = {
	_timers: [],
	init: function() {
		var now = Math.round(Timing.getCurrentServerTime() / 1e3),
			that = this;
		$('span.timer,span.timer_replace').each(function() {
			var $this = $(this),
				seconds = getTime($this);
			if (seconds != -1) that._timers.push({
				element: $this,
				end: now + seconds,
				reload: $this.hasClass('timer')
			});
			$this.removeClass('timer').removeClass('timer_replace')
		})
	},
	reset: function() {
		this.init()
	},
	tick: function() {
		for (var i = 0; i < this._timers.length; i++) {
			var remove = this.tickTimer(this._timers[i]);
			if (remove) this._timers.splice(i, 1)
		}
	},
	tickTimer: function(timer) {
		if (!$.contains(document.body, timer.element[0])) return true;
		var time = Math.round(timer.end - (Timing.getCurrentServerTime() / 1e3));
		if (timer.reload && time < 0) {
			formatTime(timer.element, 0, false);
			var hide_reload = $('.popup_style:visible').length > 0;
			if (!hide_reload) {
				if (TribalWars.shouldPartialLoad()) {
					partialReload()
				} else document.location.href = document.location.href.replace(/action=\w*/, '').replace(/#.*$/, '');
				return true
			} else return false
		};
		if (!timer.reload && time <= 0) {
			var parent = timer.element.parent(),
				next = parent.next();
			if (next.length === 0) return false;
			next.css('display', 'inline');
			parent.remove();
			return true
		};
		formatTime(timer.element, time, false);
		return false
	}
};
Timing.tickHandlers.forwardTimers = {
	_timers: [],
	init: function() {
		$('span.relative_time').each(function() {
			Timing.tickHandlers.forwardTimers._timers.push($(this));
			$(this).removeClass('.relative_time')
		})
	},
	tick: function() {
		for (var i = 0; i < this._timers.length; i++) {
			var $el = this._timers[i];
			if (!$.contains(document.body, $el[0])) {
				this._timers.splice(i, 1);
				continue
			};
			var duration = $el.data('duration'),
				arrival = ((Timing.getCurrentServerTime() + Timing.offset_to_server) / 1e3) + duration;
			$el.text(Format.date(arrival, true))
		}
	},
	reset: function() {
		this.init()
	}
}; /**** game/HotKeys.js ****/
var HotKeys = {
	enabled: false,
	init: function() {
		var $doc = $(document);
		$doc.on('keydown', null, 'shift+h', HotKeys.help);
		$doc.on('keydown', null, 'a', HotKeys.previousVillage);
		$doc.on('keydown', null, 'd', HotKeys.nextVillage);
		$doc.on('keydown', null, 'w', HotKeys.nextReport);
		$doc.on('keydown', null, 's', HotKeys.previousReport);
		$doc.on('keydown', null, 'v', HotKeys.villageOverview);
		$doc.on('keydown', null, 'm', HotKeys.map);
		$doc.on('keydown', null, 'esc', HotKeys.closeDialog);
		this.enabled = true
	},
	help: function(e) {
		if (e) e.stopPropagation();
		TribalWars.get('api', {
			ajax: 'hotkeys'
		}, function(result) {
			Dialog.show('hotkeys', result.dialog)
		})
	},
	nextReport: function(e) {
		var $el = $('#report-next');
		if ($el.length) {
			UI.InfoMessage('Lade Bericht...');
			document.location.replace($el.attr('href'))
		}
	},
	previousReport: function(e) {
		var $el = $('#report-prev');
		if ($el.length) {
			UI.InfoMessage('Lade Bericht...');
			document.location.replace($el.attr('href'))
		}
	},
	previousVillage: function(e) {
		e.stopPropagation();
		var $el = $('#village_switch_left');
		if ($el.length) {
			UI.InfoMessage('Wechsle Dorf...');
			document.location.replace($el.attr('href'))
		}
	},
	nextVillage: function(e) {
		e.stopPropagation();
		var $el = $('#village_switch_right');
		if ($el.length) {
			UI.InfoMessage('Wechsle Dorf...');
			document.location.replace($el.attr('href'))
		}
	},
	villageOverview: function(e) {
		e.stopPropagation();
		UI.InfoMessage('Ã–ffne DorfÃ¼bersicht...');
		TribalWars.redirect('overview')
	},
	map: function(e) {
		e.stopPropagation();
		UI.InfoMessage('Ã–ffne Karte...');
		TribalWars.redirect('map')
	},
	closeDialog: function(e) {
		e.stopPropagation();
		Dialog.close()
	}
}; /**** game/Campaign.js ****/
var Campaign = {
	showInterstitial: function(interstitial) {
		Dialog.show('campaign', interstitial, function(by_user) {
			if (by_user) Campaign.ignoreInterstitial()
		}, {
			class_name: 'slim',
			close_from_fader: false
		});
		$('#popup_box_campaign .campaign-image').on('click', Campaign.acceptInterstitial)
	},
	ignoreInterstitial: function() {
		TribalWars.post('campaign', {
			ajaxaction: 'ignore_interstitial'
		}, {}, function() {})
	},
	acceptInterstitial: function() {
		Dialog.close();
		TribalWars.post('campaign', {
			ajaxaction: 'accept_campaign'
		}, {}, function(result) {
			var ctaCallback = function() {
					switch (result.cta) {
						case 'inventory':
							TribalWars.redirect('inventory');
							break;
						case 'cashShop':
							Premium.buy();
							break;
						case 'none':
							break;
						default:
							document.location.replace(result.cta)
					}
				},
				rewardCallback = function() {
					var html = '<img src="' + result.reward.img + '" class="left" alt="" /><div style="width: 350px; float: left">' + result.reward.title + '<br />' + result.reward.description + '</div>';
					UI.SuccessMessage(html, 2500)
				};
			if (result.reward) {
				rewardCallback();
				setTimeout(ctaCallback, 2700)
			} else setTimeout(ctaCallback, 700)
		})
	}
}; /**** game/BrowserNotification.js ****/
var BrowserNotification;
(function() {
	'use strict';
	BrowserNotification = {
		NOTIFICATION_INTRO: 'bn_intro',
		NOTIFICATION_ATTACK: 'bn_attack',
		NOTIFICATION_WAREHOUSE: 'bn_warehouse',
		NOTIFICATION_MAIL: 'bn_mail',
		NOTIFICATION_BUILDING: 'bn_building',
		defaultProperties: {
			icon: '/browser_notification.png',
			timeout: 3
		},
		notifications: {
			bn_intro: {
				title: 'Die StÃ¤mme',
				properties: {
					body: 'Benachrichtigungen wurden aktiviert! So sehen sie aus.'
				}
			},
			bn_attack: {
				title: 'Die StÃ¤mme - Eingehender Angriff!',
				properties: {
					body: 'Dein Dorf %1 wurde angegriffen.'
				}
			},
			bn_warehouse: {
				title: 'Die StÃ¤mme - Speicher voll',
				properties: {
					body: 'Dein Speicher in %1 ist voll.'
				}
			},
			bn_mail: {
				title: 'Die StÃ¤mme - Nachricht erhalten',
				properties: {
					body: 'Du hast eine neue Nachricht von %s erhalten.'
				}
			},
			bn_building: {
				title: 'Die StÃ¤mme - Bau abgeschlossen',
				properties: {
					body: 'Dein Baufauftrag von %1 in %2 wurde abgeschlossen.'
				}
			}
		},
		supported: function() {
			return Notify.isSupported() && 'hidden' in document && Modernizr.localstorage && Modernizr.json
		},
		shouldShowNotification: function(notification_type) {
			if (notification_type === 'bn_intro') return true;
			return TribalWars._settings[notification_type] && !Notify.needsPermission() && !TribalWars.isAnyTabActive() && TribalWars.wasLastActiveTab()
		},
		showNotification: function(type, params, click_callback) {
			if (!BrowserNotification.notifications.hasOwnProperty(type)) throw "No such notification " + type;
			if (!BrowserNotification.supported()) return;
			if (!BrowserNotification.shouldShowNotification(type)) return;
			var notification = BrowserNotification.notifications[type],
				properties = $.extend(notification.properties, BrowserNotification.defaultProperties);
			if ($.isArray(params)) properties.body = s(properties.body, params);
			if (properties.hasOwnProperty('icon')) properties.icon = image_base + properties.icon;
			properties.notifyShow = function() {
				TribalWars.track('notification', ['see_notification', type])
			};
			properties.notifyClose = function() {
				TribalWars.track('notification', ['close_notification', type])
			};
			properties.notifyClick = function() {
				if (typeof click_callback === 'function') click_callback();
				TribalWars.track('notification', ['accept_notification', type])
			};
			new Notify(notification.title, properties).show()
		},
		showNotificationsTurnedOnNotification: function() {
			this.showNotification('bn_intro')
		}
	}
}()); /**** game/Connection.js ****/
var Connection;
(function() {
	'use strict';
	Connection = {
		socket: null,
		handlers: {},
		connect: function(port, sid) {
			if (window.mobile) return;
			if (!this.isSupportedBrowser()) {
				this.showUnsupportedBrowserNotice();
				return
			};
			if (typeof io === 'undefined') {
				Connection.debug('node', 'Couldn\'t connect to backend: socket.io not available');
				return
			};
			this.socket = io.connect(window.location.hostname + ':' + port + '/game', {
				reconnection: false,
				query: 'sessid=' + sid,
				rememberUpgrade: true
			});
			var socket = this.socket;
			this.socket.on('connect', function() {
				Connection.debug('Connected to backend')
			});
			this.socket.on('error', function(err) {
				Connection.debug('Couldn\'t connect to backend:' + err)
			});
			$.each(this.handlers, function(name, handler) {
				Connection.socket.on(name, function(data) {
					Connection.debug('Message from backend: ' + name);
					handler(data)
				})
			})
		},
		isSupportedBrowser: function() {
			if (window.opera && window.opera.version) {
				var splitVersion = window.opera.version().split('.');
				return splitVersion > 12
			};
			return true
		},
		showUnsupportedBrowserNotice: function() {
			$('#unsupported-browser').show().on('click', function() {
				Dialog.fetch('unsupported_browser', 'api', {
					ajax: 'unsupported_browser'
				})
			})
		},
		debug: function(message) {
			if (typeof Debug !== 'undefined' && false) Debug.message('node', message)
		}
	};
	Connection.handlers.gamedata = function(data) {
		TribalWars.handleGameData(data)
	};
	Connection.handlers.award = function(data) {
		var stripped_img = data.image.replace('awards/', '').replace('.png', ''),
			click_callback = function() {
				TribalWars.redirect('info_player', {
					mode: 'awards'
				})
			};
		UI.Notification.show('/user_image.php?award=' + stripped_img + '&level=' + data.level, 'Erfolg erhalten!', data.name + '<br />' + data.description, click_callback)
	};
	Connection.handlers.award_progress = function(data) {
		var stripped_img = data.image.replace('awards/', '').replace('.png', ''),
			click_callback = function() {
				TribalWars.redirect('info_player', {
					mode: 'awards'
				})
			},
			progress = '<div class="progress-bar"><span class="label">%1 / %2</span><div style="width: %3%"></div></div>';
		UI.Notification.show('/user_image.php?award=' + stripped_img + '&level=' + data.level, 'Erfolgsfortschritt:' + data.name, window.s(progress, data.current, data.max, data.current / data.max * 100), click_callback);
		UI.InitProgressBars()
	};
	Connection.handlers.message = function(data) {
		var click_callback = function() {
			TribalWars.redirect('mail', {
				mode: 'view',
				view: data.id
			})
		};
		if (TribalWars.isAnyTabActive()) {
			UI.Notification.show(image_base + '/notification/message.png', s('Nachricht von %1 erhalten', data.sender_name), data.subject, click_callback)
		} else BrowserNotification.showNotification(BrowserNotification.NOTIFICATION_MAIL, [data.sender_name], click_callback)
	};
	Connection.handlers.attack = function(data) {
		if (TribalWars.wasLastActiveTab()) TribalWars.playSound('attack');
		var click_callback = function() {
			TribalWars.redirect('incomings')
		};
		BrowserNotification.showNotification(BrowserNotification.NOTIFICATION_ATTACK, [data.target_village_name], click_callback)
	};
	Connection.handlers.building_complete = function(data) {
		BrowserNotification.showNotification(BrowserNotification.NOTIFICATION_BUILDING, [data.building_order, data.village_name])
	};
	Connection.handlers.premium_trial = function(data) {
		Premium.showFeatureTrialNotification()
	};
	Connection.handlers.debug = function(data) {
		alert(data)
	}
}()); /**** game/Toggler.js ****/
var Toggler;
(function() {
	'use strict';
	Toggler = {
		register: function(el, toggler, callback) {
			var $el = $(el);
			$(toggler).on('click', function() {
				Toggler.toggle($el, callback)
			});
			var saved_state = $.cookie('toggler_' + $el.data('name'));
			if (saved_state !== 'undefined' && parseInt(saved_state) === 0) Toggler.hide($el, callback)
		},
		toggle: function($el, callback) {
			if ($el.css('display') === 'none') {
				Toggler.show($el, callback)
			} else Toggler.hide($el, callback)
		},
		show: function($el, callback) {
			$el.show();
			$.cookie('toggler_' + $el.data('name'), 1, {
				expires: 365,
				path: '/'
			});
			if (callback) callback()
		},
		hide: function($el, callback) {
			$el.hide();
			$.cookie('toggler_' + $el.data('name'), 0, {
				expires: 365,
				path: '/'
			});
			if (callback) callback()
		}
	}
})(); /**** start/GoogleAnalytics.js ****/
var GAPageTracking = {
	track: function(trackdata) {
		dataLayer.push(trackdata)
	}
}; /**** start/index.js ****/
function popup_scroll(url, width, height) {
	var wnd = window.open(url, "popup", "width=" + width + ",height=" + height + ",left=150,top=100,resizable=yes,scrollbars=yes");
	wnd.focus()
}

function hover_toggle_css(el, to_css, from_css) {
	$(el).toggleClass(to_css);
	if (from_css) $(el).toggleClass(from_css)
};
var Index = {
	login_submit: function() {
		if (Index.world_select_enter_pressed()) return false;
		var url = $("#login_form").attr('action'),
			data = {
				user: $("#user").val(),
				password: $("#password").val(),
				cookie: mobile ? true : $("#cookie").is(":checked"),
				clear: true
			};
		$.ajax({
			type: 'POST',
			url: url,
			data: data,
			dataType: "json",
			success: function(response) {
				$("#error").remove();
				if (response != null)
					if (response.error != null) {
						if (!mobile) {
							$(".login-block h2").after("<div id='error' class='error' style='line-height: 20px'>" + response.error + "</div>")
						} else $('.error').show().html(response.error);
						return
					} else if (!mobile) {
					$("#servers-list-block").html(response.res);
					$("#world_selection").show();
					$("#servers-list").show()
				} else $('#mobileLogin').html(response.res)
			}
		});
		return false
	},
	world_select_enter_pressed: function() {
		var dl = $('.world_button_active');
		if (dl.length == 1 && $('#world_selection').is(":visible")) {
			$('.world_button_active')[0].parentNode.onclick();
			return true
		};
		return false
	},
	submit_login: function(server) {
		$server_select_list = $('#server_select_list');
		$server_select_list.attr("action", $server_select_list.attr("action") + "&" + server);
		$server_select_list.submit();
		return false
	},
	toggle_screenshot: function(num) {
		$('#screenshot_image').append("<img src='/graphic/index/screenshot-" + num + ".jpg' />");
		$('#screenshot').fadeIn("slow")
	},
	hide_screenshot: function() {
		$('#screenshot').fadeOut("fast", function() {
			$('#screenshot_image').html('')
		})
	},
	countdown: function(container, remaining_seconds, desc) {
		var starting_seconds = remaining_seconds;
		remaining_seconds -= 1;
		var timer = $('<p class="timer"><span class="timer-item">00</span> <span class="timer-item">:</span> <span class="timer-item">00</span> <span class="timer-item">:</span> <span class="timer-item">00</span> <span class="timer-item">:</span> <span class="timer-item">00</span></p>').css('visibility', 'hidden'),
			days = timer.find('span').eq(0),
			hours = timer.find('span').eq(2),
			minutes = timer.find('span').eq(4),
			seconds = timer.find('span').eq(6),
			interval = setInterval(function() {
				var days_remaining = Math.floor((remaining_seconds / 60 / 60 / 24) % 60),
					hours_remaining = Math.floor((remaining_seconds / 60 / 60) % 24),
					minutes_remaining = Math.floor((remaining_seconds / 60) % 60),
					seconds_remaining = remaining_seconds % 60;
				days.text(days_remaining);
				hours.text((hours_remaining < 10 ? "0" : "") + hours_remaining);
				minutes.text((minutes_remaining < 10 ? "0" : "") + minutes_remaining);
				seconds.text((seconds_remaining < 10 ? "0" : "") + seconds_remaining);
				if (starting_seconds - 1 == remaining_seconds) timer.css('visibility', 'visible');
				remaining_seconds -= 1;
				if (remaining_seconds < 0) {
					timer.fadeOut();
					clearInterval(interval)
				}
			}, 1e3);
		container.empty();
		container.append(timer);
		if (desc.length) {
			var desc = $('<div />').attr('id', 'countdown_info').text(desc);
			timer.append(desc);
			timer.parent().css('margin-bottom', '25px')
		}
	}
};