var baseUrl = 'https://api.dobell.me/registration';
var reg = /^1[345789]\d{9}$/;
function GetRequest() {
    var url = decodeURI(location.search);
    // var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);//字符串分割，存入对象
        }
    }
    return theRequest;
}
var param = GetRequest();

// 用来判断对象是否为空
var arr = Object.keys(param);
// console.log(param)

// 第一次进入是否带有openId
if(param.openId){
    if(!localStorage.state){
        const phoneData = {
            openId: param.openId,
        }
        $.ajax({
            method: 'POST',
            url:baseUrl+'/business/getPhoneByOpenId',
            async:false,
            cache:false,
            data:phoneData,
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                ajaxTimeoutTest.abort();　　　　　
                alert("请求超时");　　　　
                }　　
            },
            success:function (data) {
                if(data.data !== null){
                    // console.log(param.openId)
                    // console.log(data.data)
                    sessionStorage.fromPhone = data.data
                    // console.log(sessionStorage.fromPhone)
                    $('#r-redpack').fadeIn(2000).css({
                        display: 'block',
                    })
                    $('#redbutton').click(function () {
                        var redPhone = $('#red-phone').val()
                        if(reg.test(redPhone)){
                        const redPhoneData = {
                            openId: param.openId,
                            phone:redPhone,
                        }
                        $.ajax({
                            method: 'POST',
                            url:baseUrl+'/business/addPacket',
                            async:true,
                            cache:false,
                            data:redPhoneData,
                            dataType: "json",
                            timeout: 2000,
                            complete: function (XMLHttpRequest, status) {
                                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                                if (status == 'timeout') {
                                ajaxTimeoutTest.abort();　　　　　
                                alert("请求超时");　　　　
                                }　　
                            },
                            success:function (data) {
                                $('#r-redpack').css({
                                    display: 'none',
                                })
                                if(data.code == -1){
                                    alert(data.message)
                                }else{
                                    alert('红包领取成功')
                                }
                            },
                            error: function () {
                                alert('获取数据错误！')
                            }
                        })
                    }else{
                        // alert('号码格式出错！')
                        $.toast.prototype.defaults.duration = 1000;
                        $.toast("请输入正确的手机号", "forbidden");
                    }
                    })
                }else{
                    alert('错误的分享链接')
                    // console.log('这个openId是错误的')
                }
            },
            error: function () {
                alert('获取数据错误！')
            }
        })
    }
    localStorage.clear()
    // 点击黑白处隐藏
    $('.box').click(function () {window.location.reload()
        window.location.reload()
        localStorage.state = 1;
    })
    
    // 点击报名按钮
    $('.btn1').click(function(){
        signup();
    })
    // 报名
    var signup = function(){
        $('.signUp').fadeIn('slow').css({
            display:'block',
        });
        // 获取班型
        $.ajax({
            method: 'GET',
            url:baseUrl+'/business/getClassList',
            async:true,
            cache:false,
            data:'',
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                ajaxTimeoutTest.abort();　　　　　
                alert("请求超时");　　　　
                }　　
            },
            success: function(data){
                // console.log(data)
                const class0 = data.data[0].licenseType + ' 手动 ' + data.data[0].classType
                const class1 = data.data[1].licenseType + ' 手动 ' + data.data[1].classType
                const class2 = data.data[2].licenseType + ' 手动 ' + data.data[2].classType
                const class3 = data.data[3].licenseType + ' 自动 ' + data.data[3].classType
                $('#schclass1').text(class0)
                $('#schclass2').text(class1)
                $('#schclass3').text(class2)
                $('#schclass4').text(class3)
                var selectedText =$("#select_id").find("option:selected").text();
                var selectedVal =$("#select_id").find("option:selected").val();
                $('#classmessage').text(selectedText);
                $('#price').text(data.data[selectedVal].price);
                $('#exetime').text(data.data[selectedVal].teachTime)
                $("#select_id").change(function(){
                    var checkText = $("#select_id").find("option:selected").text();
                    var checkVal = $("#select_id").find("option:selected").val();
                    $('#classmessage').text(checkText);
                    $('#price').text(data.data[checkVal].price);
                    $('#exetime').text(data.data[checkVal].teachTime)
                })
            }, //成功执行的方法
            error: function(){
                alert("加载失败");
            }, //失败时执行的方法
        });
        
        // 失焦判断手机号码来匹配红包
        $('#phone').blur(function(){
            $('#select-redpack').empty();
            var phoneNumber = $('#phone').val();
            if(reg.test(phoneNumber)){
                var args = {
                    phone:phoneNumber
                }
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/getPacketList',
                    async:false,
                    cache:false,
                    data:args,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                        ajaxTimeoutTest.abort();　　　　　
                        alert("请求超时");　　　　
                        }　　
                    },
                    success:function (data) {
                        localStorage.redpacklength = data.data.length;
                        var pacID = [];
                        for(let i = 0;i<data.data.length;i++){
                            pacID.push(data.data[i].id)
                        }
                        localStorage.localPacID = pacID.join(',');
                    },
                    error: function () {
                        alert('获取红包数据错误！')
                    }
                    })
                    if(localStorage.redpacklength>0){
                        for(let i=0;i<localStorage.redpacklength;i++){
                            $('#select-redpack').append("<option value="+ (i+1) +">分享立减红包50元</option>")
                        }
                    }else{
                        $('#select-redpack').append("<option value='0'>暂无红包信息</option>")
                    }
                
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
        // 点击提交按钮
        $('#signUpBtn').click(function () {
            var val = $('#phone').val();
            var realname = $('#realName').val();
            var idcard = $('#idCard').val();
            if(val&&realname&&idcard){
                var ClassId = parseInt($("#select_id").find("option:selected").val()) + 1;
                var Phone = val;
                var OpenId;
                var PacketId;
                var RealName = realname;
                var IdCode = idcard;
                if(sessionStorage.fromPhone){
                    OpenId = param.openId;
                }else{
                    OpenId = '';
                }
                if(parseInt($("#select-redpack").find("option:selected").val()) == 0 ){
                    PacketId = '';
                }else{
                    var num = parseInt($("#select-redpack").find("option:selected").val()) - 1;
                    var locPacId = localStorage.localPacID.split(',')
                    PacketId = parseInt(locPacId[num]);
                }
                if(IdCodeValid(IdCode).pass == true){
                    signUpMessage(ClassId,Phone,OpenId,PacketId,RealName,IdCode);
                }else{
                    $.toast("身份证信息填写错误！", "forbidden");
                }
            }else{
                $.toast("请完善报名信息！", "forbidden");
            }
        })
    }

    // 报名传信息
    var signUpMessage = function(ClassId,Phone,OpenId,PacketId,RealName,IdCode){
        var order = {
            classId:ClassId,
            phone:Phone,
            openId:OpenId,
            packetId:PacketId,
            realName:RealName,
            idCode:IdCode,
        }
        $.ajax({
            method: 'POST',
            url:baseUrl+'/business/addOrder',
            async:true,
            cache:false,
            data:order,
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                ajaxTimeoutTest.abort();　　　　　
                alert("请求超时");　　　　
                }　　
            },
            success:function (data) {
                if(data.message == null){
                    $('.signUp').css({
                        display:'none',
                        });
                    $('.signUpSuccess').fadeIn('slow').css({
                        display:'block'
                    });
                    getOrder(Phone);
                }else{
                    alert(data.message)
                    // console.(123)
                }
            },
            error: function () {
                alert('报名失败，请重试！')
            }
    })
    }

    // 根据手机号获取订单
    var getOrder = function (Phone) {
        var orderData = {
            phone:Phone
        }
        $.ajax({
            method: 'POST',
            url:baseUrl+'/business/getOrderByPhone',
            async:true,
            cache:false,
            data:orderData,
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                ajaxTimeoutTest.abort();　　　　　
                alert("请求超时");　　　　
                }　　
            },
            success:function (data) {
                var orderNo = data.data.orderNo;
                var price = data.data.price;
                var payPrice = data.data.payPrice;
                var class_id = data.data.classId;
                var teachTime ;
                if(class_id == 1){
                    teachTime = '驾校统一安排训练时间（8：00到17:00）';
                }else if(class_id == 2){
                    teachTime = '自主预约练车（8:00到21:00）';
                }else if(class_id == 3){
                    teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                }else if(class_id== 4){
                    teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                }
                if(data.data.packetId == null){
                    $('.rbox2').css({
                        display:'block',
                    })
                    $('.rbox1').css({
                        display:'none',
                    })
                }else{
                    $('.rbox2').css({
                        display:'none',
                    })
                    $('.rbox1').css({
                        display:'block',
                    })
                }
                localStorage.orderNo = orderNo;
                localStorage.price = price;
                localStorage.payPrice = payPrice;
                localStorage.teachTime = teachTime;
                localStorage.packetId = data.data.packetId;
                $('#price1').text(price);
                $('#allprice').text(payPrice);
                $('#exetime1').text(teachTime);
            },
            error: function () {
                alert('获取支付信息错误！')
            }
        })
    }

    // 点击支付调动接口
    $('#paybutton').click(function () {
        payMessage();
    })

    // 支付信息
    var payMessage = function () {
    location.href = baseUrl+'/view/pay' + '?orderNo=' + localStorage.orderNo
    }

    // 分享
    $('.shareButton').click(function () {
        sharePacket();
    })
    // 封装的分享函数
    var sharePacket = function(){
        $('#shareRedPacket').css({
            display:'block',
        })
        $('.savebutton').click(function(){
            var sharePhoneNumer = $('#sharePhone').val();
            if(reg.test(sharePhoneNumer)){
                // 根据号码生成openId
                var userData = {
                    phone: sharePhoneNumer,
                }
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/addUser',
                    async:true,
                    cache:false,
                    data:userData,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                        ajaxTimeoutTest.abort();　　　　　
                        alert("请求超时");　　　　
                        }　　
                    },
                    success:function (data) {
                        var shareUrl = 'https://api.dobell.me/business/index.html?openId=' + data.data.openId
                        // 生成二维码
                        // $(document).ready(function() {
                            $("#qrcodeCanvas").qrcode({
                                render : "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
                                text : shareUrl,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
                                width : "125.5",               //二维码的宽度
                                height : "125.5",              //二维码的高度
                                background : "#ffffff",       //二维码的后景色
                                foreground : "#000000",        //二维码的前景色
                                src: './libs/images/logo.png'             //二维码中间的图片
                                });
                            // });
                            //从canvas中提取图片image
                            function convertCanvasToImage(canvas) {
                                //新Image对象，可以理解为DOM
                                var image = new Image();
                                // canvas.toDataURL 返回的是一串Base64编码的URL
                                // 指定格式PNG
                                image.src = canvas.toDataURL("image/png");
                                return image;
                            }
                            var mycanvas1=document.getElementsByTagName('canvas')[0];
                            //将转换后的img标签插入到html中
                            var img = convertCanvasToImage(mycanvas1);
                            $('#cesi').append(img);//imgDiv表示你要插入的容器id
                            $('#cesi').find('img').attr('id','cesiPic');
                            var res = $('#cesi').find('img')[0].src;
                            $('#cesi').ready(function(){
                                mergeImages();
                            })
                            $('.fPic').find('img').attr('id','baocunImg');
                            $('.noneButton').click(function(){
                                $('.tipMessage').css({
                                    display:'none',
                                })
                            })
                            // $('#tegg').append(img);//imgDiv表示你要插入的容器id
                            $('#tegg').css({
                                display:'block',
                            })
                            $('#closeImg').click(function () {
                                window.location.reload()
                            })
                    },
                    error: function () {
                        alert('分享错误！')
                    }
            })

            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
    }

    // 封装我的订单
    var myOrder = function () {
        $('.myorder').fadeIn('slow').css({
            display:'block'
        });
        $('#ordphone').blur(function(){
        var orderPhoneNumber = $('#ordphone').val();
        if(reg.test(orderPhoneNumber)){
            localStorage.orderPhoneNumber = orderPhoneNumber;
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
        $('#searchorder').click(function () {
            // console.log(localStorage.orderPhoneNumber)
            if(localStorage.orderPhoneNumber){
                var orderData1 = {
                phone:localStorage.orderPhoneNumber
                }
                $.ajax({
                method: 'POST',
                url:baseUrl+'/business/getOrderByPhone',
                async:true,
                cache:false,
                data:orderData1,
                dataType: "json",
                timeout: 2000,
                complete: function (XMLHttpRequest, status) {
                    // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                    if (status == 'timeout') {
                            ajaxTimeoutTest.abort();　　　　　
                            alert("请求超时");　　　　
                            }　　
                        },
                success:function (data) {
                        if(data.data){
                            var tradeStatus = data.data.tradeStatus;
                            var orderNo = data.data.orderNo;
                            var price = data.data.price;
                            var payPrice = data.data.payPrice;
                            var class_id = data.data.classId;
                            // console.log(class_id)
                            var teachTime ;
                            if(class_id == 1){
                                teachTime = '驾校统一安排训练时间（8：00到17:00）';
                            }else if(class_id == 2){
                                teachTime = '自主预约练车（8:00到21:00）';
                            }else if(class_id == 3){
                                teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                            }else if(class_id== 4){
                                teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                            }
                            localStorage.orderNo = orderNo;
                            localStorage.price = price;
                            localStorage.payPrice = payPrice;
                            localStorage.teachTime = teachTime;
                            localStorage.packetId = data.data.packetId;
                            if(data.data.isDeleted == 0 && tradeStatus == 1 ){
                                if(data.data.packetId == null){
                                    $('.rbox2').css({
                                        display:'block',
                                    })
                                    $('.rbox1').css({
                                        display:'none',
                                    })
                                }else{
                                    $('.rbox2').css({
                                        display:'none',
                                    })
                                    $('.rbox1').css({
                                        display:'block',
                                    })
                                }
                                $('#price1').text(price);
                                $('#allprice').text(payPrice);
                                $('#exetime1').text(teachTime);
                                $('.myorder').css({
                                    display:'none',
                                });
                                $('.signUpSuccess').fadeIn('slow').css({
                                    display:'block',
                                });
                                $('#cancleorder').css({
                                    display:'block',
                                })
                                // 取消订单
                                cancleOrder(data.data.id);
                            }else if(data.data.isDeleted == 0 && tradeStatus == 2 ){
                                if(data.data.packetId == null){
                                    $('.rbox2').css({
                                        display:'block',
                                    })
                                    $('.rbox1').css({
                                        display:'none',
                                    })
                                }else{
                                    $('.rbox2').css({
                                        display:'none',
                                    })
                                    $('.rbox1').css({
                                        display:'block',
                                    })
                                }
                                $('#price1').text(price);
                                $('#allprice').text(payPrice);
                                $('#exetime1').text(teachTime);
                                $('#sucMessage').text('已支付');
                                $('.myorder').css({
                                    display:'none',
                                });
                                $('#paybutton').css({
                                    display:'none',
                                })
                                $('.signUpSuccess').fadeIn('slow').css({
                                    display:'block',
                                });
                            }else{
                                $.toast("未查到用户订单", "cancel");
                            }
                            }else{
                                $.toast("未查到用户订单", "cancel");
                            }
                },
                error: function () {
                    alert('获取支付信息错误！')
                }
            })
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("请输入手机号", "cancel");
            }
        })
    }

    // 封装取消订单函数
    var cancleOrder = function (ID) {
        var cancleData = {
            id:ID,
            isDeleted:1,
            tradeStatus:3,
        }
        $('#cancleorder').click(function () {
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/updateOrder',
                    async:true,
                    cache:false,
                    data:cancleData,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                                ajaxTimeoutTest.abort();　　　　　
                                alert("请求超时");　　　　
                                }　　
                            },
                    success:function (data) {
                        // $.toast.prototype.defaults.duration = 2000
                        // $.toast("成功取消订单", "success");
                        alert("成功取消订单")
                        window.location.reload()
                    },
                    error: function () {
                        alert('获取支付信息错误！')
                    }
                })
        })
    }


    // 封装分享记录查询
    var shareRecord = function(){
        $('#sharerecord').css({
            display:'block',
        })
        $('#recordButton').click(function(){
            var shrPhone = $('#shrphone').val()
            var shareRecordData = {
                phone:shrPhone,
            }
            if(reg.test(shrPhone)){
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/addUser',
                    async:true,
                    cache:false,
                    data:shareRecordData,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                                ajaxTimeoutTest.abort();　　　　　
                                alert("请求超时");　　　　
                                }　　
                            },
                    success:function (data) {
                            var shareId = data.data.openId;
                            lookforRecord(shareId);
                    },
                    error: function () {
                        alert('获取支付信息错误！')
                    }
                })
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
    }

    var lookforRecord = function (id) {
        var lookforData = {
            openId: id
        }
        $.ajax({
            method: 'POST',
            url:baseUrl+'/business/getMyRecommendList',
            async:true,
            cache:false,
            data:lookforData,
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                        ajaxTimeoutTest.abort();　　　　　
                        alert("请求超时");　　　　
                        }　　
                    },
            success:function (data) {
                if(data.data.length>0){
                    $("#sharerecord").css({
                        display:'none',
                    })
                    $('#sharelist').css({
                        display:'block',
                    })
                    var stateMessage;
                    for(let i = 0;i < data.data.length;i++){
                        if(data.data[i].tradeStatus == 1){
                            stateMessage = '未支付';
                        }else if(data.data[i].tradeStatus == 2){
                            stateMessage = '已支付';
                        }else if(data.data[i].tradeStatus == 3){
                            stateMessage = '已取消';
                        }
                        $('#record').append("<div class='weui-cell'>"+ data.data[i].phone + '(' + stateMessage + ')' +"</div>")
                    }
                }else{
                    alert('暂无分享记录')
                    window.location.reload();
                }
            },
            error: function () {
                alert('获取支付信息错误！')
            }
        })
    }

    // 身份证验证
    var IdCodeValid = function(code){  
        //身份证号合法性验证  
        //支持15位和18位身份证号  
        //支持地址编码、出生日期、校验位验证  
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};  
        var row={
            'pass':true,
            'msg':'验证成功'
        };
        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)){  
            row={
                'pass':false,
                'msg':'身份证号格式错误'
            };
        }else if(!city[code.substr(0,2)]){
            row={
                'pass':false,
                'msg':'身份证号地址编码错误'
            };
        }else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if(parity[sum % 11] != code[17].toUpperCase()){
                    row={
                        'pass':false,
                        'msg':'身份证号校验位错误'  
                    };
                }
            }
        }
        return row;
    }
}else{
    localStorage.clear()
    // 点击黑白处隐藏
    $('.box').click(function () {window.location.reload()
        window.location.reload()
    })

    // 点击报名按钮
    $('.btn1').click(function(){
        signup();
    })
    // 报名
    var signup = function(){
        $('.signUp').fadeIn('slow').css({
            display:'block',
        });
        // 获取班型
        $.ajax({
            method: 'GET',
            url:baseUrl+'/business/getClassList',
            async:true,
            cache:false,
            data:'',
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                ajaxTimeoutTest.abort();　　　　　
                alert("请求超时");　　　　
                }　　
            },
            success: function(data){
                const class0 = data.data[0].licenseType + ' 手动 ' + data.data[0].classType
                const class1 = data.data[1].licenseType + ' 手动 ' + data.data[1].classType
                const class2 = data.data[2].licenseType + ' 手动 ' + data.data[2].classType
                const class3 = data.data[3].licenseType + ' 自动 ' + data.data[3].classType
                $('#schclass1').text(class0)
                $('#schclass2').text(class1)
                $('#schclass3').text(class2)
                $('#schclass4').text(class3)
                var selectedText =$("#select_id").find("option:selected").text();
                var selectedVal =$("#select_id").find("option:selected").val();
                $('#classmessage').text(selectedText);
                $('#price').text(data.data[selectedVal].price);
                $('#exetime').text(data.data[selectedVal].teachTime)
                $("#select_id").change(function(){
                    var checkText = $("#select_id").find("option:selected").text();
                    var checkVal = $("#select_id").find("option:selected").val();
                    $('#classmessage').text(checkText);
                    $('#price').text(data.data[checkVal].price);
                    $('#exetime').text(data.data[checkVal].teachTime)
                })
            }, //成功执行的方法
            error: function(){
                alert("加载失败");
            }, //失败时执行的方法
        });
        
        // 失焦判断手机号码来匹配红包
        $('#phone').blur(function(){
            $('#select-redpack').empty();
            var phoneNumber = $('#phone').val();
            if(reg.test(phoneNumber)){
                var args = {
                    phone:phoneNumber
                }
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/getPacketList',
                    async:false,
                    cache:false,
                    data:args,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                        ajaxTimeoutTest.abort();　　　　　
                        alert("请求超时");　　　　
                        }　　
                    },
                    success:function (data) {
                        localStorage.redpacklength = data.data.length;
                        var pacID = [];
                        for(let i = 0;i<data.data.length;i++){
                            pacID.push(data.data[i].id)
                        }
                        localStorage.localPacID = pacID.join(',');
                    },
                    error: function () {
                        alert('获取红包数据错误！')
                    }
                    })
                    if(localStorage.redpacklength>0){
                        for(let i=0;i<localStorage.redpacklength;i++){
                            $('#select-redpack').append("<option value="+ (i+1) +">分享立减红包50元</option>")
                        }
                    }else{
                        $('#select-redpack').append("<option value='0'>暂无红包信息</option>")
                    }
                
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
        // 点击提交按钮
        $('#signUpBtn').click(function () {
            var val = $('#phone').val();
            var realname = $('#realName').val();
            var idcard = $('#idCard').val();
            if(val&&realname&&idcard){
                var ClassId = parseInt($("#select_id").find("option:selected").val()) + 1;
                var Phone = val;
                var OpenId;
                var PacketId;
                var RealName = realname;
                var IdCode = idcard;
                if(sessionStorage.fromPhone){
                    OpenId = param.openId;
                }else{
                    OpenId = '';
                }
                if(parseInt($("#select-redpack").find("option:selected").val()) == 0 ){
                    PacketId = '';
                }else{
                    var num = parseInt($("#select-redpack").find("option:selected").val()) - 1;
                    var locPacId = localStorage.localPacID.split(',')
                    PacketId = parseInt(locPacId[num]);
                }
                // console.log(ClassId)
                // console.log(PacketId)
                // console.log(RealName)
                // console.log(IdCode)
                // console.log(IdCodeValid(IdCode))
                // console.log(IdCodeValid(IdCode).pass)
                if(IdCodeValid(IdCode).pass == true){
                    signUpMessage(ClassId,Phone,OpenId,PacketId,RealName,IdCode);
                }else{
                    $.toast("身份证信息填写错误！", "forbidden");
                }
            }else{
                $.toast("请完善报名信息！", "forbidden");
            }
        })
    }

    // 报名传信息
    var signUpMessage = function(ClassId,Phone,OpenId,PacketId,RealName,IdCode){
        var order = {
            classId:ClassId,
            phone:Phone,
            openId:OpenId,
            packetId:PacketId,
            realName:RealName,
            idCode:IdCode,
        }
        $.ajax({
            method: 'POST',
            url:baseUrl+'/business/addOrder',
            async:true,
            cache:false,
            data:order,
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                ajaxTimeoutTest.abort();　　　　　
                alert("请求超时");　　　　
                }　　
            },
            success:function (data) {
                if(data.message == null){
                    $('.signUp').css({
                        display:'none',
                        });
                    $('.signUpSuccess').fadeIn('slow').css({
                        display:'block'
                    });
                    getOrder(Phone);
                }else{
                    alert(data.message)
                    // console.(123)
                }
            },
            error: function () {
                alert('报名失败，请重试！')
            }
    })
    }

    // 根据手机号获取订单
    var getOrder = function (Phone) {
        var orderData = {
            phone:Phone
        }
        $.ajax({
            method: 'POST',
            url:baseUrl+'/business/getOrderByPhone',
            async:true,
            cache:false,
            data:orderData,
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                ajaxTimeoutTest.abort();　　　　　
                alert("请求超时");　　　　
                }　　
            },
            success:function (data) {
                var orderNo = data.data.orderNo;
                var price = data.data.price;
                var payPrice = data.data.payPrice;
                var class_id = data.data.classId;
                var teachTime ;
                if(class_id == 1){
                    teachTime = '驾校统一安排训练时间（8：00到17:00）';
                }else if(class_id == 2){
                    teachTime = '自主预约练车（8:00到21:00）';
                }else if(class_id == 3){
                    teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                }else if(class_id== 4){
                    teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                }
                if(data.data.packetId == null){
                    $('.rbox2').css({
                        display:'block',
                    })
                    $('.rbox1').css({
                        display:'none',
                    })
                }else{
                    $('.rbox2').css({
                        display:'none',
                    })
                    $('.rbox1').css({
                        display:'block',
                    })
                }
                localStorage.orderNo = orderNo;
                localStorage.price = price;
                localStorage.payPrice = payPrice;
                localStorage.teachTime = teachTime;
                localStorage.packetId = data.data.packetId;
                $('#price1').text(price);
                $('#allprice').text(payPrice);
                $('#exetime1').text(teachTime);
            },
            error: function () {
                alert('获取支付信息错误！')
            }
        })
    }

    // 点击支付调动接口
    $('#paybutton').click(function () {
        payMessage();
    })

    // 支付信息
    var payMessage = function () {
    location.href = baseUrl+'/view/pay' + '?orderNo=' + localStorage.orderNo
    }

    // 分享
    $('.shareButton').click(function () {
        sharePacket();
    })
    // 封装的分享函数
    var sharePacket = function(){
        $('#shareRedPacket').css({
            display:'block',
        })
        $('.savebutton').click(function(){
            var sharePhoneNumer = $('#sharePhone').val();
            if(reg.test(sharePhoneNumer)){
                // 根据号码生成openId
                var userData = {
                    phone: sharePhoneNumer,
                }
                // var body7 = '';
                // for (var key in userData) {//openId=...&token=...
                //     body7 = body7 + key + "=" + userData[key] + "&";
                // }
                // body7 = body7.slice(0, body7.length - 1);
                // var k = 'xlns21Dks901D92j'; //秘钥
                // body7 = aesEncrypt(body7,k);
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/addUser',
                    // beforeSend:function(XMLHttpRequest) {
                    //     XMLHttpRequest.setRequestHeader('cert','a');
                    //     XMLHttpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                    // },
                    async:true,
                    cache:false,
                    data:userData,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                        ajaxTimeoutTest.abort();　　　　　
                        alert("请求超时");　　　　
                        }　　
                    },
                    success:function (data) {
                        var shareUrl = 'https://api.dobell.me/business/index.html?openId=' + data.data.openId
                        // 生成二维码
                        // $(document).ready(function() {
                            $("#qrcodeCanvas").qrcode({
                                render : "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
                                text : shareUrl,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
                                width : "125.5",               //二维码的宽度
                                height : "125.5",              //二维码的高度
                                background : "#ffffff",       //二维码的后景色
                                foreground : "#000000",        //二维码的前景色
                                src: './libs/images/logo.png'             //二维码中间的图片
                                });
                            // });
                            //从canvas中提取图片image
                            function convertCanvasToImage(canvas) {
                                //新Image对象，可以理解为DOM
                                var image = new Image();
                                // canvas.toDataURL 返回的是一串Base64编码的URL
                                // 指定格式PNG
                                image.src = canvas.toDataURL("image/png");
                                return image;
                            }
                            var mycanvas1=document.getElementsByTagName('canvas')[0];
                            //将转换后的img标签插入到html中
                            var img = convertCanvasToImage(mycanvas1);
                            $('#cesi').append(img);//imgDiv表示你要插入的容器id
                            $('#cesi').find('img').attr('id','cesiPic');
                            var res = $('#cesi').find('img')[0].src;
                            $('#cesi').ready(function(){
                                mergeImages(res);
                            })
                            $('.fPic').find('img').attr('id','baocunImg');
                            $('.noneButton').click(function(){
                                $('.tipMessage').css({
                                    display:'none',
                                })
                            })
                            // console.log(img)
                            // $('#tegg').append(img);//imgDiv表示你要插入的容器id
                            $('#tegg').css({
                                display:'block',
                            })
                            $('#closeImg').click(function () {
                                window.location.reload()
                            })
                    },
                    error: function () {
                        alert('分享错误！')
                    }
            })

            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
    }

    // 封装我的订单
    var myOrder = function () {
        $('.myorder').fadeIn('slow').css({
            display:'block'
        });
        $('#ordphone').blur(function(){
        var orderPhoneNumber = $('#ordphone').val();
        if(reg.test(orderPhoneNumber)){
            localStorage.orderPhoneNumber = orderPhoneNumber;
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
        $('#searchorder').click(function () {
            // console.log(localStorage.orderPhoneNumber)
            if(localStorage.orderPhoneNumber){
                var orderData1 = {
                phone:localStorage.orderPhoneNumber
                }
                $.ajax({
                method: 'POST',
                url:baseUrl+'/business/getOrderByPhone',
                async:true,
                cache:false,
                data:orderData1,
                dataType: "json",
                timeout: 2000,
                complete: function (XMLHttpRequest, status) {
                    // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                    if (status == 'timeout') {
                            ajaxTimeoutTest.abort();　　　　　
                            alert("请求超时");　　　　
                            }　　
                        },
                success:function (data) {
                        if(data.data){
                            var tradeStatus = data.data.tradeStatus;
                            var orderNo = data.data.orderNo;
                            var price = data.data.price;
                            var payPrice = data.data.payPrice;
                            var class_id = data.data.classId;
                            // console.log(class_id)
                            var teachTime ;
                            if(class_id == 1){
                                teachTime = '驾校统一安排训练时间（8：00到17:00）';
                            }else if(class_id == 2){
                                teachTime = '自主预约练车（8:00到21:00）';
                            }else if(class_id == 3){
                                teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                            }else if(class_id== 4){
                                teachTime = '一人一车每天至少1小时单练；自主预约练车（8:00到21:00）';
                            }
                            localStorage.orderNo = orderNo;
                            localStorage.price = price;
                            localStorage.payPrice = payPrice;
                            localStorage.teachTime = teachTime;
                            localStorage.packetId = data.data.packetId;
                            if(data.data.isDeleted == 0 && tradeStatus == 1 ){
                                if(data.data.packetId == null){
                                    $('.rbox2').css({
                                        display:'block',
                                    })
                                    $('.rbox1').css({
                                        display:'none',
                                    })
                                }else{
                                    $('.rbox2').css({
                                        display:'none',
                                    })
                                    $('.rbox1').css({
                                        display:'block',
                                    })
                                }
                                $('#price1').text(price);
                                $('#allprice').text(payPrice);
                                $('#exetime1').text(teachTime);
                                $('.myorder').css({
                                    display:'none',
                                });
                                $('.signUpSuccess').fadeIn('slow').css({
                                    display:'block',
                                });
                                $('#cancleorder').css({
                                    display:'block',
                                })
                                // 取消订单
                                cancleOrder(data.data.id);
                            }else if(data.data.isDeleted == 0 && tradeStatus == 2 ){
                                if(data.data.packetId == null){
                                    $('.rbox2').css({
                                        display:'block',
                                    })
                                    $('.rbox1').css({
                                        display:'none',
                                    })
                                }else{
                                    $('.rbox2').css({
                                        display:'none',
                                    })
                                    $('.rbox1').css({
                                        display:'block',
                                    })
                                }
                                $('#price1').text(price);
                                $('#allprice').text(payPrice);
                                $('#exetime1').text(teachTime);
                                $('#sucMessage').text('已支付');
                                $('.myorder').css({
                                    display:'none',
                                });
                                $('#paybutton').css({
                                    display:'none',
                                });
                                $('.signUpSuccess').fadeIn('slow').css({
                                    display:'block',
                                });
                            }else{
                                $.toast("未查到用户订单", "cancel");
                            }
                            }else{
                                $.toast("未查到用户订单", "cancel");
                            }
                },
                error: function () {
                    alert('获取支付信息错误！')
                }
            })
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("请输入手机号", "cancel");
            }
        })
    }

    // 封装取消订单函数
    var cancleOrder = function (ID) {
        var cancleData = {
            id:ID,
            isDeleted:1,
            tradeStatus:3,
        }
        $('#cancleorder').click(function () {
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/updateOrder',
                    async:true,
                    cache:false,
                    data:cancleData,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                                ajaxTimeoutTest.abort();　　　　　
                                alert("请求超时");　　　　
                                }　　
                            },
                    success:function (data) {
                        // $.toast.prototype.defaults.duration = 2000
                        // $.toast("成功取消订单", "success");
                        alert("成功取消订单")
                        window.location.reload()
                    },
                    error: function () {
                        alert('获取支付信息错误！')
                    }
                })
        })
    }


    // 封装分享记录查询
    var shareRecord = function(){
        $('#sharerecord').css({
            display:'block',
        })
        $('#recordButton').click(function(){
            var shrPhone = $('#shrphone').val()
            var shareRecordData = {
                phone:shrPhone,
            }
            if(reg.test(shrPhone)){
                $.ajax({
                    method: 'POST',
                    url:baseUrl+'/business/addUser',
                    async:true,
                    cache:false,
                    data:shareRecordData,
                    dataType: "json",
                    timeout: 2000,
                    complete: function (XMLHttpRequest, status) {
                        // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                        if (status == 'timeout') {
                                ajaxTimeoutTest.abort();　　　　　
                                alert("请求超时");　　　　
                                }　　
                            },
                    success:function (data) {
                            var shareId = data.data.openId;
                            lookforRecord(shareId);
                    },
                    error: function () {
                        alert('获取支付信息错误！')
                    }
                })
            }else{
                $.toast.prototype.defaults.duration = 1000
                $.toast("你输入的号码格式有误！", "forbidden");
            }
        })
    }

    var lookforRecord = function (id) {
        var lookforData = {
            openId: id
        }
        $.ajax({
            method: 'POST',
            url:baseUrl+'/business/getMyRecommendList',
            async:true,
            cache:false,
            data:lookforData,
            dataType: "json",
            timeout: 2000,
            complete: function (XMLHttpRequest, status) {
                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                if (status == 'timeout') {
                        ajaxTimeoutTest.abort();　　　　　
                        alert("请求超时");　　　　
                        }　　
                    },
            success:function (data) {
                if(data.data.length>0){
                    $("#sharerecord").css({
                        display:'none',
                    })
                    $('#sharelist').css({
                        display:'block',
                    })
                    var stateMessage;
                    for(let i = 0;i < data.data.length;i++){
                        if(data.data[i].tradeStatus == 1){
                            stateMessage = '未支付';
                        }else if(data.data[i].tradeStatus == 2){
                            stateMessage = '已支付';
                        }else if(data.data[i].tradeStatus == 3){
                            stateMessage = '已取消';
                        }
                        $('#record').append("<div class='weui-cell'>"+ data.data[i].phone + '(' + stateMessage + ')' +"</div>")
                    }
                }else{
                    alert('暂无分享记录')
                    window.location.reload();
                }
            },
            error: function () {
                alert('获取支付信息错误！')
            }
        })
    }
    // 身份证验证
    var IdCodeValid = function(code){  
        //身份证号合法性验证  
        //支持15位和18位身份证号  
        //支持地址编码、出生日期、校验位验证  
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};  
        var row={
            'pass':true,
            'msg':'验证成功'
        };
        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)){  
            row={
                'pass':false,
                'msg':'身份证号格式错误'
            };
        }else if(!city[code.substr(0,2)]){
            row={
                'pass':false,
                'msg':'身份证号地址编码错误'
            };
        }else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if(parity[sum % 11] != code[17].toUpperCase()){
                    row={
                        'pass':false,
                        'msg':'身份证号校验位错误'  
                    };
                }
            }
        }
        return row;
    }
}


