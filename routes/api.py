#GET

def testar():
    return {"status":200,"message":"Teste"}

def listarUsuarios():
    return

# POST

def cadastro(profi):
    return {"status":201,"message":"Usuário "+profi.nomeUsuario+" foi registrado"}