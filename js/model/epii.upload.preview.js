define(["epii-upload", "jquery"], function (epii_upload, $) {
    var out = {};
    out.init = function (divs) {

        divs.each(function () {
            out.initOne(this);
        })
    };
    out.initOne = function (div) {
        var add = Args.baseUrl + "../img/tubiao/upload_pc.jpg"
        var add_phone =  Args.baseUrl + "../img/tubiao/upload_phone.jpg"
        var pre_dom = $("<div class='epii-upload-preview-files'><div></div></div>");

        var brower_dom = $("<div class='epii-upload-preview-btn'><div class='epii-upload-preview-add'><img src='" + add + "'><div class='epii-upload-preview-add-phone-title'>文件选择</div></div></div>");
        $(div).append(pre_dom);
        $(div).append(brower_dom);
        var closephone = $(div).attr("data-enable-phone") && ($(div).attr("data-enable-phone")-0==0);
        if (  Args.pluginsData.epii_upload_phone_enable && !closephone )  {
            var phone_brower_dome = $("<div class='epii-upload-preview-btn-phone'><div class='epii-upload-preview-add-phone'><img src='" + add_phone + "'><div class='epii-upload-preview-add-phone-title'>手机上传</div></div><div class='epii-upload-phone-qrcode'></div></div>")
            $(div).append(phone_brower_dome);
            require(["epii-upload-phone"], function (phone_upload) {
                var phone_click = phone_brower_dome.find(".epii-upload-preview-add-phone");
                phone_click.click(function () {
                    phone_click.hide();
                    phone_upload.getFiles( $.extend({
                        qrcode_img: phone_brower_dome[0].getElementsByClassName("epii-upload-phone-qrcode")[0],
                    },JSON.parse(Args.pluginsData.epii_upload_phone)),function(imgs){
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