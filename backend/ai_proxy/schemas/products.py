from drf_yasg import openapi

PRODUCT_LIST_PARAMETERS = [
    openapi.Parameter(
        "q", openapi.IN_QUERY, description="Search keyword", type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        "brand_id", openapi.IN_QUERY, description="Filter by brand ID", type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        "category_id", openapi.IN_QUERY, description="Filter by category ID", type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        "subcategory_id", openapi.IN_QUERY, description="Filter by subcategory ID", type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        "is_best_selling", openapi.IN_QUERY, description="1 = best selling products", type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        "in_stock", openapi.IN_QUERY, description="Only show products in stock", type=openapi.TYPE_BOOLEAN
    ),
    openapi.Parameter(
        "min_price", openapi.IN_QUERY, description="Minimum product price", type=openapi.TYPE_NUMBER
    ),
    openapi.Parameter(
        "max_price", openapi.IN_QUERY, description="Maximum product price", type=openapi.TYPE_NUMBER
    ),
    openapi.Parameter(
        "page", openapi.IN_QUERY, description="Page number", type=openapi.TYPE_INTEGER, default=1
    ),
    openapi.Parameter(
        "limit", openapi.IN_QUERY, description="Items per page", type=openapi.TYPE_INTEGER, default=10
    ),
    openapi.Parameter(
        "sort_by",
        openapi.IN_QUERY,
        description="Sorting options: created_desc, created_asc, price_desc, price_asc, item_name_asc, item_name_desc",
        type=openapi.TYPE_STRING,
        default="created_desc",
    ),
]

PRODUCT_LIST_RESPONSE = openapi.Response(
    description="Successful response",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "products": openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "barcode": openapi.Schema(type=openapi.TYPE_STRING),
                                "item_code": openapi.Schema(type=openapi.TYPE_STRING),
                                "item_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "description": openapi.Schema(type=openapi.TYPE_STRING),
                                "image_url": openapi.Schema(type=openapi.TYPE_STRING),
                                "price": openapi.Schema(type=openapi.TYPE_NUMBER),
                                "available_qty": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "brand_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "brand_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "category_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "category_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "subcategory_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "subcategory_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "is_best_selling": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            },
                        ),
                    ),
                    "pagination": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "total": openapi.Schema(type=openapi.TYPE_INTEGER),
                            "page": openapi.Schema(type=openapi.TYPE_INTEGER),
                            "limit": openapi.Schema(type=openapi.TYPE_INTEGER),
                            "total_pages": openapi.Schema(type=openapi.TYPE_INTEGER),
                            "has_next": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                            "has_prev": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        },
                    ),
                    "filters_applied": openapi.Schema(type=openapi.TYPE_OBJECT),
                },
            ),
        },
    ),
)

# --- Upload ---

PRODUCT_UPLOAD_PARAMETERS = [
    openapi.Parameter(
        "dry_run",
        openapi.IN_QUERY,
        description="If true, runs full validation but rolls back all DB changes",
        type=openapi.TYPE_BOOLEAN,
        default=False,
    ),
]

PRODUCT_UPLOAD_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["file"],
    properties={
        "file": openapi.Schema(
            type=openapi.TYPE_STRING,
            format="binary",
            description=".xlsx or .csv file (max 10 MB, max 10,000 rows)",
        ),
    },
)

PRODUCT_UPLOAD_RESPONSE = openapi.Response(
    description="Upload queued successfully (202 Accepted)",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "job_id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
            "message": openapi.Schema(
                type=openapi.TYPE_STRING,
                example="Upload queued. Poll GET /products/uploads/{job_id} for progress.",
            ),
            "dry_run": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        },
    ),
)

UPLOAD_ERROR_DETAIL_SCHEMA = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "row": openapi.Schema(type=openapi.TYPE_INTEGER),
        "barcode": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "error": openapi.Schema(type=openapi.TYPE_STRING),
    },
)

UPLOAD_JOB_OBJECT_SCHEMA = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        "job_id": openapi.Schema(type=openapi.TYPE_STRING, format="uuid"),
        "filename": openapi.Schema(type=openapi.TYPE_STRING),
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["queued", "processing", "completed", "failed"],
        ),
        "dry_run": openapi.Schema(type=openapi.TYPE_BOOLEAN),
        "total_rows": openapi.Schema(type=openapi.TYPE_INTEGER),
        "processed_rows": openapi.Schema(type=openapi.TYPE_INTEGER),
        "progress_pct": openapi.Schema(type=openapi.TYPE_INTEGER),
        "created_count": openapi.Schema(type=openapi.TYPE_INTEGER),
        "updated_count": openapi.Schema(type=openapi.TYPE_INTEGER),
        "skipped_count": openapi.Schema(type=openapi.TYPE_INTEGER),
        "error_count": openapi.Schema(type=openapi.TYPE_INTEGER),
        "error_details": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=UPLOAD_ERROR_DETAIL_SCHEMA,
            description="Up to 100 structured row errors",
        ),
        "error_message": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "started_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", nullable=True),
        "completed_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", nullable=True),
        "execution_seconds": openapi.Schema(type=openapi.TYPE_NUMBER, nullable=True),
        "created_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
    },
)

UPLOAD_JOB_DETAIL_RESPONSE = openapi.Response(
    description="Upload job details",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": UPLOAD_JOB_OBJECT_SCHEMA,
        },
    ),
)

