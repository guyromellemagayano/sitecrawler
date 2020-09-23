from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import ContactSerializer


class ContactView(APIView):
    def post(self, request, format=None):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            subject = f"Support Ticket - SiteCrawler - {request.user.get_full_name()}"
            send_mail(subject, serializer.validated_data["message"], request.user.email, ["support@sitecrawler.com"])

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
