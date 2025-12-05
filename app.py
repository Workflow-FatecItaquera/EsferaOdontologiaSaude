from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Annotated
import model.Profissional
from database import engine, SessionLocal
from sqlalchemy.orm import Session

from routes.api import testar, cadastro

app = FastAPI()

model.Profissional.Base.metadata.create_all(bind=engine)

# Páginas HTML
templates = Jinja2Templates(directory="view")
app.mount("/view", StaticFiles(directory="view"), name="view")

# Rota Web
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# rota dashboard
@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})
  
@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

#Criar usuário
@app.get("/user", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("user-create.html", {"request": request})

# Visualizar usuário
@app.get("/user/{id}", response_class=HTMLResponse)
async def user_see(id: int, request: Request):
    return templates.TemplateResponse(
        "user-see.html",
        {"request": request, "id": id}
    )

# Editar usuário
@app.get("/user/{id}/edit", response_class=HTMLResponse)
async def user_edit(id: int, request: Request):
    return templates.TemplateResponse(
        "user-edit.html",
        {"request": request, "id": id}
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

@app.post("/api/profissional")
async def cadastrarProfissional(profi: ProfissionalObj):
    return cadastro(profi)

