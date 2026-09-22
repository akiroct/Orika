# -*- coding: utf-8 -*-
"""
Cria a tabela `products` no PostgreSQL (se ainda não existir) e insere
os produtos de demonstração.

Como rodar:
    python seed.py

Isso só precisa ser feito uma vez (ou de novo, se você apagar o banco).
"""

from app import app
from models import Product, db
from seed_data import DEMO_PRODUCTS

with app.app_context():
    db.create_all()

    if Product.query.count() == 0:
        for item in DEMO_PRODUCTS:
            produto = Product(
                name=item["name"],
                category=item["category"],
                description=item["description"],
                price=item["price"],
                original_price=item.get("original_price"),
                stock=item["stock"],
                rating=item["rating"],
                reviews_count=item["reviews_count"],
                badge=item.get("badge"),
                symbol=item["symbol"],
                color_from=item["color_from"],
                color_to=item["color_to"],
                light_text=item.get("light_text", False),
            )
            db.session.add(produto)
        db.session.commit()
        print(f"✅ {len(DEMO_PRODUCTS)} produtos inseridos no banco com sucesso.")
    else:
        print("ℹ️  O banco já tem produtos cadastrados — nada foi alterado.")
