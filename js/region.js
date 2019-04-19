(function () {
    'use strict';
    
    function getUrl(isEn) {
        var url = "../regions";
        if (isEn) {
            url += "_en"
        }
        url += ".json";
        return url;
    }

    function getId(pageId, isEn) {
        if (isEn) {
            pageId += "_en";
        }
        return pageId;
    }

    function selectRegion(region) {
        var isEn = $("body").hasClass("en");
        if (window.location.href.indexOf("desktop") == -1) {
            var pageId = getId("region_page", isEn);

            var $regionPage = $("#"+pageId);
            if ($regionPage.length == 0) {
                var top = $(window).height();
                var html = "<div class='region-page' id='"+pageId+"' style='top:" + top + "px; height:" + top + "px;'>";
                html += "<div class='region-page-head'><a href='javascript:;'>"+(isEn?"Back":"返回")+"</a>"+(isEn?"Region":"国家/地区")+"</div>";
                html += "</div>";
                $regionPage = $(html).appendTo("body");
                
                $regionPage.animate({ top: 0 }, {
                    complete: function () {
                        window.history.pushState({title: "title", url: "#"}, "title", "#");
                        $("body>div:first").hide();
                    }
                });
        
                $.ajax({
                    url: getUrl(isEn),
                    cache: false,
                    success: function (regions) {
                        var $ul = $("<ul style='height:" + (top - 45) + "px;'></ul>").appendTo($regionPage);
                        html += "</ul>";
                        for (var i = 0; i < regions.length; i++) {
                            var html = "<li>" + regions[i].name + "<span>" + regions[i].code + "</span></li>";
                            $(html).appendTo($ul);
                        }
                    }
                });
        
                $regionPage.find("a:first").click(function (e) {
                    window.history.back();
                });
        
                $regionPage.on("mousedown", "li", function (e) {
                    $(this).css({ backgroundColor: '#f6f6f6' });
                    $(this).addClass("active");
                });
                $regionPage.on("mouseup", "li", function (e) {
                    $(region).html($(this).find("span").html());
                    window.history.back();
                });
        
                window.addEventListener("popstate", function (e) {
                    $("body>div:first").show();
                    $regionPage.animate({ top: top }, {
                        complete: function () {
                            $regionPage.hide();
                            $regionPage.find(".active").css({ backgroundColor: 'inherit' });
                        }
                    });
                }, false);
            } else {
                $regionPage.show();
                $regionPage.animate({ top: 0 }, {
                    complete: function () {
                        window.history.pushState({title: "Region", url: "#"}, "title", "#");
                        $("body>div:first").hide();
                    }
                });
            }
        } else {
            var panelId = getId("region_panel", isEn);
            var $regionPanel = $("#"+panelId);
            if ($regionPanel.length == 0) {
                var top = $(window).height();
                var offset = $(region).offset();

                var html = "<ul class='region-panel' id='"+panelId+"' style='top:"+(offset.top + 44)+"px; left:"+offset.left+"px;'></ul>";
                $regionPanel = $(html).appendTo("body");

                $.ajax({
                    url: getUrl(isEn),
                    cache: false,
                    success: function (regions) {
                        for (var i = 0; i < regions.length; i++) {
                            var html = "<li>" + regions[i].name + " <span>" + regions[i].code + "</span></li>";
                            $(html).appendTo($regionPanel);
                        }
                    }
                });

                $regionPanel.on("click", "li", function(e) {
                    e.stopPropagation();
                    $(region).html($(this).find("span").html());
                    $regionPanel.hide();
                });

                $regionPanel.on("mouseover", "li", function() {
                    $(this).css("background-color", "#eee")
                });

                $regionPanel.on("mouseout", "li", function() {
                    $(this).css("background-color", "inherit")
                });

                $(document).click(function() {
                    $regionPanel.hide();
                });

                window.onresize = function() {
                    var offset = $(region).offset();
                    $regionPanel.css({top:offset.top + 44, left:offset.left});
                }
            } else {
                $regionPanel.show();
            }
        }
    }

    $(".region-btn").click(function(e) {
        e.stopPropagation();

        selectRegion(this);
    });
})();
