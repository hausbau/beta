ect ",e,i)}})})(jQuery);
;/**** jquery/jquery.browser.js ****/
jQuery.uaMatch=function(ua){ua=ua.toLowerCase();var match=/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("
compatible ")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];return{browser:match[1]||"
",version:match[2]||"
0 "}};if(!jQuery.browser){matched=jQuery.uaMatch(navigator.userAgent);browser={};if(matched.browser){browser[matched.browser]=true;browser.version=matched.version};if(browser.chrome){browser.webkit=true}else if(browser.webkit)browser.safari=true;jQuery.browser=browser}
;/**** jquery/jquery.ds.tooltip.js ****/
(function($){var helper={},current,title,tID,IE=$.browser.msie&&/MSIE\s(5\.5|6\.)/.test(navigator.userAgent),track=false;$.tooltip={blocked:false,defaults:{delay:200,fade:false,showURL:true,extraClass:"
",top:15,left:15,id:"
tooltip "},block:function(){$.tooltip.blocked=!$.tooltip.blocked}};$.fn.extend({tooltip:function(settings){settings=$.extend({},$.tooltip.defaults,settings);createHelper(settings);return this.each(function(){$.data(this,"
tooltip ",settings);this.tOpacity=helper.parent.css("
opacity ");this.tooltipText=this.title}).mouseover(save).mouseout(hide).click(hide).removeAttr('title').removeClass('tooltip').removeAttr('alt')},fixPNG:IE?function(){return this.each(function(){var image=$(this).css('backgroundImage');if(image.match(/^url\(["
']?(.*\.png)["'] ? \) $ / i)) {
	image = RegExp.$1;
	$(this).css({
		backgroundImage: 'none',
		filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
	}).each(function() {
		var position = $(this).css('position');
		if (position != 'absolute' && position != 'relative') $(this).css('position', 'relative')
	})
}
})
} : function() {
	return this
}, unfixPNG: IE ? function() {
return this.each(function() {
	$(this).css({
		filter: '',
		backgroundImage: ''
	})
})
} : function() {
return this
}, hideWhenEmpty: function() {
return this.each(function() {
	$(this)[$(this).html() ? "show" : "hide"]()
})
}, url: function() {
return this.attr('href') || this.attr('src')
}
})

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
})(jQuery); /**** jquery/jquery.quickedit.js ****/
(function($, window, document, undefined) {
	var pluginName = "QuickEdit",
		defaults = {}

	function QuickEdit(element, options) {
		this.element = element;
		this.settings = $.extend({
			url: '',
			show_icons: true,
			label_element: false
		}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init()
	};
	QuickEdit.prototype = {
		init: function() {
			$(this.element).find('.rename-icon').on('click', $.proxy(this.beginEdit, this))
		},
		beginEdit: function() {
			var $container = $(this.element),
				$label = $container.find('.quickedit-label'),
				label_width = $label.width(),
				current_text;
			if ($label.data('text')) {
				current_text = $label.data('text')
			} else var current_text = $.trim($container.find('.quickedit-label').text());
			$container.find('.quickedit-content').hide();
			var $container = $('<span class="quickedit-edit"></span>'),
				$text_input = $('<input type="text" />').val(current_text).css('width', label_width + 'px').appendTo($container).on('keydown', $.proxy(function(e) {
					if (e.keyCode == 13) {
						this.beginSave();
						return false
					}
				}, this)),
				$button = $('<input type="button" class="btn" />').val('OK').appendTo($container).on('click', $.proxy(this.beginSave, this));
			$container.appendTo($(this.element));
			$text_input.select();
			return false
		},
		beginSave: function() {
			var $container = $(this.element),
				new_text = $container.find('input[type=text]').prop('disabled', true).val();
			$container.find('.btn').remove();
			$container.find('.quickedit-edit').append(UI.Image('loading2.gif', {
				style: 'vertical-align: middle'
			}));
			var url = this.settings.url.replace('__ID__', $container.data('id')),
				that = this;
			TribalWars.post(url, {}, {
				text: new_text
			}, function(data) {
				var $label = that.settings.label_element ? $(that.settings.label_element) : $container.find('.quickedit-label');
				$label.text(data.text);
				if (data.raw) $label.data('text', data.raw);
				if (data.icon && that.settings.show_icons) {
					var $content = $container.find('.quickedit-content');
					$content.find('img').remove();
					$.each(data.icon, function(i, icon) {
						$content.prepend(UI.Image(icon.img));
						$content.prepend(' ')
					})
				};
				that.revert()
			}, function() {
				that.revert()
			})
		},
		revert: function() {
			var $container = $(this.element);
			$container.find('.quickedit-edit').remove();
			$container.find('.quickedit-content').show()
		}
	};
	$.fn[pluginName] = function(options) {
		this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) $.data(this, "plugin_" + pluginName, new QuickEdit(this, options))
		});
		return this
	}
})(jQuery, window, document); /**** jquery/jquery-cookie.js ****/
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory)
	} else if (typeof exports === 'object') {
		factory(require('jquery'))
	} else factory(jQuery)
}(function($) {
	var pluses = /\+/g

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s)
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s)
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value))
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		try {
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s
		} catch (e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value
	};
	var config = $.cookie = function(key, value, options) {
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);
			if (typeof options.expires === 'number') {
				var days = options.expires,
					t = options.expires = new Date();
				t.setTime(+t + days * 864e+5)
			};
			return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''))
		};
		var result = key ? undefined : {},
			cookies = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');
			if (key && key === name) {
				result = read(cookie, value);
				break
			};
			if (!key && (cookie = read(cookie)) !== undefined) result[name] = cookie
		};
		return result
	};
	config.defaults = {};
	$.removeCookie = function(key, options) {
		if ($.cookie(key) === undefined) return false;
		$.cookie(key, '', $.extend({}, options, {
			expires: -1
		}));
		return !$.cookie(key)
	}
})); /**** jquery/jquery.hotkeys.js ****/
(function(jQuery) {
	jQuery.hotkeys = {
		version: "0.8",
		specialKeys: {
			8: "backspace",
			9: "tab",
			10: "return",
			13: "return",
			16: "shift",
			17: "ctrl",
			18: "alt",
			19: "pause",
			20: "capslock",
			27: "esc",
			32: "space",
			33: "pageup",
			34: "pagedown",
			35: "end",
			36: "home",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
			45: "insert",
			46: "del",
			59: ";",
			61: "=",
			96: "0",
			97: "1",
			98: "2",
			99: "3",
			100: "4",
			101: "5",
			102: "6",
			103: "7",
			104: "8",
			105: "9",
			106: "*",
			107: "+",
			109: "-",
			110: ".",
			111: "/",
			112: "f1",
			113: "f2",
			114: "f3",
			115: "f4",
			116: "f5",
			117: "f6",
			118: "f7",
			119: "f8",
			120: "f9",
			121: "f10",
			122: "f11",
			123: "f12",
			144: "numlock",
			145: "scroll",
			173: "-",
			186: ";",
			187: "=",
			188: ",",
			189: "-",
			190: ".",
			191: "/",
			192: "`",
			219: "[",
			220: "\\",
			221: "]",
			222: "'"
		},
		shiftNums: {
			"`": "~",
			"1": "!",
			"2": "@",
			"3": "#",
			"4": "$",
			"5": "%",
			"6": "^",
			"7": "&",
			"8": "*",
			"9": "(",
			"0": ")",
			"-": "_",
			"=": "+",
			";": ": ",
			"'": "\"",
			",": "<",
			".": ">",
			"/": "?",
			"\\": "|"
		}
	}

	function keyHandler(handleObj) {
		if (typeof handleObj.data === "string") handleObj.data = {
			keys: handleObj.data
		};
		if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") return;
		var origHandler = handleObj.handler,
			keys = handleObj.data.keys.toLowerCase().split(" "),
			textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color", "tel"];
		handleObj.handler = function(event) {
			if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) || jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1)) return;
			var special = jQuery.hotkeys.specialKeys[event.keyCode],
				character = String.fromCharCode(event.which).toLowerCase(),
				modif = "",
				possible = {};
			jQuery.each(["alt", "ctrl", "meta", "shift"], function(index, specialKey) {
				if (event[specialKey + 'Key'] && special !== specialKey) modif += specialKey + '+'
			});
			modif = modif.replace('alt+ctrl+meta+shift', 'hyper');
			if (special) possible[modif + special] = true;
			if (character) {
				possible[modif + character] = true;
				possible[modif + jQuery.hotkeys.shiftNums[character]] = true;
				if (modif === "shift+") possible[jQuery.hotkeys.shiftNums[character]] = true
			};
			for (var i = 0, l = keys.length; i < l; i++)
				if (possible[keys[i]]) return origHandler.apply(this, arguments)
		}
	};
	jQuery.each(["keydown", "keyup", "keypress"], function() {
		jQuery.event.special[this] = {
			add: keyHandler
		}
	})
})(this.jQuery); /**** jquery/jtoggler.js ****/
var JToggler = {
	init: function(selector) {
		JToggler.elements = $(selector + ':not(.selectAll):not(.ignore_jtoggler)');
		JToggler.elements.unbind('mousedown', JToggler.down).bind('mousedown', JToggler.down);
		JToggler.elements.unbind('click', JToggler.click).bind('click', JToggler.click);
		$('body').unbind('mouseup', JToggler.up).bind('mouseup', JToggler.up)
	},
	click: function(event) {
		if (JToggler.first) JToggler.first.checked = JToggler.checked;
		if (event.shiftKey && JToggler.first) {
			var from = JToggler.elements.index(JToggler.first),
				to = JToggler.elements.index(event.target),
				i;
			if (from > to) {
				i = to;
				to = from
			} else i = from;
			for (i; i < to; i++) JToggler.elements[i].checked = JToggler.checked
		}
	},
	down: function(event) {
		if (event.shiftKey || JToggler.started) return;
		JToggler.started = true;
		JToggler.first = event.target;
		JToggler.checked = event.target.checked = !event.target.checked;
		JToggler.elements.mouseover(JToggler.over)
	},
	over: function(event) {
		if (event.target.checked != JToggler.checked) event.target.checked = JToggler.checked
	},
	up: function(event) {
		if (!JToggler.started) return;
		JToggler.started = false;
		JToggler.elements.unbind('mouseover', JToggler.over)
	}
}; /**** libs/notify.js ****/
(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define('notify', [], function() {
			return factory(root, document)
		})
	} else if (typeof exports === 'object') {
		module.exports = factory(root, document)
	} else root.Notify = factory(root, document)
}(window, function(w, d) {
	'use strict'

	function Notify(title, options) {
		if (typeof title !== 'string') throw new Error('Notify(): first arg (title) must be a string.');
		this.title = title;
		this.options = {
			icon: '',
			body: '',
			tag: '',
			notifyShow: null,
			notifyClose: null,
			notifyClick: null,
			notifyError: null,
			permissionGranted: null,
			permissionDenied: null,
			timeout: null
		};
		this.permission = null;
		if (!Notify.isSupported()) return;
		if (typeof options === 'object') {
			for (var i in options)
				if (options.hasOwnProperty(i)) this.options[i] = options[i];
			if (typeof this.options.notifyShow === 'function') this.onShowCallback = this.options.notifyShow;
			if (typeof this.options.notifyClose === 'function') this.onCloseCallback = this.options.notifyClose;
			if (typeof this.options.notifyClick === 'function') this.onClickCallback = this.options.notifyClick;
			if (typeof this.options.notifyError === 'function') this.onErrorCallback = this.options.notifyError
		}
	};
	Notify.isSupported = function() {
		if ('Notification' in w) return true;
		return false
	};
	Notify.needsPermission = function() {
		if (Notify.isSupported() && Notification.permission === 'granted') return false;
		return true
	};
	Notify.requestPermission = function(onPermissionGrantedCallback, onPermissionDeniedCallback) {
		if (Notify.isSupported()) w.Notification.requestPermission(function(perm) {
			switch (perm) {
				case 'granted':
					if (typeof onPermissionGrantedCallback === 'function') onPermissionGrantedCallback();
					break;
				case 'denied':
					if (typeof onPermissionDeniedCallback === 'function') onPermissionDeniedCallback();
					break
			}
		})
	};
	Notify.prototype.show = function() {
		var that = this;
		if (!Notify.isSupported()) return;
		this.myNotify = new Notification(this.title, {
			body: this.options.body,
			tag: this.options.tag,
			icon: this.options.icon
		});
		if (this.options.timeout && !isNaN(this.options.timeout)) setTimeout(this.close.bind(this), this.options.timeout * 1e3);
		this.myNotify.addEventListener('show', this, false);
		this.myNotify.addEventListener('error', this, false);
		this.myNotify.addEventListener('close', this, false);
		this.myNotify.addEventListener('click', this, false)
	};
	Notify.prototype.onShowNotification = function(e) {
		if (this.onShowCallback) this.onShowCallback(e)
	};
	Notify.prototype.onCloseNotification = function() {
		if (this.onCloseCallback) this.onCloseCallback();
		this.destroy()
	};
	Notify.prototype.onClickNotification = function() {
		if (this.onClickCallback) this.onClickCallback()
	};
	Notify.prototype.onErrorNotification = function() {
		if (this.onErrorCallback) this.onErrorCallback();
		this.destroy()
	};
	Notify.prototype.destroy = function() {
		this.myNotify.removeEventListener('show', this, false);
		this.myNotify.removeEventListener('error', this, false);
		this.myNotify.removeEventListener('close', this, false);
		this.myNotify.removeEventListener('click', this, false)
	};
	Notify.prototype.close = function() {
		this.myNotify.close()
	};
	Notify.prototype.handleEvent = function(e) {
		switch (e.type) {
			case 'show':
				this.onShowNotification(e);
				break;
			case 'close':
				this.onCloseNotification(e);
				break;
			case 'click':
				this.onClickNotification(e);
				break;
			case 'error':
				this.onErrorNotification(e);
				break
		}
	};
	return Notify
})); /**** libs/socket.io.js ****/
! function(e) {
	"object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : "undefined" != typeof window ? window.io = e() : "undefined" != typeof global ? global.io = e() : "undefined" != typeof self && (self.io = e())
}(function() {
	var define, module, exports;
	return (function e(t, n, r) {
		function s(o, u) {
			if (!n[o]) {
				if (!t[o]) {
					var a = typeof require == "function" && require;
					if (!u && a) return a(o, !0);
					if (i) return i(o, !0);
					throw new Error("Cannot find module '" + o + "'")
				};
				var f = n[o] = {
					exports: {}
				};
				t[o][0].call(f.exports, function(e) {
					var n = t[o][1][e];
					return s(n ? n : e)
				}, f, f.exports, e, t, n, r)
			};
			return n[o].exports
		};
		var i = typeof require == "function" && require;
		for (var o = 0; o < r.length; o++) s(r[o]);
		return s
	})({
		1: [
			function(require, module, exports) {
				module.exports = require('./lib/')
			}, {
				"./lib/": 2
			}
		],
		2: [
			function(require, module, exports) {
				var url = require('./url'),
					parser = require('socket.io-parser'),
					Manager = require('./manager'),
					debug = require('debug')('socket.io-client');
				module.exports = exports = lookup;
				var cache = exports.managers = {}

				function lookup(uri, opts) {
					if (typeof uri == 'object') {
						opts = uri;
						uri = undefined
					};
					opts = opts || {};
					var parsed = url(uri),
						source = parsed.source,
						id = parsed.id,
						io;
					if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
						debug('ignoring socket cache for %s', source);
						io = Manager(source, opts)
					} else {
						if (!cache[id]) {
							debug('new io instance for %s', source);
							cache[id] = Manager(source, opts)
						};
						io = cache[id]
					};
					return io.socket(parsed.path)
				};
				exports.protocol = parser.protocol;
				exports.connect = lookup;
				exports.Manager = require('./manager');
				exports.Socket = require('./socket')
			}, {
				"./manager": 3,
				"./socket": 5,
				"./url": 6,
				debug: 9,
				"socket.io-parser": 40
			}
		],
		3: [
			function(require, module, exports) {
				var url = require('./url'),
					eio = require('engine.io-client'),
					Socket = require('./socket'),
					Emitter = require('component-emitter'),
					parser = require('socket.io-parser'),
					on = require('./on'),
					bind = require('component-bind'),
					object = require('object-component'),
					debug = require('debug')('socket.io-client:manager');
				module.exports = Manager

				function Manager(uri, opts) {
					if (!(this instanceof Manager)) return new Manager(uri, opts);
					if (uri && ('object' == typeof uri)) {
						opts = uri;
						uri = undefined
					};
					opts = opts || {};
					opts.path = opts.path || '/socket.io';
					this.nsps = {};
					this.subs = [];
					this.opts = opts;
					this.reconnection(opts.reconnection !== false);
					this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
					this.reconnectionDelay(opts.reconnectionDelay || 1e3);
					this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
					this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
					this.readyState = 'closed';
					this.uri = uri;
					this.connected = 0;
					this.attempts = 0;
					this.encoding = false;
					this.packetBuffer = [];
					this.encoder = new parser.Encoder();
					this.decoder = new parser.Decoder();
					this.open()
				};
				Manager.prototype.emitAll = function() {
					this.emit.apply(this, arguments);
					for (var nsp in this.nsps) this.nsps[nsp].emit.apply(this.nsps[nsp], arguments)
				};
				Emitter(Manager.prototype);
				Manager.prototype.reconnection = function(v) {
					if (!arguments.length) return this._reconnection;
					this._reconnection = !!v;
					return this
				};
				Manager.prototype.reconnectionAttempts = function(v) {
					if (!arguments.length) return this._reconnectionAttempts;
					this._reconnectionAttempts = v;
					return this
				};
				Manager.prototype.reconnectionDelay = function(v) {
					if (!arguments.length) return this._reconnectionDelay;
					this._reconnectionDelay = v;
					return this
				};
				Manager.prototype.reconnectionDelayMax = function(v) {
					if (!arguments.length) return this._reconnectionDelayMax;
					this._reconnectionDelayMax = v;
					return this
				};
				Manager.prototype.timeout = function(v) {
					if (!arguments.length) return this._timeout;
					this._timeout = v;
					return this
				};
				Manager.prototype.maybeReconnectOnOpen = function() {
					if (!this.openReconnect && !this.reconnecting && this._reconnection) {
						this.openReconnect = true;
						this.reconnect()
					}
				};
				Manager.prototype.open = Manager.prototype.connect = function(fn) {
					debug('readyState %s', this.readyState);
					if (~this.readyState.indexOf('open')) return this;
					debug('opening %s', this.uri);
					this.engine = eio(this.uri, this.opts);
					var socket = this.engine,
						self = this;
					this.readyState = 'opening';
					var openSub = on(socket, 'open', function() {
							self.onopen();
							fn && fn()
						}),
						errorSub = on(socket, 'error', function(data) {
							debug('connect_error');
							self.cleanup();
							self.readyState = 'closed';
							self.emitAll('connect_error', data);
							if (fn) {
								var err = new Error('Connection error');
								err.data = data;
								fn(err)
							};
							self.maybeReconnectOnOpen()
						});
					if (false !== this._timeout) {
						var timeout = this._timeout;
						debug('connect attempt will timeout after %d', timeout);
						var timer = setTimeout(function() {
							debug('connect attempt timed out after %d', timeout);
							openSub.destroy();
							socket.close();
							socket.emit('error', 'timeout');
							self.emitAll('connect_timeout', timeout)
						}, timeout);
						this.subs.push({
							destroy: function() {
								clearTimeout(timer)
							}
						})
					};
					this.subs.push(openSub);
					this.subs.push(errorSub);
					return this
				};
				Manager.prototype.onopen = function() {
					debug('open');
					this.cleanup();
					this.readyState = 'open';
					this.emit('open');
					var socket = this.engine;
					this.subs.push(on(socket, 'data', bind(this, 'ondata')));
					this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
					this.subs.push(on(socket, 'error', bind(this, 'onerror')));
					this.subs.push(on(socket, 'close', bind(this, 'onclose')))
				};
				Manager.prototype.ondata = function(data) {
					this.decoder.add(data)
				};
				Manager.prototype.ondecoded = function(packet) {
					this.emit('packet', packet)
				};
				Manager.prototype.onerror = function(err) {
					debug('error', err);
					this.emitAll('error', err)
				};
				Manager.prototype.socket = function(nsp) {
					var socket = this.nsps[nsp];
					if (!socket) {
						socket = new Socket(this, nsp);
						this.nsps[nsp] = socket;
						var self = this;
						socket.on('connect', function() {
							self.connected++
						})
					};
					return socket
				};
				Manager.prototype.destroy = function(socket) {
					--this.connected || this.close()
				};
				Manager.prototype.packet = function(packet) {
					debug('writing packet %j', packet);
					var self = this;
					if (!self.encoding) {
						self.encoding = true;
						this.encoder.encode(packet, function(encodedPackets) {
							for (var i = 0; i < encodedPackets.length; i++) self.engine.write(encodedPackets[i]);
							self.encoding = false;
							self.processPacketQueue()
						})
					} else self.packetBuffer.push(packet)
				};
				Manager.prototype.processPacketQueue = function() {
					if (this.packetBuffer.length > 0 && !this.encoding) {
						var pack = this.packetBuffer.shift();
						this.packet(pack)
					}
				};
				Manager.prototype.cleanup = function() {
					var sub;
					while (sub = this.subs.shift()) sub.destroy();
					this.packetBuffer = [];
					this.encoding = false;
					this.decoder.destroy()
				};
				Manager.prototype.close = Manager.prototype.disconnect = function() {
					this.skipReconnect = true;
					this.engine.close()
				};
				Manager.prototype.onclose = function(reason) {
					debug('close');
					this.cleanup();
					this.readyState = 'closed';
					this.emit('close', reason);
					if (this._reconnection && !this.skipReconnect) this.reconnect()
				};
				Manager.prototype.reconnect = function() {
					if (this.reconnecting) return this;
					var self = this;
					this.attempts++;
					if (this.attempts > this._reconnectionAttempts) {
						debug('reconnect failed');
						this.emitAll('reconnect_failed');
						this.reconnecting = false
					} else {
						var delay = this.attempts * this.reconnectionDelay();
						delay = Math.min(delay, this.reconnectionDelayMax());
						debug('will wait %dms before reconnect attempt', delay);
						this.reconnecting = true;
						var timer = setTimeout(function() {
							debug('attempting reconnect');
							self.emitAll('reconnect_attempt', self.attempts);
							self.emitAll('reconnecting', self.attempts);
							self.open(function(err) {
								if (err) {
									debug('reconnect attempt error');
									self.reconnecting = false;
									self.reconnect();
									self.emitAll('reconnect_error', err.data)
								} else {
									debug('reconnect success');
									self.onreconnect()
								}
							})
						}, delay);
						this.subs.push({
							destroy: function() {
								clearTimeout(timer)
							}
						})
					}
				};
				Manager.prototype.onreconnect = function() {
					var attempt = this.attempts;
					this.attempts = 0;
					this.reconnecting = false;
					this.emitAll('reconnect', attempt)
				}
			}, {
				"./on": 4,
				"./socket": 5,
				"./url": 6,
				"component-bind": 7,
				"component-emitter": 8,
				debug: 9,
				"engine.io-client": 11,
				"object-component": 37,
				"socket.io-parser": 40
			}
		],
		4: [
			function(require, module, exports) {
				module.exports = on

				function on(obj, ev, fn) {
					obj.on(ev, fn);
					return {
						destroy: function() {
							obj.removeListener(ev, fn)
						}
					}
				}
			}, {}
		],
		5: [
			function(require, module, exports) {
				var parser = require('socket.io-parser'),
					Emitter = require('component-emitter'),
					toArray = require('to-array'),
					on = require('./on'),
					bind = require('component-bind'),
					debug = require('debug')('socket.io-client:socket'),
					hasBin = require('has-binary-data'),
					indexOf = require('indexof');
				module.exports = exports = Socket;
				var events = {
						connect: 1,
						connect_error: 1,
						connect_timeout: 1,
						disconnect: 1,
						error: 1,
						reconnect: 1,
						reconnect_attempt: 1,
						reconnect_failed: 1,
						reconnect_error: 1,
						reconnecting: 1
					},
					emit = Emitter.prototype.emit

				function Socket(io, nsp) {
					this.io = io;
					this.nsp = nsp;
					this.json = this;
					this.ids = 0;
					this.acks = {};
					this.open();
					this.receiveBuffer = [];
					this.sendBuffer = [];
					this.connected = false;
					this.disconnected = true;
					this.subEvents()
				};
				Emitter(Socket.prototype);
				Socket.prototype.subEvents = function() {
					var io = this.io;
					this.subs = [on(io, 'open', bind(this, 'onopen')), on(io, 'packet', bind(this, 'onpacket')), on(io, 'close', bind(this, 'onclose'))]
				};
				Socket.prototype.open = Socket.prototype.connect = function() {
					if (this.connected) return this;
					this.io.open();
					if ('open' == this.io.readyState) this.onopen();
					return this
				};
				Socket.prototype.send = function() {
					var args = toArray(arguments);
					args.unshift('message');
					this.emit.apply(this, args);
					return this
				};
				Socket.prototype.emit = function(ev) {
					if (events.hasOwnProperty(ev)) {
						emit.apply(this, arguments);
						return this
					};
					var args = toArray(arguments),
						parserType = parser.EVENT;
					if (hasBin(args)) parserType = parser.BINARY_EVENT;
					var packet = {
						type: parserType,
						data: args
					};
					if ('function' == typeof args[args.length - 1]) {
						debug('emitting packet with ack id %d', this.ids);
						this.acks[this.ids] = args.pop();
						packet.id = this.ids++
					};
					if (this.connected) {
						this.packet(packet)
					} else this.sendBuffer.push(packet);
					return this
				};
				Socket.prototype.packet = function(packet) {
					packet.nsp = this.nsp;
					this.io.packet(packet)
				};
				Socket.prototype.onopen = function() {
					debug('transport is open - connecting');
					if ('/' != this.nsp) this.packet({
						type: parser.CONNECT
					})
				};
				Socket.prototype.onclose = function(reason) {
					debug('close (%s)', reason);
					this.connected = false;
					this.disconnected = true;
					this.emit('disconnect', reason)
				};
				Socket.prototype.onpacket = function(packet) {
					if (packet.nsp != this.nsp) return;
					switch (packet.type) {
						case parser.CONNECT:
							this.onconnect();
							break;
						case parser.EVENT:
							this.onevent(packet);
							break;
						case parser.BINARY_EVENT:
							this.onevent(packet);
							break;
						case parser.ACK:
							this.onack(packet);
							break;
						case parser.BINARY_ACK:
							this.onack(packet);
							break;
						case parser.DISCONNECT:
							this.ondisconnect();
							break;
						case parser.ERROR:
							this.emit('error', packet.data);
							break
					}
				};
				Socket.prototype.onevent = function(packet) {
					var args = packet.data || [];
					debug('emitting event %j', args);
					if (null != packet.id) {
						debug('attaching ack callback to event');
						args.push(this.ack(packet.id))
					};
					if (this.connected) {
						emit.apply(this, args)
					} else this.receiveBuffer.push(args)
				};
				Socket.prototype.ack = function(id) {
					var self = this,
						sent = false;
					return function() {
						if (sent) return;
						sent = true;
						var args = toArray(arguments);
						debug('sending ack %j', args);
						var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
						self.packet({
							type: type,
							id: id,
							data: args
						})
					}
				};
				Socket.prototype.onack = function(packet) {
					debug('calling ack %s with %j', packet.id, packet.data);
					var fn = this.acks[packet.id];
					fn.apply(this, packet.data);
					delete this.acks[packet.id]
				};
				Socket.prototype.onconnect = function() {
					this.connected = true;
					this.disconnected = false;
					this.emit('connect');
					this.emitBuffered()
				};
				Socket.prototype.emitBuffered = function() {
					var i;
					for (i = 0; i < this.receiveBuffer.length; i++) emit.apply(this, this.receiveBuffer[i]);
					this.receiveBuffer = [];
					for (i = 0; i < this.sendBuffer.length; i++) this.packet(this.sendBuffer[i]);
					this.sendBuffer = []
				};
				Socket.prototype.ondisconnect = function() {
					debug('server disconnect (%s)', this.nsp);
					this.destroy();
					this.onclose('io server disconnect')
				};
				Socket.prototype.destroy = function() {
					for (var i = 0; i < this.subs.length; i++) this.subs[i].destroy();
					this.io.destroy(this)
				};
				Socket.prototype.close = Socket.prototype.disconnect = function() {
					if (!this.connected) return this;
					debug('performing disconnect (%s)', this.nsp);
					this.packet({
						type: parser.DISCONNECT
					});
					this.destroy();
					this.onclose('io client disconnect');
					return this
				}
			}, {
				"./on": 4,
				"component-bind": 7,
				"component-emitter": 8,
				debug: 9,
				"has-binary-data": 32,
				indexof: 36,
				"socket.io-parser": 40,
				"to-array": 43
			}
		],
		6: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					parseuri = require('parseuri'),
					debug = require('debug')('socket.io-client:url');
				module.exports = url

				function url(uri, loc) {
					var obj = uri,
						loc = loc || global.location;
					if (null == uri) uri = loc.protocol + '//' + loc.hostname;
					if ('string' == typeof uri) {
						if ('/' == uri.charAt(0))
							if ('undefined' != typeof loc) uri = loc.hostname + uri;
						if (!/^(https?|wss?):\/\//.test(uri)) {
							debug('protocol-less url %s', uri);
							if ('undefined' != typeof loc) {
								uri = loc.protocol + '//' + uri
							} else uri = 'https://' + uri
						};
						debug('parse %s', uri);
						obj = parseuri(uri)
					};
					if (!obj.port)
						if (/^(http|ws)$/.test(obj.protocol)) {
							obj.port = '80'
						} else if (/^(http|ws)s$/.test(obj.protocol)) obj.port = '443';
					obj.path = obj.path || '/';
					obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
					obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));
					return obj
				}
			}, {
				debug: 9,
				parseuri: 38
			}
		],
		7: [
			function(require, module, exports) {
				var slice = [].slice;
				module.exports = function(obj, fn) {
					if ('string' == typeof fn) fn = obj[fn];
					if ('function' != typeof fn) throw new Error('bind() requires a function');
					var args = slice.call(arguments, 2);
					return function() {
						return fn.apply(obj, args.concat(slice.call(arguments)))
					}
				}
			}, {}
		],
		8: [
			function(require, module, exports) {
				module.exports = Emitter

				function Emitter(obj) {
					if (obj) return mixin(obj)
				}

				function mixin(obj) {
					for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
					return obj
				};
				Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
					this._callbacks = this._callbacks || {};
					(this._callbacks[event] = this._callbacks[event] || []).push(fn);
					return this
				};
				Emitter.prototype.once = function(event, fn) {
					var self = this;
					this._callbacks = this._callbacks || {}

					function on() {
						self.off(event, on);
						fn.apply(this, arguments)
					};
					on.fn = fn;
					this.on(event, on);
					return this
				};
				Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
					this._callbacks = this._callbacks || {};
					if (0 == arguments.length) {
						this._callbacks = {};
						return this
					};
					var callbacks = this._callbacks[event];
					if (!callbacks) return this;
					if (1 == arguments.length) {
						delete this._callbacks[event];
						return this
					};
					var cb;
					for (var i = 0; i < callbacks.length; i++) {
						cb = callbacks[i];
						if (cb === fn || cb.fn === fn) {
							callbacks.splice(i, 1);
							break
						}
					};
					return this
				};
				Emitter.prototype.emit = function(event) {
					this._callbacks = this._callbacks || {};
					var args = [].slice.call(arguments, 1),
						callbacks = this._callbacks[event];
					if (callbacks) {
						callbacks = callbacks.slice(0);
						for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args)
					};
					return this
				};
				Emitter.prototype.listeners = function(event) {
					this._callbacks = this._callbacks || {};
					return this._callbacks[event] || []
				};
				Emitter.prototype.hasListeners = function(event) {
					return !!this.listeners(event).length
				}
			}, {}
		],
		9: [
			function(require, module, exports) {
				module.exports = debug

				function debug(name) {
					if (!debug.enabled(name)) return function() {};
					return function(fmt) {
						fmt = coerce(fmt);
						var curr = new Date(),
							ms = curr - (debug[name] || curr);
						debug[name] = curr;
						fmt = name + ' ' + fmt + ' +' + debug.humanize(ms);
						window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
					}
				};
				debug.names = [];
				debug.skips = [];
				debug.enable = function(name) {
					try {
						localStorage.debug = name
					} catch (e) {};
					var split = (name || '').split(/[\s,]+/),
						len = split.length;
					for (var i = 0; i < len; i++) {
						name = split[i].replace('*', '.*?');
						if (name[0] === '-') {
							debug.skips.push(new RegExp('^' + name.substr(1) + '$'))
						} else debug.names.push(new RegExp('^' + name + '$'))
					}
				};
				debug.disable = function() {
					debug.enable('')
				};
				debug.humanize = function(ms) {
					var sec = 1e3,
						min = 60 * 1e3,
						hour = 60 * min;
					if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
					if (ms >= min) return (ms / min).toFixed(1) + 'm';
					if (ms >= sec) return (ms / sec | 0) + 's';
					return ms + 'ms'
				};
				debug.enabled = function(name) {
					for (var i = 0, len = debug.skips.length; i < len; i++)
						if (debug.skips[i].test(name)) return false;
					for (var i = 0, len = debug.names.length; i < len; i++)
						if (debug.names[i].test(name)) return true;
					return false
				}

				function coerce(val) {
					if (val instanceof Error) return val.stack || val.message;
					return val
				};
				try {
					if (window.localStorage) debug.enable(localStorage.debug)
				} catch (e) {}
			}, {}
		],
		10: [
			function(require, module, exports) {
				var index = require('indexof');
				module.exports = Emitter

				function Emitter(obj) {
					if (obj) return mixin(obj)
				}

				function mixin(obj) {
					for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
					return obj
				};
				Emitter.prototype.on = function(event, fn) {
					this._callbacks = this._callbacks || {};
					(this._callbacks[event] = this._callbacks[event] || []).push(fn);
					return this
				};
				Emitter.prototype.once = function(event, fn) {
					var self = this;
					this._callbacks = this._callbacks || {}

					function on() {
						self.off(event, on);
						fn.apply(this, arguments)
					};
					fn._off = on;
					this.on(event, on);
					return this
				};
				Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = function(event, fn) {
					this._callbacks = this._callbacks || {};
					if (0 == arguments.length) {
						this._callbacks = {};
						return this
					};
					var callbacks = this._callbacks[event];
					if (!callbacks) return this;
					if (1 == arguments.length) {
						delete this._callbacks[event];
						return this
					};
					var i = index(callbacks, fn._off || fn);
					if (~i) callbacks.splice(i, 1);
					return this
				};
				Emitter.prototype.emit = function(event) {
					this._callbacks = this._callbacks || {};
					var args = [].slice.call(arguments, 1),
						callbacks = this._callbacks[event];
					if (callbacks) {
						callbacks = callbacks.slice(0);
						for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args)
					};
					return this
				};
				Emitter.prototype.listeners = function(event) {
					this._callbacks = this._callbacks || {};
					return this._callbacks[event] || []
				};
				Emitter.prototype.hasListeners = function(event) {
					return !!this.listeners(event).length
				}
			}, {
				indexof: 36
			}
		],
		11: [
			function(require, module, exports) {
				module.exports = require('./lib/')
			}, {
				"./lib/": 12
			}
		],
		12: [
			function(require, module, exports) {
				module.exports = require('./socket');
				module.exports.parser = require('engine.io-parser')
			}, {
				"./socket": 13,
				"engine.io-parser": 22
			}
		],
		13: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					transports = require('./transports'),
					Emitter = require('component-emitter'),
					debug = require('debug')('engine.io-client:socket'),
					index = require('indexof'),
					parser = require('engine.io-parser'),
					parseuri = require('parseuri'),
					parsejson = require('parsejson'),
					parseqs = require('parseqs');
				module.exports = Socket

				function noop() {}

				function Socket(uri, opts) {
					if (!(this instanceof Socket)) return new Socket(uri, opts);
					opts = opts || {};
					if (uri && 'object' == typeof uri) {
						opts = uri;
						uri = null
					};
					if (uri) {
						uri = parseuri(uri);
						opts.host = uri.host;
						opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
						opts.port = uri.port;
						if (uri.query) opts.query = uri.query
					};
					this.secure = null != opts.secure ? opts.secure : (global.location && 'https:' == location.protocol);
					if (opts.host) {
						var pieces = opts.host.split(':');
						opts.hostname = pieces.shift();
						if (pieces.length) opts.port = pieces.pop()
					};
					this.agent = opts.agent || false;
					this.hostname = opts.hostname || (global.location ? location.hostname : 'localhost');
					this.port = opts.port || (global.location && location.port ? location.port : (this.secure ? 443 : 80));
					this.query = opts.query || {};
					if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
					this.upgrade = false !== opts.upgrade;
					this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
					this.forceJSONP = !!opts.forceJSONP;
					this.forceBase64 = !!opts.forceBase64;
					this.timestampParam = opts.timestampParam || 't';
					this.timestampRequests = opts.timestampRequests;
					this.transports = opts.transports || ['polling', 'websocket'];
					this.readyState = '';
					this.writeBuffer = [];
					this.callbackBuffer = [];
					this.policyPort = opts.policyPort || 843;
					this.rememberUpgrade = opts.rememberUpgrade || false;
					this.open();
					this.binaryType = null;
					this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades
				};
				Socket.priorWebsocketSuccess = false;
				Emitter(Socket.prototype);
				Socket.protocol = parser.protocol;
				Socket.Socket = Socket;
				Socket.Transport = require('./transport');
				Socket.transports = require('./transports');
				Socket.parser = require('engine.io-parser');
				Socket.prototype.createTransport = function(name) {
					debug('creating transport "%s"', name);
					var query = clone(this.query);
					query.EIO = parser.protocol;
					query.transport = name;
					if (this.id) query.sid = this.id;
					var transport = new transports[name]({
						agent: this.agent,
						hostname: this.hostname,
						port: this.port,
						secure: this.secure,
						path: this.path,
						query: query,
						forceJSONP: this.forceJSONP,
						forceBase64: this.forceBase64,
						timestampRequests: this.timestampRequests,
						timestampParam: this.timestampParam,
						policyPort: this.policyPort,
						socket: this
					});
					return transport
				}

				function clone(obj) {
					var o = {};
					for (var i in obj)
						if (obj.hasOwnProperty(i)) o[i] = obj[i];
					return o
				};
				Socket.prototype.open = function() {
					var transport;
					if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
						transport = 'websocket'
					} else transport = this.transports[0];
					this.readyState = 'opening';
					var transport = this.createTransport(transport);
					transport.open();
					this.setTransport(transport)
				};
				Socket.prototype.setTransport = function(transport) {
					debug('setting transport %s', transport.name);
					var self = this;
					if (this.transport) {
						debug('clearing existing transport %s', this.transport.name);
						this.transport.removeAllListeners()
					};
					this.transport = transport;
					transport.on('drain', function() {
						self.onDrain()
					}).on('packet', function(packet) {
						self.onPacket(packet)
					}).on('error', function(e) {
						self.onError(e)
					}).on('close', function() {
						self.onClose('transport close')
					})
				};
				Socket.prototype.probe = function(name) {
					debug('probing transport "%s"', name);
					var transport = this.createTransport(name, {
							probe: 1
						}),
						failed = false,
						self = this;
					Socket.priorWebsocketSuccess = false

					function onTransportOpen() {
						if (self.onlyBinaryUpgrades) {
							var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
							failed = failed || upgradeLosesBinary
						};
						if (failed) return;
						debug('probe transport "%s" opened', name);
						transport.send([{
							type: 'ping',
							data: 'probe'
						}]);
						transport.once('packet', function(msg) {
							if (failed) return;
							if ('pong' == msg.type && 'probe' == msg.data) {
								debug('probe transport "%s" pong', name);
								self.upgrading = true;
								self.emit('upgrading', transport);
								Socket.priorWebsocketSuccess = 'websocket' == transport.name;
								debug('pausing current transport "%s"', self.transport.name);
								self.transport.pause(function() {
									if (failed) return;
									if ('closed' == self.readyState || 'closing' == self.readyState) return;
									debug('changing transport and sending upgrade packet');
									cleanup();
									self.setTransport(transport);
									transport.send([{
										type: 'upgrade'
									}]);
									self.emit('upgrade', transport);
									transport = null;
									self.upgrading = false;
									self.flush()
								})
							} else {
								debug('probe transport "%s" failed', name);
								var err = new Error('probe error');
								err.transport = transport.name;
								self.emit('upgradeError', err)
							}
						})
					}

					function freezeTransport() {
						if (failed) return;
						failed = true;
						cleanup();
						transport.close();
						transport = null
					}

					function onerror(err) {
						var error = new Error('probe error: ' + err);
						error.transport = transport.name;
						freezeTransport();
						debug('probe transport "%s" failed because of error: %s', name, err);
						self.emit('upgradeError', error)
					}

					function onTransportClose() {
						onerror("transport closed")
					}

					function onclose() {
						onerror("socket closed")
					}

					function onupgrade(to) {
						if (transport && to.name != transport.name) {
							debug('"%s" works - aborting "%s"', to.name, transport.name);
							freezeTransport()
						}
					}

					function cleanup() {
						transport.removeListener('open', onTransportOpen);
						transport.removeListener('error', onerror);
						transport.removeListener('close', onTransportClose);
						self.removeListener('close', onclose);
						self.removeListener('upgrading', onupgrade)
					};
					transport.once('open', onTransportOpen);
					transport.once('error', onerror);
					transport.once('close', onTransportClose);
					this.once('close', onclose);
					this.once('upgrading', onupgrade);
					transport.open()
				};
				Socket.prototype.onOpen = function() {
					debug('socket open');
					this.readyState = 'open';
					Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
					this.emit('open');
					this.flush();
					if ('open' == this.readyState && this.upgrade && this.transport.pause) {
						debug('starting upgrade probes');
						for (var i = 0, l = this.upgrades.length; i < l; i++) this.probe(this.upgrades[i])
					}
				};
				Socket.prototype.onPacket = function(packet) {
					if ('opening' == this.readyState || 'open' == this.readyState) {
						debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
						this.emit('packet', packet);
						this.emit('heartbeat');
						switch (packet.type) {
							case 'open':
								this.onHandshake(parsejson(packet.data));
								break;
							case 'pong':
								this.setPing();
								break;
							case 'error':
								var err = new Error('server error');
								err.code = packet.data;
								this.emit('error', err);
								break;
							case 'message':
								this.emit('data', packet.data);
								this.emit('message', packet.data);
								break
						}
					} else debug('packet received with socket readyState "%s"', this.readyState)
				};
				Socket.prototype.onHandshake = function(data) {
					this.emit('handshake', data);
					this.id = data.sid;
					this.transport.query.sid = data.sid;
					this.upgrades = this.filterUpgrades(data.upgrades);
					this.pingInterval = data.pingInterval;
					this.pingTimeout = data.pingTimeout;
					this.onOpen();
					if ('closed' == this.readyState) return;
					this.setPing();
					this.removeListener('heartbeat', this.onHeartbeat);
					this.on('heartbeat', this.onHeartbeat)
				};
				Socket.prototype.onHeartbeat = function(timeout) {
					clearTimeout(this.pingTimeoutTimer);
					var self = this;
					self.pingTimeoutTimer = setTimeout(function() {
						if ('closed' == self.readyState) return;
						self.onClose('ping timeout')
					}, timeout || (self.pingInterval + self.pingTimeout))
				};
				Socket.prototype.setPing = function() {
					var self = this;
					clearTimeout(self.pingIntervalTimer);
					self.pingIntervalTimer = setTimeout(function() {
						debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
						self.ping();
						self.onHeartbeat(self.pingTimeout)
					}, self.pingInterval)
				};
				Socket.prototype.ping = function() {
					this.sendPacket('ping')
				};
				Socket.prototype.onDrain = function() {
					for (var i = 0; i < this.prevBufferLen; i++)
						if (this.callbackBuffer[i]) this.callbackBuffer[i]();
					this.writeBuffer.splice(0, this.prevBufferLen);
					this.callbackBuffer.splice(0, this.prevBufferLen);
					this.prevBufferLen = 0;
					if (this.writeBuffer.length == 0) {
						this.emit('drain')
					} else this.flush()
				};
				Socket.prototype.flush = function() {
					if ('closed' != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
						debug('flushing %d packets in socket', this.writeBuffer.length);
						this.transport.send(this.writeBuffer);
						this.prevBufferLen = this.writeBuffer.length;
						this.emit('flush')
					}
				};
				Socket.prototype.write = Socket.prototype.send = function(msg, fn) {
					this.sendPacket('message', msg, fn);
					return this
				};
				Socket.prototype.sendPacket = function(type, data, fn) {
					var packet = {
						type: type,
						data: data
					};
					this.emit('packetCreate', packet);
					this.writeBuffer.push(packet);
					this.callbackBuffer.push(fn);
					this.flush()
				};
				Socket.prototype.close = function() {
					if ('opening' == this.readyState || 'open' == this.readyState) {
						this.onClose('forced close');
						debug('socket closing - telling transport to close');
						this.transport.close()
					};
					return this
				};
				Socket.prototype.onError = function(err) {
					debug('socket error %j', err);
					Socket.priorWebsocketSuccess = false;
					this.emit('error', err);
					this.onClose('transport error', err)
				};
				Socket.prototype.onClose = function(reason, desc) {
					if ('opening' == this.readyState || 'open' == this.readyState) {
						debug('socket close with reason: "%s"', reason);
						var self = this;
						clearTimeout(this.pingIntervalTimer);
						clearTimeout(this.pingTimeoutTimer);
						setTimeout(function() {
							self.writeBuffer = [];
							self.callbackBuffer = [];
							self.prevBufferLen = 0
						}, 0);
						this.transport.removeAllListeners('close');
						this.transport.close();
						this.transport.removeAllListeners();
						this.readyState = 'closed';
						this.id = null;
						this.emit('close', reason, desc)
					}
				};
				Socket.prototype.filterUpgrades = function(upgrades) {
					var filteredUpgrades = [];
					for (var i = 0, j = upgrades.length; i < j; i++)
						if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
					return filteredUpgrades
				}
			}, {
				"./transport": 14,
				"./transports": 15,
				"component-emitter": 8,
				debug: 9,
				"engine.io-parser": 22,
				indexof: 36,
				parsejson: 29,
				parseqs: 30,
				parseuri: 38
			}
		],
		14: [
			function(require, module, exports) {
				var parser = require('engine.io-parser'),
					Emitter = require('component-emitter');
				module.exports = Transport

				function Transport(opts) {
					this.path = opts.path;
					this.hostname = opts.hostname;
					this.port = opts.port;
					this.secure = opts.secure;
					this.query = opts.query;
					this.timestampParam = opts.timestampParam;
					this.timestampRequests = opts.timestampRequests;
					this.readyState = '';
					this.agent = opts.agent || false;
					this.socket = opts.socket
				};
				Emitter(Transport.prototype);
				Transport.timestamps = 0;
				Transport.prototype.onError = function(msg, desc) {
					var err = new Error(msg);
					err.type = 'TransportError';
					err.description = desc;
					this.emit('error', err);
					return this
				};
				Transport.prototype.open = function() {
					if ('closed' == this.readyState || '' == this.readyState) {
						this.readyState = 'opening';
						this.doOpen()
					};
					return this
				};
				Transport.prototype.close = function() {
					if ('opening' == this.readyState || 'open' == this.readyState) {
						this.doClose();
						this.onClose()
					};
					return this
				};
				Transport.prototype.send = function(packets) {
					if ('open' == this.readyState) {
						this.write(packets)
					} else throw new Error('Transport not open')
				};
				Transport.prototype.onOpen = function() {
					this.readyState = 'open';
					this.writable = true;
					this.emit('open')
				};
				Transport.prototype.onData = function(data) {
					try {
						var packet = parser.decodePacket(data, this.socket.binaryType);
						this.onPacket(packet)
					} catch (e) {
						e.data = data;
						this.onError('parser decode error', e)
					}
				};
				Transport.prototype.onPacket = function(packet) {
					this.emit('packet', packet)
				};
				Transport.prototype.onClose = function() {
					this.readyState = 'closed';
					this.emit('close')
				}
			}, {
				"component-emitter": 8,
				"engine.io-parser": 22
			}
		],
		15: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					XMLHttpRequest = require('xmlhttprequest'),
					XHR = require('./polling-xhr'),
					JSONP = require('./polling-jsonp'),
					websocket = require('./websocket');
				exports.polling = polling;
				exports.websocket = websocket

				function polling(opts) {
					var xhr, xd = false;
					if (global.location) {
						var isSSL = 'https:' == location.protocol,
							port = location.port;
						if (!port) port = isSSL ? 443 : 80;
						xd = opts.hostname != location.hostname || port != opts.port
					};
					opts.xdomain = xd;
					xhr = new XMLHttpRequest(opts);
					if ('open' in xhr && !opts.forceJSONP) {
						return new XHR(opts)
					} else return new JSONP(opts)
				}
			}, {
				"./polling-jsonp": 16,
				"./polling-xhr": 17,
				"./websocket": 19,
				xmlhttprequest: 20
			}
		],
		16: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					Polling = require('./polling'),
					inherit = require('component-inherit');
				module.exports = JSONPPolling;
				var rNewline = /\n/g,
					rEscapedNewline = /\\n/g,
					callbacks, index = 0

				function empty() {}

				function JSONPPolling(opts) {
					Polling.call(this, opts);
					this.query = this.query || {};
					if (!callbacks) {
						if (!global.___eio) global.___eio = [];
						callbacks = global.___eio
					};
					this.index = callbacks.length;
					var self = this;
					callbacks.push(function(msg) {
						self.onData(msg)
					});
					this.query.j = this.index;
					if (global.document && global.addEventListener) global.addEventListener('beforeunload', function() {
						if (self.script) self.script.onerror = empty
					})
				};
				inherit(JSONPPolling, Polling);
				JSONPPolling.prototype.supportsBinary = false;
				JSONPPolling.prototype.doClose = function() {
					if (this.script) {
						this.script.parentNode.removeChild(this.script);
						this.script = null
					};
					if (this.form) {
						this.form.parentNode.removeChild(this.form);
						this.form = null
					};
					Polling.prototype.doClose.call(this)
				};
				JSONPPolling.prototype.doPoll = function() {
					var self = this,
						script = document.createElement('script');
					if (this.script) {
						this.script.parentNode.removeChild(this.script);
						this.script = null
					};
					script.async = true;
					script.src = this.uri();
					script.onerror = function(e) {
						self.onError('jsonp poll error', e)
					};
					var insertAt = document.getElementsByTagName('script')[0];
					insertAt.parentNode.insertBefore(script, insertAt);
					this.script = script;
					var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
					if (isUAgecko) setTimeout(function() {
						var iframe = document.createElement('iframe');
						document.body.appendChild(iframe);
						document.body.removeChild(iframe)
					}, 100)
				};
				JSONPPolling.prototype.doWrite = function(data, fn) {
					var self = this;
					if (!this.form) {
						var form = document.createElement('form'),
							area = document.createElement('textarea'),
							id = this.iframeId = 'eio_iframe_' + this.index,
							iframe;
						form.className = 'socketio';
						form.style.position = 'absolute';
						form.style.top = '-1000px';
						form.style.left = '-1000px';
						form.target = id;
						form.method = 'POST';
						form.setAttribute('accept-charset', 'utf-8');
						area.name = 'd';
						form.appendChild(area);
						document.body.appendChild(form);
						this.form = form;
						this.area = area
					};
					this.form.action = this.uri()

					function complete() {
						initIframe();
						fn()
					}

					function initIframe() {
						if (self.iframe) try {
							self.form.removeChild(self.iframe)
						} catch (e) {
							self.onError('jsonp polling iframe removal error', e)
						};
						try {
							var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
							iframe = document.createElement(html)
						} catch (e) {
							iframe = document.createElement('iframe');
							iframe.name = self.iframeId;
							iframe.src = 'javascript:0'
						};
						iframe.id = self.iframeId;
						self.form.appendChild(iframe);
						self.iframe = iframe
					};
					initIframe();
					data = data.replace(rEscapedNewline, '\\\n');
					this.area.value = data.replace(rNewline, '\\n');
					try {
						this.form.submit()
					} catch (e) {};
					if (this.iframe.attachEvent) {
						this.iframe.onreadystatechange = function() {
							if (self.iframe.readyState == 'complete') complete()
						}
					} else this.iframe.onload = complete
				}
			}, {
				"./polling": 18,
				"component-inherit": 21
			}
		],
		17: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					XMLHttpRequest = require('xmlhttprequest'),
					Polling = require('./polling'),
					Emitter = require('component-emitter'),
					inherit = require('component-inherit'),
					debug = require('debug')('engine.io-client:polling-xhr');
				module.exports = XHR;
				module.exports.Request = Request

				function empty() {}

				function XHR(opts) {
					Polling.call(this, opts);
					if (global.location) {
						var isSSL = 'https:' == location.protocol,
							port = location.port;
						if (!port) port = isSSL ? 443 : 80;
						this.xd = opts.hostname != global.location.hostname || port != opts.port
					}
				};
				inherit(XHR, Polling);
				XHR.prototype.supportsBinary = true;
				XHR.prototype.request = function(opts) {
					opts = opts || {};
					opts.uri = this.uri();
					opts.xd = this.xd;
					opts.agent = this.agent || false;
					opts.supportsBinary = this.supportsBinary;
					return new Request(opts)
				};
				XHR.prototype.doWrite = function(data, fn) {
					var isBinary = typeof data !== 'string' && data !== undefined,
						req = this.request({
							method: 'POST',
							data: data,
							isBinary: isBinary
						}),
						self = this;
					req.on('success', fn);
					req.on('error', function(err) {
						self.onError('xhr post error', err)
					});
					this.sendXhr = req
				};
				XHR.prototype.doPoll = function() {
					debug('xhr poll');
					var req = this.request(),
						self = this;
					req.on('data', function(data) {
						self.onData(data)
					});
					req.on('error', function(err) {
						self.onError('xhr poll error', err)
					});
					this.pollXhr = req
				}

				function Request(opts) {
					this.method = opts.method || 'GET';
					this.uri = opts.uri;
					this.xd = !!opts.xd;
					this.async = false !== opts.async;
					this.data = undefined != opts.data ? opts.data : null;
					this.agent = opts.agent;
					this.create(opts.isBinary, opts.supportsBinary)
				};
				Emitter(Request.prototype);
				Request.prototype.create = function(isBinary, supportsBinary) {
					var xhr = this.xhr = new XMLHttpRequest({
							agent: this.agent,
							xdomain: this.xd
						}),
						self = this;
					try {
						debug('xhr open %s: %s', this.method, this.uri);
						xhr.open(this.method, this.uri, this.async);
						if (supportsBinary) xhr.responseType = 'arraybuffer';
						if ('POST' == this.method) try {
							if (isBinary) {
								xhr.setRequestHeader('Content-type', 'application/octet-stream')
							} else xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8')
						} catch (e) {};
						if ('withCredentials' in xhr) xhr.withCredentials = true;
						xhr.onreadystatechange = function() {
							var data;
							try {
								if (4 != xhr.readyState) return;
								if (200 == xhr.status || 1223 == xhr.status) {
									var contentType = xhr.getResponseHeader('Content-Type');
									if (contentType === 'application/octet-stream') {
										data = xhr.response
									} else if (!supportsBinary) {
										data = xhr.responseText
									} else data = 'ok'
								} else setTimeout(function() {
									self.onError(xhr.status)
								}, 0)
							} catch (e) {
								self.onError(e)
							};
							if (null != data) self.onData(data)
						};
						debug('xhr data %s', this.data);
						xhr.send(this.data)
					} catch (e) {
						setTimeout(function() {
							self.onError(e)
						}, 0);
						return
					};
					if (global.document) {
						this.index = Request.requestsCount++;
						Request.requests[this.index] = this
					}
				};
				Request.prototype.onSuccess = function() {
					this.emit('success');
					this.cleanup()
				};
				Request.prototype.onData = function(data) {
					this.emit('data', data);
					this.onSuccess()
				};
				Request.prototype.onError = function(err) {
					this.emit('error', err);
					this.cleanup()
				};
				Request.prototype.cleanup = function() {
					if ('undefined' == typeof this.xhr || null === this.xhr) return;
					this.xhr.onreadystatechange = empty;
					try {
						this.xhr.abort()
					} catch (e) {};
					if (global.document) delete Request.requests[this.index];
					this.xhr = null
				};
				Request.prototype.abort = function() {
					this.cleanup()
				};
				if (global.document) {
					Request.requestsCount = 0;
					Request.requests = {};
					if (global.attachEvent) {
						global.attachEvent('onunload', unloadHandler)
					} else if (global.addEventListener) global.addEventListener('beforeunload', unloadHandler)
				}

				function unloadHandler() {
					for (var i in Request.requests)
						if (Request.requests.hasOwnProperty(i)) Request.requests[i].abort()
				}
			}, {
				"./polling": 18,
				"component-emitter": 8,
				"component-inherit": 21,
				debug: 9,
				xmlhttprequest: 20
			}
		],
		18: [
			function(require, module, exports) {
				var Transport = require('../transport'),
					parseqs = require('parseqs'),
					parser = require('engine.io-parser'),
					inherit = require('component-inherit'),
					debug = require('debug')('engine.io-client:polling');
				module.exports = Polling;
				var hasXHR2 = (function() {
					var XMLHttpRequest = require('xmlhttprequest'),
						xhr = new XMLHttpRequest({
							agent: this.agent,
							xdomain: false
						});
					return null != xhr.responseType
				})()

				function Polling(opts) {
					var forceBase64 = (opts && opts.forceBase64);
					if (!hasXHR2 || forceBase64) this.supportsBinary = false;
					Transport.call(this, opts)
				};
				inherit(Polling, Transport);
				Polling.prototype.name = 'polling';
				Polling.prototype.doOpen = function() {
					this.poll()
				};
				Polling.prototype.pause = function(onPause) {
					var pending = 0,
						self = this;
					this.readyState = 'pausing'

					function pause() {
						debug('paused');
						self.readyState = 'paused';
						onPause()
					};
					if (this.polling || !this.writable) {
						var total = 0;
						if (this.polling) {
							debug('we are currently polling - waiting to pause');
							total++;
							this.once('pollComplete', function() {
								debug('pre-pause polling complete');
								--total || pause()
							})
						};
						if (!this.writable) {
							debug('we are currently writing - waiting to pause');
							total++;
							this.once('drain', function() {
								debug('pre-pause writing complete');
								--total || pause()
							})
						}
					} else pause()
				};
				Polling.prototype.poll = function() {
					debug('polling');
					this.polling = true;
					this.doPoll();
					this.emit('poll')
				};
				Polling.prototype.onData = function(data) {
					var self = this;
					debug('polling got data %s', data);
					var callback = function(packet, index, total) {
						if ('opening' == self.readyState) self.onOpen();
						if ('close' == packet.type) {
							self.onClose();
							return false
						};
						self.onPacket(packet)
					};
					parser.decodePayload(data, this.socket.binaryType, callback);
					if ('closed' != this.readyState) {
						this.polling = false;
						this.emit('pollComplete');
						if ('open' == this.readyState) {
							this.poll()
						} else debug('ignoring poll - transport state "%s"', this.readyState)
					}
				};
				Polling.prototype.doClose = function() {
					var self = this

					function close() {
						debug('writing close packet');
						self.write([{
							type: 'close'
						}])
					};
					if ('open' == this.readyState) {
						debug('transport open - closing');
						close()
					} else {
						debug('transport not open - deferring close');
						this.once('open', close)
					}
				};
				Polling.prototype.write = function(packets) {
					var self = this;
					this.writable = false;
					var callbackfn = function() {
							self.writable = true;
							self.emit('drain')
						},
						self = this;
					parser.encodePayload(packets, this.supportsBinary, function(data) {
						self.doWrite(data, callbackfn)
					})
				};
				Polling.prototype.uri = function() {
					var query = this.query || {},
						schema = this.secure ? 'https' : 'http',
						port = '';
					if (false !== this.timestampRequests) query[this.timestampParam] = +new Date() + '-' + Transport.timestamps++;
					if (!this.supportsBinary && !query.sid) query.b64 = 1;
					query = parseqs.encode(query);
					if (this.port && (('https' == schema && this.port != 443) || ('http' == schema && this.port != 80))) port = ':' + this.port;
					if (query.length) query = '?' + query;
					return schema + '://' + this.hostname + port + this.path + query
				}
			}, {
				"../transport": 14,
				"component-inherit": 21,
				debug: 9,
				"engine.io-parser": 22,
				parseqs: 30,
				xmlhttprequest: 20
			}
		],
		19: [
			function(require, module, exports) {
				var Transport = require('../transport'),
					parser = require('engine.io-parser'),
					parseqs = require('parseqs'),
					inherit = require('component-inherit'),
					debug = require('debug')('engine.io-client:websocket'),
					WebSocket = require('ws');
				module.exports = WS

				function WS(opts) {
					var forceBase64 = (opts && opts.forceBase64);
					if (forceBase64) this.supportsBinary = false;
					Transport.call(this, opts)
				};
				inherit(WS, Transport);
				WS.prototype.name = 'websocket';
				WS.prototype.supportsBinary = true;
				WS.prototype.doOpen = function() {
					if (!this.check()) return;
					var self = this,
						uri = this.uri(),
						protocols = void(0),
						opts = {
							agent: this.agent
						};
					this.ws = new WebSocket(uri, protocols, opts);
					if (this.ws.binaryType === undefined) this.supportsBinary = false;
					this.ws.binaryType = 'arraybuffer';
					this.addEventListeners()
				};
				WS.prototype.addEventListeners = function() {
					var self = this;
					this.ws.onopen = function() {
						self.onOpen()
					};
					this.ws.onclose = function() {
						self.onClose()
					};
					this.ws.onmessage = function(ev) {
						self.onData(ev.data)
					};
					this.ws.onerror = function(e) {
						self.onError('websocket error', e)
					}
				};
				if ('undefined' != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)) WS.prototype.onData = function(data) {
					var self = this;
					setTimeout(function() {
						Transport.prototype.onData.call(self, data)
					}, 0)
				};
				WS.prototype.write = function(packets) {
					var self = this;
					this.writable = false;
					for (var i = 0, l = packets.length; i < l; i++) parser.encodePacket(packets[i], this.supportsBinary, function(data) {
						try {
							self.ws.send(data)
						} catch (e) {
							debug('websocket closed before onclose event')
						}
					})

					function ondrain() {
						self.writable = true;
						self.emit('drain')
					};
					setTimeout(ondrain, 0)
				};
				WS.prototype.onClose = function() {
					Transport.prototype.onClose.call(this)
				};
				WS.prototype.doClose = function() {
					if (typeof this.ws !== 'undefined') this.ws.close()
				};
				WS.prototype.uri = function() {
					var query = this.query || {},
						schema = this.secure ? 'wss' : 'ws',
						port = '';
					if (this.port && (('wss' == schema && this.port != 443) || ('ws' == schema && this.port != 80))) port = ':' + this.port;
					if (this.timestampRequests) query[this.timestampParam] = +new Date();
					if (!this.supportsBinary) query.b64 = 1;
					query = parseqs.encode(query);
					if (query.length) query = '?' + query;
					return schema + '://' + this.hostname + port + this.path + query
				};
				WS.prototype.check = function() {
					return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name)
				}
			}, {
				"../transport": 14,
				"component-inherit": 21,
				debug: 9,
				"engine.io-parser": 22,
				parseqs: 30,
				ws: 31
			}
		],
		20: [
			function(require, module, exports) {
				var hasCORS = require('has-cors');
				module.exports = function(opts) {
					var xdomain = opts.xdomain;
					try {
						if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) return new XMLHttpRequest()
					} catch (e) {};
					if (!xdomain) try {
						return new ActiveXObject('Microsoft.XMLHTTP')
					} catch (e) {}
				}
			}, {
				"has-cors": 34
			}
		],
		21: [
			function(require, module, exports) {
				module.exports = function(a, b) {
					var fn = function() {};
					fn.prototype = b.prototype;
					a.prototype = new fn();
					a.prototype.constructor = a
				}
			}, {}
		],
		22: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					keys = require('./keys'),
					sliceBuffer = require('arraybuffer.slice'),
					base64encoder = require('base64-arraybuffer'),
					after = require('after'),
					utf8 = require('utf8'),
					isAndroid = navigator.userAgent.match(/Android/i);
				exports.protocol = 2;
				var packets = exports.packets = {
						open: 0,
						close: 1,
						ping: 2,
						pong: 3,
						message: 4,
						upgrade: 5,
						noop: 6
					},
					packetslist = keys(packets),
					err = {
						type: 'error',
						data: 'parser error'
					},
					Blob = require('blob');
				exports.encodePacket = function(packet, supportsBinary, callback) {
					if (typeof supportsBinary == 'function') {
						callback = supportsBinary;
						supportsBinary = false
					};
					var data = (packet.data === undefined) ? undefined : packet.data.buffer || packet.data;
					if (global.ArrayBuffer && data instanceof ArrayBuffer) {
						return encodeArrayBuffer(packet, supportsBinary, callback)
					} else if (Blob && data instanceof global.Blob) return encodeBlob(packet, supportsBinary, callback);
					var encoded = packets[packet.type];
					if (undefined !== packet.data) encoded += utf8.encode(String(packet.data));
					return callback('' + encoded)
				}

				function encodeArrayBuffer(packet, supportsBinary, callback) {
					if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
					var data = packet.data,
						contentArray = new Uint8Array(data),
						resultBuffer = new Uint8Array(1 + data.byteLength);
					resultBuffer[0] = packets[packet.type];
					for (var i = 0; i < contentArray.length; i++) resultBuffer[i + 1] = contentArray[i];
					return callback(resultBuffer.buffer)
				}

				function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
					if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
					var fr = new FileReader();
					fr.onload = function() {
						packet.data = fr.result;
						exports.encodePacket(packet, supportsBinary, callback)
					};
					return fr.readAsArrayBuffer(packet.data)
				}

				function encodeBlob(packet, supportsBinary, callback) {
					if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
					if (isAndroid) return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
					var length = new Uint8Array(1);
					length[0] = packets[packet.type];
					var blob = new Blob([length.buffer, packet.data]);
					return callback(blob)
				};
				exports.encodeBase64Packet = function(packet, callback) {
					var message = 'b' + exports.packets[packet.type];
					if (Blob && packet.data instanceof Blob) {
						var fr = new FileReader();
						fr.onload = function() {
							var b64 = fr.result.split(',')[1];
							callback(message + b64)
						};
						return fr.readAsDataURL(packet.data)
					};
					var b64data;
					try {
						b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data))
					} catch (e) {
						var typed = new Uint8Array(packet.data),
							basic = new Array(typed.length);
						for (var i = 0; i < typed.length; i++) basic[i] = typed[i];
						b64data = String.fromCharCode.apply(null, basic)
					};
					message += global.btoa(b64data);
					return callback(message)
				};
				exports.decodePacket = function(data, binaryType) {
					if (typeof data == 'string' || data === undefined) {
						if (data.charAt(0) == 'b') return exports.decodeBase64Packet(data.substr(1), binaryType);
						data = utf8.decode(data);
						var type = data.charAt(0);
						if (Number(type) != type || !packetslist[type]) return err;
						if (data.length > 1) {
							return {
								type: packetslist[type],
								data: data.substring(1)
							}
						} else return {
							type: packetslist[type]
						}
					};
					var asArray = new Uint8Array(data),
						type = asArray[0],
						rest = sliceBuffer(data, 1);
					if (Blob && binaryType === 'blob') rest = new Blob([rest]);
					return {
						type: packetslist[type],
						data: rest
					}
				};
				exports.decodeBase64Packet = function(msg, binaryType) {
					var type = packetslist[msg.charAt(0)];
					if (!global.ArrayBuffer) return {
						type: type,
						data: {
							base64: true,
							data: msg.substr(1)
						}
					};
					var data = base64encoder.decode(msg.substr(1));
					if (binaryType === 'blob' && Blob) data = new Blob([data]);
					return {
						type: type,
						data: data
					}
				};
				exports.encodePayload = function(packets, supportsBinary, callback) {
					if (typeof supportsBinary == 'function') {
						callback = supportsBinary;
						supportsBinary = null
					};
					if (supportsBinary) {
						if (Blob && !isAndroid) return exports.encodePayloadAsBlob(packets, callback);
						return exports.encodePayloadAsArrayBuffer(packets, callback)
					};
					if (!packets.length) return callback('0:')

					function setLengthHeader(message) {
						return message.length + ':' + message
					}

					function encodeOne(packet, doneCallback) {
						exports.encodePacket(packet, supportsBinary, function(message) {
							doneCallback(null, setLengthHeader(message))
						})
					};
					map(packets, encodeOne, function(err, results) {
						return callback(results.join(''))
					})
				}

				function map(ary, each, done) {
					var result = new Array(ary.length),
						next = after(ary.length, done),
						eachWithIndex = function(i, el, cb) {
							each(el, function(error, msg) {
								result[i] = msg;
								cb(error, result)
							})
						};
					for (var i = 0; i < ary.length; i++) eachWithIndex(i, ary[i], next)
				};
				exports.decodePayload = function(data, binaryType, callback) {
					if (typeof data != 'string') return exports.decodePayloadAsBinary(data, binaryType, callback);
					if (typeof binaryType === 'function') {
						callback = binaryType;
						binaryType = null
					};
					var packet;
					if (data == '') return callback(err, 0, 1);
					var length = '',
						n, msg;
					for (var i = 0, l = data.length; i < l; i++) {
						var chr = data.charAt(i);
						if (':' != chr) {
							length += chr
						} else {
							if ('' == length || (length != (n = Number(length)))) return callback(err, 0, 1);
							msg = data.substr(i + 1, n);
							if (length != msg.length) return callback(err, 0, 1);
							if (msg.length) {
								packet = exports.decodePacket(msg, binaryType);
								if (err.type == packet.type && err.data == packet.data) return callback(err, 0, 1);
								var ret = callback(packet, i + n, l);
								if (false === ret) return
							};
							i += n;
							length = ''
						}
					};
					if (length != '') return callback(err, 0, 1)
				};
				exports.encodePayloadAsArrayBuffer = function(packets, callback) {
					if (!packets.length) return callback(new ArrayBuffer(0))

					function encodeOne(packet, doneCallback) {
						exports.encodePacket(packet, true, function(data) {
							return doneCallback(null, data)
						})
					};
					map(packets, encodeOne, function(err, encodedPackets) {
						var totalLength = encodedPackets.reduce(function(acc, p) {
								var len;
								if (typeof p === 'string') {
									len = p.length
								} else len = p.byteLength;
								return acc + len.toString().length + len + 2
							}, 0),
							resultArray = new Uint8Array(totalLength),
							bufferIndex = 0;
						encodedPackets.forEach(function(p) {
							var isString = typeof p === 'string',
								ab = p;
							if (isString) {
								var view = new Uint8Array(p.length);
								for (var i = 0; i < p.length; i++) view[i] = p.charCodeAt(i);
								ab = view.buffer
							};
							if (isString) {
								resultArray[bufferIndex++] = 0
							} else resultArray[bufferIndex++] = 1;
							var lenStr = ab.byteLength.toString();
							for (var i = 0; i < lenStr.length; i++) resultArray[bufferIndex++] = parseInt(lenStr[i]);
							resultArray[bufferIndex++] = 255;
							var view = new Uint8Array(ab);
							for (var i = 0; i < view.length; i++) resultArray[bufferIndex++] = view[i]
						});
						return callback(resultArray.buffer)
					})
				};
				exports.encodePayloadAsBlob = function(packets, callback) {
					function encodeOne(packet, doneCallback) {
						exports.encodePacket(packet, true, function(encoded) {
							var binaryIdentifier = new Uint8Array(1);
							binaryIdentifier[0] = 1;
							if (typeof encoded === 'string') {
								var view = new Uint8Array(encoded.length);
								for (var i = 0; i < encoded.length; i++) view[i] = encoded.charCodeAt(i);
								encoded = view.buffer;
								binaryIdentifier[0] = 0
							};
							var len = (encoded instanceof ArrayBuffer) ? encoded.byteLength : encoded.size,
								lenStr = len.toString(),
								lengthAry = new Uint8Array(lenStr.length + 1);
							for (var i = 0; i < lenStr.length; i++) lengthAry[i] = parseInt(lenStr[i]);
							lengthAry[lenStr.length] = 255;
							if (Blob) {
								var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
								doneCallback(null, blob)
							}
						})
					};
					map(packets, encodeOne, function(err, results) {
						return callback(new Blob(results))
					})
				};
				exports.decodePayloadAsBinary = function(data, binaryType, callback) {
					if (typeof binaryType === 'function') {
						callback = binaryType;
						binaryType = null
					};
					var bufferTail = data,
						buffers = [];
					while (bufferTail.byteLength > 0) {
						var tailArray = new Uint8Array(bufferTail),
							isString = tailArray[0] === 0,
							msgLength = '';
						for (var i = 1;; i++) {
							if (tailArray[i] == 255) break;
							msgLength += tailArray[i]
						};
						bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
						msgLength = parseInt(msgLength);
						var msg = sliceBuffer(bufferTail, 0, msgLength);
						if (isString) try {
							msg = String.fromCharCode.apply(null, new Uint8Array(msg))
						} catch (e) {
							var typed = new Uint8Array(msg);
							msg = '';
							for (var i = 0; i < typed.length; i++) msg += String.fromCharCode(typed[i])
						};
						buffers.push(msg);
						bufferTail = sliceBuffer(bufferTail, msgLength)
					};
					var total = buffers.length;
					buffers.forEach(function(buffer, i) {
						callback(exports.decodePacket(buffer, binaryType), i, total)
					})
				}
			}, {
				"./keys": 23,
				after: 24,
				"arraybuffer.slice": 25,
				"base64-arraybuffer": 26,
				blob: 27,
				utf8: 28
			}
		],
		23: [
			function(require, module, exports) {
				module.exports = Object.keys || function keys(obj) {
					var arr = [],
						has = Object.prototype.hasOwnProperty;
					for (var i in obj)
						if (has.call(obj, i)) arr.push(i);
					return arr
				}
			}, {}
		],
		24: [
			function(require, module, exports) {
				module.exports = after

				function after(count, callback, err_cb) {
					var bail = false;
					err_cb = err_cb || noop;
					proxy.count = count;
					return (count === 0) ? callback() : proxy

					function proxy(err, result) {
						if (proxy.count <= 0) throw new Error('after called too many times');
						--proxy.count;
						if (err) {
							bail = true;
							callback(err);
							callback = err_cb
						} else if (proxy.count === 0 && !bail) callback(null, result)
					}
				}

				function noop() {}
			}, {}
		],
		25: [
			function(require, module, exports) {
				module.exports = function(arraybuffer, start, end) {
					var bytes = arraybuffer.byteLength;
					start = start || 0;
					end = end || bytes;
					if (arraybuffer.slice) return arraybuffer.slice(start, end);
					if (start < 0) start += bytes;
					if (end < 0) end += bytes;
					if (end > bytes) end = bytes;
					if (start >= bytes || start >= end || bytes === 0) return new ArrayBuffer(0);
					var abv = new Uint8Array(arraybuffer),
						result = new Uint8Array(end - start);
					for (var i = start, ii = 0; i < end; i++, ii++) result[ii] = abv[i];
					return result.buffer
				}
			}, {}
		],
		26: [
			function(require, module, exports) {
				(function(chars) {
					"use strict";
					exports.encode = function(arraybuffer) {
						var bytes = new Uint8Array(arraybuffer),
							i, len = bytes.length,
							base64 = "";
						for (i = 0; i < len; i += 3) {
							base64 += chars[bytes[i] >> 2];
							base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
							base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
							base64 += chars[bytes[i + 2] & 63]
						};
						if ((len % 3) === 2) {
							base64 = base64.substring(0, base64.length - 1) + "="
						} else if (len % 3 === 1) base64 = base64.substring(0, base64.length - 2) + "==";
						return base64
					};
					exports.decode = function(base64) {
						var bufferLength = base64.length * 0.75,
							len = base64.length,
							i, p = 0,
							encoded1, encoded2, encoded3, encoded4;
						if (base64[base64.length - 1] === "=") {
							bufferLength--;
							if (base64[base64.length - 2] === "=") bufferLength--
						};
						var arraybuffer = new ArrayBuffer(bufferLength),
							bytes = new Uint8Array(arraybuffer);
						for (i = 0; i < len; i += 4) {
							encoded1 = chars.indexOf(base64[i]);
							encoded2 = chars.indexOf(base64[i + 1]);
							encoded3 = chars.indexOf(base64[i + 2]);
							encoded4 = chars.indexOf(base64[i + 3]);
							bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
							bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
							bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
						};
						return arraybuffer
					}
				})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
			}, {}
		],
		27: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder,
					blobSupported = (function() {
						try {
							var b = new Blob(['hi']);
							return b.size == 2
						} catch (e) {
							return false
						}
					})(),
					blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob

				function BlobBuilderConstructor(ary, options) {
					options = options || {};
					var bb = new BlobBuilder();
					for (var i = 0; i < ary.length; i++) bb.append(ary[i]);
					return (options.type) ? bb.getBlob(options.type) : bb.getBlob()
				};
				module.exports = (function() {
					if (blobSupported) {
						return global.Blob
					} else if (blobBuilderSupported) {
						return BlobBuilderConstructor
					} else return undefined
				})()
			}, {}
		],
		28: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
				(function(root) {
					var freeExports = typeof exports == 'object' && exports,
						freeModule = typeof module == 'object' && module && module.exports == freeExports && module,
						freeGlobal = typeof global == 'object' && global;
					if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) root = freeGlobal;
					var stringFromCharCode = String.fromCharCode

					function ucs2decode(string) {
						var output = [],
							counter = 0,
							length = string.length,
							value, extra;
						while (counter < length) {
							value = string.charCodeAt(counter++);
							if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
								extra = string.charCodeAt(counter++);
								if ((extra & 0xFC00) == 0xDC00) {
									output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000)
								} else {
									output.push(value);
									counter--
								}
							} else output.push(value)
						};
						return output
					}

					function ucs2encode(array) {
						var length = array.length,
							index = -1,
							value, output = '';
						while (++index < length) {
							value = array[index];
							if (value > 0xFFFF) {
								value -= 0x10000;
								output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
								value = 0xDC00 | value & 0x3FF
							};
							output += stringFromCharCode(value)
						};
						return output
					}

					function createByte(codePoint, shift) {
						return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80)
					}

					function encodeCodePoint(codePoint) {
						if ((codePoint & 0xFFFFFF80) == 0) return stringFromCharCode(codePoint);
						var symbol = '';
						if ((codePoint & 0xFFFFF800) == 0) {
							symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0)
						} else if ((codePoint & 0xFFFF0000) == 0) {
							symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
							symbol += createByte(codePoint, 6)
						} else if ((codePoint & 0xFFE00000) == 0) {
							symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
							symbol += createByte(codePoint, 12);
							symbol += createByte(codePoint, 6)
						};
						symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
						return symbol
					}

					function utf8encode(string) {
						var codePoints = ucs2decode(string),
							length = codePoints.length,
							index = -1,
							codePoint, byteString = '';
						while (++index < length) {
							codePoint = codePoints[index];
							byteString += encodeCodePoint(codePoint)
						};
						return byteString
					}

					function readContinuationByte() {
						if (byteIndex >= byteCount) throw Error('Invalid byte index');
						var continuationByte = byteArray[byteIndex] & 0xFF;
						byteIndex++;
						if ((continuationByte & 0xC0) == 0x80) return continuationByte & 0x3F;
						throw Error('Invalid continuation byte')
					}

					function decodeSymbol() {
						var byte1, byte2, byte3, byte4, codePoint;
						if (byteIndex > byteCount) throw Error('Invalid byte index');
						if (byteIndex == byteCount) return false;
						byte1 = byteArray[byteIndex] & 0xFF;
						byteIndex++;
						if ((byte1 & 0x80) == 0) return byte1;
						if ((byte1 & 0xE0) == 0xC0) {
							var byte2 = readContinuationByte();
							codePoint = ((byte1 & 0x1F) << 6) | byte2;
							if (codePoint >= 0x80) {
								return codePoint
							} else throw Error('Invalid continuation byte')
						};
						if ((byte1 & 0xF0) == 0xE0) {
							byte2 = readContinuationByte();
							byte3 = readContinuationByte();
							codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
							if (codePoint >= 0x0800) {
								return codePoint
							} else throw Error('Invalid continuation byte')
						};
						if ((byte1 & 0xF8) == 0xF0) {
							byte2 = readContinuationByte();
							byte3 = readContinuationByte();
							byte4 = readContinuationByte();
							codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) | (byte3 << 0x06) | byte4;
							if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) return codePoint
						};
						throw Error('Invalid UTF-8 detected')
					};
					var byteArray, byteCount, byteIndex

					function utf8decode(byteString) {
						byteArray = ucs2decode(byteString);
						byteCount = byteArray.length;
						byteIndex = 0;
						var codePoints = [],
							tmp;
						while ((tmp = decodeSymbol()) !== false) codePoints.push(tmp);
						return ucs2encode(codePoints)
					};
					var utf8 = {
						version: '2.0.0',
						encode: utf8encode,
						decode: utf8decode
					};
					if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
						define(function() {
							return utf8
						})
					} else if (freeExports && !freeExports.nodeType) {
						if (freeModule) {
							freeModule.exports = utf8
						} else {
							var object = {},
								hasOwnProperty = object.hasOwnProperty;
							for (var key in utf8) hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key])
						}
					} else root.utf8 = utf8
				}(this))
			}, {}
		],
		29: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					rvalidchars = /^[\],:{}\s]*$/,
					rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
					rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
					rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
					rtrimLeft = /^\s+/,
					rtrimRight = /\s+$/;
				module.exports = function parsejson(data) {
					if ('string' != typeof data || !data) return null;
					data = data.replace(rtrimLeft, '').replace(rtrimRight, '');
					if (global.JSON && JSON.parse) return JSON.parse(data);
					if (rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) return (new Function('return ' + data))()
				}
			}, {}
		],
		30: [
			function(require, module, exports) {
				exports.encode = function(obj) {
					var str = '';
					for (var i in obj)
						if (obj.hasOwnProperty(i)) {
							if (str.length) str += '&';
							str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i])
						};
					return str
				};
				exports.decode = function(qs) {
					var qry = {},
						pairs = qs.split('&');
					for (var i = 0, l = pairs.length; i < l; i++) {
						var pair = pairs[i].split('=');
						qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
					};
					return qry
				}
			}, {}
		],
		31: [
			function(require, module, exports) {
				var global = (function() {
						return this
					})(),
					WebSocket = global.WebSocket || global.MozWebSocket;
				module.exports = WebSocket ? ws : null

				function ws(uri, protocols, opts) {
					var instance;
					if (protocols) {
						instance = new WebSocket(uri, protocols)
					} else instance = new WebSocket(uri);
					return instance
				};
				if (WebSocket) ws.prototype = WebSocket.prototype
			}, {}
		],
		32: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					isArray = require('isarray');
				module.exports = hasBinary

				function hasBinary(data) {
					function recursiveCheckForBinary(obj) {
						if (!obj) return false;
						if ((global.Buffer && Buffer.isBuffer(obj)) || (global.ArrayBuffer && obj instanceof ArrayBuffer) || (global.Blob && obj instanceof Blob) || (global.File && obj instanceof File)) return true;
						if (isArray(obj)) {
							for (var i = 0; i < obj.length; i++)
								if (recursiveCheckForBinary(obj[i])) return true
						} else if (obj && 'object' == typeof obj) {
							if (obj.toJSON) obj = obj.toJSON();
							for (var key in obj)
								if (recursiveCheckForBinary(obj[key])) return true
						};
						return false
					};
					return recursiveCheckForBinary(data)
				}
			}, {
				isarray: 33
			}
		],
		33: [
			function(require, module, exports) {
				module.exports = Array.isArray || function(arr) {
					return Object.prototype.toString.call(arr) == '[object Array]'
				}
			}, {}
		],
		34: [
			function(require, module, exports) {
				var global = require('global');
				try {
					module.exports = 'XMLHttpRequest' in global && 'withCredentials' in new global.XMLHttpRequest()
				} catch (err) {
					module.exports = false
				}
			}, {
				global: 35
			}
		],
		35: [
			function(require, module, exports) {
				module.exports = (function() {
					return this
				})()
			}, {}
		],
		36: [
			function(require, module, exports) {
				var indexOf = [].indexOf;
				module.exports = function(arr, obj) {
					if (indexOf) return arr.indexOf(obj);
					for (var i = 0; i < arr.length; ++i)
						if (arr[i] === obj) return i;
					return -1
				}
			}, {}
		],
		37: [
			function(require, module, exports) {
				var has = Object.prototype.hasOwnProperty;
				exports.keys = Object.keys || function(obj) {
					var keys = [];
					for (var key in obj)
						if (has.call(obj, key)) keys.push(key);
					return keys
				};
				exports.values = function(obj) {
					var vals = [];
					for (var key in obj)
						if (has.call(obj, key)) vals.push(obj[key]);
					return vals
				};
				exports.merge = function(a, b) {
					for (var key in b)
						if (has.call(b, key)) a[key] = b[key];
					return a
				};
				exports.length = function(obj) {
					return exports.keys(obj).length
				};
				exports.isEmpty = function(obj) {
					return 0 == exports.length(obj)
				}
			}, {}
		],
		38: [
			function(require, module, exports) {
				var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
					parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];
				module.exports = function parseuri(str) {
					var m = re.exec(str || ''),
						uri = {},
						i = 14;
					while (i--) uri[parts[i]] = m[i] || '';
					return uri
				}
			}, {}
		],
		39: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					isArray = require('isarray');
				exports.deconstructPacket = function(packet) {
					var buffers = [],
						packetData = packet.data

					function deconstructBinPackRecursive(data) {
						if (!data) return data;
						if ((global.Buffer && Buffer.isBuffer(data)) || (global.ArrayBuffer && data instanceof ArrayBuffer)) {
							var placeholder = {
								_placeholder: true,
								num: buffers.length
							};
							buffers.push(data);
							return placeholder
						} else if (isArray(data)) {
							var newData = new Array(data.length);
							for (var i = 0; i < data.length; i++) newData[i] = deconstructBinPackRecursive(data[i]);
							return newData
						} else if ('object' == typeof data && !(data instanceof Date)) {
							var newData = {};
							for (var key in data) newData[key] = deconstructBinPackRecursive(data[key]);
							return newData
						};
						return data
					};
					var pack = packet;
					pack.data = deconstructBinPackRecursive(packetData);
					pack.attachments = buffers.length;
					return {
						packet: pack,
						buffers: buffers
					}
				};
				exports.reconstructPacket = function(packet, buffers) {
					var curPlaceHolder = 0

					function reconstructBinPackRecursive(data) {
						if (data && data._placeholder) {
							var buf = buffers[data.num];
							return buf
						} else if (isArray(data)) {
							for (var i = 0; i < data.length; i++) data[i] = reconstructBinPackRecursive(data[i]);
							return data
						} else if (data && 'object' == typeof data) {
							for (var key in data) data[key] = reconstructBinPackRecursive(data[key]);
							return data
						};
						return data
					};
					packet.data = reconstructBinPackRecursive(packet.data);
					packet.attachments = undefined;
					return packet
				};
				exports.removeBlobs = function(data, callback) {
					function removeBlobsRecursive(obj, curKey, containingObject) {
						if (!obj) return obj;
						if ((global.Blob && obj instanceof Blob) || (global.File && obj instanceof File)) {
							pendingBlobs++;
							var fileReader = new FileReader();
							fileReader.onload = function() {
								if (containingObject) {
									containingObject[curKey] = this.result
								} else bloblessData = this.result; if (!--pendingBlobs) callback(bloblessData)
							};
							fileReader.readAsArrayBuffer(obj)
						};
						if (isArray(obj)) {
							for (var i = 0; i < obj.length; i++) removeBlobsRecursive(obj[i], i, obj)
						} else if (obj && 'object' == typeof obj && !isBuf(obj))
							for (var key in obj) removeBlobsRecursive(obj[key], key, obj)
					};
					var pendingBlobs = 0,
						bloblessData = data;
					removeBlobsRecursive(bloblessData);
					if (!pendingBlobs) callback(bloblessData)
				}

				function isBuf(obj) {
					return (global.Buffer && Buffer.isBuffer(obj)) || (global.ArrayBuffer && obj instanceof ArrayBuffer)
				}
			}, {
				isarray: 41
			}
		],
		40: [
			function(require, module, exports) {
				var global = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},
					debug = require('debug')('socket.io-parser'),
					json = require('json3'),
					isArray = require('isarray'),
					Emitter = require('emitter'),
					binary = require('./binary');
				exports.protocol = 3;
				exports.types = ['CONNECT', 'DISCONNECT', 'EVENT', 'BINARY_EVENT', 'ACK', 'BINARY_ACK', 'ERROR'];
				exports.CONNECT = 0;
				exports.DISCONNECT = 1;
				exports.EVENT = 2;
				exports.ACK = 3;
				exports.ERROR = 4;
				exports.BINARY_EVENT = 5;
				exports.BINARY_ACK = 6;
				exports.Encoder = Encoder

				function Encoder() {};
				Encoder.prototype.encode = function(obj, callback) {
					debug('encoding packet %j', obj);
					if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
						encodeAsBinary(obj, callback)
					} else {
						var encoding = encodeAsString(obj);
						callback([encoding])
					}
				}

				function encodeAsString(obj) {
					var str = '',
						nsp = false;
					str += obj.type;
					if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
						str += obj.attachments;
						str += '-'
					};
					if (obj.nsp && '/' != obj.nsp) {
						nsp = true;
						str += obj.nsp
					};
					if (null != obj.id) {
						if (nsp) {
							str += ',';
							nsp = false
						};
						str += obj.id
					};
					if (null != obj.data) {
						if (nsp) str += ',';
						str += json.stringify(obj.data)
					};
					debug('encoded %j as %s', obj, str);
					return str
				}

				function encodeAsBinary(obj, callback) {
					function writeEncoding(bloblessData) {
						var deconstruction = binary.deconstructPacket(bloblessData),
							pack = encodeAsString(deconstruction.packet),
							buffers = deconstruction.buffers;
						buffers.unshift(pack);
						callback(buffers)
					};
					binary.removeBlobs(obj, writeEncoding)
				};
				exports.Decoder = Decoder

				function Decoder() {
					this.reconstructor = null
				};
				Emitter(Decoder.prototype);
				Decoder.prototype.add = function(obj) {
					var packet;
					if ('string' == typeof obj) {
						packet = decodeString(obj);
						if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) {
							this.reconstructor = new BinaryReconstructor(packet);
							if (this.reconstructor.reconPack.attachments == 0) this.emit('decoded', packet)
						} else this.emit('decoded', packet)
					} else if ((global.Buffer && Buffer.isBuffer(obj)) || (global.ArrayBuffer && obj instanceof ArrayBuffer) || obj.base64) {
						if (!this.reconstructor) {
							throw new Error('got binary data when not reconstructing a packet')
						} else {
							packet = this.reconstructor.takeBinaryData(obj);
							if (packet) {
								this.reconstructor = null;
								this.emit('decoded', packet)
							}
						}
					} else throw new Error('Unknown type: ' + obj)
				}

				function decodeString(str) {
					var p = {},
						i = 0;
					p.type = Number(str.charAt(0));
					if (null == exports.types[p.type]) return error();
					if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
						p.attachments = '';
						while (str.charAt(++i) != '-') p.attachments += str.charAt(i);
						p.attachments = Number(p.attachments)
					};
					if ('/' == str.charAt(i + 1)) {
						p.nsp = '';
						while (++i) {
							var c = str.charAt(i);
							if (',' == c) break;
							p.nsp += c;
							if (i + 1 == str.length) break
						}
					} else p.nsp = '/';
					var next = str.charAt(i + 1);
					if ('' != next && Number(next) == next) {
						p.id = '';
						while (++i) {
							var c = str.charAt(i);
							if (null == c || Number(c) != c) {
								--i;
								break
							};
							p.id += str.charAt(i);
							if (i + 1 == str.length) break
						};
						p.id = Number(p.id)
					};
					if (str.charAt(++i)) try {
						p.data = json.parse(str.substr(i))
					} catch (e) {
						return error()
					};
					debug('decoded %s as %j', str, p);
					return p
				};
				Decoder.prototype.destroy = function() {
					if (this.reconstructor) this.reconstructor.finishedReconstruction()
				}

				function BinaryReconstructor(packet) {
					this.reconPack = packet;
					this.buffers = []
				};
				BinaryReconstructor.prototype.takeBinaryData = function(binData) {
					this.buffers.push(binData);
					if (this.buffers.length == this.reconPack.attachments) {
						var packet = binary.reconstructPacket(this.reconPack, this.buffers);
						this.finishedReconstruction();
						return packet
					};
					return null
				};
				BinaryReconstructor.prototype.finishedReconstruction = function() {
					this.reconPack = null;
					this.buffers = []
				}

				function error(data) {
					return {
						type: exports.ERROR,
						data: 'parser error'
					}
				}
			}, {
				"./binary": 39,
				debug: 9,
				emitter: 10,
				isarray: 41,
				json3: 42
			}
		],
		41: [
			function(require, module, exports) {
				module.exports = require(33)
			}, {}
		],
		42: [
			function(require, module, exports) {
				(function(window) {
					var getClass = {}.toString,
						isProperty, forEach, undef, isLoader = typeof define === "function" && define.amd,
						nativeJSON = typeof JSON == "object" && JSON,
						JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;
					if (JSON3 && nativeJSON) {
						JSON3.stringify = nativeJSON.stringify;
						JSON3.parse = nativeJSON.parse
					} else JSON3 = window.JSON = nativeJSON || {};
					var isExtended = new Date(-3509827334573292);
					try {
						isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 && isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708
					} catch (exception) {}

					function has(name) {
						if (has[name] !== undef) return has[name];
						var isSupported;
						if (name == "bug-string-char-index") {
							isSupported = "a" [0] != "a"
						} else if (name == "json") {
							isSupported = has("json-stringify") && has("json-parse")
						} else {
							var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
							if (name == "json-stringify") {
								var stringify = JSON3.stringify,
									stringifySupported = typeof stringify == "function" && isExtended;
								if (stringifySupported) {
									(value = function() {
										return 1
									}).toJSON = value;
									try {
										stringifySupported = stringify(0) === "0" && stringify(new Number()) === "0" && stringify(new String()) == '""' && stringify(getClass) === undef && stringify(undef) === undef && stringify() === undef && stringify(value) === "1" && stringify([value]) == "[1]" && stringify([undef]) == "[null]" && stringify(null) == "null" && stringify([undef, getClass, null]) == "[null,null,null]" && stringify({
											a: [value, true, false, null, "\x00\b\n\f\r\t"]
										}) == serialized && stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" && stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' && stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' && stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' && stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"'
									} catch (exception) {
										stringifySupported = false
									}
								};
								isSupported = stringifySupported
							};
							if (name == "json-parse") {
								var parse = JSON3.parse;
								if (typeof parse == "function") try {
									if (parse("0") === 0 && !parse(false)) {
										value = parse(serialized);
										var parseSupported = value.a.length == 5 && value.a[0] === 1;
										if (parseSupported) {
											try {
												parseSupported = !parse('"\t"')
											} catch (exception) {};
											if (parseSupported) try {
												parseSupported = parse("01") !== 1
											} catch (exception) {};
											if (parseSupported) try {
												parseSupported = parse("1.") !== 1
											} catch (exception) {}
										}
									}
								} catch (exception) {
									parseSupported = false
								};
								isSupported = parseSupported
							}
						};
						return has[name] = !!isSupported
					};
					if (!has("json")) {
						var functionClass = "[object Function]",
							dateClass = "[object Date]",
							numberClass = "[object Number]",
							stringClass = "[object String]",
							arrayClass = "[object Array]",
							booleanClass = "[object Boolean]",
							charIndexBuggy = has("bug-string-char-index");
						if (!isExtended) {
							var floor = Math.floor,
								Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
								getDay = function(year, month) {
									return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400)
								}
						};
						if (!(isProperty = {}.hasOwnProperty)) isProperty = function(property) {
							var members = {},
								constructor;
							if ((members.__proto__ = null, members.__proto__ = {
								toString: 1
							}, members).toString != getClass) {
								isProperty = function(property) {
									var original = this.__proto__,
										result = property in (this.__proto__ = null, this);
									this.__proto__ = original;
									return result
								}
							} else {
								constructor = members.constructor;
								isProperty = function(property) {
									var parent = (this.constructor || constructor).prototype;
									return property in this && !(property in parent && this[property] === parent[property])
								}
							};
							members = null;
							return isProperty.call(this, property)
						};
						var PrimitiveTypes = {
								'boolean': 1,
								number: 1,
								string: 1,
								'undefined': 1
							},
							isHostType = function(object, property) {
								var type = typeof object[property];
								return type == 'object' ? !!object[property] : !PrimitiveTypes[type]
							};
						forEach = function(object, callback) {
							var size = 0,
								Properties, members, property;
							(Properties = function() {
								this.valueOf = 0
							}).prototype.valueOf = 0;
							members = new Properties();
							for (property in members)
								if (isProperty.call(members, property)) size++;
							Properties = members = null;
							if (!size) {
								members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
								forEach = function(object, callback) {
									var isFunction = getClass.call(object) == functionClass,
										property, length, hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
									for (property in object)
										if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) callback(property);
									for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
								}
							} else if (size == 2) {
								forEach = function(object, callback) {
									var members = {},
										isFunction = getClass.call(object) == functionClass,
										property;
									for (property in object)
										if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) callback(property)
								}
							} else forEach = function(object, callback) {
								var isFunction = getClass.call(object) == functionClass,
									property, isConstructor;
								for (property in object)
									if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) callback(property);
								if (isConstructor || isProperty.call(object, (property = "constructor"))) callback(property)
							};
							return forEach(object, callback)
						};
						if (!has("json-stringify")) {
							var Escapes = {
									92: "\\\\",
									34: '\\"',
									8: "\\b",
									12: "\\f",
									10: "\\n",
									13: "\\r",
									9: "\\t"
								},
								leadingZeroes = "000000",
								toPaddedString = function(width, value) {
									return (leadingZeroes + (value || 0)).slice(-width)
								},
								unicodePrefix = "\\u00",
								quote = function(value) {
									var result = '"',
										index = 0,
										length = value.length,
										isLarge = length > 10 && charIndexBuggy,
										symbols;
									if (isLarge) symbols = value.split("");
									for (; index < length; index++) {
										var charCode = value.charCodeAt(index);
										switch (charCode) {
											case 8:
											case 9:
											case 10:
											case 12:
											case 13:
											case 34:
											case 92:
												result += Escapes[charCode];
												break;
											default:
												if (charCode < 32) {
													result += unicodePrefix + toPaddedString(2, charCode.toString(16));
													break
												};
												result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index]
										}
									};
									return result + '"'
								},
								serialize = function(property, object, callback, properties, whitespace, indentation, stack) {
									var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
									try {
										value = object[property]
									} catch (exception) {};
									if (typeof value == "object" && value) {
										className = getClass.call(value);
										if (className == dateClass && !isProperty.call(value, "toJSON")) {
											if (value > -1 / 0 && value < 1 / 0) {
												if (getDay) {
													date = floor(value / 864e5);
													for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
													for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
													date = 1 + date - getDay(year, month);
													time = (value % 864e5 + 864e5) % 864e5;
													hours = floor(time / 36e5) % 24;
													minutes = floor(time / 6e4) % 60;
													seconds = floor(time / 1e3) % 60;
													milliseconds = time % 1e3
												} else {
													year = value.getUTCFullYear();
													month = value.getUTCMonth();
													date = value.getUTCDate();
													hours = value.getUTCHours();
													minutes = value.getUTCMinutes();
													seconds = value.getUTCSeconds();
													milliseconds = value.getUTCMilliseconds()
												};
												value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) + "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) + "." + toPaddedString(3, milliseconds) + "Z"
											} else value = null
										} else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) value = value.toJSON(property)
									};
									if (callback) value = callback.call(object, property, value);
									if (value === null) return "null";
									className = getClass.call(value);
									if (className == booleanClass) {
										return "" + value
									} else if (className == numberClass) {
										return value > -1 / 0 && value < 1 / 0 ? "" + value : "null"
									} else if (className == stringClass) return quote("" + value);
									if (typeof value == "object") {
										for (length = stack.length; length--;)
											if (stack[length] === value) throw TypeError();
										stack.push(value);
										results = [];
										prefix = indentation;
										indentation += whitespace;
										if (className == arrayClass) {
											for (index = 0, length = value.length; index < length; index++) {
												element = serialize(index, value, callback, properties, whitespace, indentation, stack);
												results.push(element === undef ? "null" : element)
											};
											result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]"
										} else {
											forEach(properties || value, function(property) {
												var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
												if (element !== undef) results.push(quote(property) + ":" + (whitespace ? " " : "") + element)
											});
											result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}"
										};
										stack.pop();
										return result
									}
								};
							JSON3.stringify = function(source, filter, width) {
								var whitespace, callback, properties, className;
								if (typeof filter == "function" || typeof filter == "object" && filter)
									if ((className = getClass.call(filter)) == functionClass) {
										callback = filter
									} else if (className == arrayClass) {
									properties = {};
									for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
								};
								if (width)
									if ((className = getClass.call(width)) == numberClass) {
										if ((width -= width % 1) > 0)
											for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
									} else if (className == stringClass) whitespace = width.length <= 10 ? width : width.slice(0, 10);
								return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", [])
							}
						};
						if (!has("json-parse")) {
							var fromCharCode = String.fromCharCode,
								Unescapes = {
									92: "\\",
									34: '"',
									47: "/",
									98: "\b",
									116: "\t",
									110: "\n",
									102: "\f",
									114: "\r"
								},
								Index, Source, abort = function() {
									Index = Source = null;
									throw SyntaxError()
								},
								lex = function() {
									var source = Source,
										length = source.length,
										value, begin, position, isSigned, charCode;
									while (Index < length) {
										charCode = source.charCodeAt(Index);
										switch (charCode) {
											case 9:
											case 10:
											case 13:
											case 32:
												Index++;
												break;
											case 123:
											case 125:
											case 91:
											case 93:
											case 58:
											case 44:
												value = charIndexBuggy ? source.charAt(Index) : source[Index];
												Index++;
												return value;
											case 34:
												for (value = "@", Index++; Index < length;) {
													charCode = source.charCodeAt(Index);
													if (charCode < 32) {
														abort()
													} else if (charCode == 92) {
														charCode = source.charCodeAt(++Index);
														switch (charCode) {
															case 92:
															case 34:
															case 47:
															case 98:
															case 116:
															case 110:
															case 102:
															case 114:
																value += Unescapes[charCode];
																Index++;
																break;
															case 117:
																begin = ++Index;
																for (position = Index + 4; Index < position; Index++) {
																	charCode = source.charCodeAt(Index);
																	if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) abort()
																};
																value += fromCharCode("0x" + source.slice(begin, Index));
																break;
															default:
																abort()
														}
													} else {
														if (charCode == 34) break;
														charCode = source.charCodeAt(Index);
														begin = Index;
														while (charCode >= 32 && charCode != 92 && charCode != 34) charCode = source.charCodeAt(++Index);
														value += source.slice(begin, Index)
													}
												};
												if (source.charCodeAt(Index) == 34) {
													Index++;
													return value
												};
												abort();
											default:
												begin = Index;
												if (charCode == 45) {
													isSigned = true;
													charCode = source.charCodeAt(++Index)
												};
												if (charCode >= 48 && charCode <= 57) {
													if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) abort();
													isSigned = false;
													for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
													if (source.charCodeAt(Index) == 46) {
														position = ++Index;
														for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
														if (position == Index) abort();
														Index = position
													};
													charCode = source.charCodeAt(Index);
													if (charCode == 101 || charCode == 69) {
														charCode = source.charCodeAt(++Index);
														if (charCode == 43 || charCode == 45) Index++;
														for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
														if (position == Index) abort();
														Index = position
													};
													return +source.slice(begin, Index)
												};
												if (isSigned) abort();
												if (source.slice(Index, Index + 4) == "true") {
													Index += 4;
													return true
												} else if (source.slice(Index, Index + 5) == "false") {
													Index += 5;
													return false
												} else if (source.slice(Index, Index + 4) == "null") {
													Index += 4;
													return null
												};
												abort()
										}
									};
									return "$"
								},
								get = function(value) {
									var results, hasMembers;
									if (value == "$") abort();
									if (typeof value == "string") {
										if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") return value.slice(1);
										if (value == "[") {
											results = [];
											for (;; hasMembers || (hasMembers = true)) {
												value = lex();
												if (value == "]") break;
												if (hasMembers)
													if (value == ",") {
														value = lex();
														if (value == "]") abort()
													} else abort();
												if (value == ",") abort();
												results.push(get(value))
											};
											return results
										} else if (value == "{") {
											results = {};
											for (;; hasMembers || (hasMembers = true)) {
												value = lex();
												if (value == "}") break;
												if (hasMembers)
													if (value == ",") {
														value = lex();
														if (value == "}") abort()
													} else abort();
												if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") abort();
												results[value.slice(1)] = get(lex())
											};
											return results
										};
										abort()
									};
									return value
								},
								update = function(source, property, callback) {
									var element = walk(source, property, callback);
									if (element === undef) {
										delete source[property]
									} else source[property] = element
								},
								walk = function(source, property, callback) {
									var value = source[property],
										length;
									if (typeof value == "object" && value)
										if (getClass.call(value) == arrayClass) {
											for (length = value.length; length--;) update(value, length, callback)
										} else forEach(value, function(property) {
											update(value, property, callback)
										});
									return callback.call(source, property, value)
								};
							JSON3.parse = function(source, callback) {
								var result, value;
								Index = 0;
								Source = "" + source;
								result = get(lex());
								if (lex() != "$") abort();
								Index = Source = null;
								return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result
							}
						}
					};
					if (isLoader) define(function() {
						return JSON3
					})
				}(this))
			}, {}
		],
		43: [
			function(require, module, exports) {
				module.exports = toArray

				function toArray(list, index) {
					var array = [];
					index = index || 0;
					for (var i = index || 0; i < list.length; i++) array[i - index] = list[i];
					return array
				}
			}, {}
		]
	}, {}, [1])(1)
}); /**** game/Modernizr.js ****/
window.Modernizr = function(a, b, c) {
		function y(a) {
			j.cssText = a
		}

		function z(a, b) {
			return y(prefixes.join(a + ";") + (b || ""))
		}

		function A(a, b) {
			return typeof a === b
		}

		function B(a, b) {
			return !!~("" + a).indexOf(b)
		}

		function C(a, b) {
			for (var d in a) {
				var e = a[d];
				if (!B(e, "-") && j[e] !== c) return b == "pfx" ? e : !0
			};
			return !1
		}

		function D(a, b, d) {
			for (var e in a) {
				var f = b[a[e]];
				if (f !== c) return d === !1 ? a[e] : A(f, "function") ? f.bind(d || b) : f
			};
			return !1
		}

		function E(a, b, c) {
			var d = a.charAt(0).toUpperCase() + a.slice(1),
				e = (a + " " + n.join(d + " ") + d).split(" ");
			return A(b, "string") || A(b, "undefined") ? C(e, b) : (e = (a + " " + o.join(d + " ") + d).split(" "), D(e, b, c))
		};
		var d = "2.7.1",
			e = {},
			f = !0,
			g = b.documentElement,
			h = "modernizr",
			i = b.createElement(h),
			j = i.style,
			k, l = {}.toString,
			m = "Webkit Moz O ms",
			n = m.split(" "),
			o = m.toLowerCase().split(" "),
			p = {},
			q = {},
			r = {},
			s = [],
			t = s.slice,
			u, v = function() {
				function d(d, e) {
					e = e || b.createElement(a[d] || "div"), d = "on" + d;
					var f = d in e;
					return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = A(e[d], "function"), A(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), e = null, f
				};
				var a = {
					select: "input",
					change: "input",
					submit: "form",
					reset: "form",
					error: "img",
					load: "img",
					abort: "img"
				};
				return d
			}(),
			w = {}.hasOwnProperty,
			x;
		!A(w, "undefined") && !A(w.call, "undefined") ? x = function(a, b) {
			return w.call(a, b)
		} : x = function(a, b) {
			return b in a && A(a.constructor.prototype[b], "undefined")
		}, Function.prototype.bind || (Function.prototype.bind = function(b) {
			var c = this;
			if (typeof c != "function") throw new TypeError();
			var d = t.call(arguments, 1),
				e = function() {
					if (this instanceof e) {
						var a = function() {};
						a.prototype = c.prototype;
						var f = new a(),
							g = c.apply(f, d.concat(t.call(arguments)));
						return Object(g) === g ? g : f
					};
					return c.apply(b, d.concat(t.call(arguments)))
				};
			return e
		}), p.history = function() {
			return !!a.history && !!history.pushState
		}, p.draganddrop = function() {
			var a = b.createElement("div");
			return "draggable" in a || "ondragstart" in a && "ondrop" in a
		}, p.borderimage = function() {
			return E("borderImage")
		}, p.textshadow = function() {
			return b.createElement("div").style.textShadow === ""
		}, p.cssanimations = function() {
			return E("animationName")
		}, p.localstorage = function() {
			try {
				return localStorage.setItem(h, h), localStorage.removeItem(h), !0
			} catch (a) {
				return !1
			}
		}, p.sessionstorage = function() {
			try {
				return sessionStorage.setItem(h, h), sessionStorage.removeItem(h), !0
			} catch (a) {
				return !1
			}
		};
		for (var F in p) x(p, F) && (u = F.toLowerCase(), e[u] = p[F](), s.push((e[u] ? "" : "no-") + u));
		return e.addTest = function(a, b) {
				if (typeof a == "object") {
					for (var d in a) x(a, d) && e.addTest(d, a[d])
				} else {
					a = a.toLowerCase();
					if (e[a] !== c) return e;
					b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
				};
				return e
			}, y(""), i = k = null,
			function(a, b) {
				function l(a, b) {
					var c = a.createElement("p"),
						d = a.getElementsByTagName("head")[0] || a.documentElement;
					return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
				}

				function m() {
					var a = s.elements;
					return typeof a == "string" ? a.split(" ") : a
				}

				function n(a) {
					var b = j[a[h]];
					return b || (b = {}, i++, a[h] = i, j[i] = b), b
				}

				function o(a, c, d) {
					c || (c = b);
					if (k) return c.createElement(a);
					d || (d = n(c));
					var g;
					return d.cache[a] ? g = d.cache[a].cloneNode() : f.test(a) ? g = (d.cache[a] = d.createElem(a)).cloneNode() : g = d.createElem(a), g.canHaveChildren && !e.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g
				}

				function p(a, c) {
					a || (a = b);
					if (k) return a.createDocumentFragment();
					c = c || n(a);
					var d = c.frag.cloneNode(),
						e = 0,
						f = m(),
						g = f.length;
					for (; e < g; e++) d.createElement(f[e]);
					return d
				}

				function q(a, b) {
					b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function(c) {
						return s.shivMethods ? o(c, a, b) : b.createElem(c)
					}, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function(a) {
						return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
					}) + ");return n}")(s, b.frag)
				}

				function r(a) {
					a || (a = b);
					var c = n(a);
					return s.shivCSS && !g && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), k || q(a, c), a
				};
				var c = "3.7.0",
					d = a.html5 || {},
					e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
					f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
					g, h = "_html5shiv",
					i = 0,
					j = {},
					k;
				(function() {
					try {
						var a = b.createElement("a");
						a.innerHTML = "<xyz></xyz>", g = "hidden" in a, k = a.childNodes.length == 1 || function() {
							b.createElement("a");
							var a = b.createDocumentFragment();
							return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
						}()
					} catch (c) {
						g = !0, k = !0
					}
				})();
				var s = {
					elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
					version: c,
					shivCSS: d.shivCSS !== !1,
					supportsUnknownElements: k,
					shivMethods: d.shivMethods !== !1,
					type: "default",
					shivDocument: r,
					createElement: o,
					createDocumentFragment: p
				};
				a.html5 = s, r(b)
			}(this, b), e._version = d, e._domPrefixes = o, e._cssomPrefixes = n, e.hasEvent = v, e.testProp = function(a) {
				return C([a])
			}, e.testAllProps = E, e.prefixed = function(a, b, c) {
				return b ? E(a, b, c) : E(a, "pfx")
			}, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + s.join(" ") : ""), e
	}(this, this.document),
	function(a, b, c) {
		function d(a) {
			return "[object Function]" == o.call(a)
		}

		function e(a) {
			return "string" == typeof a
		}

		function f() {}

		function g(a) {
			return !a || "loaded" == a || "complete" == a || "uninitialized" == a
		}

		function h() {
			var a = p.shift();
			q = 1, a ? a.t ? m(function() {
				("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
			}, 0) : (a(), h()) : q = 0
		}

		function i(a, c, d, e, f, i, j) {
			function k(b) {
				if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
					"img" != a && m(function() {
						t.removeChild(l)
					}, 50);
					for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
				}
			};
			var j = j || B.errorTimeout,
				l = b.createElement(a),
				o = 0,
				r = 0,
				u = {
					t: d,
					s: c,
					e: f,
					a: i,
					x: j
				};
			1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
				k.call(this, r)
			}, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
		}

		function j(a, b, c, d, f) {
			return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
		}

		function k() {
			var a = B;
			return a.loader = {
				load: j,
				i: 0
			}, a
		};
		var l = b.documentElement,
			m = a.setTimeout,
			n = b.getElementsByTagName("script")[0],
			o = {}.toString,
			p = [],
			q = 0,
			r = "MozAppearance" in l.style,
			s = r && !!b.createRange().compareNode,
			t = s ? l : n.parentNode,
			l = a.opera && "[object Opera]" == o.call(a.opera),
			l = !!b.attachEvent && !l,
			u = r ? "object" : l ? "script" : "img",
			v = l ? "script" : u,
			w = Array.isArray || function(a) {
				return "[object Array]" == o.call(a)
			},
			x = [],
			y = {},
			z = {
				timeout: function(a, b) {
					return b.length && (a.timeout = b[0]), a
				}
			},
			A, B;
		B = function(a) {
			function b(a) {
				var a = a.split("!"),
					b = x.length,
					c = a.pop(),
					d = a.length,
					c = {
						url: c,
						origUrl: c,
						prefixes: a
					},
					e, f, g;
				for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
				for (f = 0; f < b; f++) c = x[f](c);
				return c
			}

			function g(a, e, f, g, h) {
				var i = b(a),
					j = i.autoCallback;
				i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
					k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
				})))
			}

			function h(a, b) {
				function c(a, c) {
					if (a) {
						if (e(a)) {
							c || (j = function() {
								var a = [].slice.call(arguments);
								k.apply(this, a), l()
							}), g(a, j, b, 0, h)
						} else if (Object(a) === a)
							for (n in m = function() {
								var b = 0,
									c;
								for (c in a) a.hasOwnProperty(c) && b++;
								return b
							}(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
								var a = [].slice.call(arguments);
								k.apply(this, a), l()
							} : j[n] = function(a) {
								return function() {
									var b = [].slice.call(arguments);
									a && a.apply(this, b), l()
								}
							}(k[n])), g(a[n], j, b, n, h))
					} else !c && l()
				};
				var h = !!a.test,
					i = a.load || a.both,
					j = a.callback || f,
					k = j,
					l = a.complete || f,
					m, n;
				c(h ? a.yep : a.nope, !!i), i && c(i)
			};
			var i, j, l = this.yepnope.loader;
			if (e(a)) {
				g(a, 0, l, 0)
			} else if (w(a)) {
				for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l)
			} else Object(a) === a && h(a, l)
		}, B.addPrefix = function(a, b) {
			z[a] = b
		}, B.addFilter = function(a) {
			x.push(a)
		}, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
			b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
		}, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
			var k = b.createElement("script"),
				l, o, e = e || B.errorTimeout;
			k.src = a;
			for (o in d) k.setAttribute(o, d[o]);
			c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
				!l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
			}, m(function() {
				l || (l = 1, c(1))
			}, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
		}, a.yepnope.injectCss = function(a, c, d, e, g, i) {
			var e = b.createElement("link"),
				j, c = i ? h : c || f;
			e.href = a, e.rel = "stylesheet", e.type = "text/css";
			for (j in d) e.setAttribute(j, d[j]);
			g || (n.parentNode.insertBefore(e, n), m(c, 0))
		}
	}(this, document), Modernizr.load = function() {
		yepnope.apply(window, [].slice.call(arguments, 0))
	}, Modernizr.addTest("filereader", function() {
		return !!(window.File && window.FileList && window.FileReader)
	}), Modernizr.addTest("json", !!window.JSON && !!JSON.parse), Modernizr.addTest("performance", !!Modernizr.prefixed("performance", window)); /**** game/script.js ****/
