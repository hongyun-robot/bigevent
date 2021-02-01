$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initCate();
  function initCate() {
    $.ajax({
      type: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        let htmlCate = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlCate);
        form.render();
      },
    });
  }
  // 初始化富文本
  initEditor();
  // 1. 初始化图片裁剪器
  let $image = $('#image');

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 点击按钮选择图片
  $('.layui-btn-danger').on('click', () => {
    $('#select_img').click();
  });

  $('#select_img').on('change', e => {
    let files = e.target.files;
    if (files.length === 0) return;
    let newImgurl = URL.createObjectURL(files[0]);
    $image.cropper('destroy').attr('src', newImgurl).cropper(options);
  });

  let art_state = '已发布';
  $('.btn-Save2').on('click', () => {
    art_state = '草稿';
  });
  $('.btn-Save1').on('click', () => {
    art_state = '已发布';
  });
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    let fd = new FormData($(this)[0]);
    fd.append('state', art_state);

    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob);
      });
    publishArticle(fd);
  });

  // 定义一个发布文章方法
  function publishArticle(fd) {
    $.ajax({
      type: 'post',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (response) {
        if (response.status !== 0) return layer.msg(response.message);
        layer.msg(response.message);
        location.href = '/art/art_list.html';
      },
    });
  }
});
