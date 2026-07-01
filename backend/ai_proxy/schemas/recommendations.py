from drf_yasg import openapi

AI_PRODUCT_ITEM_SCHEMA = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "barcode": openapi.Schema(type=openapi.TYPE_STRING),
        "item_name": openapi.Schema(type=openapi.TYPE_STRING),
        "brand_name": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "category_name": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "subcategory_name": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "price": openapi.Schema(type=openapi.TYPE_NUMBER, nullable=True),
        "price_tier": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "available_qty": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
        "image_url": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "description": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "is_best_selling": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        "is_new_arrival": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        "is_recommended": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        "_scores": openapi.Schema(
            type=openapi.TYPE_OBJECT,
            nullable=True,
            description="Only present when include_scores=true",
            properties={
                "vector_score": openapi.Schema(type=openapi.TYPE_NUMBER),
                "metadata_score": openapi.Schema(type=openapi.TYPE_NUMBER),
                "final_score": openapi.Schema(type=openapi.TYPE_NUMBER),
            },
        ),
    },
)

AI_RECOMMEND_RESPONSE = openapi.Response(
    description="Recommendation results",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "intent": openapi.Schema(
                type=openapi.TYPE_STRING,
                nullable=True,
                description="Detected intent: similar_product | skin_concern | category_search | brand_search | price_search | general",
            ),
            "products": openapi.Schema(type=openapi.TYPE_ARRAY, items=AI_PRODUCT_ITEM_SCHEMA),
            "total": openapi.Schema(type=openapi.TYPE_INTEGER),
        },
    ),
)

AI_RECOMMEND_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["query"],
    properties={
        "query": openapi.Schema(type=openapi.TYPE_STRING, description="User's natural-language query (English or Arabic, 1–500 chars)"),
        "user_id": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "session_id": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "locale": openapi.Schema(type=openapi.TYPE_STRING, enum=["en", "ar"], nullable=True),
        "limit": openapi.Schema(type=openapi.TYPE_INTEGER, description="1–50. Default: 10", nullable=True),
        "category_id": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
        "price_tier": openapi.Schema(type=openapi.TYPE_STRING, enum=["Budget", "Mid", "Premium", "Luxury"], nullable=True),
        "cart_barcodes": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="Products currently in cart — excluded from results",
            nullable=True,
        ),
        "viewed_barcodes": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="Products already seen — deprioritised to end",
            nullable=True,
        ),
        "include_scores": openapi.Schema(type=openapi.TYPE_BOOLEAN, nullable=True),
    },
)

AI_SEARCH_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["query"],
    properties={
        "query": openapi.Schema(type=openapi.TYPE_STRING, description="Search query text (1–500 chars)"),
        "limit": openapi.Schema(type=openapi.TYPE_INTEGER, description="1–50. Default: 10", nullable=True),
        "category_id": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
        "price_tier": openapi.Schema(type=openapi.TYPE_STRING, enum=["Budget", "Mid", "Premium", "Luxury"], nullable=True),
        "min_price": openapi.Schema(type=openapi.TYPE_NUMBER, description="Minimum price (USD)", nullable=True),
        "max_price": openapi.Schema(type=openapi.TYPE_NUMBER, description="Maximum price (USD)", nullable=True),
        "skin_type": openapi.Schema(type=openapi.TYPE_STRING, description="Partial match, case-insensitive", nullable=True),
        "concerns": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="Filter to products matching ANY concern",
            nullable=True,
        ),
        "include_scores": openapi.Schema(type=openapi.TYPE_BOOLEAN, nullable=True),
    },
)

AI_SIMILAR_PARAMETERS = [
    openapi.Parameter("limit", openapi.IN_QUERY, description="Max similar products (1–50). Default: 10", type=openapi.TYPE_INTEGER, default=10),
    openapi.Parameter("same_category", openapi.IN_QUERY, description="If true, restrict to same product category", type=openapi.TYPE_BOOLEAN, default=False),
    openapi.Parameter("include_scores", openapi.IN_QUERY, description="Include _scores in response", type=openapi.TYPE_BOOLEAN, default=False),
]

AI_CROSS_SELL_PARAMETERS = [
    openapi.Parameter("limit", openapi.IN_QUERY, description="Max cross-sell products (1–30). Default: 8", type=openapi.TYPE_INTEGER, default=8),
    openapi.Parameter("include_scores", openapi.IN_QUERY, description="Include scoring breakdown", type=openapi.TYPE_BOOLEAN, default=False),
]

AI_UPSELL_PARAMETERS = [
    openapi.Parameter("limit", openapi.IN_QUERY, description="Max upsell products (1–20). Default: 6", type=openapi.TYPE_INTEGER, default=6),
    openapi.Parameter("include_scores", openapi.IN_QUERY, description="Include scoring breakdown", type=openapi.TYPE_BOOLEAN, default=False),
]

AI_SKINCARE_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "skin_type": openapi.Schema(type=openapi.TYPE_STRING, enum=["dry", "oily", "sensitive", "combination", "normal"], nullable=True),
        "concerns": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="acne, dryness, oiliness, sensitivity, aging, hyperpigmentation, dark_circles, pores, redness, eczema",
            nullable=True,
        ),
        "price_tier": openapi.Schema(type=openapi.TYPE_STRING, enum=["Budget", "Mid", "Premium", "Luxury"], nullable=True),
        "category_id": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
        "limit": openapi.Schema(type=openapi.TYPE_INTEGER, description="1–50. Default: 10", nullable=True),
        "include_scores": openapi.Schema(type=openapi.TYPE_BOOLEAN, nullable=True),
    },
)

AI_FRAGRANCE_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["reference_name"],
    properties={
        "reference_name": openapi.Schema(type=openapi.TYPE_STRING, description="Reference perfume name, e.g. 'Dior Sauvage' (1–200 chars)"),
        "price_tier": openapi.Schema(type=openapi.TYPE_STRING, enum=["Budget", "Mid", "Premium", "Luxury"], nullable=True),
        "limit": openapi.Schema(type=openapi.TYPE_INTEGER, description="1–50. Default: 10", nullable=True),
        "include_scores": openapi.Schema(type=openapi.TYPE_BOOLEAN, nullable=True),
    },
)

AI_PERSONALISED_PARAMETERS = [
    openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID (must have events logged for personalisation)", type=openapi.TYPE_STRING, required=True),
    openapi.Parameter("q", openapi.IN_QUERY, description="Search context query. Default: 'beauty products'", type=openapi.TYPE_STRING),
    openapi.Parameter("category_id", openapi.IN_QUERY, description="Filter by category FK", type=openapi.TYPE_INTEGER),
    openapi.Parameter("limit", openapi.IN_QUERY, description="Max results (1–50). Default: 10", type=openapi.TYPE_INTEGER, default=10),
    openapi.Parameter("include_scores", openapi.IN_QUERY, description="Include _scores. Default: false", type=openapi.TYPE_BOOLEAN, default=False),
]
