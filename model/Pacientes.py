from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Pacientes(Base):
    __tablename__ = "pacientes"

    id_paciente = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_prontuario = Column(String(255), ForeignKey("prontuarios.id_prontuario"))
    id_endereco = Column(String(255), ForeignKey("enderecos.id_endereco"))
    nome = Column(String(255))
    data_nascimento = Column(Date)
    documento = Column(String(255))
    genero = Column(String(255))
    conhecimento_clinica = Column(String(1))
    observacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    prontuario = relationship("Prontuarios", foreign_keys=[id_prontuario])
    endereco = relationship("Enderecos")
