import logging
from django.core.management.base import BaseCommand
from conversation.models import ConversationSender
from conversation.services import MetaApiService

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Synchronizes profile names and pictures for all Meta senders (FB/IG)'

    def handle(self, *args, **options):
        senders = ConversationSender.objects.exclude(platform='whatsapp')
        service = MetaApiService()
        
        self.stdout.write(f"Starting sync for {senders.count()} senders...")
        
        success = 0
        failed = 0
        
        for sender in senders:
            self.stdout.write(f"Fetching profile for {sender.platform} ID: {sender.sender_id}...")
            # We use our unified field fetcher
            data = service.fetch_user_profile(sender.sender_id, sender.platform)
            
            if data:
                # Re-fetch from DB to see updated values
                sender.refresh_from_db()
                self.stdout.write(self.style.SUCCESS(f"  Successfully updated: {sender.full_name}"))
                success += 1
            else:
                self.stdout.write(self.style.ERROR(f"  Failed to update profile for {sender.sender_id}"))
                failed += 1
        
        self.stdout.write(self.style.SUCCESS(f"\nFinished. Success: {success}, Failed: {failed}"))
