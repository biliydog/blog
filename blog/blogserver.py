from flask import Flask
from routes.sbapi import sbapi as sbapi_routes
from routes.smallblog import small_blog as small_routes


app = Flask(__name__)
app.secret_key = 'second version'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True


app.register_blueprint(small_routes)
app.register_blueprint(sbapi_routes, url_prefix='/api')


if __name__ == '__main__':
    config = dict(
        debug=True,
        host='0.0.0.0',
        port=3000,
    )
    app.run(**config)
   
