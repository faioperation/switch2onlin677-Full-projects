from drf_yasg import openapi

# --- Category ---

CATEGORY_LIST_PARAMETERS = [
    openapi.Parameter("search", openapi.IN_QUERY, description="Search by category name or Arabic name", type=openapi.TYPE_STRING),
    openapi.Parameter("is_active", openapi.IN_QUERY, description="Filter active/inactive categories", type=openapi.TYPE_BOOLEAN),
    openapi.Parameter("page", openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER, default=1),
    openapi.Parameter("limit", openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER, default=100),
]

CATEGORY_OBJECT_SCHEMA = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
        "name": openapi.Schema(type=openapi.TYPE_STRING),
        "name_ar": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", nullable=True),
    },
)

CATEGORY_LIST_RESPONSE = openapi.Response(
    description="Category list retrieved successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": openapi.Schema(type=openapi.TYPE_ARRAY, items=CATEGORY_OBJECT_SCHEMA),
            "pagination": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "total": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "page": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "limit": openapi.Schema(type=openapi.TYPE_INTEGER),
                },
            ),
        },
    ),
)

CATEGORY_DETAILS_RESPONSE = openapi.Response(
    description="Category details",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": CATEGORY_OBJECT_SCHEMA,
        },
    ),
)

CATEGORY_CREATE_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["name"],
    properties={
        "name": openapi.Schema(type=openapi.TYPE_STRING, description="Category name"),
        "name_ar": openapi.Schema(type=openapi.TYPE_STRING, description="Arabic category name", nullable=True),
        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=True),
    },
)

CATEGORY_CREATE_RESPONSE = openapi.Response(
    description="Category created successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING, example="Category created successfully"),
            "data": CATEGORY_OBJECT_SCHEMA,
        },
    ),
)

# --- Brand ---

BRAND_LIST_PARAMETERS = [
    openapi.Parameter("search", openapi.IN_QUERY, description="Search by brand name or Arabic name", type=openapi.TYPE_STRING),
    openapi.Parameter("is_active", openapi.IN_QUERY, description="Filter active/inactive brands", type=openapi.TYPE_BOOLEAN),
    openapi.Parameter("page", openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER, default=1),
    openapi.Parameter("limit", openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER, default=100),
]

BRAND_OBJECT_SCHEMA = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
        "name": openapi.Schema(type=openapi.TYPE_STRING),
        "name_ar": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", nullable=True),
    },
)

BRAND_LIST_RESPONSE = openapi.Response(
    description="Brand list retrieved successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": openapi.Schema(type=openapi.TYPE_ARRAY, items=BRAND_OBJECT_SCHEMA),
            "pagination": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "total": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "page": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "limit": openapi.Schema(type=openapi.TYPE_INTEGER),
                },
            ),
        },
    ),
)

BRAND_DETAILS_RESPONSE = openapi.Response(
    description="Brand details retrieved successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": BRAND_OBJECT_SCHEMA,
        },
    ),
)

BRAND_CREATE_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["name"],
    properties={
        "name": openapi.Schema(type=openapi.TYPE_STRING, description="Brand name"),
        "name_ar": openapi.Schema(type=openapi.TYPE_STRING, description="Arabic brand name", nullable=True),
        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=True),
    },
)

BRAND_CREATE_RESPONSE = openapi.Response(
    description="Brand created successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING, example="Brand created successfully"),
            "data": BRAND_OBJECT_SCHEMA,
        },
    ),
)

# --- Subcategory ---

SUBCATEGORY_LIST_PARAMETERS = [
    openapi.Parameter("category_id", openapi.IN_QUERY, description="Filter by parent category ID", type=openapi.TYPE_INTEGER),
    openapi.Parameter("search", openapi.IN_QUERY, description="Search by subcategory name or Arabic name", type=openapi.TYPE_STRING),
    openapi.Parameter("is_active", openapi.IN_QUERY, description="Filter active/inactive subcategories", type=openapi.TYPE_BOOLEAN),
    openapi.Parameter("page", openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER, default=1),
    openapi.Parameter("limit", openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER, default=100),
]

SUBCATEGORY_OBJECT_SCHEMA = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "id": openapi.Schema(type=openapi.TYPE_INTEGER),
        "name": openapi.Schema(type=openapi.TYPE_STRING),
        "name_ar": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "category_id": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
        "category_name": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", nullable=True),
    },
)

SUBCATEGORY_LIST_RESPONSE = openapi.Response(
    description="Subcategory list retrieved successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": openapi.Schema(type=openapi.TYPE_ARRAY, items=SUBCATEGORY_OBJECT_SCHEMA),
            "pagination": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "total": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "page": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "limit": openapi.Schema(type=openapi.TYPE_INTEGER),
                },
            ),
        },
    ),
)

SUBCATEGORY_DETAILS_RESPONSE = openapi.Response(
    description="Subcategory details retrieved successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": SUBCATEGORY_OBJECT_SCHEMA,
        },
    ),
)

SUBCATEGORY_CREATE_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["name", "category_id"],
    properties={
        "name": openapi.Schema(type=openapi.TYPE_STRING, description="Subcategory name"),
        "name_ar": openapi.Schema(type=openapi.TYPE_STRING, description="Arabic subcategory name", nullable=True),
        "category_id": openapi.Schema(type=openapi.TYPE_INTEGER, description="Parent category ID"),
        "is_active": openapi.Schema(type=openapi.TYPE_BOOLEAN, default=True),
    },
)

SUBCATEGORY_CREATE_RESPONSE = openapi.Response(
    description="Subcategory created successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING, example="Subcategory created successfully"),
            "data": SUBCATEGORY_OBJECT_SCHEMA,
        },
    ),
)
