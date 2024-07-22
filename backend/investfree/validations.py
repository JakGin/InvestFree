import re
from django.core.validators import validate_email


def username_valid(username: str) -> bool:
    if len(username) < 3:
        return False
    return True


def email_valid(email: str) -> bool:
    try:
        validate_email(email)
    except Exception:
        return False
    return True


def password_valid(password: str) -> bool:
    password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    if re.match(password_pattern, password) is None:
        return False
    return True


def validate_register_data(data):
    if len(data) != 4:
        raise Exception("Not every register field was provided")

    try:
        username = data["username"]
        email = data["email"]
        password = data["password"]
        confirm_password = data["confirmPassword"]
    except KeyError:
        raise Exception("Invalid request data")

    if not username_valid(username):
        raise Exception("Username must be at least 3 characters long")

    if not email_valid(email):
        raise Exception("Invalid email")

    if not password_valid(password):
        raise Exception("Password does not fulfil the requirements")

    if password != confirm_password:
        raise Exception("Passwords do not match")