// 封装画出合成图
function mergeImages() {
    // 底片
    var shareSrc = document.getElementById('sharePIC');
    // 覆盖
    var erweima = document.getElementById('cesiPic');
    // console.log(shareSrc)
    // console.log(erweima)
    var canvas = $('.showPic').append('<canvas id="myCanvas"></canvas>');
    var canvas1 = $('#myCanvas')[0];
   
    // console.log(canvas1)
    canvas1.width = 375;
    canvas1.height = 603;
    var context = canvas1.getContext('2d');
    // console.log(context)
    context.drawImage(shareSrc,0,0,375,603);
    context.drawImage(erweima,124.75, 395, 125.5, 125.5);
    // context.drawImage(erweima,0, 0, 75.3, 75.3, 0,0, 75.3,75.3);
    
    // 从canvas中提取图片image
    function convertCanvasToImage(canvas) {
        //新Image对象，可以理解为DOM
        var images = new Image();
        images.crossOrigin = "Anonymous";
        // images.setAttribute('crossOrigin', '');
        // canvas.toDataURL 返回的是一串Base64编码的URL
        // 指定格式PNG
        images.src = canvas.toDataURL("image/png");
        
        return images;
    }
    var mycanvas2 = $('#myCanvas')[0];
    // console.log($('#myCanvas')[0])
    // console.log(mycanvas2)
    // 将转换后的img标签插入到html中
    var img1 = convertCanvasToImage(mycanvas2);
    $('.fPic').append(img1)
}








