/**
 * Created by zhougy on 11/25/16.
 */
var date = new Date();
var local_date = date.toLocaleDateString();
var day = local_date.split('/')[1];
var month = local_date.split('/')[0];
day = day.length>1 ? day : '0' +day;
month = month.length>1 ? month :'0'+month
console.log(day,month)
console.log(month+day);