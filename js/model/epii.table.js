/**
 * Created by mrren on 2018/6/30.
 */



define(['bootstrap-table', "jquery","args"], function (bTable, $,Args) {


    var defualt_table = null;

    function getTable(data) {
        var tableid = "1";
        if (typeof data == "string") {
            tableid = data;
        } else {
            tableid = data['tableId'];
        }
        return (tableid && tableid != "1") ? $("#" + tableid) : defualt_table;
    }



    function out(tables) {

        tables.each(function () {
            if (defualt_table === null) defualt_table = $(this);
            var on_load_success = $(this).data("on-load-success");
            $(this).bootstrapTable({
                jdom:$(this),
                method: 'POST',
                dataType: 'json',
                contentType: "application/x-www-form-urlencoded",
                locale: EpiiAdmin.getTrueValue($(this).data("locale"), 'zh-CN'),
                // search:true,
                idField: EpiiAdmin.getTrueValue($(this).data("id-field"), "id"),
                pagination: true,
                sidePagination: EpiiAdmin.getTrueValue($(this).data("side-pagination"), "server"),
                pageSize: EpiiAdmin.getTrueValue($(this).data("page-size"), 30),
                onLoadSuccess: function (data) {
                  if(on_load_success && window[on_load_success])
                  {
                     window[on_load_success].call(this,data)  
                  }
                },
                onResetView: function () {
                    if ((this.totalRows - 0 > 0) && (window.changeThisIframeHeight)) {
                        setTimeout(function () {

                            window.changeThisIframeHeight();
                        }, 10);
                    }


                }

            });
        });

        return out;
    }


    out.filedclick = function (json, fun, index) {
        window[fun](JSON.parse(json), index);
    };

    out.refreshTable = function (tableid) {
        getTable(tableid).bootstrapTable("refresh");
    };

    out.do = function (dom) {
        var data = $(dom).data();
        var run = data['do'];
        var table = getTable(data);
        var selectall = table.bootstrapTable('getSelections');

        var selectids = EpiiAdmin.tools.getColumn(selectall, table.bootstrapTable("getOptions").idField);
        //var selectids = EpiiAdmin.tools.getColumn(selectall, table.bootstrapTable("getOptions").idField);
        dom.table = table;
        if (out.do.hasOwnProperty(run)) {
            out.do[run].call(dom, selectids, selectall);
            return;
        }
       
        if (run && window.hasOwnProperty(run)) {
            window[run].call(dom, selectids, selectall);
            return;
        }

    };
    out.do.refresh = function (query) {
        if (query)
            this.table.bootstrapTable("refresh", {
                query: query
            });
        else
            this.table.bootstrapTable("refresh");
    };
    out.do.url = function (selectids) {
        var name = "selectids";
        if ($(this).data("getName")) {
            name = $(this).data("getName");
            this.urlArgs = name + "=" + selectids.join(",");
        } else {
            if (!$(this).attr("url")) {
                $(this).attr("url", $(this).attr("href") || $(this).attr("data-url"));
            }
            if ($(this).attr("href")) $(this).attr("href", EpiiAdmin.tools.replaceInData($(this).attr("url"), {ids: selectids}));
            if ($(this).attr("data-url")) $(this).attr("data-url", $(this).attr("href"));
        }


        EpiiAdmin.tag.a(this);
    };

    out.search = function (data, tableId) {
        var table = getTable(tableId);
        var offset = 0;
        table.bootstrapTable("refreshOptions", {
            queryParams: function (params) {
                var datapost = $.extend(params, data);
                if (offset == 0) {
                    datapost['offset'] = 0;
                    offset = 1;
                }
                return datapost;
            }
        });
        // table.bootstrapTable("refresh",{offset:0});

    };

    function formatter(value, row, index, field) {

        arguments[0]= typeof(value) === 'undefined'?EpiiAdmin.tools.replaceInData(this.field,row):value;

        return jqueryObject.apply(this, arguments).prop("outerHTML");


    }

    var jqueryObject = function (obj, row, index, field) {

        if (obj instanceof jQuery) {

            return obj;
        } else {
            var phptagname = row[filedName(field, "name")];
            var tagname = phptagname ? phptagname : (this["tagName"] ? this["tagName"] : "span");
            tagname = EpiiAdmin.tools.replaceInData(tagname, row);
            var tagstyle = this["tagStyle"] ? this["tagStyle"] : "";
            tagstyle = EpiiAdmin.tools.replaceInData(tagstyle, row);
            var tagattr = this["tagAttr"] ? this["tagAttr"] : "";
            tagattr = EpiiAdmin.tools.replaceInData(tagattr, row);
            var tagclass = this["tagClass"] ? this["tagClass"] : "";
            tagclass = EpiiAdmin.tools.replaceInData(tagclass, row);

            if (this.url) tagattr += " href='" + EpiiAdmin.tools.replaceInData(this.url, row) + "' ";
            if (this.pageTitle) tagattr += " data-title='" + EpiiAdmin.tools.replaceInData(this.pageTitle, row) + "' ";
            var colorstyle = null, bgcolorstyle = null;
            if (colorstyle = row[filedName(field, "color")]) {
                tagstyle += "; color:" + EpiiAdmin.tools.replaceInData(colorstyle, row) + ";"
            }
            if (bgcolorstyle = row[filedName(field, "bgColor")]) {
                tagstyle += "; background-color:" + EpiiAdmin.tools.replaceInData(bgcolorstyle, row) + ";"
            }

            var value = $('<' + tagname + '   class="text-align:center' + tagclass + '" style="' + tagstyle + '"  ' + tagattr + '>' + obj + '</' + tagname + '>');
            var filed_class, filed_style, fileld_attr;
            if (filed_class = row[filedName(field, "class")]) {
                value.addClass(filed_class);
            }


            if (filed_style = row[filedName(field, "style")]) {

                value.css(filed_style);
            }
            if (fileld_attr = row[filedName(field, "attr")]) {
                value.attr(fileld_attr);
            }

            if (this["click"]) {
                value.attr("onclick", "window.epii_table.filedclick('" + JSON.stringify(row) + "','" + this["click"] + "','" + index + "')");

            }


            return value;

        }
    };

    var filedName = function (filed, name) {
        return filed + "_" + name;
    };


    formatter.bgColor = function (value, row, index, field) {
        value = jqueryObject.apply(this, arguments);
        value.css({"backgroundColor": row[filedName(field, "bg_color")]});
        return value.prop("outerHTML");
    };
    formatter.color = function (value, row, index, field) {
        value = jqueryObject.apply(this, arguments);
        value.css({"color": row[filedName(field, "color")]});
        return value.prop("outerHTML");
    };
    formatter.span = function (value, row, index, field) {


        return formatter.apply(this, arguments);

    };



    formatter.__changeSwitch = function(url)
    {
        EpiiAdmin.confirm("确定要修改吗？",function(){
            EpiiAdmin.ajax(url);
        });

    }

    formatter.switch = function (value, row, index, field) {

        var witch_value=field?field:'switch_value';
        var  url = this.onChangeUrl?EpiiAdmin.tools.replaceInData(this.onChangeUrl, row):"";
        if(url.indexOf("?")>=0)
        {
            url = url+"&"+witch_value+"="+(1-value);
        }else{
            url = url+"?"+witch_value+"="+(1-value);
        }
        var onclickstr=this.onChangeUrl?"onclick='window.epiiFormatter.__changeSwitch(\""+url+"\")'":'';
        if (value - 0 === 0) {
            value = "<i class=\"fa fa-toggle-off\" aria-hidden=\"true\" "+onclickstr+" style='color: red;font-size: 30px' ></i>";
        } else {
            value = "<i class=\"fa fa-toggle-on\" aria-hidden=\"true\" "+onclickstr+"  style='color: green;font-size: 30px'></i>";
        }

        arguments[0] = value;
      

        return formatter.apply(this, arguments);


    };


    formatter.status =  formatter.switch ; 

    formatter.btns = function (value, row, index, field) {
        var btns_args = arguments;

        var btnmoban = {
            edit: '<a href="' + EpiiAdmin.tools.replaceInData(this.editUrl ? this.editUrl : "", row) + '" class="btn btn-outline-info btn-sm    btn-dialog " data-area="' + (this.area ? this.area : "100%,100%") + '"  title="' + EpiiAdmin.tools.replaceInData(this.editTitle ? this.editTitle : "", row) + '"><i class="fa fa-pencil"></i>编辑</a>',
            edit_addtab: '<a href="' + EpiiAdmin.tools.replaceInData(this.editUrl ? this.editUrl : "", row) + '" class="btn btn-outline-info btn-sm   btn-addtab " data-area="' + (this.area ? this.area : "100%,100%") + '"   title="' + EpiiAdmin.tools.replaceInData(this.editTitle ? this.editTitle : "", row) + '"><i class="fa fa-pencil"></i>编辑</a>',
            detail: '<a href="' + EpiiAdmin.tools.replaceInData(this.detailUrl ? this.detailUrl : "", row) + '" class="btn btn-outline-primary btn-sm  btn-dialog " data-area="' + (this.area ? this.area : "100%,100%") + '"   title="' + EpiiAdmin.tools.replaceInData(this.detailTitle ? this.detailTitle : "", row) + '"><i class="fa fa-list"></i>详情</a>',
            detail_addtab: '<a href="' + EpiiAdmin.tools.replaceInData(this.detailUrl ? this.detailUrl : "", row) + '" class="btn btn-outline-primary btn-sm   btn-addtab " title="' + EpiiAdmin.tools.replaceInData(this.detailTitle ? this.detailTitle : "", row) + '"><i class="fa fa-list"></i>详情</a>',
            del: '<a href="' + EpiiAdmin.tools.replaceInData(this.delUrl ? this.delUrl : "", row) + '" class="btn btn-outline-danger btn-sm   btn-confirm " data-ajax="1" data-on-ok="tag.a" data-msg="' + EpiiAdmin.tools.replaceInData(this.delMsg ? this.delMsg : "确定要删除吗？", row) + '"   data-title="' + EpiiAdmin.tools.replaceInData(this.delTitle ? this.delTitle : "删除提示", row) + '"><i class="fa fa-trash"></i>删除</a>',

        };

        var btns = this["btns"];
        if (btns) btns = btns.split(",");
        var out = "";
        btns.forEach(function (item) {
            if (btnmoban.hasOwnProperty(item)) {
                out += "   " + btnmoban[item];
            }
            if (window.hasOwnProperty(item)) {
                out += "   " + window[item].apply(this, btns_args);
            }
        });

        return out;

    };
    formatter.a = function (value, row, index, field) {

        this.tagName = "a";
        if (arguments[0] === undefined) {
            if (this.value)
                arguments[0] = EpiiAdmin.tools.replaceInData(this.value, row);
            else {
                // console.log(this);
                arguments[0] = EpiiAdmin.getTrueValue(this.title, this.pageTitle);
            }

        }
        return formatter.apply(this, arguments);
    };

    function btn(value, row, index, field) {

        this.tagClass += " btn";
        return formatter.a.apply(this, arguments);
    }

    formatter.a.addtab = btn.addtab = function (value, row, index, field) {
        this.tagClass += " btn-addtab";
        return formatter.btn.apply(this, arguments);
    };
    formatter.a.dialog = btn.dialog = function (value, row, index, field) {
        this.tagClass += " btn-dialog";
        this.tagAttr += " data-area='"+(this.area ? this.area : "100%,100%")+"'";
        return formatter.btn.apply(this, arguments);
    };
    formatter.a._blank = btn._blank = function (value, row, index, field) {
        this.tagAttr += " target='_blank' ";
        return formatter.btn.apply(this, arguments);
    };

    formatter.btn = btn;
    formatter.url = formatter.a;

    formatter.time =function (value, row, index, field) {

        return  this.timeFormat?dateFormat(value,this.timeFormat):dateFormat(value,'y-m-d');
    };
    formatter.time.year =function (value, row, index, field) {
        return  dateFormat(value,'yyyy')+'年';
    };
    formatter.time.day =function (value, row, index, field) {
        return  dateFormat(value,'y-m-d');
    };
    formatter.time.y= formatter.time.year;
    formatter.time.m =function (value, row, index, field) {
        return  dateFormat(value,'y年m月');
    };
    formatter.time.d = formatter.time.day;
    formatter.time.h =function (value, row, index, field) {
        return  dateFormat(value,'y年m月d日 h时');
    };
    formatter.time.i =function (value, row, index, field) {

        return  dateFormat(value,'y-m-d h:i');
    };
    formatter.time.s =function (value, row, index, field) {
        return  dateFormat(value,'y-m-d h:i:s');
    };
    formatter.img =function (value, row, index, field) {
            value=value.split(',')[0];
        return   "<a class=\"btn  btn-dialog\"   title=\"点击查看图片\"  data-area=\"60%,60%\" data-url=\""+value+"\"><img src='"+value+"' style='width:60px;height: 60px;'/></a>";
    };
    formatter.imgs =function (value, row, index, field) {
        value=value.replace(';',',')
        var valObj=value.split(',');
        var count=valObj.length;
        var size=60;
        var  h_w=size/count*1.;
        var  margin=size/count/5;
        var _html='';
        for(var i=0;i<count;i++){
            var img_val=valObj[i];
            _html+="<a class=\"btn  btn-dialog\"  style='margin: "+margin+"px' title=\"点击查看图片\"  data-area=\"60%,60%\" data-url=\""+img_val+"\"><img src='"+img_val+"' style='width:"+h_w+"px;height: "+h_w+"px;'/></a>"
        }
        return _html;
    };
     
    formatter.mapValue =function(value, row, index, field) {
        if(Args.pluginsData.epii_table_map_values){
            var mapkey = this["mapKey"]?this["mapKey"]:field;
            if(Args.pluginsData.epii_table_map_values[mapkey+"_color"]){
                row[field+"_color"] = Args.pluginsData.epii_table_map_values[mapkey+"_color"][value];
            }
             
            if(Args.pluginsData.epii_table_map_values[filedName(field,"bgColor")]){
                row[filedName(field,"bgColor")] = Args.pluginsData.epii_table_map_values[filedName(field,"bgColor")][value];
            }
            
            arguments[0] = Object.prototype.hasOwnProperty.call(Args.pluginsData.epii_table_map_values,mapkey)?Args.pluginsData.epii_table_map_values[mapkey][value]:value;
        }
        return formatter.apply(this, arguments);
 
    }
   
    out.formatter = out.epiiFormatter = formatter;
    window.epiiFormatter = formatter;
    window.epii_table = out;

    return out;

});


function dateFormat(date,fmt){
    date=new Date(date*1000);
    fmt=fmt?fmt.toLowerCase():'yyyy-mm-dd hh:ii:ss';
    var o = {
        "y+":date.getFullYear(),                    //年
        "m+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "i+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
    };

    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (k==='y+') ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}


