from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Procedimentos(Base):
    __tablename__ = "procedimentos"

    id_procedimento = Column(String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String(255))
    id_categoria = Column(String(255), ForeignKey("categoria_procedimento.id_categoriaprocedimento"))
    cod_procedimento = Column(String(255))
    valor_sugerido = Column(Float)
    descricao = Column(Text)
    duracao_media = Column(Integer)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    categoria = relationship("CategoriaProcedimento")
