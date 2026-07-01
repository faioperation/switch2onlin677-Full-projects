from drf_yasg import openapi

AI_EMBEDDING_STATUS_RESPONSE = openapi.Response(
    description="Embedding pipeline coverage statistics",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "total_products": openapi.Schema(type=openapi.TYPE_INTEGER, description="All active (non-deleted) products"),
                    "embedded_products": openapi.Schema(type=openapi.TYPE_INTEGER, description="Products with embedding IS NOT NULL"),
                    "pending_products": openapi.Schema(type=openapi.TYPE_INTEGER, description="Products still awaiting embedding"),
                    "coverage_pct": openapi.Schema(type=openapi.TYPE_NUMBER, description="embedded / total × 100, one decimal place"),
                    "embed_model": openapi.Schema(type=openapi.TYPE_STRING, example="text-embedding-3-small"),
                    "embed_dimensions": openapi.Schema(type=openapi.TYPE_INTEGER, example=1536),
                },
            ),
        },
    ),
)

AI_EMBEDDING_TRIGGER_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "limit": openapi.Schema(type=openapi.TYPE_INTEGER, description="Max products to embed. 0 = all pending. Default: 0", default=0),
        "force_all": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="If true, re-embed entire catalog. Use after prompt changes. Default: false", default=False),
        "batch_size": openapi.Schema(type=openapi.TYPE_INTEGER, description="Products per OpenAI API call (1–200). Default: 50", default=50),
    },
)

AI_EMBEDDING_TRIGGER_RESPONSE = openapi.Response(
    description="Embedding job triggered (returns immediately; job runs asynchronously)",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING),
            "job_id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid", nullable=True),
        },
    ),
)
