define(["adminlte", "addtabs"], function (AdminLTE, Addtabs) {
    $.addtabs.addDom = function (dom) {
        _click($(dom));
        $.addtabs.drop();
    };

    var $sidebar = $('.control-sidebar')
    var $container = $('<div />', {
        class: 'p-3'
    });

    $sidebar.append($container)


    var whenSkinsChange = function (type, value) {
        if (Args.pluginsData && Args.pluginsData.skin_save_api) {

            var url = Args.pluginsData.skin_save_api;
            if (url.indexOf("{type}") > 0) {
                url = EpiiAdmin.tools.replaceInData(url, {type: type, value: value})
            } else {
                url = url + ((url.indexOf("?") > 0) ? "&" : "?") + "type=" + type + "&value=" + value;
            }
            EpiiAdmin.ajax(url);

        }


    };

    var navbar_dark_skins = [
        'bg-primary',
        'bg-info',
        'bg-success',
        'bg-danger'
    ];

    var navbar_light_skins = [
        'bg-warning',
        'bg-white',
        'bg-gray-light'
    ];

    $container.append(
        '<h5>主题设置</h5><hr class="mb-2"/>'
        + '<h6>头部导航背景色</h6>'
    );

    var $navbar_variants = $('<div />', {
        'class': 'd-flex'
    });
    var navbar_all_colors = navbar_dark_skins.concat(navbar_light_skins)
    var $navbar_variants_colors = createSkinBlock(navbar_all_colors, function (e) {
        var color = $(this).data('color');

        var $main_header = $('.main-header')
        $main_header.removeClass('navbar-dark').removeClass('navbar-light')
        navbar_all_colors.map(function (color) {
            $main_header.removeClass(color)
        });

        if (navbar_dark_skins.indexOf(color) > -1) {
            $main_header.addClass('navbar-dark');

        } else {

            $main_header.addClass('navbar-light')
        }


        $main_header.addClass(color);
        whenSkinsChange("navbar", color);
    });

    $navbar_variants.append($navbar_variants_colors);

    $container.append($navbar_variants);

    var $checkbox_container = $('<div />', {
        'class': 'mb-4'
    })
    var $navbar_border = $('<input />', {
        type: 'checkbox',
        value: 1,
        checked: $('.main-header').hasClass('border-bottom'),
        'class': 'mr-1'
    }).on('click', function () {
        if ($(this).is(':checked')) {
            $('.main-header').addClass('border-bottom')
        } else {
            $('.main-header').removeClass('border-bottom')
        }
    })
    $checkbox_container.append($navbar_border)
    $checkbox_container.append('<span>Navbar border</span>');
    $container.append($checkbox_container)


    var sidebar_colors = [
        'bg-primary',
        'bg-warning',
        'bg-info',
        'bg-danger',
        'bg-success'
    ];

    var sidebar_skins = [
        'sidebar-dark-primary',
        'sidebar-dark-warning',
        'sidebar-dark-info',
        'sidebar-dark-danger',
        'sidebar-dark-success',
        'sidebar-light-primary',
        'sidebar-light-warning',
        'sidebar-light-info',
        'sidebar-light-danger',
        'sidebar-light-success'
    ];

    $container.append('<h6>左侧黑色背景按钮颜色</h6>');
    var $sidebar_variants = $('<div />', {
        'class': 'd-flex'
    });
    $container.append($sidebar_variants);
    $container.append(createSkinBlock(sidebar_colors, function () {
        var color = $(this).data('color');
        var sidebar_class = 'sidebar-dark-' + color.replace('bg-', '');
        var $sidebar = $('.main-sidebar');
        sidebar_skins.map(function (skin) {
            $sidebar.removeClass(skin)
        });

        $sidebar.addClass(sidebar_class);
        whenSkinsChange("sidebar-dark", sidebar_class);
    }));

    $container.append('<h6>左侧白色背景按钮颜色</h6>');
    var $sidebar_variants = $('<div />', {
        'class': 'd-flex'
    })
    $container.append($sidebar_variants)
    $container.append(createSkinBlock(sidebar_colors, function () {
        var color = $(this).data('color')
        var sidebar_class = 'sidebar-light-' + color.replace('bg-', '');
        var $sidebar = $('.main-sidebar')
        sidebar_skins.map(function (skin) {
            $sidebar.removeClass(skin)
        });

        $sidebar.addClass(sidebar_class);
        whenSkinsChange("sidebar-light", sidebar_class);
    }));

    var logo_skins = navbar_all_colors
    $container.append('<h6>Logo区背景色</h6>');
    var $logo_variants = $('<div />', {
        'class': 'd-flex'
    })
    $container.append($logo_variants);
    var $clear_btn = $('<a />', {
        href: 'javascript:void(0)'
    }).text('clear').on('click', function () {
        var $logo = $('.brand-link');
        logo_skins.map(function (skin) {
            $logo.removeClass(skin)
        });
        whenSkinsChange("logo-bg", "clear");
    })
    $container.append(createSkinBlock(logo_skins, function () {
        var color = $(this).data('color')
        var $logo = $('.brand-link')
        logo_skins.map(function (skin) {
            $logo.removeClass(skin)
        })
        $logo.addClass(color);
        whenSkinsChange("logo-bg", color);
    }).append($clear_btn));

    function createSkinBlock(colors, callback) {
        var $block = $('<div />', {
            'class': 'd-flex flex-wrap mb-3'
        });

        colors.map(function (color) {
            var $color = $('<div />', {
                'class': (typeof color === 'object' ? color.join(' ') : color) + ' elevation-2'
            });

            $block.append($color);

            $color.data('color', color);

            $color.css({
                width: '40px',
                height: '20px',
                borderRadius: '25px',
                marginRight: 10,
                marginBottom: 10,
                opacity: 0.8,
                cursor: 'pointer'
            });

            $color.hover(function () {
                $(this).css({opacity: 1}).removeClass('elevation-2').addClass('elevation-4')
            }, function () {
                $(this).css({opacity: 0.8}).removeClass('elevation-4').addClass('elevation-2')
            });

            if (callback) {
                $color.on('click', callback)
            }
        })

        return $block
    }


    $(".sidebar a[data-addtab]").on('click', function (e) {
        //console.log($(this).html());
        e.stopPropagation();
        e.preventDefault();
        $(".sidebar a.active").each(function () {
            $(this).removeClass("active")
        });

        $(this).addClass("active");
        $.addtabs.addDom(this);
    });

    $(".sidebar").on('click', ".has-treeview", function (e) {

        $(this).siblings().removeClass("menu-open");
        if ($(this).hasClass("menu-open")) {
            $(this).removeClass("menu-open");
        } else {
            $(this).addClass("menu-open");
        }
    });


    setTimeout(function () {
        $(".sidebar a.active").eq(0).trigger("click");
    }, 300);


    $("body").on('click', "a[data-toggle=tab]", function (e) {


        e.preventDefault();


        if ($.addtabs.reload_check($(this).data("tabid"))) {
            $(this).dblclick();
        } else {

            if ($(this).is("a"))
                window.EpiiAdmin.addtabs.addById($(this).attr("aria-controls"));
            //$(this).tab('show');
        }


    });

    $.addtabs.set({
        "target": ".wstabs",
        "tab_title_li_class": "nav-item",
        "tab_title_a_class": "nav-link",
        "iframe": true,
        "tab_content": "#tab_content",
        "height": "1000px"
    });


    $("body").on("click", "a[data-widget='control-reload']", function (e) {

        $.addtabs.reloadById($.addtabs.current_id);
    });


    function reload_menu_badge(menu_id) {
        if (Args.pluginsData && Args.pluginsData.menu_badge_api) {
            if (!menu_id) menu_id = "";
            $.getJSON(Args.pluginsData.menu_badge_api, {menu_id: menu_id}, function (data) {
                if (data && (data["code"] - 1 === 0) && (data["data"]) && (data["data"]["list"])) {
                    if (data["data"]["list"].length > 0) {
                        $(".nav-sidebar  .nav-item span").remove();
                        data["data"]["list"].map(function (item) {
                            // console.log(item);
                            var li = $("[data-addtab=" + item.id + "]");
                            li.find("span").remove();
                            li.find("p").append(item.span);
                        });
                    }
                }
            });
        }

    }

    if (window.EpiiAdmin) {


        window.EpiiAdmin.addtabs = Addtabs;
        window.EpiiAdmin.closeThis = function () {
            EpiiAdmin.addtabs.close({id: EpiiAdmin.addtabs.current_id});
        };
        window.EpiiAdmin.reload = Addtabs.reload_next;
        window.EpiiAdmin.AdminLTE = AdminLTE;

        window.EpiiAdmin.Pushmenu = new AdminLTE.PushMenu();
        window.EpiiAdmin.reload_menu_badge = reload_menu_badge;
    }
    // setTimeout(function () {
    //     $.addtabs.reload_next("data");
    // }, 5000);
});