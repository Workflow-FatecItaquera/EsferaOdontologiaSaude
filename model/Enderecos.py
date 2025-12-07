from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Enderecos(Base):
    __tablename__ = "enderecos"

    id_endereco = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    logradouro = Column(String(255))
    numero = Column(String(255))
    complemento = Column(String(255))
    bairro = Column(String(255))
    cidade = Column(String(255))
    estado = Column(String(255))
    cep = Column(String(255))
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

