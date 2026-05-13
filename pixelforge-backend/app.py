from flask import Flask
from flask_cors import CORS
import os
from routes.image_routes import image_bp
from routes.enhancement_routes import enhancement_bp
from routes.transform_routes import transform_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024 # 50MB
    
    app.register_blueprint(image_bp, url_prefix='/api/image')
    app.register_blueprint(enhancement_bp, url_prefix='/api/enhancement')
    app.register_blueprint(transform_bp, url_prefix='/api/transform')

    @app.route('/')
    def index():
        return {'status': 'ok'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
