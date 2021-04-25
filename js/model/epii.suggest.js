/**
 * Created by mrren on 2018/8/24.
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery', 'bootstrap-suggest'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'), require('bootstrap-suggest'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($, bootstrapSuggest) {

    var out = {
        //使用案例 <div data-search=1 data-on-select="setvalue" data-input="item_value" data-input-text="item_value"  data-title-text="姓名"  data-url="?app=test@search_data&keyword=" ></div>
        init: function (selects) {
            selects.each(function () {
                var data = $(this).data();
                $(this).html('<div class="input-group"><input class="form-control" type="text"autocomplete="off"></div>');
                out.initByInput($(this).find("input").eq(0),data);
            });
        },
        initByInput:function(jInput,data){
        
            var jThat = jInput;
            var jPdata = data;
            var effectiveFieldsAlias = {};
            var effectiveFields = data["field"];
            if (effectiveFields) effectiveFields = effectiveFields.split(",")

            for (var index in data) {
                if (index.indexOf("title") == 0) {
                    effectiveFieldsAlias[index.substr("title".length).toLowerCase()] = data[index];
                }
            }
 
            jThat.after('<div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu dropdown-menu-right" role="menu"></ul></div>');
            var idField = EpiiAdmin.getTrueValue(data['idField'], "id");
            jThat.bsSuggest({
                allowNoKeyword: false, //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
                multiWord: true, //以分隔符号分割的多关键字支持
                separator: ",", //多关键字支持时的分隔符，默认为空格
                getDataMethod: "url", //获取数据的方式，总是从 URL 获取
                url: data['url'],
                /*优先从url ajax 请求 json 帮助数据，注意最后一个参数为关键字请求参数*/
                listAlign: "auto",
                idField: idField, //每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
                keyField: EpiiAdmin.getTrueValue(data['keyField'], "text"),
                // url 获取数据时，对数据的处理，作为 fnGetData 的回调函数
                fnProcessData: function (json) {
                    return {
                        value: json
                    };
                },
                effectiveFields: effectiveFields,
                showHeader: data['showHeader'] !== true,
                effectiveFieldsAlias: effectiveFieldsAlias //showHeader 时，header 别名
            }).on('onDataRequestSuccess', function (e, result) {
                // console.log('onDataRequestSuccess: ', result);
            }).on('onSetSelectValue', function (e, keyword, data) {

                jThat.attr("data-last-select-value", e.target.value);
                var inputs = [];

                if (jPdata["input"]) {
                    $("input[name='" +jPdata["input"] + "']").val(data[idField]);
                    inputs.push(jPdata["input"]);
                }
                for (var item in data) {

                    var input = "input" + item.substring(0, 1).toUpperCase() + item.substring(1);

                    if (jPdata[input]) {
                        $("input[name='" + jPdata[input] + "']").val(data[item]);
                        inputs.push(jPdata[input]);
                    }
                }
                jThat.attr("data-inputs", inputs.join(","));
                var callback = EpiiAdmin.tools.getFunction(null, jPdata, "onSelect", window);

                callback && callback.apply(this, arguments);
            }).on('onUnsetSelectValue', function () {
                //console.log("onUnsetSelectValue");
            }).on('onHideDropdown', function (e, data) {
                if (jThat.attr("data-last-select-value") != e.target.value) {
                    if (jThat.attr("data-inputs")) {
                        var inputs = jThat.attr("data-inputs").split(",");
                        for (var item in inputs) {
                            $("input[name='" + inputs[item] + "']").val("");
                        }
                    }

                }

            });
        }
    };
    return out;
});