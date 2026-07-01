# Switch2Online Meta Hub

Switch2Online Meta Hub is an all-in-one messaging powerhouse that brings WhatsApp, Messenger, and Instagram together in one place. Built with Django, it handles everything from automated bot chats to tracking leads and monitoring real-time growth via a sleek dashboard. It’s designed to make social communication feel effortless and organized.

## 🚀 Key Features

- **Omnichannel Support**: Unified handling of WhatsApp, Facebook, and Instagram messages.
- **Automated Bot Integration**: Asynchronous bot reply system for instant customer engagement.
- **Lead Management**: Automatically track and manage potential leads generated through social conversations.
- **Real-time Dashboard**: Visual statistics for total conversations, leads, platform distribution, and 7-day activity.
- **Media Handling**: Secure proxying and persistence of media (images, videos, etc.) from Meta platforms.
- **Auto-Token Resolution**: Smart handling of System User and Page Access Tokens for seamless authentication.
- **Swagger Documentation**: Interactive API documentation for easy integration.

## 🛠 Tech Stack

- **Framework**: [Django 6.0](https://www.djangoproject.com/)
- **API**: [Django REST Framework](https://www.django-rest-framework.org/)
- **Authentication**: JWT (SimpleJWT)
- **Documentation**: [drf-yasg](https://github.com/axnsan12/drf-yasg) (Swagger)
- **Database**: SQLite (Development) / PostgreSQL (Recommended for Production)
- **Integration**: Meta Graph API v25.0

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Aru-01/switch2onlin-Backend
cd switch2onlin677-Backend
```

### 2. Set Up Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/macOS
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and populate it with the following variables:

```env
# Django Settings
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Meta API Credentials
META_VERIFY_TOKEN=your_webhook_verify_token
META_PAGE_ID=your_facebook_page_id
META_FB_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
META_IG_PAGE_ACCESS_TOKEN=your_instagram_access_token
META_PAGE_ACCESS_TOKEN=your_whatsapp_access_token

# Platform IDs
META_WHATSAPP_PHONE_NUMBER_ID=your_wa_phone_id
META_WHATSAPP_BUSINESS_ACCOUNT_ID=your_wa_business_id
META_INSTAGRAM_BUSINESS_ACCOUNT_ID=your_ig_business_id

# External Services
AI_BOT_BASE_URL=https://your-bot-api.com
LEADS_API_KEY=your_leads_secret_key
```

### 5. Run Migrations
```bash
python manage.py migrate
```

### 6. Start the Server
```bash
python manage.py runserver
```

The server will be available at `http://127.0.0.1:8000/`.
Access Swagger documentation at `http://127.0.0.1:8000/swagger/`.

## 📂 Folder Structure

```text
├── Switch2onlin677/   # Core project settings
├── accounts/          # User authentication and profiles
├── conversation/      # Meta integration and messaging logic
├── leads/             # Lead tracking and management
├── dashboard/         # Statistics and monitoring views
├── api/               # API routing and utilities
├── manage.py          # Django management script
└── requirements.txt   # Project dependencies
```

## 📝 Important Notes

- **Webhook Configuration**: Ensure your Meta App is configured to send webhooks to `https://your-domain.com/api/v1/conversation/webhook/`.
- **System User Tokens**: This system is optimized for System User tokens. It automatically resolves Page Access Tokens for Facebook Messenger interactions.
- **Media Storage**: Ensure the `media/` directory has proper write permissions for media persistence.

## 📄 License

This project is proprietary. Unauthorized use, copying, or distribution is strictly prohibited without explicit permission from the author. See `LICENSE` for full details.

Built with passion by **[Arif](https://www.linkedin.com/in/aru01)** 🖤💻

