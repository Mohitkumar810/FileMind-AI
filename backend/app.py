from flask import Flask, jsonify
from flask_cors import CORS

from database import users_collection
from auth import register_user, login_user


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "success": True,
        "message": "FileMind AI Backend is running!"
    })


# ==========================================
# STATUS
# ==========================================

@app.route("/api/status")
def status():

    return jsonify({

        "success": True,

        "status": "online",

        "project": "FileMind AI",

        "database": "MongoDB"

    })


# ==========================================
# TEST DATABASE
# ==========================================

@app.route("/api/test-db")
def test_db():

    try:

        users_collection.find_one()

        return jsonify({

            "success": True,

            "status": "success",

            "message": "MongoDB is connected successfully!"

        })


    except Exception as e:

        return jsonify({

            "success": False,

            "status": "error",

            "message": str(e)

        }), 500


# ==========================================
# REGISTER
# ==========================================

@app.route(
    "/api/register",
    methods=["POST"]
)
def register():

    return register_user()


# ==========================================
# LOGIN
# ==========================================

@app.route(
    "/api/login",
    methods=["POST"]
)
def login():

    return login_user()


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )