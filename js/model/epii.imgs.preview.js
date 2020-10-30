
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($) {

    var out = {
        getFileExt: function (file) {
            var type = file.split('.');
            return type[type.length - 1];
        },
        isImg: function (file) {

            var ext = this.getFileExt(file);
            return ["png", "gif", "jpeg", "jpg"].indexOf(ext) >= 0
        },
        isPdf: function (file) {
            var ext = this.getFileExt(file);
            return ext == "pdf"
        },
        getFileIcon: function (file) {
            var ext = this.getFileExt(file)
            var icon = "";
            switch (ext) {
                case "png":
                case "jpeg":
                case "gif":
                case "jpg":
                    icon = file;
                    break;
                case "zip":
                case "pdf":
                case "docx":
                case "doc":
                case "rar":
                    icon = Args.baseUrl + "../img/tubiao/" + ext + ".png"
                    break;
                default:
                    icon = Args.baseUrl + "../img/tubiao/qita.png"
                    break;

            }
            return icon;
        },
        init: function (divs) {
            divs.each(function () {
                out.initOne(this)
            });
        },
        initOne: function (dom) {
            var jdom = $(dom);
           
            if (jdom.attr("data-files")) {
                jdom.attr("data-files").split(",").forEach(function (item) {
                    out.addFiles(jdom, item);
                });
                window.top.layer.photos({
                    photos: jdom,
                    closeBtn: 1,
                    anim: 5,
                    img:".epii-upload-file-icon-img"
                });
            }else{
                var find = jdom.attr("data-img") || "img"
                window.top.layer.photos({
                    photos: jdom,
                    closeBtn: 1,
                    anim: 5,
                    img:find
                });
            }
         
        },
        addFiles: function (imgs_ul_id_jquery, url) {

            var name = url;
            var icon = this.getFileIcon(name);

            var isImg = this.isImg(url);

            var file_div = $("<div class='epii-upload-files-div' ><img  data-file='"+url+"' class='epii-upload-file-icon " + (isImg ? ("epii-upload-file-icon-img'")  : "  '")  + " src='" + icon + "'  ></div>");

            imgs_ul_id_jquery.append(file_div);
            imgs_ul_id_jquery.show();
            if(this.isPdf(url)){
                file_div.click(function(){
                   EpiiAdmin.openInDialog(url,"预览",true)
                });
            }else if(!isImg){
                window.open(url,"_blank")
            }
        }
    };
    return out;
});