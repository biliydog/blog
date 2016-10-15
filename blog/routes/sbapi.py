
from flask import Blueprint
from flask import request
from flask import session
from static.utils import log
from models import User
import json
from models import Loft
from models import Comment
from datetime import datetime
sbapi = Blueprint('sbapi', __name__)


def current_user():
    uid = session.get('user_id')
    if uid is not None:
        u = User.query.get(uid)
        return u


@sbapi.route('/login', methods=['POST'])
def login():
    login_form = request.form
    name = login_form.get('username', '')
    pwd = login_form.get('password', '')
    log('拿到数据了吗？', name, pwd)
    r = {}
    if User.query.filter_by(username=name).first():
        user = User.query.filter_by(username=name).first()
        if user.password == pwd:
            session['user_id'] = user.id
            r['message'] = '登录成功！'
            return json.dumps(r, ensure_ascii=False)
        else:
            r['message'] = '密码错误！'
            return json.dumps(r, ensure_ascii=False)
    else:
        r['message'] = '用户不存在！'
        return json.dumps(r, ensure_ascii=False)


@sbapi.route('/new_loft', methods=['POST'])
def new_loft():
    loft_form = request.form
    loft = Loft(loft_form)
    user = current_user()
    loft.user_id = user.id
    loft.created_time = str(datetime.utcnow()).split('.')[0]
    loft.save()
    log('拿到数据了吗？', loft_form, loft.user_id)
    r = {
        'content': loft.content,
        'user': user.username,
        'id': loft.id,
        'time': loft.created_time
    }
    return json.dumps(r, ensure_ascii=False)


# @sbapi.route('/loft', methods=['POST', 'GET'])
# def index_loft():
#     log('调用了API吗？')
#     loft_list = Loft.query.all()
#     r, list = {}, []
#     for i in loft_list:
#         name = User.query.get(i.user_id).username
#         r = {
#             'content': i.content,
#             'user': name,
#             'id': i.id,
#             'time': i.local_time()
#         }
#         list.append(r)
#         r = {}
#     return json.dumps(list, ensure_ascii=False)


@sbapi.route('/new_comment', methods=['POST'])
def new_comment():
    com_form = request.form
    comment = Comment(com_form)
    user = current_user()
    comment.user_id = user.id
    log('评论的用户取到了', comment.user_id)
    comment.loft_id = com_form.get('loftId')
    comment.created_time = str(datetime.utcnow()).split('.')[0]
    comment.save()
    log('拿到评论了吗？', com_form, comment.user_id)
    r = {
        'content': comment.content,
        'user': user.username,
        'time': comment.created_time
    }
    return json.dumps(r, ensure_ascii=False)


@sbapi.route('/comment_all', methods=['POST'])
def comment_all():
    form = request.form
    loft_id = form.get('id')
    comment_list = Comment.query.filter_by(loft_id=loft_id)
    log(comment_list)
    r, list = {}, []
    for i in comment_list:
        name = User.query.get(i.user_id).username
        r = {
            'content': i.content,
            'user': name,
            'time': i.created_time
        }
        list.append(r)
        r = {}
    return json.dumps(list, ensure_ascii=False)


@sbapi.route('/edit', methods=['POST'])
def edit():
    loft_form = request.form
    loft_id = loft_form.get('id')
    new_content = loft_form.get('new_content')
    loft = Loft.query.filter_by(id=loft_id).first()
    loft.content = new_content
    loft.save()
    log('拿到数据了吗？', loft_form, loft.user_id)
    return 'A'


@sbapi.route('/delete', methods=['POST'])
def delete():
    loft_form = request.form
    loft_id = loft_form.get('id')
    loft = Loft.query.filter_by(id=loft_id).first()
    loft_comments = Comment.query.filter_by(loft_id=loft_id).all()
    for i in loft_comments:
        i.delete()
    loft.delete()
    return 'A'