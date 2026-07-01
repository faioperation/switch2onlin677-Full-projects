from rest_framework import serializers
from agent_manage.models import AgentBehaviorConfig


class AgentBehaviorConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentBehaviorConfig
        fields = "__all__"
