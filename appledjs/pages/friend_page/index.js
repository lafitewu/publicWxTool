//index.js
//获取应用实例
const app = getApp()
var utilMd5 = require('../../utils/md5.js')
var zhmd5 = require('../../utils/zhmd5.js')
var CusBase64 = require('../../utils/base64.js')

Page({
  data: {
    user_icon: '',
    detail_icon: '',
    detail_title: '',
    detail_desc: '',
    detail_guide: '',
    btnStatus: false,
    btn_name: '立即体验',
    btn_name2: '立即分享',
    secret: '3e3ee97caae76da62c9228704e7e1cfe',
    appid: 'wxccebc230574a5c8a',
    goldTime: '',
    time: '',
    hideName: true,
    userInfo: {},
    input_val: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    targetId: true,
    openId: '',
    unionId: '',
    successfn: true,
    hostname: '',
    desc: '',
    Jumpurl: '',
    btn_turn: '',
    isUesrInfo: ''
  },
  // 基础信息初始化
  shareInit() {
    var _self = this;
    var timeNew = Date.parse(new Date()),
      keyNew = "ce3e7c8d567106cd",
      md5strNew = "code=" + _self.data.input_val + "&time=" + timeNew,
      signNew = zhmd5.md5(md5strNew + keyNew);
    wx.request({
      url: 'https://ad.midongtech.com/api/ads/miniapp',
      method: 'GET',
      data: {
        wxminiid: _self.data.appid,
        unionid: _self.data.unionId,
        openid: _self.data.openId,
        code: _self.data.input_val,
        time: timeNew,
        sign: signNew,
        share: 1
      },
      success: function (res) {
        console.log(res);
        _self.setData({
          detail_icon: res.data.data.logo,
          detail_title: res.data.data.name,
          detail_desc: res.data.data.description,
          detail_guide: res.data.data.guide
        })
      }
    });
  },
  //事件处理函数
  onShow() {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var Url = currentPage.route;
    var options = currentPage.options
    console.log(options);
    console.log(decodeURIComponent(options.avatarUrl));
    var _self = this;

    _self.setData({
      input_val: options.mycode,
      btn_turn: true,
      user_icon: decodeURIComponent(options.avatarUrl)
    });
    var ts = Date.parse(new Date()),
      md5str2 = "wxminiid=" + _self.data.appid + "&time=" + times,
      Sign = zhmd5.md5(md5str2 + key);
    // 动态配置api地址
    wx.request({
      url: 'https://ad.midongtech.com/api/ads/miniadconfig',
      method: 'POST',
      data: {
        wxminiid: _self.data.appid,
        time: times,
        sign: Sign
      },
      success: function (res) {
        _self.setData({
          hostname: res.data.data.baseurl
        });
      }
    });

    // 判断是否授权
    wx.getUserInfo({
      success: res => {
        //如果用户点击过授权，可以直接获取到信息
        _self.setData({
          isUesrInfo: 1
        });
        var userMsg = res.userInfo;
        var Iv = res.iv;
        var EncryptedData = res.encryptedData;
        var SessionKey;

        wx.login({
          success: function (res) {
            console.log("code"+res.code);
            if (res.code) {
              var l = _self.data.hostname + '/api/ads/jscode2session?appid=' + _self.data.appid + '&secret=' + _self.data.secret + '&js_code=' + res.code + '&grant_type=authorizationCode';
              wx.request({
                url: l,
                data: {},
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                success: function (res) {
                  // console.log(res);
                  console.log("老方法" + res.data.unionid);
                  SessionKey = res.data.session_key; //获取session_key
                  userMsg.openId = res.data.openid;
                  userMsg.unionId = res.data.unionid;

                   wx.checkSession({
                      success: function () {
                        console.log("哈哈哈，session_key有效！")
                      },
                      fail: function () {
                        console.log("session_key失效！");
                      }
                    })

                  _self.setData({
                    openId: userMsg.openId
                  });
                  if (res.data.unionid != undefined) {
                    _self.setData({
                      unionId: userMsg.unionId
                    })
                  } 
                  // 10.16兼容enjoy表情
                  console.log(userMsg.nickName);
                  userMsg.nickName = CusBase64.CusBASE64.encoder(userMsg.nickName);
                  var Str = JSON.stringify(userMsg);

                  var times = Date.parse(new Date()),
                    key = "ce3e7c8d567106cd",
                    md5str = "wxminiid=" + _self.data.appid + "&userinfo=" + Str + "&time=" + times;
                  var sign = zhmd5.md5(md5str + key);
                  // 保存用户信息
                  wx.request({
                    url: _self.data.hostname + '/api/ads/miniadusersave',
                    method: 'post',
                    data: {
                      wxminiid: _self.data.appid,
                      userinfo: Str,
                      time: times,
                      sign: sign,
                      encryptedData: EncryptedData,
                      iv: Iv,
                      sessionKey: SessionKey
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(res);
                      console.log("新方法" + res.data.data.unionId);
                      if (res.statusCode == 200) {
                        _self.setData({
                          unionId: res.data.data.unionId
                        });
                        _self.shareInit();
                      }
                    }
                  })
                  if (options.openid == res.data.openid) {
                    wx.redirectTo({
                      url: '../../pages/details/index?mycode=' + options.mycode
                    });
                  }
                }
              });
            }
          }
        });

      },
      fail: err => {
        _self.setData({
          isUesrInfo: 0
        }); 
        _self.shareInit();
        console.log('未授权，请授权！');
        console.log(err.errMsg)
      }
    });

    // 获取用户体验时间
    var timeS = (Date.parse(new Date()) - this.data.time) / 1000;
    // 判断是否有目标时间
    if (_self.data.goldTime != 0) {
      if (timeS - this.data.goldTime > 0) {
        console.log(timeS);
        var times = Date.parse(new Date()),
          key = "ce3e7c8d567106cd",
          md5str = "openid=" + _self.data.openId + "&code=" + _self.data.input_val + "&time=" + times,
          sign = zhmd5.md5(md5str + key);
        // 奖励接口
        wx.request({
          url: _self.data.hostname + '/api/ads/miniok',
          method: 'post',
          data: {
            wxminiid: _self.data.appid,
            unionid: _self.data.unionId,
            openid: _self.data.openId,
            code: _self.data.input_val,
            time: times,
            sign: sign,
            share: 1
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log("奖励请求成功" + res.data);
          },
          fail: function (res) {
            _self.setData({
              input_val: '',
              hideName: true
            })
          }
        });
      } else {
        console.log("任务未完成！");
        _self.setData({
          hideName: true,
          goldTime: ''
        })
        var Toast = _self.data.desc;
        console.log(Toast);
      }
    }
  },
  getUserInfo: function (e) {
    var _self = this;
    // loading
    wx.showLoading({
      title: '加载中',
    });

    // 判断是否点击多次
    if (_self.data.btn_turn) {
      _self.setData({
        btn_turn: false
      });

      if (_self.data.isUesrInfo == 0) {
        wx.getUserInfo({
          success: function (res) {
            var Iv = res.iv;
            var EncryptedData = res.encryptedData;
            var SessionKey;
            wx.login({
              success: function (res) {
                console.log("code"+res.code);
                if (res.code) {
                  var l = _self.data.hostname + '/api/ads/jscode2session?appid=' + _self.data.appid + '&secret=' + _self.data.secret + '&js_code=' + res.code + '&grant_type=authorizationCode';
                  wx.request({
                    url: l,
                    data: {},
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                    success: function (res) {
                      console.log(res.data);
                      console.log("老方法" + res.data.unionid);
                      SessionKey = res.data.session_key; //获取session_key
                      // wx.checkSession({
                      //   success: function () {
                      //     SessionKey = res.data.session_key; //获取session_key
                      //   },
                      //   fail: function () {
                      //     console.log("session_key失效！");
                      //   }
                      // })

                      _self.setData({
                        openId: res.data.openid
                      });
                      if (res.data.unionid != undefined) {
                        _self.setData({
                          unionId: res.data.unionid
                        })
                      }

                      // 10.26新增用户是否允许授权，并解决取消不能跳转
                      if (e.detail.userInfo == undefined) {
                        wx.hideLoading();
                        _self.setData({
                          btn_turn: true
                        });
                      } else {
                        e.detail.userInfo.openId = _self.data.openId;
                        e.detail.userInfo.unionId = _self.data.unionId;
                        // 10.16兼容enjoy表情
                        console.log(e.detail.userInfo.nickName);
                        e.detail.userInfo.nickName = CusBase64.CusBASE64.encoder(e.detail.userInfo.nickName);
                        var Str = JSON.stringify(e.detail.userInfo);

                        var times = Date.parse(new Date()),
                          key = "ce3e7c8d567106cd",
                          md5str = "wxminiid=" + _self.data.appid + "&userinfo=" + Str + "&time=" + times;
                        var sign = zhmd5.md5(md5str + key);
                        if (e.detail.errMsg == "getUserInfo:ok") {
                          _self.setData({
                            hideName: false
                          });
                          // 保存用户信息
                          wx.request({
                            url: _self.data.hostname + '/api/ads/miniadusersave',
                            method: 'post',
                            data: {
                              wxminiid: _self.data.appid,
                              userinfo: Str,
                              time: times,
                              sign: sign,
                              encryptedData: EncryptedData,
                              iv: Iv,
                              sessionKey: SessionKey
                            },
                            header: {
                              'content-type': 'application/json'
                            },
                            success: function (res) {
                              console.log(res);
                              // console.log("新方法" + res.data.data.unionId);
                              if (res.data.data.unionId != undefined) {
                                _self.setData({
                                  unionId: res.data.data.unionId
                                });
                              }

                              var times = Date.parse(new Date()),
                                key = "ce3e7c8d567106cd",
                                md5str = "openid=" + _self.data.openId + "&code=" + _self.data.input_val + "&time=" + times,
                                sign = zhmd5.md5(md5str + key);
                              // 判断输入框值
                              wx.request({
                                url: _self.data.hostname + '/api/ads/codecheck',
                                method: 'post',
                                data: {
                                  wxminiid: _self.data.appid,
                                  unionid: _self.data.unionId,
                                  openid: _self.data.openId,
                                  code: _self.data.input_val,
                                  time: times,
                                  sign: sign,
                                  share: 1
                                },
                                header: {
                                  'content-type': 'application/json'
                                },
                                success: function (res) {
                                  console.log(res);
                                  // if (res.data.code == 1 && res.data.data.wxid != "") {
                                  var AppID = res.data.data.wxid;
                                  var Duration = res.data.data.duration;
                                  var jumpurl = res.data.data.jumpurl;
                                  _self.setData({
                                    desc: res.data.data.guide,
                                    Jumpurl: jumpurl
                                  })
                                  var ContentToast = res.data.data.guide;
                                  // setTimeout(function () {
                                  console.log(AppID);
                                  console.log(jumpurl);
                                  wx.navigateToMiniProgram({
                                    appId: AppID,
                                    path: jumpurl,
                                    extraData: {},
                                    envVersion: 'release',
                                    success(res) {
                                      wx.hideLoading();
                                      // 打开成功
                                      wx.request({
                                        url: _self.data.hostname + '/api/ads/minijump',
                                        method: 'post',
                                        data: {
                                          wxminiid: _self.data.appid,
                                          unionid: _self.data.unionId,
                                          openid: _self.data.openId,
                                          code: _self.data.input_val,
                                          jumpurl: _self.data.Jumpurl,
                                          jumpresult: '1',
                                          time: times,
                                          sign: sign,
                                          share: 1
                                        },
                                        header: {
                                          'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                          console.log(res);
                                          console.log("程序跳转成功！");
                                        }
                                      });
                                      _self.setData({
                                        goldTime: Duration,
                                        time: Date.parse(new Date())
                                      });
                                    },
                                    fail: function (res) {
                                      wx.hideLoading();
                                      _self.setData({
                                        btn_turn: true
                                      });
                                      wx.request({
                                        url: _self.data.hostname + '/api/ads/minijump',
                                        method: 'post',
                                        data: {
                                          wxminiid: _self.data.appid,
                                          unionid: _self.data.unionId,
                                          openid: _self.data.openId,
                                          code: _self.data.input_val,
                                          jumpurl: _self.data.Jumpurl,
                                          jumpresult: '0',
                                          time: times,
                                          sign: sign,
                                          share: 1
                                        },
                                        header: {
                                          'content-type': 'application/json'
                                        },
                                        success: function (res) {
                                          console.log(res);
                                          console.log("程序跳转失败！");
                                        }
                                      });
                                    }
                                  });
                                }
                              })
                              console.log("miniadusersave接口请求成功");
                            }
                          })
                        }
                      }
                    }
                  });
                } else {
                  _self.setData({
                    btn_turn: true
                  });
                  console.log('获取用户登录态失败！' + res.errMsg)
                }
              }
            });
          }
        });
      }else {
        var times = Date.parse(new Date()),
          key = "ce3e7c8d567106cd",
          md5str = "openid=" + _self.data.openId + "&code=" + _self.data.input_val + "&time=" + times,
          sign = zhmd5.md5(md5str + key);
        // 判断输入框值
        wx.request({
          url: _self.data.hostname + '/api/ads/codecheck',
          method: 'post',
          data: {
            wxminiid: _self.data.appid,
            unionid: _self.data.unionId,
            openid: _self.data.openId,
            code: _self.data.input_val,
            time: times,
            sign: sign,
            share: 1
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            // if (res.data.code == 1 && res.data.data.wxid != "") {
            var AppID = res.data.data.wxid;
            var Duration = res.data.data.duration;
            var jumpurl = res.data.data.jumpurl;
            _self.setData({
              desc: res.data.data.guide,
              Jumpurl: jumpurl
            })
            var ContentToast = res.data.data.guide;
            // setTimeout(function () {
            console.log(AppID);
            console.log(jumpurl);
            wx.navigateToMiniProgram({
              appId: AppID,
              path: jumpurl,
              extraData: {},
              envVersion: 'release',
              success(res) {
                wx.hideLoading();
                // 打开成功
                wx.request({
                  url: _self.data.hostname + '/api/ads/minijump',
                  method: 'post',
                  data: {
                    wxminiid: _self.data.appid,
                    unionid: _self.data.unionId,
                    openid: _self.data.openId,
                    code: _self.data.input_val,
                    jumpurl: _self.data.Jumpurl,
                    jumpresult: '1',
                    time: times,
                    sign: sign,
                    share: 1
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res);
                    console.log("程序跳转成功！");
                  }
                });
                _self.setData({
                  goldTime: Duration,
                  time: Date.parse(new Date())
                });
              },
              fail: function (res) {
                wx.hideLoading();
                _self.setData({
                  btn_turn: true
                });
                wx.request({
                  url: _self.data.hostname + '/api/ads/minijump',
                  method: 'post',
                  data: {
                    wxminiid: _self.data.appid,
                    unionid: _self.data.unionId,
                    openid: _self.data.openId,
                    code: _self.data.input_val,
                    jumpurl: _self.data.Jumpurl,
                    jumpresult: '0',
                    time: times,
                    sign: sign,
                    share: 1
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res);
                    console.log("程序跳转失败！");
                  }
                });
              }
            });
          }
        })
        console.log("miniadusersave接口请求成功");
      }

    }
  }
})
