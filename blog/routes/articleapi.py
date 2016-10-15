from flask import render_template
from flask import Blueprint
from flask import request
from flask import session
from flask import redirect
from flask import url_for
from flask_sqlalchemy import SQLAlchemy
from static.utils import log
from models import User
import json
from models import Article
from routes.sbapi import current_user


article_api = Blueprint('articleapi', __name__)


@article_api.route('/new_article', methods=['POST'])
def new_article():
    form = request.form
    user = current_user()
    article = Article(form)
    log('aticle成功建立了？', article.created_time, article.content)
    article.user_id = user.id
    log('拿到user了吗', article.user_id)
    article.save()
    r = {
        'user': user.username,
        'created_time': article.created_time,
        # 'title': title
    }
    return json.dumps(r, ensure_ascii=False)


@article_api.route('/article_del', methods=['POST'])
def del_article():
    id = request.form.get('id', '')
    log('拿到articleID了吗：', id)
    article = Article.query.filter_by(id=id).first()
    article.delete()
    return 'del success'


@article_api.route('/edit_article', methods=['POST'])
def edit_article():
    id = request.form.get('id')
    log('拿到的ID是？', id)
    return redirect(url_for('article.edit_view'))


