$(function () {
  let layer = layui.layer;
  let dataURL = '';
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $('#image');
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 点击选择文件
  $('#btnChoose').on('click', function (e) {
    $('[type=file]').click();
  });
  $('[type=file]').on('change', function (e) {
    // 1. 拿到用户选择的文件
    let files = e.target.files;
    // 1.1 判断用户有没有选择图片
    if (files.length <= 0) return layer.msg('请选择图片');

    // 2. 根据选择的文件，创建一个对应的 URL 地址
    let newImgURL = URL.createObjectURL(files[0]);

    // 3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 发送 post 请求更换头像
  $('.layui-btn-danger').on('click', function (e) {
    dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
      type: 'post',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo();
      },
    });
  });
});
