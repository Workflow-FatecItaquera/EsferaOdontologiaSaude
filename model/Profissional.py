from sqlalchemy import Boolean, Column, String, Date, Integer
from database import Base

class Profissional(Base):
    __tablename__ = 'profissionais'

    id = Column(Integer, primary_key=True, index=True)
    nomeCompleto = Column(String(50))
    cor = Column(String(10))
    dataNascimento = Column(Date)
    genero = Column(String(15))
    estadoCivil = Column(String(20))
    cro = Column(String(50),unique=True)
    numero = Column(Integer)
    fotoPerfil = Column(String(1000000000))
    cpf = Column(String(20), unique=True)
    rg = Column(String(20),unique=True)
    username = Column(String(100), unique=True)
    clinica = Column(Integer)