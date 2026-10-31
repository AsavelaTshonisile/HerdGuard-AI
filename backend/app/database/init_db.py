from app.database.session import Base, engine, SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings
import app.models  # ensure models are loaded into Base.metadata

def init_db():
    Base.metadata.create_all(bind=engine)
    ensure_builtin_admin()

def ensure_builtin_admin():
    db = SessionLocal()
    try:
        admin_email = settings.DEFAULT_ADMIN_EMAIL.lower()
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            admin_user = User(
                email=admin_email,
                hashed_password=get_password_hash(settings.DEFAULT_ADMIN_PASSWORD),
                full_name=settings.DEFAULT_ADMIN_NAME,
                phone_number="+27 82 100 0001",
                role="admin",
                organization_or_practice="HerdGuard AI Operations",
                province="Gauteng",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print(f"Built-in Administrator created: {admin_email}")
        else:
            # Ensure admin password matches configured DEFAULT_ADMIN_PASSWORD and remains active
            from app.core.security import verify_password
            needs_update = False
            if not verify_password(settings.DEFAULT_ADMIN_PASSWORD, admin_user.hashed_password):
                admin_user.hashed_password = get_password_hash(settings.DEFAULT_ADMIN_PASSWORD)
                needs_update = True
            if admin_user.role != "admin":
                admin_user.role = "admin"
                needs_update = True
            if not admin_user.is_active:
                admin_user.is_active = True
                needs_update = True
            if needs_update:
                db.commit()
                print(f"Built-in Administrator credentials synchronized: {admin_email}")
    except Exception as e:
        db.rollback()
        print(f"Error verifying built-in admin user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating all tables in SQLite database...")
    init_db()
    print("Database tables and built-in credentials verified successfully!")
