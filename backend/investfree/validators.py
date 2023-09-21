from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from profanity_check import predict


def validate_register(username, email, password, confirmation):
    if username == "" or email == "" or password == "" or confirmation == "":
        return {"error": "Please fill out all fields"}
    
    if predict([username])[0] == 1:
        return {"error": "Username contains bad / offensive words"}
    
    if len(username) < 3 or len(username) > 20:
        return {"error": "Username must be between 3 and 20 characters long"}

    try:
        validate_email(email)
    except ValidationError as error:
        return {"error": error.message}
    
    if len(password) < 8:
        return {"error": "Password must be at least 8 characters long"}
    
    if password != confirmation:
        return {"error": "Passwords don't match"}
    
    return {"success": "Registration successful"}
    