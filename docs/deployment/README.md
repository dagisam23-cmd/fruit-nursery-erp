# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Git
- PostgreSQL CLI (optional, for backups)
- Node.js 18+ (for local development)

## Local Development

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/fruit-nursery-erp.git
cd fruit-nursery-erp
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Services

```bash
# Using Docker Compose
docker-compose up -d

# Run migrations
npm run migrate:latest

# Seed database
npm run seed:db

# Start API in development mode
npm run dev
```

### 5. Access Services

- API: http://localhost:3000
- PgAdmin: http://localhost:5050 (admin@fruiitnerseryyerp.com / admin123)
- Redis: localhost:6379

## Production Deployment

### Using Docker Compose (Recommended)

#### 1. Prepare Production Environment

```bash
cp .env.example .env.production
# Edit .env.production with production values
```

#### 2. Run Deployment Script

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### 3. Verify Deployment

```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Test API
curl http://localhost:3000/health
```

### AWS Deployment (ECS/Fargate)

#### 1. Build and Push Images

```bash
# Authenticate with AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

# Build images
docker build -t [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/fruit-nursery-api:latest -f docker/Dockerfile.api .

# Push to ECR
docker push [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/fruit-nursery-api:latest
```

#### 2. Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name fruit-nursery-prod
```

#### 3. Create Task Definition

Create `task-definition.json`:

```json
{
  "family": "fruit-nursery-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "[ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/fruit-nursery-api:latest",
      "portMappings": [{
        "containerPort": 3000
      }],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "DB_HOST", "value": "[RDS_ENDPOINT]"}
      ]
    }
  ]
}
```

#### 4. Register Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### 5. Create Service

```bash
aws ecs create-service \
  --cluster fruit-nursery-prod \
  --service-name fruit-nursery-api \
  --task-definition fruit-nursery-api \
  --desired-count 2 \
  --launch-type FARGATE
```

### Google Cloud Deployment (Cloud Run)

#### 1. Build and Push Image

```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/fruit-nursery-api
```

#### 2. Deploy to Cloud Run

```bash
gcloud run deploy fruit-nursery-api \
  --image gcr.io/[PROJECT_ID]/fruit-nursery-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars NODE_ENV=production,DB_HOST=[CLOUD_SQL_HOST]
```

## Database Management

### Backup Database

```bash
# Using script
chmod +x scripts/backup.sh
./scripts/backup.sh

# Manual backup
docker-compose exec postgres pg_dump -U postgres fruit_nursery_erp > backup.sql
```

### Restore Database

```bash
docker-compose exec -T postgres psql -U postgres fruit_nursery_erp < backup.sql
```

### Run Migrations

```bash
# Latest migrations
npm run migrate:latest

# Specific migration
npm run migrate:up

# Rollback
npm run migrate:rollback
```

## Monitoring & Logging

### Application Logs

```bash
# Docker Compose logs
docker-compose logs -f api

# Specific time range
docker-compose logs --since 2024-01-01 api

# With timestamps
docker-compose logs -f --timestamps api
```

### Health Checks

```bash
# API health
curl http://localhost:3000/health

# Database connection
curl http://localhost:3000/api/v1/health
```

## Scaling

### Docker Compose Scaling

```bash
# Scale API service to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

### Kubernetes Deployment

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fruit-nursery-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: fruit-nursery-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
```

Deploy:

```bash
kubectl apply -f k8s-deployment.yaml
```

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Backup Strategy

- **Daily backups** using automated script
- **Weekly** full database dumps to cloud storage
- **Retention policy**: 30 days local, 1 year cloud storage
- **Encryption**: All backups encrypted with AES-256

## Disaster Recovery

1. **RTO**: 2 hours
2. **RPO**: 24 hours
3. **Backup location**: AWS S3 with cross-region replication
4. **Recovery procedures**: Document in runbook

## Performance Optimization

### Database Indexing

```sql
CREATE INDEX idx_batches_status_created 
ON batches(status, created_at);
```

### Caching Strategy

- Cache layer: Redis
- Cache TTL: 5 minutes (configurable)
- Invalidation: Event-driven

### CDN Configuration

- Static assets: CloudFront/CloudFlare
- API responses: No caching (real-time data)

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs -f

# Verify ports not in use
lsof -i :3000
lsof -i :5432

# Clean up and restart
docker-compose down -v
docker-compose up -d
```

### Database Connection Issues

```bash
# Test connection
docker-compose exec postgres psql -U postgres -c "SELECT version();"

# Check environment variables
docker-compose exec api env | grep DB_
```

### Memory Issues

```bash
# Increase Docker memory limit
# Edit docker-compose.yml:
# services:
#   api:
#     mem_limit: 2g
```

## Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Setup API rate limiting
- [ ] Enable audit logging
- [ ] Backup encryption enabled
- [ ] VPN/bastion host access
- [ ] Regular security updates
- [ ] Secrets management (HashiCorp Vault)
- [ ] DDoS protection

## Support

For deployment issues, contact: devops@fruiitnerseryyerp.com
