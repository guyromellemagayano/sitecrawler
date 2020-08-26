from rest_framework import serializers

from crawl.models import Tls


class TlsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tls
        fields = [
            "not_before",
            "not_after",
            "common_name",
            "organization",
            "dns_names",
            "issuer_organization",
            "issuer_cn",
            "cipher_suite",
            "version",
            "errors",
        ]
