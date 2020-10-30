 
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

var out={
    getFileIcon :function (file) {
        var type = file.split('.');
        var ext = type[type.length - 1];
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
    init:function (divs) {
        divs.each(function () {
            out.initOne(this)
        });
    },
    initOne:function(dom){
        var jdom = $(dom);
        jdom.find("img").each(function(index){
            $(this).attr("layer-index",index);
            $(this).click(function(){
                window.top.layer.photos({
                    photos: jdom,
                    closeBtn: 1,
                    anim: 5 
                });
            })
        });
        if(jdom.attr("data-files")){
            jdom.attr("data-files").split(",").forEach(function(item){
                out.addFiles(jdom,item);
            });
        }
    },
    addFiles:function(imgs_ul_id_jquery,url){
        var name =url;
        var icon = this.getFileIcon(name);     
        var file_div = $("<div class='epii-upload-files-div' ><img class='epii-upload-file-icon' layer-index='" + imgs_ul_id_jquery.find(".epii-upload-files-div").length + "' src='" + icon + "' ></div>");
        file_div.find(".epii-upload-file-icon").click(function () {
            window.top.layer.photos({
                photos: imgs_ul_id_jquery,
                closeBtn: 1,
                anim: 5 
            });
        });
        imgs_ul_id_jquery.append(file_div);
        imgs_ul_id_jquery.show();
    }
};
return out;
});