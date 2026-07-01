from drf_yasg.utils import swagger_auto_schema
from ai_proxy.schemas import events as sc
from .base import BaseAIProxyView


class ProductEventProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Log a product behavioral event",
        operation_description="""
Log a behavioral event (view, click, purchase, recommendation accepted/rejected).

Events feed into:
- User preference embedding updates
- Future collaborative-filtering models
- AI score recalculation pipeline

**Event weights:**

| event_type | Weight | Triggers Profile Update |
|---|---|---|
| view | 0.3 | No |
| click | 0.7 | Yes |
| purchase | 1.0 | Yes |
| recommendation_accepted | 0.9 | Yes |
| recommendation_rejected | — | No |
""",
        tags=["AI Proxy - Behavioral Tracking"],
        request_body=sc.PRODUCT_EVENT_REQUEST,
        responses={200: sc.PRODUCT_EVENT_RESPONSE},
    )
    def post(self, request, barcode):
        return self.proxy_request("POST", f"/events/product/{barcode}", data=request.data)
