from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Honorario(Base):
    __tablename__ = "honorario"

    id_honorario = Column(String(255), primary_key=True)
    id_usuario = Column(String(255), ForeignKey("usuarios.id_usuario"))
    id_procedimento = Column(String(255), ForeignKey("procedimentos.id_procedimento"))
    valor_honorario = Column(Float)
    data_inicio_vigencia = Column(Date)
    data_fim_vigencia = Column(Date)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    usuario = relationship("Usuarios")
    procedimento = relationship("Procedimentos")
