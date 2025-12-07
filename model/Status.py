from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Status(Base):
    __tablename__ = "status"

    id_status = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String(255))
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))
