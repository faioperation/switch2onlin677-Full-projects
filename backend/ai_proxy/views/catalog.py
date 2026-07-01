from drf_yasg.utils import swagger_auto_schema
from ai_proxy.schemas import catalog as sc
from .base import BaseAIProxyView


class CategoryListCreateProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="List Categories",
        operation_description="""
Retrieve category list with:

- Search
- Active filter
- Pagination
""",
        tags=["AI Proxy Categories"],
        manual_parameters=sc.CATEGORY_LIST_PARAMETERS,
        responses={200: sc.CATEGORY_LIST_RESPONSE},
    )
    def get(self, request):
        return self.proxy_request("GET", "/categories", params=request.query_params)

    @swagger_auto_schema(
        operation_summary="Create Category",
        operation_description="""
Create a new category.

Features:
- Case-insensitive duplicate detection
- Arabic name support
""",
        tags=["AI Proxy Categories"],
        request_body=sc.CATEGORY_CREATE_REQUEST,
        responses={201: sc.CATEGORY_CREATE_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/categories", data=request.data)


class CategoryDetailsProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Get Category Details",
        operation_description="Retrieve category details by ID",
        tags=["AI Proxy Categories"],
        responses={200: sc.CATEGORY_DETAILS_RESPONSE},
    )
    def get(self, request, id):
        return self.proxy_request("GET", f"/categories/{id}")


class BrandListCreateProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="List Brands",
        operation_description="""
Retrieve brand list with:

- Search
- Active filter
- Pagination
""",
        tags=["AI Proxy Brands"],
        manual_parameters=sc.BRAND_LIST_PARAMETERS,
        responses={200: sc.BRAND_LIST_RESPONSE},
    )
    def get(self, request):
        return self.proxy_request("GET", "/brands", params=request.query_params)

    @swagger_auto_schema(
        operation_summary="Create Brand",
        operation_description="""
Create a new brand.

Features:
- Case-insensitive duplicate detection
- Arabic name support
""",
        tags=["AI Proxy Brands"],
        request_body=sc.BRAND_CREATE_REQUEST,
        responses={201: sc.BRAND_CREATE_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/brands", data=request.data)


class BrandDetailsProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Get Brand Details",
        operation_description="Retrieve brand details by ID",
        tags=["AI Proxy Brands"],
        responses={200: sc.BRAND_DETAILS_RESPONSE},
    )
    def get(self, request, id):
        return self.proxy_request("GET", f"/brands/{id}")


class SubcategoryListCreateProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="List Subcategories",
        operation_description="""
Retrieve subcategory list with:

- Parent category filtering
- Search
- Active filter
- Pagination
""",
        tags=["AI Proxy Subcategories"],
        manual_parameters=sc.SUBCATEGORY_LIST_PARAMETERS,
        responses={200: sc.SUBCATEGORY_LIST_RESPONSE},
    )
    def get(self, request):
        return self.proxy_request("GET", "/subcategories", params=request.query_params)

    @swagger_auto_schema(
        operation_summary="Create Subcategory",
        operation_description="""
Create a new subcategory under an existing category.

Features:
- Parent category validation
- Duplicate detection scoped to category
- Arabic name support
""",
        tags=["AI Proxy Subcategories"],
        request_body=sc.SUBCATEGORY_CREATE_REQUEST,
        responses={201: sc.SUBCATEGORY_CREATE_RESPONSE},
    )
    def post(self, request):
        return self.proxy_request("POST", "/subcategories", data=request.data)


class SubcategoryDetailsProxyView(BaseAIProxyView):
    @swagger_auto_schema(
        operation_summary="Get Subcategory Details",
        operation_description="Retrieve subcategory details by ID",
        tags=["AI Proxy Subcategories"],
        responses={200: sc.SUBCATEGORY_DETAILS_RESPONSE},
    )
    def get(self, request, id):
        return self.proxy_request("GET", f"/subcategories/{id}")
