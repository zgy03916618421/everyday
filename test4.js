/**
 * Created by Administrator on 2016/9/18.
 */
var request = require('request')
var redis = require('redis')
var fs = require('fs')
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 1;
var client = redis.createClient(6379,'192.168.200.2',{});
var j = schedule.scheduleJob(rule, function(){
  /*  var date = new Date();
    var day = date.getDate().toString();
    if(day.length<2){
        day = '0'+day;
    }
    var month = date.getMonth() + 1;
    month = month.toString();
    if(month.length<2){
        month = '0'+month;
    }*/
  var date = new Date();
  var local_date = date.toLocaleDateString();
  var day = local_date.split('/')[1];
  var month = local_date.split('/')[0];
  day = day.length>1 ? day : '0' +day;
  month = month.length>1 ? month :'0'+month
    var filename = month + day;
  console.log(filename);
    client.get('wechat_accesstoken',function (err,token) {
        console.log(token)
        var opts = {
            method: 'POST',
            url: 'https://api.weixin.qq.com/cgi-bin/material/add_material',
            qs: {
                access_token: token,
                type: 'image'
            },
            headers: {
                'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
            },
            formData: {
                media: {
                    value: fs.readFileSync('img/'+filename+'.png'),
                    options: {filename:filename+'.png', contentType: 'image/png'}
                }
            }
        }
        request(opts,function (err,response,upbody) {
            var media_id = JSON.parse(upbody).media_id
            console.log(media_id);
            var opts = {
                method: 'POST',
                url: 'https://api.weixin.qq.com/cgi-bin/menu/create',
                qs: {access_token: token},
                headers: {
                    'content-type': 'application/json'
                },
                body: {
                    'button':[
                        {
                            'type':'view',
                            'name':'往期精选',
                            'url' : 'http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzY2ODA1MQ==#wechat_webview_type=1&wechat_redirect'
                        },
                        {
                            'type':'media_id',
                            'name':'今日书签',
                            'media_id': media_id
                        },
                        {
                            'type':'view',
                            'name':'Up起来',
                            'url':'https://share.beautifulreading.com/suriv/home?source=bookface'
                        }
                    ]
                },
                json: true
            }
            request(opts,function (err,response,body) {
                console.log(body);
            })
        })
    })
});
