# -*- coding: utf-8 -*-
"""
Lista de produtos de demonstração.

Isso é usado de duas formas:
1. Pelo seed.py, para popular a tabela `products` no PostgreSQL.
2. Pelo app.py, como um "plano B" — se o banco de dados não estiver
   disponível (por exemplo, você ainda não configurou o Postgres),
   o site continua funcionando com esses dados fixos.

Cada produto é só um dicionário Python. Sinta-se livre para editar
nomes, preços, símbolos (kanji) e cores.
"""

DEMO_PRODUCTS = [
    {
        "id": 1,
        "name": "Jaqueta Ronin",
        "category": "Jaquetas",
        "description": "Corte oversized, tecido resinado e forro térmico. A peça de entrada no universo Orika.",
        "price": 489.00,
        "original_price": 690.00,
        "stock": 4,
        "rating": 4.9,
        "reviews_count": 128,
        "badge": "MAIS VENDIDO",
        "symbol": "侍",
        "color_from": "#242627",
        "color_to": "#0c0d0e",
    },
    {
        "id": 2,
        "name": "Camiseta Kanji Oversized",
        "category": "Camisetas",
        "description": "100% algodão pesado 240g/m². Estampa em serigrafia de alta densidade.",
        "price": 149.00,
        "original_price": 199.00,
        "stock": 27,
        "rating": 4.8,
        "reviews_count": 342,
        "badge": None,
        "symbol": "風",
        "color_from": "#3b1a5e",
        "color_to": "#150a29",
    },
    {
        "id": 3,
        "name": "Moletom Tokyo Nights",
        "category": "Moletons",
        "description": "Moletom flanelado com capuz forrado e bolso canguru reforçado.",
        "price": 329.00,
        "original_price": 429.00,
        "stock": 3,
        "rating": 5.0,
        "reviews_count": 89,
        "badge": "ÚLTIMAS UNIDADES",
        "symbol": "夜",
        "color_from": "#1c1e1f",
        "color_to": "#090a0b",
    },
    {
        "id": 4,
        "name": "Calça Cargo Shinobi",
        "category": "Calças",
        "description": "Modelagem reta com bolsos utilitários e cadarço de ajuste no tornozelo.",
        "price": 279.00,
        "original_price": None,
        "stock": 15,
        "rating": 4.7,
        "reviews_count": 56,
        "badge": None,
        "symbol": "忍",
        "color_from": "#2a2c2d",
        "color_to": "#141516",
    },
    {
        "id": 5,
        "name": "Boné Torii",
        "category": "Acessórios",
        "description": "Aba curva, fivela de metal gravada e bordado 3D frontal.",
        "price": 99.00,
        "original_price": 139.00,
        "stock": 41,
        "rating": 4.6,
        "reviews_count": 201,
        "badge": None,
        "symbol": "門",
        "color_from": "#d5d1c8",
        "color_to": "#a9a498",
        "light_text": True,
    },
    {
        "id": 6,
        "name": "Bolsa Kitsune",
        "category": "Acessórios",
        "description": "Transversal, compartimento acolchoado para celular e alça regulável.",
        "price": 219.00,
        "original_price": None,
        "stock": 9,
        "rating": 4.9,
        "reviews_count": 34,
        "badge": "NOVO",
        "symbol": "狐",
        "color_from": "#5b21b6",
        "color_to": "#2a0f52",
    },
]
