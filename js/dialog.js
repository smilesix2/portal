function openDialog(title, message, btns, handler) {
    var width = $(window).width();
    if (width > 420) {
        width = 420;
    } else {
        width = width * 0.9;
    }

    var loginBtn = $(".login-btn");
    var color = loginBtn.css("background-color");
    var html = "<div class='dialog' style='width:"+width+"px; margin-left: -"+(width/2)+"px'>";
    html += "<div class='icon-container'><img src='../images/cozy.png' style='background-color:"+color+"'></div>";
    html += "<div class='dialog-content'>";
    html += "<p class='title'>"+title+"</p><p>"+message+"</p>";
    html += "<div class='input-group'><input type='button' value='"+btns[0]+"'><input class='ok-btn' type='button' value='"+btns[1]+"' style='color:#fff; background-color: "+color+";'></div>";
    html += "<a href='javascript:;'><img src='../images/x.png' style='background-color:"+color+"'/></a>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "<div class='dialog-backdrop'></div>";
    var $elements = $(html).appendTo("body");
    var $dialog = $($elements[0]);

    function close() {
        $elements.animate({ opacity: 0 }, {
            complete: function () {
                $elements.hide();
            }
        });
    }

    $dialog.on("click", "input", function() {
        if ($(this).hasClass("ok-btn")) {
            handler();
        }
        close();
    });

    $dialog.find("a").click(function() {
        close();
    });
}