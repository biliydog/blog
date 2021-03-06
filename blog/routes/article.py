from flask import Blueprint
from flask import request
from flask import session
from flask import redirect
from flask import url_for
from models import User
from static.utils import log
from models import Article
from flask import render_template


article = Blueprint('article', __name__)


@article.route('/store')
def all_article():
    log('zhixingzhegelema')
    article_list = Article.query.all()
    log('article都拿到了吗：', len(article_list))
    list =[]
    for i in article_list:
        user = User.query.filter_by(id=i.user_id).first().username
        e = {
            'created_time': i.created_time,
            'user': user,
            'content': i.content,
            'id': int(i.id)
        }
        list.append(e)
    list.reverse()
    return render_template('store.html', articles=list)


@article.route('/edit_view/<int:id>')
def edit_view(id):
    return render_template('edit_article.html', id=id)


