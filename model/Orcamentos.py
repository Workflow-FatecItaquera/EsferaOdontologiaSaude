from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Orcamentos(Base):
    __tablename__ = "orcamentos"

    id_orcamento = Column(String(255), primary_key=True)
    id_funcionario = Column(String(255), ForeignKey("usuarios.id_usuario"))
    id_paciente = Column(String(255), ForeignKey("pacientes.id_paciente"))
    data_orcamento = Column(DateTime)
    valor_total = Column(Float)
    observacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))
    status = Column(String(255), ForeignKey("status.id_status"))

    funcionario = relationship("Usuarios")
    paciente = relationship("Pacientes")
    status_rel = relationship("Status")
