/***********************************************************************************
 * http请求
 ************************************************************************************/
// var serverDomain = "https://www.meihaoyunyu.com/live-java/";
// var serverDomain = "https://test.maamcare.net/live-java-test/";

var serverDomain = "http://10.0.0.191:8082/";
function request(object) {
    if (!serverDomain) {
        console.log('请设置serverDomain1');
        object.fail || object.fail({errCode: -1, errMsg: "serverDomain为空, 请调用init接口进行设置"});
        return;
    }
    httpRequest({
        url: serverDomain + object.url,
        data: object.data || {},
        method: object.method || "POST",
        success: object.success || function () {
        },
        fail: object.fail || function () {
        },
        complete: object.complete || function () {
        },
        contentType: object.contentType || "application/json;charset=utf-8",
    })
}

function strateRequest(object) {
    if (!BIZ_URL) {
        console.log('请设置serverDomain1');
        object.fail || object.fail({errCode: -1, errMsg: "serverDomain为空, 请调用init接口进行设置"});
        return;
    }
    httpRequest({
        url: BIZ_URL + object.url,
        data: object.data || {},
        method: object.method || "POST",
        success: object.success || function () {
        },
        fail: object.fail || function () {
        },
        complete: object.complete || function () {
        },
        contentType: object.contentType || "application/json;charset=utf-8",
        accept: object.accept || '',
    })
}
function httpRequest(object) {
        /*if (isIE9Version()) {
            httpXDRRequest(object);
        } else */
        {
            object = object || {};
            object.method = (object.method || "GET").toUpperCase();
            object.dataType = "json";
            var params = formatParams(object.data);

            //创建 - 非IE6 - 第一步
            if (window.XMLHttpRequest) {
                var xhr = new XMLHttpRequest();
            } else { //IE6及其以下版本浏览器
                var xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }

            var timeout_time = typeof(object.timeout) == "undefined" ? 10000 : object.timeout;
            var timeout = false;
            var timer = setTimeout(function () {
                timeout = true;
                xhr.abort();
            }, timeout_time);
            //接收 - 第三步
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (timeout) {
                        object.fail && object.fail({code: -1, msg: "请求超时"});
                    }
                    var status = xhr.status;
                    clearTimeout(timer);
                    if (status >= 200 && status < 300) {
                        var jsonObj = JSON.parse(xhr.responseText);
                        object.success && object.success({status: status, data: jsonObj});
                    } else {
                        object.fail && object.fail({code: status, msg: xhr.message});
                    }

                    object.complete && object.complete();
                }
            }

            //连接 和 发送 - 第二步
            if (object.method == "GET") {
                xhr.open("GET", object.url + "?" + params, true);
                xhr.send(null);
            } else if (object.method == "POST") {
                xhr.open("POST", object.url, true);
                //设置表单提交时的内容类型
                xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
                // xhr.setRequestHeader("Content-Type", object.contentType);
                // var str=object.contentType;
                // if(str.includes('application/x-www-form-urlencoded')){
                //     xhr.send(params);
                // }else{
                //     xhr.send(JSON.stringify(object.data));
                // }
                xhr.send(JSON.stringify(object.data));

            } else if (object.method == "PHPPOST") {
                xhr.open("POST", object.url, true);
                xhr.setRequestHeader("Content-Type", object.contentType);
                xhr.send(params);

            }
        }
    }

//格式化参数
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
    }

//IE8~9下的跨域请求兼容，xhr在IE9不支持跨域。
    function httpXDRRequest(object) {
        object = object || {};
        object.method = (object.method || "GET").toUpperCase();
        object.dataType = "json";
        var params = formatXDRParams(object.data);

        console.log("请求信息1：");
        //创建 - 非IE6 - 第一步
        var xdr = new XDomainRequest();
        console.log("请求信息2：");
        xdr.timeout = typeof (object.timeout) == "undefined" ? 10000 : object.timeout;
        var timeout = false;
        xdr.ontimeout = function () {
            timeout = true;
            xdr.abort();
            console.log("ontimeout", xdr);
        };
        xdr.onprogress = function () {
        };
        xdr.onerror = function () {
            console.log("onerror", JSON.stringify(xdr));
        };
        //接收 - 第三步
        xdr.onload = function () {
            //alert(xdr.responseText);
            var status = xdr.status;
            var jsonObj = JSON.parse(xdr.responseText);
            object.success && object.success({status: 200, data: jsonObj});
            object.complete && object.complete();
        }

        console.log("请求信息3：");
        //连接 和 发送 - 第二步
        if (object.method == "GET") {
            xdr.open("GET", object.url + "?" + params, true);
            xdr.send(null);
        } else if (object.method == "POST") {
            // xdr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            console.log("请求信息4：" + object.url);
            xdr.open("POST", object.url, true);
            //设置表单提交时的内容类型
            console.log("请求信息：", params);
            xdr.send(params);
        }
    }

//格式化参数
    function formatXDRParams(data) {
        var jsonStrRet;
        jsonStrRet = "{";
        for (var name in data) {
            if (typeof (data[name]) == typeof ("123")) {
                jsonStrRet += "\"" + name + "\"" + ":" + "\"" + data[name] + "\",";
            }
            else {
                jsonStrRet += "\"" + name + "\"" + ":" + data[name] + ",";
            }
        }
        jsonStrRet = jsonStrRet.substring(0, jsonStrRet.lastIndexOf(','));
        jsonStrRet += "}";
        return jsonStrRet;
    }

    /**
     * 检测是否是ie9
     *
     */
    function isIE9Version() {
        var browser = navigator.appName
        var b_version = navigator.appVersion
        var version = b_version.split(";");
        var trim_Version = version[1].replace(/[ ]/g, "");
        if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
            return true;
        }
        return false;
    }




