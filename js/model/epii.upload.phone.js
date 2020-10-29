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
            var client = new WebSocketP2P(options.ws, options.server_name +server_name , {
                name: "服务端"
            });
            client.ready(function () {
                var has_connect = false;
                options.qrcode_img.style.display = "block";
                var qrcode = new QRCode(options.qrcode_img, {
                    text: options.client_url+"&server_id="+server_name,
                    width: 250,
                    height: 250
                });
                options.oninit();
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