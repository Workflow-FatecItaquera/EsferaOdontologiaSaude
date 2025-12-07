from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Clinicas(Base):
    __tablename__ = "clinicas"

    id_clinica = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_conta = Column(String(255), ForeignKey("contas.id_conta"))
    id_endereco = Column(String(255), ForeignKey("enderecos.id_endereco"))
    razao_social = Column(String(255))
    nome_fantasia = Column(String(255))
    cnpj = Column(String(255))
    inscricao_estadual = Column(String(255))
    inscricao_municipal = Column(String(255))
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    conta = relationship("Contas")
    endereco = relationship("Enderecos")
