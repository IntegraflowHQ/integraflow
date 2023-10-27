import json

import requests
from django.conf import settings
from django.http import JsonResponse
from django.views import View


class GoogleCallback(View):
    enabled = settings.GOOGLE_LOGIN_ENABLED
    client_id = settings.GOOGLE_CLIENT_ID
    client_secret = settings.GOOGLE_CLIENT_SECRET

    def get_payload(self, code: str):
        data = {
            "code": code,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        }
        response = requests.post(
            "https://oauth2.googleapis.com/token", data=data
        ).json()

        headers = {"Authorization": f'Bearer {response["access_token"]}'}
        user_info = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo", headers=headers
        ).json()
        return user_info

    def post(self, request):
        body = json.loads(request.body.decode("utf-8"))
        code = body.get("code", "")
        print(code)

        if not self.enabled:
            return JsonResponse({"message": "feature disabled"}, status=404)

        if code == "":
            return JsonResponse({"message": "'code' is required"}, status=400)

        credentials = self.get_payload(code)
        print(credentials)
        return JsonResponse(credentials)