UPLOAD_JOB_LIST_PARAMETERS = [
    openapi.Parameter("page", openapi.IN_QUERY, description="Page number (min: 1)", type=openapi.TYPE_INTEGER, default=1),
    openapi.Parameter("limit", openapi.IN_QUERY, description="Items per page (min: 1, max: 100)", type=openapi.TYPE_INTEGER, default=20),
    openapi.Parameter("status", openapi.IN_QUERY, description="Filter by: queued, processing, completed, failed", type=openapi.TYPE_STRING),
]

UPLOAD_JOB_LIST_RESPONSE = openapi.Response(
    description="Paginated list of upload jobs (newest first)",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": openapi.Schema(type=openapi.TYPE_ARRAY, items=UPLOAD_JOB_OBJECT_SCHEMA),
            "pagination": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "total": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "page": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "limit": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "total_pages": openapi.Schema(type=openapi.TYPE_INTEGER),
                },
            ),
        },
    ),
)

UPLOAD_TEMPLATE_RESPONSE = openapi.Response(
    description="Column schema for building a template spreadsheet",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "columns": openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "column": openapi.Schema(type=openapi.TYPE_STRING),
                        "required": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        "type": openapi.Schema(type=openapi.TYPE_STRING),
                        "notes": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                    },
                ),
            ),
        },
    ),
)

# --- Delete / Restore ---

PRODUCT_DELETE_RESPONSE = openapi.Response(
    description="Product soft-deleted successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING, example="Product BC001234 deleted successfully"),
        },
    ),
)

PRODUCT_RESTORE_RESPONSE = openapi.Response(
    description="Product restored successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING, example="Product BC001234 restored successfully"),
        },
    ),
)

# --- Status transition ---

PRODUCT_STATUS_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["status"],
    properties={
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["active", "inactive", "draft"],
            description="Target status. Note: inactive → draft is not allowed.",
        ),
        "changed_by": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "reason": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
    },
)

PRODUCT_STATUS_RESPONSE = openapi.Response(
    description="Status transitioned successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING),
            "data": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "barcode": openapi.Schema(type=openapi.TYPE_STRING),
                    "previous_status": openapi.Schema(type=openapi.TYPE_STRING),
                    "new_status": openapi.Schema(type=openapi.TYPE_STRING),
                },
            ),
        },
    ),
)

PRODUCT_BULK_STATUS_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["barcodes", "status"],
    properties={
        "barcodes": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="1–500 product barcodes to update",
        ),
        "status": openapi.Schema(type=openapi.TYPE_STRING, enum=["active", "inactive", "draft"]),
        "changed_by": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
        "reason": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
    },
)

PRODUCT_BULK_STATUS_RESPONSE = openapi.Response(
    description="Bulk status update result",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "updated_count": openapi.Schema(type=openapi.TYPE_INTEGER),
            "failed_count": openapi.Schema(type=openapi.TYPE_INTEGER),
            "failures": openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "barcode": openapi.Schema(type=openapi.TYPE_STRING),
                        "reason": openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
        },
    ),
)

# --- Flags ---

FLAGS_FIELDS = {
    "is_recommended": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Include in AI recommendation pool"),
    "is_new_arrival": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Mark as new arrival"),
    "is_best_selling": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Mark as best seller"),
    "is_cod_recommended": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Flag for COD recommendation"),
    "recommendation_priority": openapi.Schema(type=openapi.TYPE_INTEGER, description="0–9999. Lower = higher rank"),
    "recommendation_score_override": openapi.Schema(type=openapi.TYPE_NUMBER, description="0–999. Manual AI score override"),
    "price_tier": openapi.Schema(type=openapi.TYPE_STRING, enum=["Budget", "Mid", "Premium", "Luxury"]),
    "brand_family": openapi.Schema(type=openapi.TYPE_STRING, description="e.g. Italian Niche (max 100 chars)"),
    "best_selling_scope": openapi.Schema(type=openapi.TYPE_STRING, enum=["global", "category", "brand", "subcategory"]),
}

PRODUCT_FLAGS_REQUEST = openapi.Schema(type=openapi.TYPE_OBJECT, properties=FLAGS_FIELDS)

PRODUCT_FLAGS_RESPONSE = openapi.Response(
    description="Flags updated successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING),
            "data": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={"barcode": openapi.Schema(type=openapi.TYPE_STRING), **FLAGS_FIELDS},
            ),
        },
    ),
)

PRODUCT_BULK_FLAGS_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["barcodes", "flags"],
    properties={
        "barcodes": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="1–500 target product barcodes",
        ),
        "flags": PRODUCT_FLAGS_REQUEST,
    },
)

PRODUCT_BULK_FLAGS_RESPONSE = openapi.Response(
    description="Bulk flags update result",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "updated_count": openapi.Schema(type=openapi.TYPE_INTEGER),
            "not_found": openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(type=openapi.TYPE_STRING),
                description="Barcodes not found in DB",
            ),
        },
    ),
)

# --- Embedding refresh ---

PRODUCT_EMBEDDING_REFRESH_RESPONSE = openapi.Response(
    description="Embedding refreshed successfully (synchronous)",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "data": openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "barcode": openapi.Schema(type=openapi.TYPE_STRING),
                    "embedding_updated_at": openapi.Schema(type=openapi.TYPE_STRING, format="date-time"),
                    "ai_score": openapi.Schema(type=openapi.TYPE_NUMBER, description="0.0–1.0"),
                    "embedding_text_len": openapi.Schema(type=openapi.TYPE_INTEGER),
                },
            ),
        },
    ),
)
