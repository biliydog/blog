from flask import render_template
from flask import Blueprint
from flask import request
from flask import session
from static.utils import log
from models import User
from models import Loft
import json


small_blog = Blueprint('sb', __name__)


def current_user():
    uid = session.get('user_id')
    if uid is not None:
        u = User.query.get(uid)
        return u


@small_blog.route('/')
def login_view():
    return render_template('login.html')


@small_blog.route('/register', methods=['POST'])
def register():
    print('yunxingle!!!!')
    r = {}
    form = request.form
    name = form.get('username', '')
    if User.query.filter_by(username=name).first():
        r['message'] = '用户已存在！'
        return json.dumps(r, ensure_ascii=False)
    else:
        new_user = User(form)
        new_user.save()
        log('是否成功注册：', new_user.id, new_user.username)
        session['user_id'] = new_user.id
        r['message'] = '注册成功！'
        return json.dumps(r, ensure_ascii=False)


@small_blog.route('/index')
def index():
    return render_template('index.html')



@small_blog.route('/loft')
def loft_index_view():
    log('调用了API吗？')
    loft_list = Loft.query.all()
    r  = {}
    loft_info = []
    for i in loft_list:

        name = User.query.get(i.user_id).username
        r = {
            'content': i.content,
            'user': name,
            'id': i.id,
            'time': i.created_time
        }
        loft_info.append(r)
        r = {}
    loft_info.reverse()
    return render_template('loft2.html', lofts=loft_info)

#
# @small_blog.route('/favicon.ico')
# def fav_ico():
#     return url_for('static', filename='img/fav.jpg', _external=True)

