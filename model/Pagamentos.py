from sqlalchemy import (
    Column, String, Integer, Float, Date, DateTime, Time, Text,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base

class Pagamentos(Base):
    __tablename__ = "pagamentos"

    id_pagamento = Column(String(255), primary_key=True)
    id_consulta = Column(String(255), ForeignKey("consultas.id_consulta"))
    id_paciente = Column(String(255), ForeignKey("pacientes.id_paciente"))
    id_conta = Column(String(255), ForeignKey("contas.id_conta"))
    forma_pagamento = Column(String(255), ForeignKey("forma_pagamento.id_formapagamento"))
    valor_total = Column(Float)
    data_pagamento = Column(DateTime)
    observacoes = Column(Text)
    criado = Column(DateTime)
    editado = Column(DateTime)
    inativado = Column(String(1))

    consulta = relationship("Consultas")
    paciente = relationship("Pacientes")
    conta = relationship("Contas")
    forma = relationship("FormaPagamento")
