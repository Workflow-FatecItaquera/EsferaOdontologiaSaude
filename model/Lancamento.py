from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Lancamentos(Base):
    __tablename__ = "lancamentos"

    id_lancamento = Column(String(255), primary_key=True)
    id_conta = Column(String(255), ForeignKey("contas.id_conta"))
    id_funcionario = Column(String(255), ForeignKey("usuarios.id_usuario"))
    tipo_lancamento = Column(String(255), ForeignKey("tipo_lancamento.id_tipolancamento"))
    valor_total = Column(Float)
    anotacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    conta = relationship("Contas")
    funcionario = relationship("Usuarios")
    tipo = relationship("TipoLancamento")
