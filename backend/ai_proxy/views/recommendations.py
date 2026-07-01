from drf_yasg.utils import swagger_auto_schema
from ai_proxy.schemas import recommendations as sc
from .base import BaseAIProxyView


class AIRecommendProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Universal AI recommendation",
        operation_description="""
Universal intent-aware recommendation endpoint. Detects the user's intent and routes to the optimal retrieval strategy.

**Intent Detection:**

| Intent | Trigger Example | Strategy |
|---|---|---|
| similar_product | Something like Dior Sauvage | Embed reference name → cosine search |
| skin_concern | My skin is dry and sensitive | Embed skin text + metadata filtering |
| category_search | Show me luxury face creams | Category + price_tier vector search |
| brand_search | I want something from Chanel | Brand name vector search |
| price_search | Budget skincare under 15,000 IQD | Price-filtered vector search |
| general | Any other query | Hybrid semantic search |

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.

**Graceful Degradation:** Falls back gracefully when a product has no embedding yet.
""",
        tags=["AI Proxy - Recommendations"],
        request_body=sc.AI_RECOMMEND_REQUEST,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/ai/recommend", data=request.data)


class AISearchProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Semantic product search",
        operation_description="""
Pure semantic search. Embeds the query and finds nearest catalog matches. No intent detection overhead.

Use when the caller already knows the query is a search (vs. the universal `/ai/recommend` endpoint).

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.
""",
        tags=["AI Proxy - Recommendations"],
        request_body=sc.AI_SEARCH_REQUEST,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/ai/search", data=request.data)


class AISimilarProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Similar products by barcode",
        operation_description="""
Returns products most similar to the given barcode's embedding vector.

Falls back to featured products if the source product has no embedding yet.

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.
""",
        tags=["AI Proxy - Recommendations"],
        manual_parameters=sc.AI_SIMILAR_PARAMETERS,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def get(self, request, barcode):
        return self.proxy_request("GET", f"/ai/similar/{barcode}", params=request.query_params)


class AICrossSellProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Cross-sell products by barcode",
        operation_description="""
Returns complementary products from a **different category** for cross-sell placement.

*'Customers who bought this also bought...'*

Only returns products priced differently from the source. Falls back gracefully when no embedding exists.

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.
""",
        tags=["AI Proxy - Recommendations"],
        manual_parameters=sc.AI_CROSS_SELL_PARAMETERS,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def get(self, request, barcode):
        return self.proxy_request("GET", f"/ai/cross-sell/{barcode}", params=request.query_params)


class AIUpsellProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Upsell products by barcode",
        operation_description="""
Returns higher-tier alternatives in the **same category** for upsell placement.

Only returns products priced **at least 10% more** than the source product.

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.
""",
        tags=["AI Proxy - Recommendations"],
        manual_parameters=sc.AI_UPSELL_PARAMETERS,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def get(self, request, barcode):
        return self.proxy_request("GET", f"/ai/upsell/{barcode}", params=request.query_params)


class AISkincareProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Skincare recommendations by skin type & concerns",
        operation_description="""
Returns skincare product recommendations tailored to skin type and specific concerns.

Uses semantic search enriched with skin-typed query text.

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.
""",
        tags=["AI Proxy - Recommendations"],
        request_body=sc.AI_SKINCARE_REQUEST,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/ai/skincare", data=request.data)


class AIFragranceProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Fragrance recommendations by reference name",
        operation_description="""
Find perfumes similar to a named reference fragrance.

The reference name is automatically enriched with fragrance domain vocabulary before embedding.

Results are sorted: **fragrance-category products first**, then others.

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.
""",
        tags=["AI Proxy - Recommendations"],
        request_body=sc.AI_FRAGRANCE_REQUEST,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/ai/fragrance", data=request.data)


class AIPersonalisedProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Personalised recommendations by user",
        operation_description="""
Personalised recommendations that blend the query embedding with the user's stored preference embedding.

Falls back to standard semantic search if no preference profile exists.

**Blending formula:**
```
blended_vector = 0.7 × query_embedding + 0.3 × user_preference_embedding
blended_vector = normalize(blended_vector)  # unit length
```

**Product Filter:** Only `product_status=active`, `available_qty > 5`, `price > 0`, `deleted_at IS NULL` products are returned.
""",
        tags=["AI Proxy - Recommendations"],
        manual_parameters=sc.AI_PERSONALISED_PARAMETERS,
        responses={200: sc.AI_RECOMMEND_RESPONSE},
    )
    def get(self, request):
        return self.proxy_request("GET", "/ai/personalised", params=request.query_params)
