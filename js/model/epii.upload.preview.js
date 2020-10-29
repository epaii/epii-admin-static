define(["epii-upload", "jquery"], function (epii_upload, $) {
    var out = {};
    out.init = function (divs) {

        divs.each(function () {
            out.initOne(this);
        })
    };
    out.initOne = function (div) {
        var add = Args.baseUrl + "../img/tubiao/add.png"
        var pre_dom = $("<div class='epii-upload-preview-files'><div></div></div>");

        var brower_dom = $("<div class='epii-upload-preview-btn'><div class='epii-upload-preview-add'><img src='" + add + "'></div></div>");
        $(div).append(pre_dom);
        $(div).append(brower_dom);
        if ($(div).attr("data-enable-phone")) {
            var phone_brower_dome = $("<div class='epii-upload-preview-btn-phone'><div class='epii-upload-preview-add-phone'>手机上传</div><div class='epii-upload-phone-qrcode'></div></div>")
            $(div).append(phone_brower_dome);
            require(["epii-upload-phone"], function (phone_upload) {
                var phone_click = phone_brower_dome.find(".epii-upload-preview-add-phone");
                phone_click.click(function () {
                    phone_click.hide();
                    phone_upload.getFiles({
                        qrcode_img: phone_brower_dome[0].getElementsByClassName("epii-upload-phone-qrcode")[0],
                        file_pre: 'https://wszxstore.blob.core.chinacloudapi.cn/susong/uploads/'
                    },function(imgs){
                        epii_upload.addFiles(div,imgs);
                    });
                });
            })


        }

        $(div).addClass("epii-upload-preview");
        $(div).attr("data-multiple", "1");

        div.browse_dom = brower_dom.find("div").eq(0)[0];

        div.preview_dom = pre_dom.find("div").eq(0)[0];
        epii_upload.initOne(div);

    };
    return out;
});