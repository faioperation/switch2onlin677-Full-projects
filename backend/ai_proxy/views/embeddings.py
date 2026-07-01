from drf_yasg.utils import swagger_auto_schema
from ai_proxy.schemas import embeddings as sc
from .base import BaseAIProxyView


class AIEmbeddingStatusProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Get embedding pipeline coverage",
        operation_description="""
Returns current embedding coverage statistics.

Use this to monitor pipeline health and decide when to activate `RECOMMENDATION_SCORER=hybrid_ai`.

| Field | Description |
|---|---|
| total_products | All active (non-deleted) products |
| embedded_products | Products with embedding IS NOT NULL |
| pending_products | Products still awaiting embedding |
| coverage_pct | embedded / total × 100 (one decimal) |
| embed_model | OpenAI model used (text-embedding-3-small) |
| embed_dimensions | Vector dimensions (1536) |
""",
        tags=["AI Proxy - Embeddings"],
        responses={200: sc.AI_EMBEDDING_STATUS_RESPONSE},
    )
    def get(self, request):
        return self.proxy_request("GET", "/ai/embeddings/status")


class AIEmbeddingTriggerProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Trigger product embedding job",
        operation_description="""
Trigger the product embedding background job on-demand.

Returns **immediately** — the job runs asynchronously.

**Common usage:**
- `{}` — embed all pending products
- `{"force_all": true, "batch_size": 100}` — re-embed entire catalog after prompt changes
- `{"limit": 500}` — embed first 500 products only (test run)
""",
        tags=["AI Proxy - Embeddings"],
        request_body=sc.AI_EMBEDDING_TRIGGER_REQUEST,
        responses={200: sc.AI_EMBEDDING_TRIGGER_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/ai/embeddings/trigger", data=request.data)
