import re
from django.core.validators import validate_email


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

    if len(username) < 3:
        raise Exception("Username must be at least 3 characters long")

    try:
        validate_email(email)
    except Exception:
        raise Exception("Invalid email")

    password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    if re.match(password_pattern, password) is None:
        raise Exception("Password does not fulfil the requirements")

    if password != confirm_password:
        raise Exception("Passwords do not match")
