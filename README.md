安装EXpress $ npm install -g express
创建一个项目 $ express --view=ejs microblog(项目名称），再根据终端提示完成后续命令
express4.0之后运行启动服务器是运行 $ npm start

app.js是工程的入口。routes是一个本地模块，为指定路径组织返回内容
layout.ejs是一个页面布局模板，它描述了整个页面的框架结构，默认情况下每个单独的页面都继承来自这个框架，替换掉<%- body >部分。

建立这个项目步骤： 功能分析，路由规划，界面设计

连接数据库$ npm install -S mongodb  然后在工程目录下新建一个settings.js文件用于保存数据库的连接信息。数据库命名为microblog。数据库服务器在本地所以端口为localhost
接着在目录下新建models中新建db.js，然后输出了创建的数据库连接
把会话信息存储在数据库便于持久维护 $ npm install -S connect-mongo
创建用户模型，微博模型
