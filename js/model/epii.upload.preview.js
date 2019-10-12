define(["epii-upload", "jquery"], function (epii_upload, $) {
    var out = {};
    out.init = function (divs) {

        divs.each(function () {
            out.initOne(this);
        })
    };
    out.initOne = function (div) {
        var add = Args.baseUrl+"../img/tubiao/add.png"
        var pre_dom = $("<div class='epii-upload-preview-files'><div></div></div>");
        var brower_dom = $("<div class='epii-upload-preview-btn'><div class='epii-upload-preview-add'><img src='"+add+"'></div></div>");
        $(div).append(pre_dom);
        $(div).append(brower_dom);
        $(div).addClass("epii-upload-preview");
        $(div).attr("data-multiple","1");

        div.browse_dom = brower_dom.find("div").eq(0)[0];

        div.preview_dom = pre_dom.find("div").eq(0)[0];
        epii_upload.initOne(div);
    };
    return out;
});