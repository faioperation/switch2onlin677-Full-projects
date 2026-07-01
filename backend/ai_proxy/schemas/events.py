from drf_yasg import openapi

PRODUCT_EVENT_REQUEST = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["event_type"],
    properties={
        "user_id": openapi.Schema(type=openapi.TYPE_STRING, description="User ID. Required for preference profile update", nullable=True),
        "session_id": openapi.Schema(type=openapi.TYPE_STRING, description="Session token for multi-turn tracking", nullable=True),
        "event_type": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["view", "click", "purchase", "recommendation_accepted", "recommendation_rejected"],
            description="view (0.3 weight), click (0.7), purchase (1.0), recommendation_accepted (0.9), recommendation_rejected (no weight)",
        ),
        "source": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["chatbot", "api", "frontend", "recommendation"],
            nullable=True,
        ),
        "position": openapi.Schema(type=openapi.TYPE_INTEGER, description="Rank position in recommendation list (0-indexed)", nullable=True),
        "metadata": openapi.Schema(type=openapi.TYPE_OBJECT, description="Free-form JSON (query text, rec type, A/B group, etc.)", nullable=True),
    },
)

PRODUCT_EVENT_RESPONSE = openapi.Response(
    description="Event logged successfully",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "success": openapi.Schema(type=openapi.TYPE_BOOLEAN),
            "message": openapi.Schema(type=openapi.TYPE_STRING),
            "event_id": openapi.Schema(type=openapi.TYPE_INTEGER, nullable=True),
            "profile_updated": openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Whether the user preference profile was updated"),
        },
    ),
)
