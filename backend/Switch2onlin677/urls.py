from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from debug_toolbar.toolbar import debug_toolbar_urls
from .views import api_root_view
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="AI Sales & Engagement Chatbot with SAP Integration",
        default_version="v1",
        description="""
AI Sales & Engagement Chatbot API with SAP Integration.

---

## Product Filter (all AI endpoints)

Only products meeting **all** of the following are returned:
- `product_status = 'active'`
- `available_qty > 5`
- `price > 0`
- `deleted_at IS NULL`

---

## Recommendation Scoring — Hybrid Formula

```
final_score = W_SEM   × semantic_similarity
            + W_ED    × editorial_score
            + W_POP   × popularity_score
            + W_STK   × availability_score
            + W_FRESH × freshness_score
```

| Component | Env Var | Default | Description |
|---|---|---|---|
| Semantic | `SCORE_W_SEMANTIC` | 0.40 | 1 − cosine_distance (pgvector) |
| Editorial | `SCORE_W_EDITORIAL` | 0.22 | Priority + override + flag bonuses |
| Popularity | `SCORE_W_POPULARITY` | 0.15 | Best-selling flag + sales rank |
| Stock | `SCORE_W_STOCK` | 0.13 | available_qty / 100, capped at 1.0 |
| Freshness | `SCORE_W_FRESHNESS` | 0.10 | New arrival recency bonus |

**HybridAIScorer** (active when `RECOMMENDATION_SCORER=hybrid_ai`, recommended at ≥ 50% embedding coverage):
```
final = 0.55 × ai_score + 0.45 × editorial_score   # SCORE_ALPHA env var
```

---

## Error Envelope

All errors follow this structure:
```json
{ "success": false, "error": "Human-readable error message." }
```

| HTTP Code | When |
|---|---|
| 200 | Request succeeded |
| 202 | Upload job queued |
| 400 | File validation failure (size, extension, MIME, corruption) |
| 404 | Product, upload job, or resource not found |
| 422 | Request body validation failed |
| 500 | DB commit failure, OpenAI API error, or unexpected exception |
| 503 | Readiness check failed (DB unreachable) |
""",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path("", api_root_view),
    path("admin/", admin.site.urls),
    path("auth/", include("accounts.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/v1/", include("api.urls")),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
] + debug_toolbar_urls()

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
