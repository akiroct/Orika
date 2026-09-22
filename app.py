# -*- coding: utf-8 -*-
"""
App principal da Orika.

Stack (de propósito, tudo em Python + o básico da web):
- Flask         -> servidor web / rotas
- SQLAlchemy    -> conversa com o PostgreSQL sem precisar escrever SQL puro
- Jinja2        -> o "{{ }}" dentro do HTML, já vem junto com o Flask
- HTML/CSS/JS   -> front-end, sem frameworks, direto em static/ e templates/

Como os dados chegam na página:
1. O navegador pede "/".
2. A função home() busca os produtos no PostgreSQL.
3. Se o banco não estiver configurado/rodando, usamos uma lista de
   demonstração (seed_data.py) — assim o site NUNCA fica quebrado,
   mesmo antes de você configurar o banco.
4. O Flask entrega o HTML pronto, com os produtos já dentro.
"""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template
from sqlalchemy.exc import SQLAlchemyError

from models import Product, db
from seed_data import DEMO_PRODUCTS

load_dotenv()  # lê o arquivo .env, se existir

app = Flask(__name__)

# Endereço do banco. Formato: postgresql://usuario:senha@host:porta/nome_do_banco
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", "postgresql://orika:orika@localhost:5432/orika_db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


def get_products():
    """Busca os produtos no Postgres. Se der qualquer problema de conexão
    (banco não configurado, senha errada, etc.), cai no plano B."""
    try:
        produtos = Product.query.order_by(Product.id).all()
        if produtos:
            return [p.to_dict() for p in produtos]
    except SQLAlchemyError as erro:
        print(f"[aviso] não consegui ler o Postgres, usando dados de demonstração: {erro}")
    return DEMO_PRODUCTS


@app.route("/")
def home():
    produtos = get_products()
    return render_template("index.html", produtos=produtos)


@app.route("/api/produtos")
def api_produtos():
    """Endpoint JSON, útil se um dia você quiser consumir os produtos
    de outro lugar (um app mobile, por exemplo)."""
    return jsonify(get_products())


if __name__ == "__main__":
    app.run(debug=True)
