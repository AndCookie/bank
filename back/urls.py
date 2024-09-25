from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import KFTCCallbackView, KFTCTransactionView


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/bank_accounts/', include('bank_accounts.urls')),
    path('api/exchange_rates/', include('exchange_rates.urls')),
    path('api/trips/', include('trips.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/keys/', include('keys.urls')),
    path('auth/kftc/callback/', KFTCCallbackView.as_view(), name='kftc_callback'),
    path('api/kftc/transactions/', KFTCTransactionView.as_view(), name='kftc_transactions'),
    path('api/auth/', include('social_django.urls', namespace='social')), 
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
