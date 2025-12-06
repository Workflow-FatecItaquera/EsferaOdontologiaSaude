from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Annotated

import model.AgendaFuncionario
import model.Agendas
import model.Anexos
import model.CategoriaProcedimento
import model.Clinicas
import model.Consultas
import model.Contas
import model.Cores
import model.Enderecos
import model.FichasClinicas
import model.FormaPagamento
import model.Funcoes
import model.Honorario
import model.Lancamento
import model.Orcamentos
import model.Pacientes
import model.Pagamentos
import model.Procedimentos
import model.Prontuarios
import model.Status
import model.TipoLancamento
import model.Usuarios

from database import engine, SessionLocal
from sqlalchemy.orm import Session

# JWT
from auth import verificar_token

# Rotas da API
from routes.api import router as api_router

# --------------------------------------------------
# INICIALIZA FASTAPI
# --------------------------------------------------

app = FastAPI()
app.include_router(api_router, prefix="/api")  # <── ROTAS /api

# --------------------------------------------------
# CRIA TABELAS
# --------------------------------------------------

model.AgendaFuncionario.Base.metadata.create_all(bind=engine)
model.Agendas.Base.metadata.create_all(bind=engine)
model.Anexos.Base.metadata.create_all(bind=engine)
model.CategoriaProcedimento.Base.metadata.create_all(bind=engine)
model.Clinicas.Base.metadata.create_all(bind=engine)
model.Consultas.Base.metadata.create_all(bind=engine)
model.Contas.Base.metadata.create_all(bind=engine)
model.Cores.Base.metadata.create_all(bind=engine)
model.Enderecos.Base.metadata.create_all(bind=engine)
model.FichasClinicas.Base.metadata.create_all(bind=engine)
model.FormaPagamento.Base.metadata.create_all(bind=engine)
model.Funcoes.Base.metadata.create_all(bind=engine)
model.Honorario.Base.metadata.create_all(bind=engine)
model.Lancamento.Base.metadata.create_all(bind=engine)
model.Orcamentos.Base.metadata.create_all(bind=engine)
model.Pacientes.Base.metadata.create_all(bind=engine)
model.Pagamentos.Base.metadata.create_all(bind=engine)
model.Procedimentos.Base.metadata.create_all(bind=engine)
model.Prontuarios.Base.metadata.create_all(bind=engine)
model.Status.Base.metadata.create_all(bind=engine)
model.TipoLancamento.Base.metadata.create_all(bind=engine)
model.Usuarios.Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# HTML / STATIC
# --------------------------------------------------

templates = Jinja2Templates(directory="view")
app.mount("/view", StaticFiles(directory="view"), name="view")

# --------------------------------------------------
# ROTAS WEB (NADA FOI REMOVIDO)
# --------------------------------------------------

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# USER
@app.get("/user", response_class=HTMLResponse)
async def user_create(request: Request):
    return templates.TemplateResponse("user-create.html", {"request": request})

@app.get("/user/{id}", response_class=HTMLResponse)
async def user_see(id: int, request: Request):
    return templates.TemplateResponse("user-see.html", {"request": request, "id": id})

@app.get("/user/{id}/edit", response_class=HTMLResponse)
async def user_edit(id: int, request: Request):
    return templates.TemplateResponse("user-edit.html", {"request": request, "id": id})

# PATIENT
@app.get("/patient", response_class=HTMLResponse)
async def patient_create(request: Request):
    return templates.TemplateResponse("patient-create.html", {"request": request})

@app.get("/patient/{id}", response_class=HTMLResponse)
async def patient_see(id: int, request: Request):
    return templates.TemplateResponse("patient-see.html", {"request": request, "id": id})

@app.get("/patient/{id}/edit", response_class=HTMLResponse)
async def patient_edit(id: int, request: Request):
    return templates.TemplateResponse("patient-edit.html", {"request": request, "id": id})

# APPOINTMENT
@app.get("/appointment", response_class=HTMLResponse)
async def appointment_create(request: Request):
    return templates.TemplateResponse("appointment-create.html", {"request": request})

@app.get("/appointment/{id}", response_class=HTMLResponse)
async def appointment_see(id: int, request: Request):
    return templates.TemplateResponse("appointment-see.html", {"request": request, "id": id})

@app.get("/appointment/{id}/edit", response_class=HTMLResponse)
async def appointment_edit(id: int, request: Request):
    return templates.TemplateResponse("appointment-edit.html", {"request": request, "id": id})

# --------------------------------------------------
# API ANTIGA
# --------------------------------------------------
# --------------------------------------------------
# OBJETO PROFISSIONAL
# --------------------------------------------------

class ProfissionalObj(BaseModel):
    nomeCompleto: str
    cor: str
    dataNasc: str
    genero: str
    estadoCivil: str
    cro: str
    numero: int
    nomeUsuario: str
    entradaFoto: str
    rg: str
    cpf: str
    clinica: int

class PostBase(BaseModel):
    title: str
    content: str
    user_id: int

class UserBase(BaseModel):
    username: str

# DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


# --------------------------------------------------
# MIDDLEWARE DE AUTENTICAÇÃO
# --------------------------------------------------

@app.middleware("http")
async def autenticar(request: Request, call_next):
    caminho = request.url.path

    paginas_protegidas = [
        "/dashboard",
        "/user",
        "/patient",
        "/appointment"
    ]

    if any(caminho.startswith(p) for p in paginas_protegidas):
        token = request.cookies.get("session")

        if not token:
            return RedirectResponse("/login")

        dados = verificar_token(token)
        if not dados:
            return RedirectResponse("/login")

    return await call_next(request)
