from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Prontuarios(Base):
    __tablename__ = "prontuarios"

    id_prontuario = Column(String(255), primary_key=True)
    id_paciente = Column(String(255), ForeignKey("pacientes.id_paciente"))
    observacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))
