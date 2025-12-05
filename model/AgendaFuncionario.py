from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base


class Agendafuncionario(Base):
    __tablename__ = "agendafuncionario"

    id_agendafuncionario = Column(String(255), primary_key=True)
    id_agenda = Column(String(255), ForeignKey("agendas.id_agenda"))
    id_usuario = Column(String(255), ForeignKey("usuarios.id_usuario"))

    agenda = relationship("Agendas")
    usuario = relationship("Usuarios")