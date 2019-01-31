var mongodb=require('./db');
function User(user) {
    this.name=user.name;
    this.password=user.password
};
module.exports=User;

//保存用户到数据库,对象实例的方法
User.prototype.save=function save(callback) {
    var user={
        name:this.name,
        password:this.password,
    };
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为name属性添加索引
            // collection.createIndex('name',{unique:ture});
            //写入user文档
            collection.insert(user,{safe:true},function (err,user) {
                mongodb.close();
                callback(err,user);
            });
        });
    });
}

//函数字面量的方法，用于从数据库中查找指定的用户
User.get = function get(username, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.findOne({name: username}, function(err, doc) {
                mongodb.close();
                if (doc) {

                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};