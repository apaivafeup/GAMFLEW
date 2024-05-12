from sqlalchemy.orm import Session
from functools import cmp_to_key

import models
import schemas

def compare(user1, user2):
    if user1.score < user2.score:
        return 1
    elif user1.score > user2.score:
        return -1
    elif user1.score == user2.score:
        if (user1.successful_attempts < user2.successful_attempts):
            return 1
        elif (user1.successful_attempts > user2.successful_attempts):
            return -1
        elif (user1.successful_attempts == user2.successful_attempts):
            if (user1.achievements < user2.achievements):
                return 1
            elif (user1.achievements > user2.achievements):
                return -1
            elif (user1.achievements == user2.achievements):
                if (user1.failed_attempts < user2.failed_attempts):
                    return -1
                elif (user1.failed_attempts > user2.failed_attempts):
                    return 1
                elif (user1.failed_attempts == user2.failed_attempts):
                    if (user1.successful_attempts + user1.failed_attempts < user2.successful_attempts + user2.failed_attempts):
                        return 1
                    elif (user1.successful_attempts + user1.failed_attempts > user2.successful_attempts + user2.failed_attempts):
                        return -1
                    elif (user1.successful_attempts + user1.failed_attempts == user2.successful_attempts + user2.failed_attempts):
                        return user1.name < user2.name

def get_admin_leaderboard(db: Session):
    users = db.query(schemas.User).all()
    users.sort(key=cmp_to_key(compare))
    result = []

    for user in users:
        result.append(models.UserBasics(
            id=user.id,
            name=user.name,
            email=user.email,
            picture=user.picture,
            username=user.username,
            failed_attempts=user.failed_attempts,
            successful_attempts=user.successful_attempts,
            score=user.score,
            achievements=user.achievements,
            user_type=user.user_type,
            validated=user.validated
        ))

    return result

def get_player_leaderboard(db: Session):
    users = db.query(schemas.User).filter(schemas.User.user_type == schemas.UserType.PLAYER).all()
    users.sort(key=cmp_to_key(compare))
    result = []

    for user in users:
        result.append({
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "picture": user.picture,
            "successful_attempts": user.successful_attempts,
            "achievements": user.achievements,
            "user_type": user.user_type
        })

    return result
