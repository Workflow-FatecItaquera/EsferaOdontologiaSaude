from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Usuarios(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_funcao = Column(String(255), ForeignKey("funcoes.id_funcao"))
    id_cor = Column(String(255), ForeignKey("cores.id_cor"))
    id_conta = Column(String(255), ForeignKey("contas.id_conta"))
    id_endereco = Column(String(255), ForeignKey("enderecos.id_endereco"))
    nome = Column(String(255))
    rg = Column(String(25))
    cpf = Column(String(25))
    email = Column(String(100))
    cro = Column(String(25))
    sexo = Column(String(25))
    data_nascimento = Column(Date)
    estado_civil = Column(String(30))
    celular = Column(String(30))
    telefone = Column(String(30))
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    funcao = relationship("Funcoes")
    cor = relationship("Cores")
    conta = relationship("Contas")
    endereco = relationship("Enderecos")