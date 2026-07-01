from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from agent_manage.models import AgentBehaviorConfig
from agent_manage.serializers import AgentBehaviorConfigSerializer


class AgentBehaviorConfigView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Retrieve current agent behavior config",
        responses={
            200: AgentBehaviorConfigSerializer,
            404: "No config found",
        },
        tags=["Agent / Behavior"],
    )
    def get(self, request):
        config = AgentBehaviorConfig.objects.first()
        if not config:
            return Response(
                {"detail": "No config found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = AgentBehaviorConfigSerializer(config)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="Create agent behavior config",
        request_body=AgentBehaviorConfigSerializer,
        responses={
            201: AgentBehaviorConfigSerializer,
            400: "Config already exists. Use PATCH to update.",
        },
        tags=["Agent / Behavior"],
    )
    def post(self, request):
        if AgentBehaviorConfig.objects.exists():
            return Response(
                {"detail": "Config already exists. Use PATCH to update."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = AgentBehaviorConfigSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        operation_summary="Update existing agent behavior config",
        request_body=AgentBehaviorConfigSerializer,
        responses={
            200: AgentBehaviorConfigSerializer,
            404: "No config exists. Use POST to create.",
        },
        tags=["Agent / Behavior"],
    )
    def patch(self, request):
        config = AgentBehaviorConfig.objects.first()
        if not config:
            return Response(
                {"detail": "No config exists. Use POST to create."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = AgentBehaviorConfigSerializer(
            config, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
