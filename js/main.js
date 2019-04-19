(function () {
	'use strict';

	var MESSAGES = {
		en: {
			INVALID_MOBILE_NUM: 'Please enter a valid mobile number',
			INVALID_USERNAME: 'Please enter a valid username',
			INVALID_PASSWORD: 'Please enter a valid password',
			AGREE_TERMS: 'Please agree to the Terms & Conditions',
			AUTHING: 'Logging in...',
			SENDING: 'Sending',
			TITLE: 'Welcome',
			AUTHENTICATED: '{0} has been authenticated. Do you want to continue to log in with this account?'
		},
		cn: {
			INVALID_MOBILE_NUM: '请输入一个有效的手机号码',
			INVALID_USERNAME: '请输入一个有效的账号',
			INVALID_PASSWORD: '请输入一个有效的密码',
			AGREE_TERMS: '请选中使用条款',
			AUTHING: '正在认证...',
			SENDING: '正在获取',
			TITLE: '欢迎您',
			AUTHENTICATED: '{0}已经认证过，是否继续使用此账号登录？'
		}
	}

	function getMessage(key, params) {
		var lang = $("body").hasClass("en") ? "en" : "cn";
		var message = MESSAGES[lang][key];
		if (params) {
			for (var i = 0; i < params.length; i++) {
				message = message.replace("{" + i + "}", params[i]);
			}
		}
		return message;
	}

	function xalert(key, params) {
		var message = getMessage(key, params)
		alert(message);
	}

	$(".checkbox").click(function () {
		var checkbox = $(this);
		if (checkbox.hasClass("unchecked")) {
			checkbox.removeClass("unchecked");
		} else {
			checkbox.addClass("unchecked");
		}
	});

	var authenticator = new Authenticator({
		success: function (portal) {
			setTimeout(function () {
				var url = "";
				if ($("body").attr("data-logining-closed") == undefined) {
					url = "logining" + (window.location.href.indexOf("login.html") != -1 ? "" : "_desktop") + ".html?url=";
				}
				url += portal.success;
				window.location.href = url;
			}, 1000);
		},
		error: function (error) {
			var btn = $("#login_btn");
			btn.removeClass("btn-disabled");
			var temp = btn.attr("data-temp");
			btn.val(temp);
			alert(error.description);
		}
	});

	function getRegion() {
		var $region = $("#region");
		var region = $.trim($region.html());
		if (region != "+86") {
			region = region.substring(1);
			region = "00" + region;
		} else {
			region = "";
		}
		return region;
	}

	$("#login_btn").click(function () {
		if ($('.wechat').hasClass('true')) {
			$('#wechat_btn').click();
			return false;
		}
		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");

			var username = $.trim($("#username").val());
			var region = getRegion();
			var isSmsAuth = $("#login").hasClass("phone");
			if (isSmsAuth) {
				if (!username || isNaN(username) || username.length != 11) {
					xalert("INVALID_MOBILE_NUM");
					$this.removeClass("btn-disabled");
					return;
				}
			} else {
				if (!username || username.length > 32) {
					xalert("INVALID_USERNAME");
					$this.removeClass("btn-disabled");
					return;
				}
			}


			var password = $.trim($("#password").val());
			if (!password || password.length > 32) {
				xalert("INVALID_PASSWORD");
				$this.removeClass("btn-disabled");
				return;
			}

			if ($(".checkbox").hasClass("unchecked")) {
				xalert("AGREE_TERMS");
				$this.removeClass("btn-disabled");
				return;
			}

			var value = $this.val();
			$this.attr("data-temp", value);
			$this.val(getMessage("AUTHING"));

			if (isSmsAuth) {
				authenticator.sms(username, password);
			} else {
				authenticator.account(username, password);
			}
		}
	});

	function disable(second) {
		var $inner = $("#get_pwd_btn_inner");
		$inner.html(second);
		second--;
		if (second != 0) {
			setTimeout(function () {
				disable(second);
			}, 1000);
		} else {
			$('#get_pwd_btn').removeClass("btn-disabled");
			$inner.removeClass("btn-disabled");
			var temp = $inner.attr("data-temp");
			$inner.html(temp);
		}
	}

	$("#get_pwd_btn").click(function () {
		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");

			var username = $.trim($("#username").val());
			if (!username || isNaN(username) || username.length != 11) {
				xalert("INVALID_MOBILE_NUM");
				$this.removeClass("btn-disabled");
				return;
			}

			var $inner = $("#get_pwd_btn_inner");
			var value = $inner.html();
			$inner.attr("data-temp", value);
			$inner.html(getMessage("SENDING"));

			authenticator.sendCode(username, function () {
				disable(59);
			}, function (error) {
				$this.removeClass("btn-disabled");
				var temp = $inner.attr("data-temp");
				$inner.html(temp);
				alert(error.description);
			});
		}
	});

	$("body").click(function () {
		if ($(".main_content").is(":visible")) {
			$(".main_content").hide();
		}
	});

	$("#wechat_btn").click(function (e) {
		e.stopPropagation();

		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");

			if ($(".checkbox").hasClass("unchecked")) {
				xalert("AGREE_TERMS");
				$this.removeClass("btn-disabled");
				return;
			}

			$(".loader").show();
			authenticator.wechat(hideLoader);
		}
	});

	function hideLoader() {
		$(".loader").hide();
	}

	$(".loader").click(hideLoader);

	$("#back_btn").click(function () {
		$("#wrapper").hide();
	});

	function switchAuth($next) {
		var $username = $("#username");
		var $password = $("#password");
		var data = [
			[
				["SMS login", "Username", "Password"],
				["短信认证", "Account number 请输入账号", "Password 请输入密码"]
			],
			[
				["Account login", "Mobile number", "Password"],
				["账号认证", "Phone number 请输入手机号", "validation code 请输入验证码"]
			]
		];

		var $login = $("#login");
		var typeIndex = $login.hasClass("phone") ? 0 : 1;
		var langIndex = $("body").hasClass("en") ? 0 : 1;
		var authTypeData = data[typeIndex];
		$username.val("");
		$password.val("");

		if ($next && $next.length != 0) {
			$next.html(authTypeData[langIndex][0]);
		}
		// if($('a.active').hasClass('sms')){
		// 	langIndex =0;
		// }else{
		// 	langIndex =1;
		// }

		$username.attr("placeholder", authTypeData[langIndex][1]);
		$password.attr("placeholder", authTypeData[langIndex][2]);

		langIndex = langIndex == 0 ? 1 : 0;
		if ($next && $next.length != 0) {
			$next.attr("data-replacer", authTypeData[langIndex][0]);
		}
		$username.attr("data-replacer", authTypeData[langIndex][1]);
		$password.attr("data-replacer", authTypeData[langIndex][2]);

		if (typeIndex == 0) {
			$("#get_pwd_btn").hide();
			$login.removeClass("phone");
			if ($username.attr("type")) {
				$username.attr("type", "text");
			} else {
				$username.prop("type", "text");
			}
		} else {
			$("#get_pwd_btn").show();
			$login.addClass("phone");
			if ($username.attr("type")) {
				$username.attr("type", "tel");
			} else {
				$username.prop("type", "tel");
			}
		}
	}

	$("#more_btn").click(function () {
		var $this = $(this);
		switchAuth($this.next());
	});

	$(".tab").click(function () {
		var $this = $(this);
		if($this.hasClass('active')){
			return false;
		}
		var $active = $this.parent().find(".active");
		$active.removeClass("active");
		$this.addClass("active");
		if ($this.hasClass('wechat')) {
			$this.addClass('true');
			$('.input-form').hide();
		} else {
			$('.wechat').removeClass('true');
			$('.input-form').show();
			switchAuth();
		}
	});

	var codeRegex = $.cookie('codeRegex');
	if (codeRegex && codeRegex.indexOf("\\d") != -1 && window.location.href.indexOf("_desktop") == -1) {
		$("#code").attr("type", "number");
	}

	var username = $.cookie('username');
	if (username && username != "" && username != "null") {
		var title = getMessage("TITLE");
		var message = getMessage("AUTHENTICATED", [username]);
		var buttons = $("body").hasClass("en") ? ["CANCEL", "OK"] : ["取消", "上网"];
		openDialog(title, message, buttons, function () {
			var btn = $("#login_btn");
			var value = btn.val();
			btn.addClass("btn-disabled");
			btn.attr("data-temp", value);
			btn.val(getMessage("AUTHING"));
			authenticator.mac();
		});
	}
})();


$(window).load(function () {
	if(typeof $.fn.swipeslider =='function' ){
		$('#swipslider').swipeslider({
			sliderHeight: '60%',
			transitionDuration: '300',
			autoPlayTimeout: 3000,
			prevNextButtons: false
		});
	}
})