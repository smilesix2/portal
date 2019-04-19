(function () {
	'use strict';
	


	var authenticator = new Authenticator({
		success: function(portal) {
			setTimeout(function() {
				var url = "";
				
				if ($("body").attr("data-logining-closed") == undefined) {
					url = "logining"+(window.location.href.indexOf("login.html") != -1 ? "":"_desktop")+".html?url=";
				}
				url += portal.success;
				window.location.href=url;
			}, 1000);
		},
		error: function(error) {
			var btn = $("#wechat_btn");
			btn.removeClass("btn-disabled");
			btn.val("登录");
			alert(error.description);
		}
	});

	$("#wechat_btn").click(function(e) {
		e.stopPropagation();
		
		var $this = $(this);
		if (!$this.hasClass("btn-disabled")) {
			$this.addClass("btn-disabled");

			if ($(".checkbox").hasClass("unchecked")) {
				alert("请选中使用条款");
				$this.removeClass("btn-disabled");
			 	return;
			}

			if (window.location.href.indexOf("_desktop") == -1) {
				$(".loader").show();
				authenticator.wechat(hideLoader);
			} else {
				$(".main_content").show();
				authenticator.wechat(document.getElementById("qrcode_zone"), hideLoader);
			}
		}
	});

	$("body").click(function () {
		if( $(".main_content").is(":visible")) {
			$(".main_content").hide();
			$("#wechat_btn").removeClass("btn-disabled");
		}
	});

	function hideLoader() {
		$(".loader").hide();
		$("#wechat_btn").removeClass("btn-disabled");
	}

	$(".loader").click(hideLoader);
	
	$("#back_btn").click(function() {
		$("#wrapper").hide();
	});

	$("#agreement-btn").click(function() {
		$("#wrapper").show();
	});

	var codeRegex = $.cookie('codeRegex');
	if (codeRegex && codeRegex.indexOf("\\d") != -1 && window.location.href.indexOf("_desktop") == -1) {
		$("#code").attr("type", "number");
	}

	var username = $.cookie('username');
	if (username && username != "" && username != "null") {
		var title = "欢迎您";
		var message = username + "已经认证过，是否继续使用此账号登录？";
		var buttons = ["取消", "上网"];
		openDialog(title, message, buttons, function () {
			var btn = $("#login_btn");
			var value = btn.val();
			btn.addClass("btn-disabled");
			btn.attr("data-temp", value);
			btn.val('正在认证...');
			authenticator.mac();
		});
	}
})();