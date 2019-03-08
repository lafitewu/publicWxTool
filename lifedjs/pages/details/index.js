//index.js
//获取应用实例
const app = getApp()
var utilMd5 = require('../../utils/md5.js')
var zhmd5 = require('../../utils/zhmd5.js')
var CusBase64 = require('../../utils/base64.js')

Page({
  data: {
    version: '人生倒计时pro1.2（新增banner广告）',
    ExperShow: false,
    goBack: '',
    isShare: '',
    help_icon_turn: '',
    help_text: '',
    text_colors: '',
    shareUrl: '',
    shareImg: '',
    shareTitle: '',
    detail_share: '',
    detail_icon: '',
    detail_title: '',
    detail_desc: '',
    detail_guide: '',
    btnStatus: false,
    btn_name: '立即体验',
    btn_name2: '立即分享',
    secret: '0bd18f65a0670ec947ead813e200d41d',
    appid: 'wxebfb2f28b074193d',
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
    isUesrInfo: '',
    adCoverTurn: false,
    coverNoticeFont: '',
    adCoverFontTurn1: false,
    adCoverFontTurn2: false,
    newAdTurn: false,
    adHide: false
  },
  // 获取游戏基本信息
  gameInfo: function () {
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
        sign: signNew
      },
      success: function (res) {
        console.log(res);
        // _self.setData({
        //   coverNoticeFont: res.data.reward.price + res.data.reward.exdw
        // })
        var helpTxt, shares, textColor;
        // 判断goback =》 是否返回
        if (res.goback != 1) {
          _self.setData({
            goBack: false
          })
        } else {
          _self.setData({
            goBack: true
          })
        }
        // 判断体验奖励模块show || hide
        if (_self.data.openId != "") {
          if (res.data.check.code == 0) {
            _self.setData({
              ExperShow: true
            })
          } else {
            _self.setData({
              ExperShow: false,
              btn_name: res.data.check.msg
            })
          }
        } else {
          _self.setData({
            ExperShow: false,
            btn_name: "立即体验"
          })
        }

        // 判断是否可以分享
        if (res.data.invite.open == 0) {
          shares = true;
        } else {
          shares = false;
        }
        // 判断是否有邀请数据
        if (res.data.invite.fcount > 0) {
          helpTxt = res.data.invite.fcount + "位好友助力，累计获得" + res.data.invite.total + res.data.invite.exdw;
          textColor = "black";
        } else {
          helpTxt = "暂无助力，邀请好友试玩即可获得金币";
          textColor = "red";
        }
        _self.setData({
          detail_icon: res.data.data.logo,
          detail_title: res.data.data.name,
          detail_desc: res.data.data.description,
          detail_guide: res.data.data.guide,
          detail_share: res.data.invite.shareWord,
          shareTitle: res.data.invite.shareTitle,
          shareImg: res.data.invite.shareImg,
          shareUrl: res.data.invite.shareEnterPath,
          isShare: shares,
          help_text: helpTxt,
          text_colors: textColor
        })
      }
    });
  },
  //事件处理函数
  onShow() {
    wx.showLoading({
      title: '加载中',
    });

    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var Url = currentPage.route;
    var options = currentPage.options
    console.log(options.mycode);
    var _self = this;
    console.log(_self.data.version);  //新增版本状态


    if (options.q) {
      let scan_url = decodeURIComponent(options.q);
      _self.setData({
        input_val: scan_url.split("mycode=")[1],
        btn_turn: true
      });
    } else {
      _self.setData({
        input_val: options.mycode,
        btn_turn: true
      });
    }
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
        // 判断是否授权
        wx.getUserInfo({
          success: res => {
            _self.setData({
              isUesrInfo: 1
            });
            var Iv = res.iv;
            var EncryptedData = res.encryptedData;
            var SessionKey;
            //如果用户点击过授权，可以直接获取到信息
            var userMsg = res.userInfo;
            wx.login({
              success: function (res) {
                console.log(res);
                console.log(_self.data.hostname);
                if (res.code) {
                  var l = _self.data.hostname + '/api/ads/jscode2session?appid=' + _self.data.appid + '&secret=' + _self.data.secret + '&js_code=' + res.code + '&grant_type=authorizationCode';
                  wx.request({
                    url: l,
                    data: {},
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                    success: function (res) {
                      console.log(res);
                      SessionKey = res.data.session_key; //获取session_key

                      wx.checkSession({
                        success: function () {
                          console.log("哈哈哈，session_key有效！")
                        },
                        fail: function () {
                          console.log("session_key失效！");
                        }
                      })

                      userMsg.openId = res.data.openid;
                      userMsg.unionId = res.data.unionid;
                      console.log("老方法" + userMsg.unionId);

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
                          wx.hideLoading();
                          console.log("新方法" + res.data.data.unionId);
                          if (res.statusCode == 200) {
                            console.log(res.data.data.unionId);
                            _self.setData({
                              unionId: res.data.data.unionId
                            });
                            _self.gameInfo();
                          }
                        }
                      });

                    }
                  });
                }
              }
            });
          },
          fail: err => {
            wx.hideLoading();
            //如果用户没有点击过授权，或者清除缓存，删除小程序，重新进入，会进入这里
            console.log('未授权，请授权！');
            console.log(err.errMsg)
            _self.gameInfo();
            _self.setData({
              ExperShow: false,
              isUesrInfo: 0
            })
          }
        });
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
            sign: sign
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log("奖励请求成功" + res.data);
            var addMsg = res.data.msg;
            // 判断请求返回值
            if (res.data.code == 1) {
              // 10.18新增返回判断
              if (_self.data.goBack) {
                wx.navigateBackMiniProgram({
                  extraData: {
                    itDone: 1,
                    decMsg: addMsg
                  },
                  success(res) {
                    // 返回成功
                    console.log('成功' + res);
                  },
                  fail(res) {
                    console.log('失败' + res)
                    // 失败
                    // wx.navigateTo({
                    //   url: `/pages/more/main`
                    // })
                  },
                });
              }

              // wx.showToast({
              //   title: '奖励领取成功！',
              //   icon: 'success',
              //   duration: 3000
              // })
              wx.hideLoading();
              _self.setData({
                adCoverTurn: true,
                adCoverFontTurn1: true,
                btnStatus: true,
                btn_name: '奖励已领取',
                goldTime: '',
                // coverNoticeFont: res.data.data.reward.price + res.data.data.reward.exdw
                coverNoticeFont: "试玩完成!"
              })
            } else {
              wx.hideLoading();
              // wx.showToast({
              //   title: res.data.msg,
              //   icon: 'none',
              //   duration: 3000
              // })
              console.log('77777777');
              _self.setData({
                // coverNoticeFont: res.data.msg,
                adCoverTurn: true,
                adCoverFontTurn2: true
              })
            }
          },
          fail: function (res) {
            _self.setData({
              input_val: '',
              hideName: true
            })
          }
        });
      } else {
        wx.hideLoading();
        console.log("任务未完成！");
        _self.setData({
          adCoverFontTurn2: true,
          adCoverTurn: true,
          // coverNoticeFont: _self.data.desc,
          hideName: true,
          goldTime: ''
        })
        // var Toast = _self.data.desc;
        // console.log(Toast);
        // wx.showToast({
        //   title: Toast,
        //   icon: 'none',
        //   duration: 4000
        // })
      }
    }
  },
  // botton分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: this.data.shareTitle,
        path: this.data.shareUrl,
        imageUrl: this.data.shareImg
      }
    }
  },
  getUserInfo: function (e) {
    var _self = this;
    wx.showLoading({
      title: '加载中',
    })
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
                if (res.code) {
                  var l = _self.data.hostname + '/api/ads/jscode2session?appid=' + _self.data.appid + '&secret=' + _self.data.secret + '&js_code=' + res.code + '&grant_type=authorizationCode';
                  wx.request({
                    url: l,
                    data: {},
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
                    success: function (res) {
                      console.log("老方法" + res.data.unionid);
                      SessionKey = res.data.session_key; //获取session_key

                      wx.checkSession({
                        success: function () {
                          console.log("哈哈哈，session_key有效！")
                        },
                        fail: function () {
                          console.log("session_key失效！");
                        }
                      })

                      console.log(res.data.openid);
                      _self.setData({
                        openId: res.data.openid,
                        unionId: res.data.unionid
                      })
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

                        console.log(Str);
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
                              console.log(res.data);
                              console.log("新方法" + res.data.data.unionId);
                              _self.setData({
                                unionId: res.data.data.unionId
                              });

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
                                  sign: sign
                                },
                                header: {
                                  'content-type': 'application/json'
                                },
                                success: function (res) {
                                  console.log(res);
                                  if (res.data.code == 1 && res.data.data.wxid != "") {
                                    var AppID = res.data.data.wxid;
                                    var Duration = res.data.data.duration;
                                    var jumpurl = res.data.data.jumpurl;
                                    _self.setData({
                                      desc: res.data.data.guide,
                                      Jumpurl: jumpurl
                                    })
                                    var ContentToast = res.data.data.guide;
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
                                            sign: sign
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
                                          newAdTurn: true,
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
                                            sign: sign
                                          },
                                          header: {
                                            'content-type': 'application/json'
                                          },
                                          success: function (res) {
                                            console.log("程序跳转失败！");
                                          }
                                        });
                                      }
                                    });
                                  } else {
                                    wx.hideLoading();
                                    var btnMsg = res.data.msg;
                                    wx.showModal({
                                      title: '提示',
                                      content: btnMsg,
                                      success: function (res) {
                                        if (res.confirm) {
                                          _self.setData({
                                            hideName: true,
                                            btnStatus: true,
                                            btn_name: btnMsg
                                          })
                                        } else if (res.cancel) {
                                          _self.setData({
                                            hideName: true,
                                            btnStatus: true,
                                            btn_name: btnMsg
                                          })
                                        }
                                      }
                                    })
                                  }
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
              },
              fail: function (res) {
                console.log('9999999');
              }
            });
          }
        });
      } else {
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
            sign: sign
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 1 && res.data.data.wxid != "") {
              var AppID = res.data.data.wxid;
              var Duration = res.data.data.duration;
              var jumpurl = res.data.data.jumpurl;
              _self.setData({
                desc: res.data.data.guide,
                Jumpurl: jumpurl
              })
              var ContentToast = res.data.data.guide;
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
                      sign: sign
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
                    newAdTurn: true,
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
                      unionid: _self.data.unionId,
                      openid: _self.data.openId,
                      code: _self.data.input_val,
                      jumpurl: _self.data.Jumpurl,
                      jumpresult: '0',
                      time: times,
                      sign: sign
                    },
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log("程序跳转失败！");
                    }
                  });
                }
              });
            } else {
              wx.hideLoading();
              var btnMsg = res.data.msg;
              wx.showModal({
                title: '提示',
                content: btnMsg,
                success: function (res) {
                  if (res.confirm) {
                    _self.setData({
                      hideName: true,
                      btnStatus: true,
                      btn_name: btnMsg
                    })
                  } else if (res.cancel) {
                    _self.setData({
                      hideName: true,
                      btnStatus: true,
                      btn_name: btnMsg
                    })
                  }
                }
              })
            }
          }
        })
        console.log("miniadusersave接口请求成功");
      }
    }
  },
  // cover弹窗隐藏
  closeCover() {
    this.setData({
      adCoverTurn: false,
      adCoverFontTurn1: false,
      adCoverFontTurn2: false
    })
  },
  adCloseFn() {
    this.setData({
      adHide: true
    });
    this.ddFn('task.close'); //广告close 打点
  },
  // 打点接口
  shareDdFn() {
    this.ddFn('task.share');  //分享打点
  },
  // 跳转打点
  gameStartFn() {
    this.ddFn('task.open');  //跳转打点
  },
  // 打点函数封装
  ddFn(name) {
    var _self = this;
    wx.request({
      url: _self.data.hostname + '/api/dd',
      method: 'post',
      data: {
        type: name,
        mycode: _self.data.input_val,
        openid: _self.data.openId,
        unionid: _self.data.unionId,
        wxminiid: _self.data.appid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("分享点击打点");
        console.log(res);
      }
    });
  }
})
