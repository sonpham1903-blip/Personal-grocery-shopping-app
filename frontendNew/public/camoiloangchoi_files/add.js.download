function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(document).ready(function () {
    $("#billtoship").click(function () {
        $('.steps-hoso').toggle(500);
    });
    $('.menu-bar-lv-2').each(function () {
        $(this).find('.span-lv-2').click(function () {
            $(this).toggleClass('rotate-menu');
            $(this).parent().find('.menu-bar-lv-3').toggle(500);
        });
    });
    $('.menu-bar-lv-3').each(function () {
        $(this).find('.span-lv-3').click(function () {
            $(this).toggleClass('rotate-menu');
            $(this).parent().find('.menu-bar-lv-4').toggle(500);
        });
    });
    $('.menu-bar-lv-4').each(function () {
        $(this).find('.span-lv-4').click(function () {
            $(this).toggleClass('rotate-menu');
            $(this).parent().find('.menu-bar-lv-5').toggle(500);
        });
    });
    $('#owl-detail').owlCarousel({
        items: 5,
        loop: false,
        margin: 10,
        merge: true,
        dots: false,
        nav: true,
        responsive: {
            0: {
                items: 4,
                margin: 5,
            },
            350: {
                items: 4,
                margin: 5,
            },
            600: {
                items: 4,
                margin: 5,
            },
            767: {
                items: 5,
                margin: 5,
            },
            992: {
                items: 5,
                margin: 5,
            },
            1200: {
                items: 5,
                margin: 5,
            }
        }
    });

    $('#box-cr-popup').owlCarousel({
        items: 1,
        loop: false,
        margin: 10,
        merge: true,
        dots: false,
        nav: true,
        responsive: {
        }
    });
    $('.slide-some-product').owlCarousel({
        items: 1,
        loop: false,
        merge: true,
        dots: false,
        nav: true,
        responsive: {
            0: {
                items: 1,
            },
            530: {
                items: 1,
            },
            531: {
                items: 1,
            },
            767: {
                items: 1,
            },
            992: {
                items: 1,
            },
            1200: {
                items: 1,
            },
        }
    });
});
function openanswer(id) {
    $(".box-answer-" + id).toggleClass("open");
}
function responcerate(id, url) {
    var message = $('#message-' + id).val();
    $.ajax({
        url: url,
        type: 'post',
        data: { id: id, 'message': message },
        success: function (result) {
            // $('#content-data-review').html(result);
            $(".box-answer-" + id).toggleClass("open");
            $('#box-response-' + id).append(result);
            $('#message-' + id).val('');
        }
    });
}

function loadAjax(url, data, div) {
    div.html('<img style="padding:5px 10px;" src="/images/ajax-loader.gif" />');
    $.ajax({
        url: url,
        data: data,
        success: function (result) {
            div.html(result);
        }
    });
}

function loadAjaxPost(url, data, div) {
    div.html('<img style="padding:5px 10px;" src="/images/ajax-loader.gif" />');
    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        success: function (result) {
            div.html(result);
        }
    });
}

function loadJson(url, data, div) {
    div.html('<img style="padding:5px 10px;" src="/images/ajax-loader.gif" />');
    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

$(document).ready(function () {
    if ($(window).width() < 1200) {
        var table = $('table');
        $('table').parent().css('overflow-y', 'auto');
    }
    $(".video-youtube").height($(".video-youtube").width() * 0.564);
    // $("html, body").scroll(function () {
    //     console.log($(this).scrollTop());
    //     // console.log('2323');
    // });
    // $(window).scroll(function () {
    //     console.log($(this).scrollTop());
    // });
});

function addLoading() {
    $('body').append('<div id="boxloading" class="boxloading"><img style="padding:5px 10px;" src="/images/ajax-loader.gif" /></div>');
    $('body').css('overflow', 'hidden');
}

function removeLoading() {
    $('#boxloading').remove();
    $('body').css('overflow', 'unset');
}

function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}