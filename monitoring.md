# Monitoring Stack Access

| Service | URL | Default Credentials |
|---------|-----|----------------------|
| **Prometheus** | http://prometheus.localhost | None |
| **Grafana** | http://grafana.localhost | admin / admin |
| **Jaeger** | http://jaeger.localhost | None |
| **Loki** | http://grafana.localhost (Explore tab) | None |
| **phpMyAdmin** | http://db.localhost | See .env |

## Metrics Endpoints

| Service | URL | Format |
|---------|-----|--------|
| **Backend API Metrics** | http://localhost/metrics | Prometheus |
| **Auth Service Metrics** | http://localhost/auth/metrics | Prometheus |

