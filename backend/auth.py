from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

from database import users_collection


# ==========================================
# REGISTER USER
# ==========================================

def register_user():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request data is missing"
            }), 400


        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()
        password = data.get("password", "")


        # -------------------------------
        # Required fields
        # -------------------------------

        if not name:
            return jsonify({
                "success": False,
                "message": "Name is required"
            }), 400


        if not password:
            return jsonify({
                "success": False,
                "message": "Password is required"
            }), 400


        if len(password) < 6:
            return jsonify({
                "success": False,
                "message": "Password must contain at least 6 characters"
            }), 400


        # User must provide email OR phone

        if not email and not phone:
            return jsonify({
                "success": False,
                "message": "Email or phone number is required"
            }), 400


        # -------------------------------
        # Check existing user
        # -------------------------------

        duplicate_conditions = []

        if email:
            duplicate_conditions.append({
                "email": email
            })

        if phone:
            duplicate_conditions.append({
                "phone": phone
            })


        existing_user = users_collection.find_one({
            "$or": duplicate_conditions
        })


        if existing_user:

            return jsonify({
                "success": False,
                "message": "Email or phone number is already registered"
            }), 409


        # -------------------------------
        # Hash password
        # -------------------------------

        hashed_password = generate_password_hash(
            password
        )


        # -------------------------------
        # Create user
        # -------------------------------

        user = {
            "name": name,
            "email": email if email else None,
            "phone": phone if phone else None,
            "password": hashed_password
        }


        result = users_collection.insert_one(user)


        return jsonify({

            "success": True,

            "message": "Account created successfully!",

            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email if email else None,
                "phone": phone if phone else None
            }

        }), 201


    except Exception as e:

        print("Register error:", e)

        return jsonify({
            "success": False,
            "message": "Server error while creating account"
        }), 500


# ==========================================
# LOGIN USER
# ==========================================

def login_user():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request data is missing"
            }), 400


        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()
        password = data.get("password", "")


        # -------------------------------
        # Validate password
        # -------------------------------

        if not password:

            return jsonify({
                "success": False,
                "message": "Password is required"
            }), 400


        # -------------------------------
        # Validate email / phone
        # -------------------------------

        if not email and not phone:

            return jsonify({
                "success": False,
                "message": "Email or phone number is required"
            }), 400


        # -------------------------------
        # Find user
        # -------------------------------

        if email:

            user = users_collection.find_one({
                "email": email
            })

        else:

            user = users_collection.find_one({
                "phone": phone
            })


        # -------------------------------
        # User not found
        # -------------------------------

        if not user:

            return jsonify({
                "success": False,
                "message": "Invalid email/phone or password"
            }), 401


        # -------------------------------
        # Check password
        # -------------------------------

        password_correct = check_password_hash(
            user["password"],
            password
        )


        if not password_correct:

            return jsonify({
                "success": False,
                "message": "Invalid email/phone or password"
            }), 401


        # -------------------------------
        # Successful login
        # -------------------------------

        return jsonify({

            "success": True,

            "message": "Login successful!",

            "user": {

                "id": str(user["_id"]),

                "name": user["name"],

                "email": user.get("email"),

                "phone": user.get("phone")

            }

        }), 200


    except Exception as e:

        print("Login error:", e)

        return jsonify({
            "success": False,
            "message": "Server error while logging in"
        }), 500