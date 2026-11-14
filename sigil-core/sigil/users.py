"""
User Management Module
User CRUD operations
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
import logging
from .database import db
from .auth import get_password_hash, verify_password

logger = logging.getLogger(__name__)

class User:
    """User model"""
    
    @staticmethod
    async def create(email: str, password: str, full_name: Optional[str] = None) -> Dict[str, Any]:
        """Create a new user"""
        password_hash = get_password_hash(password)
        
        query = """
            INSERT INTO users (email, password_hash, full_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, full_name, created_at, is_active, subscription_tier
        """
        
        try:
            result = await db.fetchrow(query, email, password_hash, full_name)
            logger.info(f"User created: {email}")
            return result
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            raise
    
    @staticmethod
    async def get_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        query = "SELECT id, email, full_name, created_at, is_active, subscription_tier FROM users WHERE id = $1"
        return await db.fetchrow(query, user_id)
    
    @staticmethod
    async def get_by_email(email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        query = "SELECT * FROM users WHERE email = $1"
        return await db.fetchrow(query, email)
    
    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        user = await User.get_by_email(email)
        if not user:
            return None
        
        if not verify_password(password, user["password_hash"]):
            return None
        
        if not user["is_active"]:
            return None
        
        # Remove password hash from response
        user.pop("password_hash", None)
        return user
    
    @staticmethod
    async def update(user_id: str, **kwargs) -> Optional[Dict[str, Any]]:
        """Update user"""
        set_clause = ", ".join([f"{k} = ${i+1}" for i, k in enumerate(kwargs.keys())])
        values = list(kwargs.values())
        values.append(user_id)
        
        query = f"""
            UPDATE users
            SET {set_clause}
            WHERE id = ${len(values)}
            RETURNING id, email, full_name, created_at, is_active, subscription_tier
        """
        
        try:
            result = await db.fetchrow(query, *values)
            logger.info(f"User updated: {user_id}")
            return result
        except Exception as e:
            logger.error(f"Error updating user: {e}")
            raise
    
    @staticmethod
    async def delete(user_id: str) -> bool:
        """Delete user"""
        query = "DELETE FROM users WHERE id = $1"
        try:
            await db.execute(query, user_id)
            logger.info(f"User deleted: {user_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting user: {e}")
            return False
