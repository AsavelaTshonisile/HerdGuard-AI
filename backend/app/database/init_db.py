from app.database.session import Base, engine
import app.models  # ensure models are loaded into Base.metadata

def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    print("Creating all tables in SQLite database...")
    init_db()
    print("Database tables created successfully!")
