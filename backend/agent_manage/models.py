from django.db import models


class ToneChoices(models.TextChoices):
    FRIENDLY = "friendly", "Friendly & Warm"
    PROFESSIONAL = "professional", "Professional"
    SALES = "sales", "Sales-Oriented"


class AgentBehaviorConfig(models.Model):
    opening_message = models.TextField(default="Hello! How can I help you today?")
    closing_message = models.TextField(default="Thanks for chatting! Have a great day.")
    tone = models.CharField(
        max_length=30,
        choices=ToneChoices.choices,
        default=ToneChoices.FRIENDLY,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Agent Behavior ({self.tone})"
