define(["plupload", "jquery"], function (Plupload, $) {


    var out = [];

    // out.showFile=function(obj,file)
    // {
    //
    // };


    out.getFileIcon = function (file) {
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
    };


    out.init = function (buttons) {

        buttons.each(function () {
            out.initOne(this);
        })
    };
    out.list = [];
    out.initOne = function (that) {

        var d_config = {
            maxsize: "2048kb",
            mimetype: "jpg,gif,png,jpeg",
            url: (Args.pluginsData && Args.pluginsData.upload_url) ? Args.pluginsData.upload_url : ""

        };

        var that_jq = $(that);

        if (that_jq.attr("inited")) {
            return true;
        }
        that_jq.attr("inited", true);

        var browse_jq = null;
        if (that.browse_dom) {
            browse_jq = that.browse_dom;

        }
        if (!browse_jq) {
            var id = that_jq.prop("id");
            if (!id) {
                alert("All upload dom must has a id attr");
                return;
            }
            browse_jq = document.getElementById(id);
        }

        var url = that_jq.data("url");
        url = typeof url !== "undefined" ? url : d_config.url;
        if (!url) {
            alert("Must set a data-url attr");
            return;
        }
        var maxsize = that_jq.data("maxsize");
        var mimetype = that_jq.data("mimetype");
        var multipart = that_jq.data("multipart");
        var multiple = that_jq.data("multiple");


        var input_id = that_jq.data("input-id") ? that_jq.data("input-id") : "";

        var img_id = that_jq.data("img-id") ? that_jq.data("img-id") : "";

        var imgs_ul_id = that_jq.data("preview-id") ? that_jq.data("preview-id") : "";
        if (!imgs_ul_id)
            imgs_ul_id = that_jq.data("imgs-id") ? that_jq.data("imgs-id") : "";

        var imgs_ul_id_jquery = null;

        if (imgs_ul_id) {
            imgs_ul_id_jquery = $("#" + imgs_ul_id)
        } else if (that.preview_dom) {
            imgs_ul_id_jquery = $(that.preview_dom);
        }
        var img_style = $(that).data("preview-style") ? $(that).data("preview-style") : "";
        if (!img_style)
            img_style = $(that).data("img-style") ? $(that).data("img-style") : "";


        maxsize = typeof maxsize !== "undefined" ? maxsize : d_config.maxsize;

        mimetype = typeof mimetype !== "undefined" ? mimetype : d_config.mimetype;

        //是否支持批量上传
        multiple = typeof multiple !== "undefined" ? multiple : false;
        var mimetypeArr = [];
        //支持后缀和Mimetype格式,以,分隔
        if (mimetype && mimetype !== "*" && mimetype.indexOf("/") === -1) {
            var tempArr = mimetype.split(',');
            for (var i = 0; i < tempArr.length; i++) {
                mimetypeArr.push({title: "支持的文件", extensions: tempArr[i]});
            }
            mimetype = mimetypeArr;
        }


        var option = {
            runtimes: 'html5,flash,silverlight,html4',
            multi_selection: multiple, //是否允许多选批量上传
            browse_button: browse_jq, // 浏览按钮的ID
            //container: $(browse_jq).parent().get(0), //取按钮的上级元素
            flash_swf_url: Args.pluginsUrl + '/plupload/js/Moxie.swf',
            silverlight_xap_url: Args.pluginsUrl + '/plupload/js/Moxie.xap',
            filters: {
                max_file_size: maxsize,
                mime_types: mimetype
            },
            url: url,
            multipart_params: $.isArray(multipart) ? {} : multipart,
            init: {
                PostInit: function () {
                    //alert("PostInit");
                },

                FilesAdded: function (up, files) {

                    var browse_button = up.settings.browse_button;

                    $(browse_button).data("bakup-html", $(browse_button).html());
                    var button = up.settings.button;
                    var maxcount = $(button).data("maxcount");
                    var input_id = $(button).data("input-id") ? $(button).data("input-id") : "";
                    maxcount = typeof maxcount !== "undefined" ? maxcount : 0;

                    if (maxcount > 0 && input_id) {
                        var inputObj = $("#" + input_id);
                        if (maxcount > 0 && input_id) {
                            var inputObj = $("#" + input_id);
                            if (inputObj) {
                                var value = $.trim(inputObj.val());
                                var nums = value === '' ? 0 : value.split(/\,/).length;
                                var remains = maxcount - nums;
                                if (files.length > remains) {
                                    for (var i = 0; i < files.length; i++) {
                                        up.removeFile(files[i]);
                                    }
                                    alert('You can upload up to ' + remains + ' file');
                                    return false;
                                }
                            }
                        }
                    }
                    //添加后立即上传
                    setTimeout(function () {

                        up.start();
                    }, 1);
                },
                BeforeUpload: function (up, file) {
                    var button = up.settings.browse_button;
                    $(button).prop("disabled", true).html("<i class='fa fa-upload'></i> 即将上传");
                },
                UploadProgress: function (up, file) {


                    var browse_button = up.settings.browse_button;
                    $(browse_button).prop("disabled", true).html("<i class='fa fa-upload'></i> 上传中" + file.percent + "%");


                    var button = up.settings.button;
                    // Upload.events.onUploadProgress(up, file);
                    var onDomUploadSuccess = $(button).data("upload-progress");
                    if (onDomUploadSuccess && window[onDomUploadSuccess] && (typeof window[onDomUploadSuccess] == "function")) {
                        window[onDomUploadSuccess](up, file);
                    }
                },
                FileUploaded: function (up, file, info) {
                    var browse_button = up.settings.browse_button;
                    $(browse_button).prop("disabled", false).html($(browse_button).data("bakup-html"));



                    var button = up.settings.button;


                    var response = JSON.parse(info.response);

                    if (response.code - 0 == 0) {
                        alert(response.msg);
                        return;
                    }
                    var inputObj;
                    if (input_id) {
                        var urlArr = [];
                        inputObj = $("#" + input_id);
                        if ($(button).data("multiple") && inputObj.val() !== "") {
                            urlArr.push(inputObj.val());
                        }
                        urlArr.push(response.path);
                        inputObj.val(urlArr.join(",")).trigger("change");
                    }

                    if (img_id && !$(button).data("multiple")) {
                        var img = $("#" + img_id);
                        img.attr("src", response.url);
                        if (img_style)
                            img.attr("style", img_style);
                        img.show();

                    } else if (imgs_ul_id_jquery && $(button).data("multiple")) {

                        var name = response.url;
                        var icon = out.getFileIcon(name);


                        imgs_ul_id_jquery.css({"overflow": "auto"});
                        var file_div = $("<div class='epii-upload-files-div' ><img class='epii-upload-file-icon' layer-index='" + imgs_ul_id_jquery.find(".epii-upload-files-div").length + "' src='" + icon + "' style='" + img_style + "'></div>");


                        //var close = $("<img  class='epii-upload-file-close'  src='" + del + "'  >");
                        var close = $('<a  class="epii-upload-file-close" href="javascript:;"></a>');
                        close.click(
                            (function (input, val) {
                                return function () {

                                    if (input) {
                                        var val_real = input.val() + ",";
                                        val_real = val_real.replace(val + ",", "").replace(/,$/g, '');

                                        input.val(val_real).trigger("change");
                                    }
                                    $(this).parent().remove();
                                };

                            })(inputObj, response.path)
                        );
                        close.hide();
                        file_div.append(close);

                        file_div.mouseout(function () {
                            if (this.getElementsByClassName("epii-upload-file-close").length > 0) {
                                $(this).find(".epii-upload-file-close").hide();
                            }
                        });
                        file_div.mouseover(function () {
                            if (this.getElementsByClassName("epii-upload-file-close").length > 0) {
                                $(this).find(".epii-upload-file-close").show();
                            }
                        });

                        file_div.find(".epii-upload-file-icon").click(function () {

                            if (this.getElementsByClassName("epii-upload-file-close").length > 0) {
                                $(this).find(".epii-upload-file-close").remove();
                            }
                            //  imgs_ul_id_jquery.find(".epii-upload-file-close").hide();
                            window.top.layer.photos({
                                photos: imgs_ul_id_jquery,
                                closeBtn: 1,
                                anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                            });

                        });
                        imgs_ul_id_jquery.append(file_div);


                        imgs_ul_id_jquery.show();


                    }


                    var onDomUploadSuccess = $(button).data("upload-success");
                    if (onDomUploadSuccess && window[onDomUploadSuccess] && (typeof window[onDomUploadSuccess] == "function")) {
                        window[onDomUploadSuccess](up, response);
                    }


                },
                UploadComplete: function (up, files) {
                    var browse_button = up.settings.browse_button;
                    $(browse_button).prop("disabled", false).html($(browse_button).data("bakup-html"));


                    var button = up.settings.button;

                    var onDomUploadSuccess = $(button).data("upload-complete");
                    if (onDomUploadSuccess && window[onDomUploadSuccess] && (typeof window[onDomUploadSuccess] == "function")) {
                        window[onDomUploadSuccess](up, response ? response : null);
                    }
                },

                Error: function (up, err) {
                    var browse_button = up.settings.browse_button;
                    $(browse_button).prop("disabled", false).html($(browse_button).data("bakup-html"));

                    var button = up.settings.button;
                    var onDomUploadSuccess = $(button).data("upload-error");
                    if (onDomUploadSuccess && window[onDomUploadSuccess] && (typeof window[onDomUploadSuccess] == "function")) {
                        window[onDomUploadSuccess](up, err);
                    } else {
                        alert(err.msg);
                    }
                }
            },

            button: that
        };


        out.list[id] = new Plupload.Uploader(option);
        out.list[id].init();


    };


    return out;


});