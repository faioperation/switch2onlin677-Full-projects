from django.urls import path
from ai_proxy import views

urlpatterns = [
    path("rate/", views.RateProxyView.as_view(), name="ai-rate-proxy"),
    path("prompt/", views.PromptProxyView.as_view(), name="ai-prompt-proxy"),
    path("knowledge/", views.KnowledgeProxyView.as_view(), name="ai-knowledge-proxy"),
    path(
        "knowledge/upload/",
        views.KnowledgeUploadProxyView.as_view(),
        name="ai-knowledge-upload-proxy",
    ),
    path(
        "knowledge/<str:knowledge_id>/",
        views.KnowledgeDetailProxyView.as_view(),
        name="ai-knowledge-detail-proxy",
    ),
    path(
        "products/filters/",
        views.ProductFilterProxyView.as_view(),
        name="ai-product-filter-proxy",
    ),
    path(
        "products/upload-template/",
        views.ProductTemplateProxyView.as_view(),
        name="ai-product-template-proxy",
    ),
    path(
        "products/upload/",
        views.ProductUploadProxyView.as_view(),
        name="ai-product-upload-proxy",
    ),
    path(
        "products/uploads/",
        views.ProductUploadJobListProxyView.as_view(),
        name="ai-product-upload-job-list-proxy",
    ),
    path(
        "products/uploads/<str:job_id>/",
        views.ProductUploadJobDetailProxyView.as_view(),
        name="ai-product-upload-job-detail-proxy",
    ),
    path(
        "products/bulk/status/",
        views.ProductBulkStatusProxyView.as_view(),
        name="ai-product-bulk-status-proxy",
    ),
    path(
        "products/bulk/flags/",
        views.ProductBulkFlagsProxyView.as_view(),
        name="ai-product-bulk-flags-proxy",
    ),
    path(
        "products/", views.ProductListProxyView.as_view(), name="ai-product-list-proxy"
    ),
    path(
        "products/export/",
        views.ProductExportProxyView.as_view(),
        name="ai-product-export-proxy",
    ),
    path(
        "products/<str:barcode>/restore/",
        views.ProductRestoreProxyView.as_view(),
        name="ai-product-restore-proxy",
    ),
    path(
        "products/<str:barcode>/status/",
        views.ProductStatusProxyView.as_view(),
        name="ai-product-status-proxy",
    ),
    path(
        "products/<str:barcode>/flags/",
        views.ProductFlagsProxyView.as_view(),
        name="ai-product-flags-proxy",
    ),
    path(
        "products/<str:barcode>/",
        views.ProductDetailProxyView.as_view(),
        name="ai-product-detail-proxy",
    ),
    path(
        "categories/",
        views.CategoryListCreateProxyView.as_view(),
        name="proxy-category-list-create",
    ),
    path(
        "categories/<int:id>/",
        views.CategoryDetailsProxyView.as_view(),
        name="proxy-category-details",
    ),
    path(
        "brands/",
        views.BrandListCreateProxyView.as_view(),
        name="proxy-brand-list-create",
    ),
    path(
        "brands/<int:id>/",
        views.BrandDetailsProxyView.as_view(),
        name="proxy-brand-details",
    ),
    path(
        "subcategories/",
        views.SubcategoryListCreateProxyView.as_view(),
        name="proxy-subcategory-list-create",
    ),
    path(
        "subcategories/<int:id>/",
        views.SubcategoryDetailsProxyView.as_view(),
        name="proxy-subcategory-details",
    ),
    # AI Recommendation endpoints
    path(
        "ai/recommend/", views.AIRecommendProxyView.as_view(), name="ai-recommend-proxy"
    ),
    path("ai/search/", views.AISearchProxyView.as_view(), name="ai-search-proxy"),
    path("ai/skincare/", views.AISkincareProxyView.as_view(), name="ai-skincare-proxy"),
    path(
        "ai/fragrance/", views.AIFragranceProxyView.as_view(), name="ai-fragrance-proxy"
    ),
    path(
        "ai/personalised/",
        views.AIPersonalisedProxyView.as_view(),
        name="ai-personalised-proxy",
    ),
    path(
        "ai/similar/<str:barcode>/",
        views.AISimilarProxyView.as_view(),
        name="ai-similar-proxy",
    ),
    path(
        "ai/cross-sell/<str:barcode>/",
        views.AICrossSellProxyView.as_view(),
        name="ai-cross-sell-proxy",
    ),
    path(
        "ai/upsell/<str:barcode>/",
        views.AIUpsellProxyView.as_view(),
        name="ai-upsell-proxy",
    ),
    # AI Embedding endpoints
    path(
        "ai/embeddings/status/",
        views.AIEmbeddingStatusProxyView.as_view(),
        name="ai-embedding-status-proxy",
    ),
    path(
        "ai/embeddings/trigger/",
        views.AIEmbeddingTriggerProxyView.as_view(),
        name="ai-embedding-trigger-proxy",
    ),
    path(
        "products/<str:barcode>/embedding/refresh/",
        views.ProductEmbeddingRefreshProxyView.as_view(),
        name="ai-product-embedding-refresh-proxy",
    ),
    # SAP sync
    path(
        "sap/sync/",
        views.SapSyncProxyView.as_view(),
        name="ai-sap-sync-proxy",
    ),
    # Behavioral Tracking endpoints
    path(
        "events/product/<str:barcode>/",
        views.ProductEventProxyView.as_view(),
        name="ai-product-event-proxy",
    ),
]
