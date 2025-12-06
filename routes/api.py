from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from database import SessionLocal
from model.Usuarios import Usuarios
from auth import criar_token, verificar_senha

router = APIRouter()   # IMPORTANTE

# ------------------------------
# Função de conexão com o banco
# ------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------------
# Rota de teste
# ------------------------------
@router.get("/teste")
def teste():
    return {"message": "API funcionando!"}


# ------------------------------
# LOGIN (cookie HTTPOnly com JWT)
# ------------------------------
from fastapi import Form

@router.post("/login")
def login(
    response: Response,
    email: str = Form(...),
    senha: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(Usuarios).filter(Usuarios.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Email não encontrado")

    if not verificar_senha(senha, user.senha_hash):
        raise HTTPException(status_code=400, detail="Senha incorreta")

    token = criar_token({"sub": user.id_usuario})

    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        samesite="lax",
        path="/"
    )

    return {"message": "Login ok", "redirect": "/dashboard"}
