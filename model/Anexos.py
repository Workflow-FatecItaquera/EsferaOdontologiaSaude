from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Anexos(Base):
    __tablename__ = "anexos"

    id_anexo = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    referer = Column(String(255))
    nome = Column(String(255))
    tipo_arquivo = Column(String(255))
    tabela = Column(String(255))
    criado = Column(DateTime)
