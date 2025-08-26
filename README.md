# Esfera Odontologia & Saúde

## Rodar o projeto em ambiente local
1. Preparar ambiente:
```sh
python -m venv venv
.\venv\Scripts\activate
pip install fastapi[standard] jinja2
```

2. Rodar e atualizar automaticamente a cada mudança (ambiente de desenvolvimento):

```sh
fastapi dev
```