$(function () {
  let layer = layui.layer;
  // 获取用户信息
  getUserInfo();

  // 点击按钮退出账号
  $('#logOut').on('click', () => {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      localStorage.removeItem('token');
      setTimeout(() => {
        location.href = '/login.html';
      }, 700);
      layer.close(index);
      layer.msg('退出成功，正在跳转至登录页面');
    });
  });
});

function getUserInfo() {
  $.ajax({
    type: 'get',
    url: '/my/userinfo',
    success(res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message);
      }
      renderUserInfo(res.data);
    },
  });
}

// 渲染用户信息
function renderUserInfo(data) {
  let name = data.nickname || data.username;
  $('.user-name').html(name);
  if (data.user_pic) {
    $('.layui-nav-img').attr('src', data.user_pic);
    $('.text-avatar').hide();
  } else {
    $('.layui-nav-img').hide();
    $('.text-avatar').html(name[0].toUpperCase());
  }
}
