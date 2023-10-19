from django.http import JsonResponse

from .jwt_manager import get_jwt_manager


def jwks(request):
    return JsonResponse(get_jwt_manager().get_jwks())
