(function () {
    'use strict';
    
    function openTerms() {
        if (window.location.href.indexOf("desktop") == -1) {
            var pageId = "terms_page";
            var hasEn = $("body").hasClass("en");
            if ($("body").hasClass("en")) {
                pageId += "_en";
            }

            var $termsPage = $("#" + pageId);
            if ($termsPage.length == 0) {
                var top = $(window).height();
                var title;
                var back;
                var url;
                if (hasEn) {
                    title = "Wi-Fi terms of use";
                    back = "Back";
                    url = "terms_en.html";
                } else {
                    title = "Wi-Fi Terms of Use<br />Wi-Fi使用条款";
                    back = "Back<br />返回";
                    url = "terms.html";
                }

                var html = "<div class='terms-page' id='" + pageId + "' style='top:" + top + "px;height:" + top + "px;'>";
                html += "<div class='terms-page-head'><span>" + title + "<span><a>" + back + "</a></div>";
                html += "<div class='terms-page-content' id='" + pageId + "_content' style='height:" + (top - 45) + "px;'></div>";
                html += "</div>";
                $termsPage = $(html).appendTo("body");
                $termsPage.animate({ top: 0 }, {
                    complete: function () {
                        window.history.pushState({ title: "title", url: "#" }, "title", "#");
                        $("body>div:first").hide();
                    }
                });        
                $.ajax({
                    url: "../html/"+url,                
                    cache: false,
                    success: function (content) {
                        $("#" + pageId + "_content").append(content);
                    }
                });

                $termsPage.find("a:first").click(function (e) {
                    window.history.back();
                });

                window.addEventListener("popstate", function (e) {
                    $("body>div:first").show();
                    $termsPage.animate({ top: top }, {
                        complete: function () {
                            $termsPage.hide();
                        }
                    });
                }, false);
            } else {
                $termsPage.show();
                $termsPage.animate({ top: 0 }, {
                    complete: function () {
                        window.history.pushState({ title: "Terms", url: "#" }, "title", "#");
                        $("body>div:first").hide();
                    }
                });
            }
        } else {
            var panelId = "terms_panel";
            var hasEn = $("body").hasClass("en");
            if ($("body").hasClass("en")) {
                panelId += "_en";
            }
            var $termsPanel = $("#" + panelId);
            if ($termsPanel.length == 0) {
                var title;
                var back;
                var url;
                if (hasEn) {
                    title = "Wi-Fi terms of use";
                    back = "Back";
                    url = "terms_en.html";
                } else {
                    title = "Wi-Fi使用条款";
                    back = "返回";
                    url = "terms.html";
                }

                var loginBtn = $(".login-btn");
                var color = loginBtn.css("background-color");
                var html = "<div class='terms-panel' id='" + panelId + "' style='border-radius:" + loginBtn.css("border-radius") + "'>";
                html += "<div class='terms-panel-title'>" + title + "</div>";
                html += "<div class='terms-panel-content'id='" + panelId + "_content'></div>";
                html += "<div class='terms-panel-bottom'><a href='javascript:;' style='background-color:" + color + "'>" + back + "</a></div>";
                html += "</div>";
                $termsPanel = $(html).appendTo("body");

                $.ajax({
                    url: "../"+url,
                    cache: false,
                    success: function (content) {
                        $("#" + panelId + "_content").append(content);
                    }
                });
                $termsPanel.find("a:first").click(function () {
                    $termsPanel.hide();
                });
            } else {
                $termsPanel.show();
            }
        }
    }

    // $(".agreement-btn").click(openTerms);
    $(".agreement-btn").click(function(){
        openTerms();
    });
})();