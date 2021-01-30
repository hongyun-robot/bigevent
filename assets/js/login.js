$(function () {
  $('[name=username]').blur();
  // 点击切换登录注册模块
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  // 校验规则
  let form = layui.form;
  // 弹出层
  let layer = layui.layer;
  // 定义校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码不能包含空格'],
    // 定义确认密码校验规则
    repwd(value) {
      if (value !== $('.reg-box [name=password]').val()) {
        $('.reg-box [name=password]').val('');
        $('.reg-box [name=repassword]').val('');
        return '两次密码不一致';
      }
    },
  });

  // 提交注册信息
  $('#form-reg').on('submit', function (e) {
    e.preventDefault();
    let username = $('.reg-box [name=username]').val();
    let password = $('.reg-box [name=password]').val();
    $.post('/api/reguser', { username, password }, function (data) {
      console.log(data.status);
      if (data.status !== 0) {
        $('.reg-box [name=username]').val('');
        $('.reg-box [name=password]').val('');
        $('.reg-box [name=repassword]').val('');
        return layer.msg(data.message);
      }
      layer.msg('注册成功，切换至登录界面');
      $('#link_login').click();
    });
  });
  // 提交登录信息
  $('#form-login').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/api/login',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) return layer.msg(res.message);
        layer.msg(res.message + '正在跳转后台页面');
        localStorage.setItem('token', res.token);
        setTimeout(() => (location.href = '../../index.html'), 1000);
      },
    });
  });
});
