function doAjax(settings, options) {
	var type = settings.type;
	if (!type) {
		type = "POST";
	}

	var success = settings.success;
	if (!success && options) {
		success = options.success;
	}

	var error = settings.error;
	if (!error && options) {
		error = options.error;
	}

	var url = settings.url;
	$.ajax({
		url: url,
		type: type,
		data: settings.data,
		traditional: true,
		cache: false,
		success: function(data) {
			if (data && data.releaseUrl && this.url != "/authenticator/wechat/status") {
				window.callback = function() {
					success(data);
				};
				var element = document.createElement('script');
				element.src = data.releaseUrl;
				element.type = 'text/javascript';
				document.body.appendChild(element);
			} else {
				success(data);
			}
		},
		error: function(xhr) {
			var s = xhr.status;
			if (s == 403) {
				window.location.href = "http://m.2345.com/?lm_4";
			} else {
				// error(xhr.responseJSON, s);
			}
		}
	});

}

function checkStatus(count) {
	doAjax({
		type: 'GET',
		url: '/authenticator/wechat/status',
		success: function(portal) {
			if (portal) {
				window.location.href = portal.success;
			} else {
				if (count) {
					count--;
					setTimeout(function() {
						checkStatus(count);
					}, 2000);
				}
			}
		}
	}, this.options);
}

function addVisibilityChangeEvent() {
	var hidden, state, visibilityChange; 
	if (typeof document.hidden !== "undefined") {
		hidden = "hidden";
		visibilityChange = "visibilitychange";
		state = "visibilityState";
	} else if (typeof document.mozHidden !== "undefined") {
		hidden = "mozHidden";
		visibilityChange = "mozvisibilitychange";
		state = "mozVisibilityState";
	} else if (typeof document.msHidden !== "undefined") {
		hidden = "msHidden";
		visibilityChange = "msvisibilitychange";
		state = "msVisibilityState";
	} else if (typeof document.webkitHidden !== "undefined") {
		hidden = "webkitHidden";
		visibilityChange = "webkitvisibilitychange";
		state = "webkitVisibilityState";
	}
	
	document.addEventListener(visibilityChange, function() {
		if ($("body").data("activated") === true) {
			if(document[state] != hidden) {
				checkStatus();
			} else {
				var timeoutId = $("body").data("timeoutId");
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
			}
		}
	});
}

function wechatAuth(data, target) {
	if (target) {
		JSAPI.auth({
			target: target,
			appId: data.appId,
			shopId: data.shopId,
			extend: data.extend,
			authUrl: data.authUrl
		});
	} else {
		$("body").data("activated", true)
		Wechat_GotoRedirect(data.appId, data.extend, data.timestamp, data.sign, data.shopId, data.authUrl, data.mac, data.ssid );
		if ($("body").data("hasEvent") !== true) {
			addVisibilityChangeEvent();
			$("body").data("hasEvent", true);
		}

		var timeoutId = setTimeout(function() {
			checkStatus(2);
		}, 5000);
		$("body").data("timeoutId", timeoutId);
	}
}

Authenticator = (function() {
	function Authenticator(options) {
		var defaults = {
			env: 'PRD',
			success: function(portal) {
				setTimeout(function() {
					window.location.href = portal.success;
				}, 1000);
			},
			error: function(error, status) {
				alert(error.description);
			}
		};
        this.options = $.extend({}, defaults, options);
	}
	return Authenticator;
})();

Authenticator.prototype.sms = function(mobile, code, success, error) {
	doAjax({
		url: '/authenticator/sms',
		data: {mobile: mobile, code: code, certCode: $("#cert_code").data("value")},
		success: success,
		error: error
	}, this.options);
};

Authenticator.prototype.sendCode = function(mobile, success, error) {
	if (!success) {
		success = function () {};
	}

	doAjax({
		url: '/authenticator/sms/code',
		data: {mobile: mobile},
		success: success,
		error: error
	}, this.options);
};

Authenticator.prototype.mac = function(success, error) {
	doAjax({
		url: '/authenticator/mac',
		success: success,
		error: error
	}, this.options);
};

Authenticator.prototype.oneClick = function(success, error) {
	doAjax({
		url: '/authenticator/one_click',
		success: success,
		error: error
	}, this.options);
};

Authenticator.prototype.boardingPass = function(seatno,fitno,passengerno,success, error) {
	doAjax({
		url: "/authenticator/boardingpass",
		data:{seatno: seatno, fitno: fitno, passengerno: passengerno},
		success: success,
		error: error
	}, this.options);
};

Authenticator.prototype.password = function(password, success, error) {
	doAjax({
		url: '/authenticator/password',
		data: {password: password},
		success: success,
		error: error
	}, this.options);
};

Authenticator.prototype.wechat = function(target, error) {
	var isMobile;
	if (target instanceof Function) {
		isMobile = true;
		error = target
	} else {
		isMobile = false;
	}

	doAjax({
		type: 'GET',
		url: '/authenticator/wechat/info',
		success:function(data) {
			
			if (!$("body").data("initialized")) {
				if (isMobile) {
					$.getScript("https://wifi.weixin.qq.com/resources/js/wechatticket/wechatutil.js", function () {
						$("body").data("initialized", true)
						wechatAuth(data);
					});
				} else {
					$.getScript("https://wifi.weixin.qq.com/resources/js/wechatticket/pcauth.js", function () {
						$("body").data("initialized", true)
						wechatAuth(data, target);
					});
				}
			} else {
				wechatAuth(data, target);
			}
		},
		error: error
	}, this.options);
}

Authenticator.prototype.account = function(username, password, success, error) {
	doAjax({
		url: '/authenticator/account',
		data: {username: username, password: password},
		success: success,
		error: error
	}, this.options);
};


$(function(){
	doAjax({url: '/pageviews', success: function() {}});
});