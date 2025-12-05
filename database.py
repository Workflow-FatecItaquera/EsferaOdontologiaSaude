from sqlalchemy import create_engine # Função que cria o "motor" do banco de dados.
from sqlalchemy.orm import sessionmaker # Cria a sessão permitindo a execução de comandos
from sqlalchemy.ext.declarative import declarative_base # A base pra declarar coisas como tabelas

# Link do banco de dados: linguagem+lib://usuario:senha@host:porta/nomeBanco
# URL_DATABASE = 'mysql+pymysql://root:root@localhost:3306/esferaodonto'
# URL_DATABASE = 'mysql+pymysql://root:Pedrofink2006*@localhost:3306/esfera_db'
# Gustahbo joia
URL_DATABASE = 'mysql+pymysql://root:@localhost:3306/esferaodonto'
# Pedro pensa
# URL_DATABASE = 'mysql+pymysql://root:Pedrofink2006*@localhost:3306/esfera_db'
# Triners
# URL_DATABASE = 'mysql+pymysql://root:root@localhost:3306/esfera_db'

# Cria o motor
engine = create_engine(URL_DATABASE)

# Iniciou a sessão local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Criou a base pra declarar
Base = declarative_base()