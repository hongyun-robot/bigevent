$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initArtCateList();
  let layerIndex = null;
  // 点击按钮添加文章类别
  $('#addCate').on('click', function () {
    layerIndex = layer.open({
      title: '添加文章分类',
      type: 1,
      area: ['500px', '250px'],
      content: $('#add').html(), //这里content是一个普通的String
    });
  });
  $('body').on('submit', '#addCateForm', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        initArtCateList();
        layer.close(layerIndex);
      },
    });
  });

  // 编辑按钮弹出层
  let editIndex = null;
  $('body').on('click', '#editBtn', function () {
    editIndex = layer.open({
      title: '编辑文章分类',
      type: 1,
      area: ['500px', '250px'],
      content: $('#edit').html(), //这里content是一个普通的String
    });
    let id = $(this).attr('data-id');
    $.ajax({
      type: 'get',
      url: '/my/article/cates/' + id,
      success: function (response) {
        if (response.status !== 0) {
          return layer.msg(response.message);
        }
        form.val('editCateForm', response.data);
      },
    });
  });

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#editCateForm', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！');
        }
        layer.msg('更新分类数据成功！');
        layer.close(editIndex);
        initArtCateList();
      },
    });
  });

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id');
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！');
          }
          layer.msg('删除分类成功！');
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });

  // 初始化文章；类别
  function initArtCateList() {
    $.ajax({
      type: 'get',
      url: '/my/article/cates',
      success(res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        let htmlStr = template('tpl-template', res);
        $('tbody').html(htmlStr);
      },
    });
  }
});
