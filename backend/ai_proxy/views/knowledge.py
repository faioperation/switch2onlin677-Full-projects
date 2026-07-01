from rest_framework import permissions
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .base import BaseAIProxyView


class RateProxyView(BaseAIProxyView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Get current rate",
        tags=["AI Proxy - USD To IQD"],
    )
    def get(self, request):
        return self.proxy_request("GET", "/rate")

    @swagger_auto_schema(
        operation_summary="Update rate",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={"iqd_rate": openapi.Schema(type=openapi.TYPE_NUMBER)},
        ),
        tags=["AI Proxy - USD To IQD"],
    )
    def post(self, request):
        return self.proxy_request("POST", "/rate", data=request.data)


class PromptProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Get AI prompt",
        tags=["AI Proxy - Prompt"],
    )
    def get(self, request):
        return self.proxy_request("GET", "/prompt")

    @swagger_auto_schema(
        operation_summary="Update AI prompt",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={"prompt": openapi.Schema(type=openapi.TYPE_STRING)},
        ),
        tags=["AI Proxy - Prompt"],
    )
    def put(self, request):
        return self.proxy_request("PUT", "/prompt", data=request.data)


class KnowledgeProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="List knowledge base",
        tags=["AI Proxy - Knowledge Files"],
    )
    def get(self, request):
        return self.proxy_request("GET", "/knowledge")


class KnowledgeUploadProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Upload to knowledge base",
        tags=["AI Proxy - Knowledge Files"],
    )
    def post(self, request):
        files = {
            k: (v.name, v.read(), v.content_type) for k, v in request.FILES.items()
        }
        data = {k: v for k, v in request.data.items() if k not in request.FILES}
        return self.proxy_request(
            "POST",
            "/knowledge/upload",
            data=data,
            files=files,
            params=request.query_params,
            timeout=300,
        )


class KnowledgeDetailProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Delete knowledge item",
        tags=["AI Proxy - Knowledge Files"],
    )
    def delete(self, request, knowledge_id):
        return self.proxy_request("DELETE", f"/knowledge/{knowledge_id}")
