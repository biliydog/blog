from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from static.utils import log
import time
from flask_moment import Moment
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from datetime import datetime


app = Flask(__name__)
app.secret_key = 'json fun'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
# 指定数据库的路径
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:776632@localhost/blog'

db = SQLAlchemy(app)
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)
moment = Moment(app)

class Helper(object):
    def __repr__(self):
        """
        __repr__ 是一个魔法方法
        简单来说, 它的作用是得到类的 字符串表达 形式
        比如 print(u) 实际上是 print(u.__repr__())
        """
        classname = self.__class__.__name__
        properties = ['{}: ({})'.format(k, v) for k, v in self.__dict__.items()]
        s = '\n'.join(properties)
        return '< {}\n{} \n>\n'.format(classname, s)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Loft(db.Model, Helper):
    __tablename__ = 'lofts'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String())
    created_time = db.Column(db.String())
    user_id = db.Column(db.Integer)

    def __init__(self, form):
        self.content = form.get('content', '')
        self.created_time = int(time.time())

    def valid(self):
        return len(self.content) > 0

    # def local_time(self):
    #     # string = '%Y/%m/%d %H:%M:%S'
    #     # value = time.localtime(self.created_time)
    #     # dt = time.strftime(string, value)
    #     dt = datetime.utcnow()
    #     return dt


class User(db.Model, Helper):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String())
    password = db.Column(db.String())

    def __init__(self, form):
        self.username = form.get('username', '')
        self.password = form.get('password')
    #
    # def valid(self):
    #     if User.query.filter_by(username=name).first()


class Comment(db.Model, Helper):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String())
    created_time = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer)
    loft_id = db.Column(db.Integer)

    def __init__(self, form):
        self.content = form.get('content', '')
        self.created_time = int(time.time())

    def valid(self):
        return len(self.content) > 0



if __name__ == '__main__':
    # 先 drop_all 删除所有数据库中的表
    # 再 create_all 创建所有的表
    manager.run()
    print('init database')