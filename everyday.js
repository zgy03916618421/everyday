/**
 * Created by Administrator on 2016/9/18.
 */
var request = require('request')
var redis = require('redis')
var fs = require('fs')
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.hour = 23;
rule.minute=55;
var count = 1;
var client = redis.createClient(6379,'192.168.200.2',{});
var j = schedule.scheduleJob(rule, function(){
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
                    value: fs.readFileSync('img/'+count+'.png'),
                    options: {filename:count+'.png', contentType: 'image/png'}
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
                            'name':'往期精�?,
                            'url' : 'http://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzAxMzY2ODA1MQ==#wechat_webview_type=1&wechat_redirect'
                        },
                        {
                            'type':'media_id',
                            'name':'今日书签',
                            'media_id': media_id
                        },
                        {
                            'type':'view',
                            'name':'传纸�?,
                            'url':'https://share.beautifulreading.com/suriv/home'
                        }
                    ]
                },
                json: true
            }
            request(opts,function (err,response,body) {
                console.log(body);
                count++;
            })
        })
    })
});
