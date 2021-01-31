$(function () {
  layui.form.verify({
    samePwd(value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同';
      }
    },
  });
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.message);
        }
        layui.layer.msg(res.message);
        $('.layui-form')[0].reset();
      },
    });
  });
});
