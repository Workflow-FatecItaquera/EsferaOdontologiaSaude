from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Consultas(Base):
    __tablename__ = "consultas"

    id_consulta = Column(String(255), primary_key=True)
    id_paciente = Column(String(255), ForeignKey("pacientes.id_paciente"))
    id_usuario = Column(String(255), ForeignKey("usuarios.id_usuario"))
    id_procedimento = Column(String(255), ForeignKey("procedimentos.id_procedimento"))
    id_agenda = Column(String(255), ForeignKey("agendas.id_agenda"))
    id_honorario = Column(String(255), ForeignKey("honorario.id_honorario"))
    valor_honorario = Column(Float)
    data = Column(DateTime)
    observacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))
    status = Column(String(255), ForeignKey("status.id_status"))

    paciente = relationship("Pacientes")
    usuario = relationship("Usuarios")
    procedimento = relationship("Procedimentos")
    agenda = relationship("Agendas")
    honorario_rel = relationship("Honorario")
    status_rel = relationship("Status")
