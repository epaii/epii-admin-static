define(["jquery","args"], function ($,Args) {
    return {
        init: function () {
             
            var upload1 = (uploads = $('[data-upload="1"]')) && uploads.length > 0;
            var upload2 = (uploads_pre = $('[data-upload-preview="1"]')) && uploads_pre.length > 0;
      
            if (upload1 || upload2) {
                  

                function ongettoken(){
                    if (upload1) {
                        require(['epii-upload'], function (epii_uploads) {
    
                            epii_uploads.init(uploads);
                        })
                    }
                    if (upload2) {
                        require(['epii-upload-preview'], function (epii_uploads_pre) {
    
                            epii_uploads_pre.init(uploads_pre);
                        })
                    }
                }

                if(Args.pluginsData.ws_upload_yun_api)
                {
                    EpiiAdmin.ajax(Args.pluginsData.ws_upload_yun_get_token,function(data){
                        var token = data.data.token;
                        if (uploads) {
                            uploads.each(function(){
                                if(!$(this).attr("data-url"))
                                $(this).attr("data-url" ,Args.pluginsData.ws_upload_yun_api+token)
                            });
                        }
                        if (uploads_pre) {
                            uploads_pre.each(function(){
                               if(!$(this).attr("data-url"))
                                $(this).attr("data-url" ,Args.pluginsData.ws_upload_yun_api+token)
                            });
                        }
                        ongettoken();
                    })
                }else{
                    ongettoken();
                }

               
            }
        }
    }
});