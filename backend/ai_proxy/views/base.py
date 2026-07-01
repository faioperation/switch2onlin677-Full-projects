from rest_framework import views, permissions, status
from rest_framework.response import Response
import requests
from django.conf import settings


class BaseAIProxyView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_base_url(self):
        base_url = getattr(settings, "AI_BOT_BASE_URL", "").rstrip("/")
        if not base_url:
            raise Exception("AI_BOT_BASE_URL not configured")
        return base_url

    def proxy_request(
        self, method, path, data=None, params=None, files=None, timeout=120
    ):
        try:
            base_url = self.get_base_url()
            target_url = f"{base_url}/{path.lstrip('/')}"

            response = requests.request(
                method=method,
                url=target_url,
                json=data if not files else None,
                data=data if files else None,
                params=params,
                files=files,
                timeout=timeout,
            )

            try:
                return Response(response.json(), status=response.status_code)
            except ValueError:
                return Response(response.content, status=response.status_code)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
