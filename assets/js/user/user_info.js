let form = layui.form;
let layer = layui.layer;
$(function () {
  // 定义用户名验证规则
  form.verify({
    nickName(value) {
      if (value.length > 6) {
        return '用户名不能大于 6 位';
      }
    },
  });
  initUserInfo();
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！');
        }
        layer.msg('更新用户信息成功！');
        initUserInfo();
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo();
        console.log(window.parent.getUserInfo);
      },
    });
  });
  // 重置按钮
  $('.layui-btn-primary').on('click', function (e) {
    e.preventDefault();
    initUserInfo();
  });
});

function initUserInfo() {
  $.ajax({
    method: 'get',
    url: '/my/userinfo',
    success(res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      form.val('formUserInfo', res.data);
    },
  });
}
