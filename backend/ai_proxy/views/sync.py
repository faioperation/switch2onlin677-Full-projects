from drf_yasg.utils import swagger_auto_schema
from .base import BaseAIProxyView


class SapSyncProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Trigger SAP price/stock sync now",
        operation_description="""
Trigger an on-demand SAP sync, outside the normal 06:00 / 18:00 (Asia/Baghdad) schedule.

Updates only SAP-owned fields (`price`, `available_qty`, `sap_product_id`, `last_synced_sap`).
Products with `price_source_override = true` keep their manually-set price.

Runs **synchronously** — the request blocks until the sync finishes, so this can take a while
for large catalogs. A row is written to the SAP sync audit log either way.
""",
        tags=["AI Proxy - SAP Sync"],
    )
    def post(self, request):
        # Full-catalog sync can take a while — give it more room than the default 120s.
        return self.proxy_request("POST", "/sap/sync-now", timeout=300)
