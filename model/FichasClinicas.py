from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class FichasClinicas(Base):
    __tablename__ = "fichasclinicas"

    id_fichaclinica = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_prontuario = Column(String(255), ForeignKey("prontuarios.id_prontuario"))
    id_consulta = Column(String(255), ForeignKey("consultas.id_consulta"))
    id_paciente = Column(String(255), ForeignKey("pacientes.id_paciente"))
    data_atendimento = Column(DateTime)
    procedimento = Column(String(255))
    id_usuario = Column(String(255), ForeignKey("usuarios.id_usuario"))
    observacoes_clinicas = Column(Text)
    evolucao = Column(Text)
    recomendacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    prontuario = relationship("Prontuarios")
    consulta = relationship("Consultas")
    paciente = relationship("Pacientes")
    usuario = relationship("Usuarios")
