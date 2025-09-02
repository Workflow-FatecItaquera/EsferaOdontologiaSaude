# sqlalchemy é a lib que comunica com o banco via ORM,
# então aqui vc importa os tipos de dados do MySql que vc
# vai usar e as columas pra declarar os atributos de uma
# entidade
from sqlalchemy import Boolean, Column, String, Date, Integer
from database import Base # isso é a variável que criamos em database.py

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