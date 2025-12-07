from fastapi import FastAPI, Request, HTTPException, Depends, status, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Annotated
from model.AgendaFuncionario import Agendafuncionario
from model.Agendas import Agendas
from model.Anexos import Anexos
from model.CategoriaProcedimento import CategoriaProcedimento
from model.Clinicas import Clinicas
from model.Consultas import Consultas
from model.Contas import Contas
from model.Cores import Cores
from model.Enderecos import Enderecos
from model.FichasClinicas import FichasClinicas
from model.FormaPagamento import FormaPagamento
from model.Funcoes import Funcoes
from model.Honorario import Honorario
from model.Lancamento import Lancamentos
from model.Orcamentos import Orcamentos
from model.Pacientes import Pacientes
from model.Pagamentos import Pagamentos
from model.Procedimentos import Procedimentos
from model.Prontuarios import Prontuarios
from model.Status import Status
from model.TipoLancamento import TipoLancamento
from model.Usuarios import Usuarios
from database import engine, SessionLocal, Base
from sqlalchemy.orm import Session

from routes.api import testar, cadastro

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Páginas HTML
templates = Jinja2Templates(directory="view")
app.mount("/view", StaticFiles(directory="view"), name="view")

# Rota Web Principal
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Dashboard
@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

# Login  
@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Criar usuário
@app.get("/user", response_class=HTMLResponse)
async def user_create(request: Request, db: Session = Depends(get_db)):
    cores = db.query(Cores).filter(Cores.em_uso == "0").all()
    funcoes = db.query(Funcoes).filter(Funcoes.inativado == "0").all()

    return templates.TemplateResponse(
        "user-create.html",
        {
            "request": request,
            "cores": cores,
            "funcoes": funcoes
        }
    )


# Visualizar usuário
@app.get("/user/{id}", response_class=HTMLResponse)
async def user_see(id: str, request: Request, db: Session = Depends(get_db)):
    usuario = db.query(Usuarios).filter(Usuarios.id_usuario==id).first()
    cores = db.query(Cores).all()
    endereco = db.query(Enderecos).filter(Enderecos.id_endereco==usuario.id_endereco).first()
    funcoes = db.query(Funcoes).all()
    return templates.TemplateResponse(
        "user-see.html",
        {"request": request, "id": id, "usuario":usuario,"cores":cores,"funcoes":funcoes,"endereco":endereco}
    )

# Editar usuário
@app.get("/user/{id}/edit", response_class=HTMLResponse)
async def user_edit(id: str, request: Request, db: Session = Depends(get_db)):
    usuario = db.query(Usuarios).filter(Usuarios.id_usuario==id).first()
    endereco = db.query(Enderecos).filter(Enderecos.id_endereco==usuario.id_endereco).first()
    cores = db.query(Cores).filter(Cores.em_uso=="0").all()
    funcoes = db.query(Funcoes).filter(Funcoes.inativado=="0").all()
    return templates.TemplateResponse(
        "user-edit.html",
        {"request": request, "id": id, "usuario":usuario,"endereco":endereco,"cores":cores,"funcoes":funcoes}
    )
    
# Criar paciente
@app.get("/patient", response_class=HTMLResponse)
async def patient_create(request: Request):
    return templates.TemplateResponse(
        "patient-create.html",
        {"request": request}
    )  

# Visualizar paciente
@app.get("/patient/{id}", response_class=HTMLResponse)
async def patient_see(id: int, request: Request):
    return templates.TemplateResponse(
        "patient-see.html",
        {"request": request, "id": id}
    )   
    
# Editar paciente
@app.get("/patient/{id}/edit", response_class=HTMLResponse)
async def patient_edit(id: int, request: Request):
    return templates.TemplateResponse(
        "patient-edit.html",
        {"request": request, "id": id}
    )
    
# Criar consulta
@app.get("/appointment", response_class=HTMLResponse)
async def appointment_create(request: Request):
    return templates.TemplateResponse(
        "appointment-create.html",
        {"request": request}
    )
    
# Visualizar consulta
@app.get("/appointment/{id}", response_class=HTMLResponse)
async def appointment_see(id: int, request: Request):
    return templates.TemplateResponse(
        "appointment-see.html",
        {"request": request, "id": id}
    )
    
# Editar consulta
@app.get("/appointment/{id}/edit", response_class=HTMLResponse)
async def appointment_edit(id: int, request: Request):
    return templates.TemplateResponse(
        "appointment-edit.html",
        {"request": request, "id": id}
    )



# Rota API
@app.get("/api/teste")
def teste():
    return testar()

db_dependency = Annotated[Session,Depends(get_db)]

