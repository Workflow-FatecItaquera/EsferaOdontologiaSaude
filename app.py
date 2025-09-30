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