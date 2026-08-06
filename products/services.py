from products.models import ProductHistory


def create_product_history(product):
    history = ProductHistory.objects.create(
        product=product,
        seller=product.seller,
        name=product.name,
        brand=product.brand,
        description=product.description,
        price=product.price,
        currency=product.currency,
        condition=product.condition,
        quantity=product.quantity,
    )

    history.category.set(product.category.all())

    return history
