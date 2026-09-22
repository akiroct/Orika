# -*- coding: utf-8 -*-
"""
Aqui definimos como a tabela `products` é organizada dentro do PostgreSQL,
usando o SQLAlchemy (uma biblioteca Python que traduz classes Python em
tabelas de banco de dados, então você não precisa escrever SQL na mão).
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(60))
    description = db.Column(db.Text)

    price = db.Column(db.Numeric(10, 2), nullable=False)
    original_price = db.Column(db.Numeric(10, 2), nullable=True)

    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Numeric(2, 1), default=5.0)
    reviews_count = db.Column(db.Integer, default=0)

    badge = db.Column(db.String(40), nullable=True)     # ex: "MAIS VENDIDO"
    symbol = db.Column(db.String(4))                     # kanji usado como "imagem"
    color_from = db.Column(db.String(20))                 # cor do degradê do card
    color_to = db.Column(db.String(20))
    light_text = db.Column(db.Boolean, default=False)     # texto escuro em cards claros

    def to_dict(self):
        """Transforma a linha do banco em um dicionário, pronto para
        virar JSON (usado pela API) ou ser lido pelo template HTML."""
        price = float(self.price)
        original = float(self.original_price) if self.original_price else None
        discount = 0
        if original and original > price:
            discount = round((1 - price / original) * 100)

        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": price,
            "original_price": original,
            "discount": discount,
            "stock": self.stock,
            "rating": float(self.rating) if self.rating is not None else 5.0,
            "reviews_count": self.reviews_count,
            "badge": self.badge,
            "symbol": self.symbol,
            "color_from": self.color_from,
            "color_to": self.color_to,
            "light_text": self.light_text,
        }
