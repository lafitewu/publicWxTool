//index.js
//获取应用实例

const myaudio = wx.createInnerAudioContext();
const myaudio2 = wx.createInnerAudioContext();
const myaudio3 = wx.createInnerAudioContext();
const app = getApp()

Page({
  data: {
    title: '坚持好习惯',
    info: '选择一个习惯，每天坚持30分钟',
    bannerArr: [
      { src: 'http://p5tezjdao.bkt.clouddn.com/home_listen_funciton_img.png', name: "111"},
      { src: 'http://p5tezjdao.bkt.clouddn.com/home_chat_funciton_img.png', name: "222" },
      { src: 'http://p5tezjdao.bkt.clouddn.com/home_read_function_img.png', name: "333" },
      { src: 'http://p5tezjdao.bkt.clouddn.com/home_run_funciton_img.png', name: "4444" },
      { src: 'http://p5tezjdao.bkt.clouddn.com/home_sleep_funciton_img.png', name: "5555" },
      { src: 'http://p5tezjdao.bkt.clouddn.com/home_write_funciton_img.png', name: "66666" },
    ],
    shows: true,
    Djs: '',
    min: "30",
    senconds: "00"
  },
  onShow() {
    // this.DjsFn();
  },
  onReady: function () {

  },
  urlFn() {
    wx.navigateTo({
      // pages/friend_page/index?mycode=udSOsSI&unionid=unionid7&openid=OPENID7&nickName=goodday&avatarUrl=https%3A%2F%2Fwx.qlogo.cn%2Fmmopen%2Fvi_32%2FDYAIOgq83eqvpotPXibx1c1qqscSn6g7OrObQHQ1CibmS38uxY3bcMZzdDkPOZ8UOhSKXibNWsD3tlicd0LCV9jXXw%2F132
      url: '../details/index?mycode=t20I6yUCY',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀new_details/index?mycode=udC3Sik
         success:function() { } ,       //成功后的回调；
        // fail：function() { }      ,    //失败后的回调；
        // complete：function() { }   ,   //结束后的回调(成功，失败都会执行)
    })
  },
  // 倒计时
  DjsFn() {
    var that = this;
    var Times = 30 * 60 * 1000;
    that.Djs = setInterval(function () {
      Times -= 1000;
      var MTime = parseInt(Times / (1000 * 60));
      var sTime = (Times / 1000) % 60;
      if (parseInt(MTime) == 0) {
        if (sTime <= 0) {
          MTime = "0";
          sTime = "0";
          clearInterval(that.Djs);
        }
      }
      if (MTime < 10) {
        MTime = "0" + MTime;
      }
      if (sTime < 10) {
        sTime = "0" + sTime;
      }
      that.setData({
        min: MTime,
        senconds: sTime
      })
    }, 1000);
  },
  startFn() {
    var that = this;
    that.setData({
      shows: false
    });
    that.DjsFn();
  },
  endFn() {
    var that = this;
    that.setData({
      shows: true,
      min: "30",
      senconds: "00"
    });
    clearInterval(that.Djs);
  }
})
