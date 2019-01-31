var mongodb = require('./db');
function Post(username,post,time){
    this.user=username;
    this.post=post;
    if(time) {
        this.time=time;
    }else{
        this.time=new Date();
    }
};
module.exports=Post;
Post.prototype.save=function save(callback) {
    //用于将对象的变动保存到数据库
    var post={
      user:this.user,
      post:this.post,
      time:this.time,
    };
    mongodb.open(function (err,db) {
        if(err) {
            return callback(err);
        }
        //读取posts集合
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为user添加索引
            // collection.ensureIndex('user');
            //写入post文档
            collection.insert(post,{safe:true},function(err,post){
                mongodb.close();
                callback(err,post);
            });
        });
    });
};
//获取微博
Post.get=function get(username,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
                }
                //查找user属性为username的文档，如果username是null则匹配全部
                var query={};
                if(username) {
                    query.user = username;
                }
                collection.find(query).sort({time:-1}).toArray(function (err,docs) {
                    mongodb.close();
                    if(err){
                        callback(err,null);
                    }
                    //封装posts为Post对象s
                    var posts=[];
                    docs.forEach(function (doc,index) {
                        var post=new Post(doc.user,doc.post,doc.time);
                        posts.push(post);
                    });
                    callback(null,posts)
                });
        });
    });
};