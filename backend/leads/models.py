from django.db import models


class Lead(models.Model):
    sender = models.ForeignKey(
        "conversation.ConversationSender",
        on_delete=models.CASCADE,
        related_name="leads",
        null=True,
        blank=True,
    )
    interested_product = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.sender.full_name or self.sender.sender_id} - {self.interested_product}"
