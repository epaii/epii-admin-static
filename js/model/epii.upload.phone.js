define(["jquery"], function ($) {
    var out = {};
    out.init = function (divs) {

        divs.each(function () {
            out.initOne(this);
        })
    };
    out.initOne = function (div) {

    };
    out.getFiles = function (options,ongetfiles) {
        require(["qrcode", "epii-websocket-p2p"], function (QRCode, WebSocketP2P) {
            var server_name = (new Date().getTime())+"_"+Math.random(1000,10000);
            var client = new WebSocketP2P("wss://websocket.wszx.cc:4897", "susong_ytj_" +server_name , {
                name: "手机端"
            });
            client.ready(function () {
                var has_connect = false;
                options.qrcode_img.style.display = "block";
                var qrcode = new QRCode(options.qrcode_img, {
                    text: "http://susong.web.wszx.cc/upload_h5_client.html?server_id="+server_name,
                    width: 250,
                    height: 250
                });
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
                    var urls = data.data.files.split(",");
                    urls.forEach(value => {
                        imgs.push({
                            url: options.file_pre + value,
                            path:value
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