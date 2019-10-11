define(["epii-upload", "jquery"], function (epii_upload, $) {
    var out = {};
    out.init = function (divs) {

        divs.each(function () {
            out.initOne(this);
        })
    };
    out.initOne = function (div) {
        var pre_dom = $("<div class='epii-upload-preview-files'></div>");
        var brower_dom = $("<div class='epii-upload-preview-btn'><button>上传</button></div>");
        $(div).append(pre_dom);
        $(div).append(brower_dom);
        $(div).addClass("epii-upload-preview");
        $(div).attr("data-multiple","1");

        div.browse_dom = brower_dom.find("button").eq(0)[0];

        div.preview_dom = pre_dom[0];
        epii_upload.initOne(div);
    };
    return out;
});