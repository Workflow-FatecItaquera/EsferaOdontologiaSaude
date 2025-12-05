from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Agendas(Base):
    __tablename__ = "agendas"

    id_agenda = Column(String(255), primary_key=True)
    id_consulta = Column(String(255), ForeignKey("consultas.id_consulta"))
    data = Column(Date)
    horario_inicio = Column(Time)
    horario_fim = Column(Time)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))
    status = Column(String(255), ForeignKey("status.id_status"))

    consulta = relationship("Consultas", foreign_keys=[id_consulta])
    status_rel = relationship("Status")