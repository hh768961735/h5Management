//var BASE_URL = "https://www.meihaoyunyu.com/";
// var BASE_URL = "https://www.meihaoyunyu.com/live-java/";
// var BASE_URL = "https://test.maamcare.net/live-java-test";
var BASE_URL = "http://10.0.0.191:8082";
//组织机构服务
var BIZ_URLA = "https://test.maamcare.net/maamcare-org/";
//引用手机端的接口（攻略）
// var BIZ_URL = "https://test.maamcare.net/obstetrical_tool_php/";
var BIZ_URL = "http://10.0.0.191/obstetrical_tool_php/";

// var BASE_URL = "http://10.0.0.191:8083/";

function getParam(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var quniuImgHead = "https://qn.meihaoyunyu.com/";
function fileUpload(file, _complete, _error){
    var key = null;
    $.ajax({
        url: BASE_URL+"lvb/file/getToken", success: function (res) {
            var token = res.data;
            var config = {
                useCdnDomain: true,
                disableStatisticsReport: false,
                retryCount: 5,
                region: qiniu.region.z0
            };
            var putExtra = {
                fname: "",
                params: {},
                mimeType: null
            };
            // putExtra.params["x:name"] = key.split(".")[0];
            // 设置next,error,complete对应的操作，分别处理相应的进度信息，错误信息，以及完成后的操作
            var error = _error != null ? _error : function (err) {
                alert("上传出错");
            };
            var complete = _complete != null ? _complete : function (res) {
                alert("图片上传成功，key:" + res.key)
            };

            var next = function (response) {
                var chunks = response.chunks || [];
                var total = response.total;
            };
            var subObject = {
                next: next,
                error: error,
                complete: complete
            };
            var subscription;
            // 调用sdk上传接口获得相应的observable，控制上传和暂停
            observable = qiniu.upload(file, key, token, putExtra, config);
            subscription = observable.subscribe(subObject);
        }
    })
}