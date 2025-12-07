# Esfera Odontologia & Saúde

## Rodar o projeto em ambiente local
1. Preparar ambiente:
```sh
python -m venv venv
.\venv\Scripts\activate
pip install fastapi[standard] jinja2
pip install sqlalchemy pymysql
pip install python-jose passlib[bcrypt]
```

2. Rodar e atualizar automaticamente a cada mudança (ambiente de desenvolvimento), requer que o ambiente virutal esteja ativo (comando: .\venv\Scripts\activate):

```sh
fastapi dev
```