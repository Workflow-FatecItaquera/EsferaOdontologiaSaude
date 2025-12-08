from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Contas(Base):
    __tablename__ = "contas"

    id_conta = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    nome_conta = Column(String(255))
    banco = Column(String(255))
    agencia = Column(String(255))
    numero_conta = Column(String(255))
    saldo = Column(Float)
    observacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))
