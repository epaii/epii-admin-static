define(["jquery"], function ($) {
    var out = {};
    out.init = function (divs) {

        divs.each(function () {
            out.initOne(this);
        })
    };
    out.initOne = function (div) {

    };
    out.getFiles = function (options, ongetfiles) {
        require(["qrcode", "epii-websocket-p2p"], function (QRCode, WebSocketP2P) {
            var server_name = (new Date().getTime()) + "_" + Math.random(1000, 10000);
            console.log(server_name)
            var client = new WebSocketP2P(options.ws, options.server_name + server_name, {
                name: "服务端"
            });

            function getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            }
            client.ready(function () {
                var has_connect = false;
              
                var text = options.client_url + "&server_id=" + server_name + "&file_types=" + options.file_types + "&sv=" + getCookie("PHPSESSID");
                console.log(text);
                var qrcode = new QRCode(options.qrcode_img, {
                    text:text,
                    width: 400,
                    height: 400,
                    correctLevel: 3
                });

                options.oninit();
               
                setTimeout(() => {
                    window.top.layer.photos({
                        photos: options.qrcode_img, 
                    });
                }, 500);
                client.regServer("onconnect", function (data, callback) {
                    if (has_connect) {
                        callback();
                        return;
                    }
                    has_connect = true
                    callback();
                });
                client.regServer("onfile", function (data, callback) {


                    var imgs = [];
                    var paths = data.data.files.split(",");
                    var urls = data.data.urls.split(",");
                    paths.forEach( (value,index) => {
                        imgs.push({
                            url: urls[index],
                            path: value
                        })
                    });
                    ongetfiles(imgs);
                    callback();
                });

            });


        });
    }
    return out;
});