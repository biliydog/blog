from flask import Flask
from routes.sbapi import sbapi as sbapi_routes
from routes.article import article as article_routes
from routes.smallblog import small_blog as small_routes
from routes.articleapi import article_api as article_api_routes
from flask_script import Manager


app = Flask(__name__)
app.secret_key = 'second version'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
manager = Manager(app)


app.register_blueprint(small_routes)
app.register_blueprint(sbapi_routes, url_prefix='/api')
app.register_blueprint(article_api_routes, url_prefix='/api')


if __name__ == '__main__':
    # debug 模式可以自动加载你对代码的变动, 所以不用重启程序
    # host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    config = dict(
        debug=True,
        host='0.0.0.0',
        port=3000
    )
    app.run(**config)
    # app.run() 开始运行服务器
    # 所以你访问下面的网址就可以打开网站了
    # http://127.0.0.1:3000/
