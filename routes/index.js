var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js')
var Post = require('../models/post.js')

/* GET home page. */
router.get('/', function(req, res) {
    //读取所有的用户的微博传递个页面的posts属性。
  Post.get(null,function (err,posts) {
      if(err){
          posts=[];
      }
      res.render('index', {
              title: '首页',
              posts:posts,
              user : req.session.user,
              success : req.flash('success').toString(),
              error : req.flash('error').toString()
          });
  });
});
//用户页面
router.get('/u/:user',function (req,res) {
    User.get(req.params.user, function(err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            res.redirect('/');
        }else {
            Post.get(user.name, function(err, posts) {
                if (err) {
                    req.flash('error', err);
                    res.redirect('/');
                }else {
                    res.render('user', {
                        title: user.name,
                        posts: posts,
                    });
                }
            });
        }
    });
});
//发表微博路由
router.post("/post",checkLogin);
router.post('/post',function (req,res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            req.flash('error', err);
            res.redirect('/');
        }else {
            req.flash('success', '发表成功');
            res.redirect('/u/' + currentUser.name);
        }

    });
});
//注册页路由
router.get('/reg',checkNotLogin);
router.get('/reg',function (req,res) {
   res.render('reg',{
     title:'用户注册'
   })
});
// router.post('/reg',checkNotLogin);
router.post('/reg',checkNotLogin);
router.post('/reg',function (req,res) {
   if(req.body['password-repeat'] != req.body['password']){
       req.flash('error', '两次输入的口令不一致');
       return res.redirect('/reg');
   }
  //生成口令的散列值
  var hash = crypto.createHash('md5');
  var password = hash.update(req.body.password).digest('base64');
  var newUser = new User({
    name: req.body.username,
    password: password,
  });

  //检查用户名是否已经存在
  User.get(newUser.name,function (err,user) {//User为设计的用户对象
    if(user){
      err="用户名已经存在";
    }
    if(err){
      req.flash('error',err);
      return res.redirect('/reg');
    }
    //如果不存在则新增用户
    newUser.save(function (err) {
      if(err) {
        req.flash('error',err);
        return res.redirect('/reg');
      }
      req.session.user=newUser;//向会话对象写入了当前用户的信息
      req.flash('success','注册成功');
      res.redirect('/');
    })
  });
});
router.get('/login',checkNotLogin);
router.get('/login',function (req,res) {
   res.render('login',{
       title:'用户登入',
   });
});
router.post('/login',checkNotLogin);
router.post('/login',function (req,res) {
//生成密码的散列值
    var md5 =crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');

    User.get(req.body.username,function (err,user) {
        if(!user){
            req.flash('error','用户不存在')
            return res.redirect('/login');
        }
        if(user.password!=password){
            req.flash('error',"用户密码错误");
            return res.redirect('/login');
        }
        req.session.user=user;
        req.flash('success','登录成功');
        res.redirect('/');
    })
});
router.get('/logout',checkLogin);
router.get('/logout',function (req,res) {
   req.session.user=null;
   req.flash('success','退出成功');
    res.redirect('/');
});
function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}



module.exports = router;

