// 每次执行 $get  $post  $ajax 前都会执行这个回调函数
$.ajaxPrefilter(function (option) {
  // 配置请求根路径
  option.url = 'http://ajax.frontend.itheima.net' + option.url;
  // 判断是否以 /my 开头路径，进行权限配置
  if (option.url.indexOf('/my/') !== -1) {
    // 配置请求头，设置 token
    option.headers = {
      Authorization: localStorage.getItem('token') || '',
    };
    // 判断用户有没有登录
    option.complete = function (res) {
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        localStorage.removeItem('token');
        layui.layer.msg(res.responseJSON.message + '请重新登录,正在跳转至登录界面');
        setTimeout(() => {
          location.href = '/login.html';
        }, 1300);
      }
    };
  }
});

$(function () {
  layui.form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 定义确认密码校验规则
    repwd(value) {
      if (value !== $('.reg-box [name=password]').val()) {
        $('.reg-box [name=password]').val('');
        $('.reg-box [name=repassword]').val('');
        return '两次密码不一致';
      }
    },
  });
});
