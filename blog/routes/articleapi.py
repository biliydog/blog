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
from models import Loft
from models import Article
from routes.sbapi import current_user


article_api = Blueprint('articleapi', __name__)


@article_api.route('/new_article', methods=['POST'])
def new_article():
    form = request.form
    user = current_user()
    article = Article(form)
    log('aticle成功建立了？', article.created_time)
    article.user_id = user.id
    log('拿到user了吗', article.user_id)
    title = find_title(article.content)
    log('title函数找得怎么样', title)
    article.save()
    r = {
        'user': user.username,
        'created_time': article.created_time,
        # 'title': title
    }
    return json.dumps(r, ensure_ascii=False)


def find_title(a):
    cache = a.split('<h2>', 1)[0]
    log('第一次分离', cache)
    title = cache.split('</h2>', 1)[0]
    log('第2次分离', title)
    return title
