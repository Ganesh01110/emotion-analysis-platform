"""
AES-256 Encryption utilities for securing user thoughts
"""

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
import base64
import os
from typing import Optional


class EncryptionManager:
    """Handles encryption and decryption of sensitive data"""
    
    def __init__(self, encryption_key: Optional[str] = None):
        """
        Initialize encryption manager
        
        Args:
            encryption_key: Base encryption key (from environment)
        """
        if encryption_key is None:
            encryption_key = os.getenv("ENCRYPTION_KEY")
        
        if not encryption_key:
            raise ValueError("ENCRYPTION_KEY environment variable not set")
        
        # Derive a proper Fernet key from the encryption key
        self.fernet = self._create_fernet(encryption_key)
    
    def _create_fernet(self, key: str) -> Fernet:
        """
        Create Fernet cipher from string key
        
        Args:
            key: String encryption key
            
        Returns:
            Fernet cipher instance
        """
        # Use PBKDF2HMAC to derive a proper 32-byte key
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=b'emotion_analysis_salt',  # In production, use random salt per user
            iterations=100000,
            backend=default_backend()
        )
        
        derived_key = base64.urlsafe_b64encode(kdf.derive(key.encode()))
        return Fernet(derived_key)
    
    def encrypt_text(self, plaintext: str) -> str:
        """
        Encrypt text
        
        Args:
            plaintext: Text to encrypt
            
        Returns:
            Encrypted text (base64 encoded)
        """
        if not plaintext:
            return ""
        
        encrypted_bytes = self.fernet.encrypt(plaintext.encode('utf-8'))
        return encrypted_bytes.decode('utf-8')
    
    def decrypt_text(self, ciphertext: str) -> str:
        """
        Decrypt text
        
        Args:
            ciphertext: Encrypted text (base64 encoded)
            
        Returns:
            Decrypted plaintext
        """
        if not ciphertext:
            return ""
        
        decrypted_bytes = self.fernet.decrypt(ciphertext.encode('utf-8'))
        return decrypted_bytes.decode('utf-8')


# Global encryption manager instance
_encryption_manager: Optional[EncryptionManager] = None


def get_encryption_manager() -> EncryptionManager:
    """Get or create global encryption manager"""
    global _encryption_manager
    
    if _encryption_manager is None:
        _encryption_manager = EncryptionManager()
    
    return _encryption_manager


def encrypt(text: str) -> str:
    """Convenience function to encrypt text"""
    return get_encryption_manager().encrypt_text(text)


def decrypt(text: str) -> str:
    """Convenience function to decrypt text"""
    return get_encryption_manager().decrypt_text(text)
