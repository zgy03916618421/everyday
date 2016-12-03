/**
 * Created by zhougy on 12/2/16.
 */
var redis = require('redis');
var client = redis.createClient(6379,'192.168.100.2',{})


client.hincrby('userstatic:3','scancount',1);
client.hgetall('userstatic:3',function (err,obj) {
    console.log(obj);
})
