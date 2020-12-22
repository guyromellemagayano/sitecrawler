package main

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Epic-Design-Labs/web-crawl-app/go/common"
	"github.com/Epic-Design-Labs/web-crawl-app/go/common/database"
	"github.com/pkg/errors"
)

type TlsCache struct {
	cache map[tlsKey]*database.CrawlTl
}

func NewTlsCache() *TlsCache {
	// We don't reinitialize the cache on crawl continue, since this is space saving optimization only anyway
	return &TlsCache{
		cache: make(map[tlsKey]*database.CrawlTl),
	}
}

type tlsKey struct {
	NotBefore          int64
	NotAfter           int64
	CommonName         string
	Organization       string
	DnsNames           string
	IssuerOrganization string
	IssuerCn           string
	CipherSuite        string
	Version            string
}

// Extract returns tls_status, tls_id and error
func (t *TlsCache) Extract(db *database.Database, TLS *tls.ConnectionState, request *http.Request) (int, *int, error) {
	if TLS == nil || len(TLS.PeerCertificates) == 0 {
		return common.TLS_NONE, nil, nil
	}

	certificate := TLS.PeerCertificates[0]
	cs := findCipherSuite(TLS.CipherSuite)
	if cs == nil {
		return 0, nil, errors.Errorf("invalid cipher suite: %d", TLS.CipherSuite)
	}
	version := "SSL 3.0"
	if TLS.Version >= tls.VersionTLS10 {
		version = fmt.Sprintf("TLS 1.%d", TLS.Version-tls.VersionTLS10)
	}

	key := tlsKey{}
	key.NotBefore = certificate.NotBefore.Unix()
	key.NotAfter = certificate.NotAfter.Unix()
	key.CommonName = certificate.Subject.CommonName
	key.Organization = strings.Join(certificate.Subject.Organization, " ")
	key.DnsNames = strings.Join(certificate.DNSNames, "!")
	key.IssuerOrganization = strings.Join(certificate.Issuer.Organization, " ")
	key.IssuerCn = certificate.Issuer.CommonName
	key.CipherSuite = cs.Name
	key.Version = version

	if tl, ok := t.cache[key]; ok {
		return t.status(tl), &tl.ID, nil
	}

	dnsNames := certificate.DNSNames
	if dnsNames == nil {
		dnsNames = []string{}
	}

	tl := &database.CrawlTl{
		NotBefore:          certificate.NotBefore,
		NotAfter:           certificate.NotAfter,
		CommonName:         key.CommonName,
		Organization:       key.Organization,
		DnsNames:           dnsNames,
		IssuerOrganization: key.IssuerOrganization,
		IssuerCn:           key.IssuerCn,
		CipherSuite:        key.CipherSuite,
		Version:            key.Version,
	}

	errors := make(map[string]interface{})

	if time.Now().Before(certificate.NotBefore) {
		errors["not_before"] = "Certificate not valid yet."
	}
	if time.Now().After(certificate.NotAfter) {
		errors["not_after"] = "Certificate expired."
	}

	if err := certificate.VerifyHostname(request.URL.Hostname()); err != nil {
		errors["dns_names"] = err.Error()
	}

	verifyOptions := x509.VerifyOptions{
		Intermediates: x509.NewCertPool(),
	}
	for _, cert := range TLS.PeerCertificates[1:] {
		verifyOptions.Intermediates.AddCert(cert)
	}
	if _, err := certificate.Verify(verifyOptions); err != nil {
		errors["ca"] = err.Error()
	}

	if cs.Insecure {
		errors["cipher_suite"] = "Insecure cipher suite."
	}

	if TLS.Version < tls.VersionTLS12 {
		errors["version"] = "Old tls version."
	}

	if len(errors) > 0 {
		tl.Errors = errors
	}

	if err := db.Insert(tl); err != nil {
		return 0, nil, err
	}
	t.cache[key] = tl

	return t.status(tl), &tl.ID, nil
}

func (t *TlsCache) status(tl *database.CrawlTl) int {
	if len(tl.Errors) > 0 {
		return common.TLS_ERROR
	}
	return common.TLS_OK
}