@app.post("/api/cor")
async def cadastrarCor(data: dict, db: Session = Depends(get_db)):
    cor = Cores(
        nome = data["nome"],
        em_uso = data["em_uso"],
        criado = data["criado"],
        editado = data["editado"],
        inativado = data["inativado"]
    )
    db.add(cor)
    db.commit()
    db.refresh(cor)
    return {
        "id":cor.id_cor,
        "nome":cor.nome
    }

@app.post("/api/funcao")
async def cadastrarFuncao(data: dict, db: Session = Depends(get_db)):
    funcao = Funcoes(
        nome = data["nome"],
        descricao = data["descricao"],
        nivel_acesso = data["nivel_acesso"],
        criado = data["criado"],
        editado = data["editado"],
        inativado = data["inativado"]
    )
    db.add(funcao)
    db.commit()
    db.refresh(funcao)
    return {
        "id":funcao.id_funcao,
        "nome":funcao.nome
    }

@app.post("/api/usuario")
async def cadastrar_usuario(
    name: str = Form(...),
    color: str = Form(""),
    rg: str = Form(""),
    cpf: str = Form(""),
    email: str = Form(""),
    cro: str = Form(""),
    gender: str = Form(""),
    dateofbirth: str = Form(""),
    position: str = Form(""),
    maritalstatus: str = Form(""),
    cellphone: str = Form(""),
    phone: str = Form(""),
    cep: str = Form(""),
    logradouro: str = Form(""),
    bairro: str = Form(""),
    numero: str = Form(""),
    cidade: str = Form(""),
    estado: str = Form(""),
    complemento: str = Form(""),
    db: Session = Depends(get_db)
):
    endereco = Enderecos(
        cep=cep,
        logradouro=logradouro,
        bairro = bairro,
        numero = numero,
        cidade = cidade,
        estado = estado,
        complemento = complemento,
        criado = "",
        editado = "",
        inativado = "0"
    )

    db.add(endereco)
    db.commit()
    db.refresh(endereco)

    conta = Contas(
        nome_conta = "",
        banco = "",
        agencia = "",
        numero_conta = "",
        saldo = 0,
        observacoes = "",
        criado = "",
        editado = "",
        inativado = "0"
    )

    db.add(conta)
    db.commit()
    db.refresh(conta)

    usuario = Usuarios(
        nome=name,
        id_cor=color,
        id_endereco=endereco.id_endereco,
        id_conta=conta.id_conta,
        rg=rg,
        cpf=cpf,
        email=email,
        cro=cro,
        sexo=gender,
        data_nascimento=dateofbirth,
        id_funcao=position,
        estado_civil=maritalstatus,
        celular=cellphone,
        telefone=phone
    )

    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return RedirectResponse(
        url="/user/" + usuario.id_usuario,
        status_code=303
    )

@app.post("/api/user/edit/{id}")
async def atualizar_usuario(
    id: str,
    name: str = Form(...),
    color: str = Form(""),
    rg: str = Form(""),
    cpf: str = Form(""),
    email: str = Form(""),
    cro: str = Form(""),
    gender: str = Form(""),
    dateofbirth: str = Form(""),
    position: str = Form(""),
    maritalstatus: str = Form(""),
    cellphone: str = Form(""),
    phone: str = Form(""),
    cep: str = Form(""),
    logradouro: str = Form(""),
    bairro: str = Form(""),
    numero: str = Form(""),
    cidade: str = Form(""),
    estado: str = Form(""),
    complemento: str = Form(""),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuarios).filter(Usuarios.id_usuario==id).first()

    antigo_endereco = db.query(Enderecos).filter(Enderecos.id_endereco==usuario.id_endereco).first()
    db.delete(antigo_endereco)

    endereco = Enderecos(
        cep=cep,
        logradouro=logradouro,
        bairro = bairro,
        numero = numero,
        cidade = cidade,
        estado = estado,
        complemento = complemento,
        criado = "",
        editado = "",
        inativado = "0"
    )

    db.add(endereco)
    db.commit()
    db.refresh(endereco)

    conta = db.query(Contas).filter(Contas.id_conta==usuario.id_conta).first()
    
    usuario.nome = name
    usuario.id_cor = color
    usuario.id_endereco = endereco.id_endereco
    usuario.id_conta = conta.id_conta
    usuario.rg = rg
    usuario.cpf = cpf
    usuario.email = email
    usuario.cro = cro
    usuario.sexo = gender
    usuario.data_nascimento = dateofbirth
    usuario.id_funcao = position
    usuario.estado_civil = maritalstatus
    usuario.celular = cellphone
    usuario.telefone = phone

    db.commit()
    db.refresh(usuario)

    return RedirectResponse(
        url="/user/" + id,
        status_code=303
    )
