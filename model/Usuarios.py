from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Usuarios(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(String(255), primary_key=True)
    id_funcao = Column(String(255), ForeignKey("funcoes.id_funcao"))
    id_cor = Column(String(255), ForeignKey("cores.id_cor"))
    id_conta = Column(String(255), ForeignKey("contas.id_conta"))
    id_endereco = Column(String(255), ForeignKey("enderecos.id_endereco"))
    id_agenda = Column(String(255), ForeignKey("agendas.id_agenda"))
    nome = Column(String(255))
    data_nascimento = Column(Date)
    documento = Column(String(255))
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    funcao = relationship("Funcoes")
    cor = relationship("Cores")
    conta = relationship("Contas")
    endereco = relationship("Enderecos")
    agenda = relationship("Agendas")