from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Funcoes(Base):
    __tablename__ = "funcoes"

    id_funcao = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String(255))
    descricao = Column(String(255))
    nivel_acesso = Column(String(255))
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))