var mx = 0,
	my = 0

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
}; /**** game/general.js ****/
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
		if (typeof input == 'string') {
			if (input.charAt() == '/') {
				url = input;
				if (typeof params == 'object') input = params
			} else input = $.extend({ screen: input }, params);
		}

		if (url == '') {
			if (game_data.hasOwnProperty('village')) {
				url = TribalWars._script + '?village=' + game_data.village.id
			} else url = TribalWars._script + '?village=';
		}

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
}; /**** game/Village.js ****/
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
}; /**** game/VillageGroups.js ****/
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
}; /**** game/OrderProgress.js ****/
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
}; /**** game/Timing.js ****/
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
		} else this.initial_local_time = new Date().getTime();
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



{
    "name": "dragongun100",
    "ally": "682",
    "sitter": "0",
    "sleep_start": "0",
    "sitter_type": "normal",
    "sleep_end": "0",
    "sleep_last": "0",
    "interstitial": "0",
    "email_valid": "1",
    "villages": "1",
    "incomings": "0",
    "supports": "0",
    "knight_location": null,
    "knight_unit": null,
    "rank": 3850,
    "points": "3223",
    "date_started": "1409563814",
    "is_guest": "0",
    "id": "8490508",
    "quest_progress": "0",
    "premium": true,
    "account_manager": false,
    "farm_manager": false,
    "points_formatted": "3<span class=\"grey\">.<\/span>223",
    "rank_formatted": "3<span class=\"grey\">.<\/span>850",
    "pp": "1567",
    "new_ally_application": "0",
    "new_ally_invite": "0",
    "new_buddy_request": "0",
    "new_forum_post": "40",
    "new_igm": "0",
    "new_items": "0",
    "new_report": "0",
    "fire_pixel": "0",
    "new_quest": "1"
}, 
"village": {
    "id": 3837,
    "name": "dragongun100s Dorf",
    "wood_prod": 1.1656376129484,
    "stone_prod": 1.0021662203278,
    "iron_prod": 0.86162038871216,
    "storage_max": "142373",
    "pop_max": "9255",
    "wood_float": 20132.813517756,
    "stone_float": 31257.09035895,
    "iron_float": 65745.620961267,
    "wood": 20133,
    "stone": 31257,
    "iron": 65746,
    "pop": "5051",
    "x": "565",
    "y": "451",
    "trader_away": "0",
    "bonus_id": null,
    "bonus": null,
    "buildings": {
        "village": "3837",
        "main": "20",
        "farm": "24",
        "storage": "25",
        "place": "1",
        "barracks": "14",
        "church": "0",
        "church_f": "0",
        "smith": "11",
        "wood": "26",
        "stone": "25",
        "iron": "24",
        "market": "2",
        "stable": "7",
        "wall": "20",
        "garage": "1",
        "hide": "4",
        "snob": "0",
        "statue": "0",
        "watchtower": "0"
    },
    "player_id": "8490508",
    "res": [20133, 1.1656376129484, 31257, 1.0021662203278, 65746, 0.86162038871216, "142373", "5051", "9255"],
    "coord": "565|451"
},
"nav": {
    "parent": 2
},
"link_base": "\/game.php?village=3837&amp;screen=",
"link_base_pure": "\/game.php?village=3837&screen=",
"csrf": "c125",
"world": "de109",
"market": "de",
"RTL": false,
"version": "22085 8.27",
"majorVersion": "8.27",
"screen": "overview",
"mode": null,
"device": "desktop"
};


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