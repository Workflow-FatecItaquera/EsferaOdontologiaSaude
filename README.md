# Esfera Odontologia & Saúde

## Rodar o projeto em ambiente local
1. Preparar ambiente:
```sh
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn jinja2
```

2. Rodar e atualizar automaticamente a cada mudança:

```sh
uvicorn app:app --reload
```