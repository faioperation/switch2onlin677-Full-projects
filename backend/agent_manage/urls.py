from django.urls import path
from agent_manage.views import AgentBehaviorConfigView


urlpatterns = [
    path("agent-behavior/", AgentBehaviorConfigView.as_view(), name="agent-behavior"),
]
