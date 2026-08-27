# Architecture Overview

## System Design

The Fruit Nursery ERP Platform uses a **microservices architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Web Browser  │  │ Mobile App   │  │ External API │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/WSS
┌──────────────────────────┴──────────────────────────────────┐
│                      API Gateway                            │
│  (Auth, Rate Limiting, Request Validation)                 │
└──────────────────────────┬───────────────────────────���──────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                  Microservices Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Identity    │  │ Nursery     │  │ Agronomy    │         │
│  │ Service     │  │ Service     │  │ Service     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Inventory   │  │ Procurement │  │ CRM Service │         │
│  │ Service     │  │ Service     │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Finance     │  │ HR Service  │  │ Compliance  │         │
│  │ Service     │  │             │  │ Service     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────────────────────────────────────────┐       │
│  │         Analytics Service (BI/Reports)         │       │
│  └─────────────────────────────────────────────────┘       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│              Infrastructure Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Redis Cache  │  │ Message Queue│      │
│  │ (Primary DB) │  │ (Sessions)   │  │ (Bull/RabbitMQ)    │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ File Storage │  │ Search Index │  │ Monitoring   │      │
│  │ (S3/MinIO)   │  │ (Elasticsearch)   │ (Prometheus) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

## Service Responsibilities

### 1. Identity Service
- User authentication (OAuth 2.0, JWT)
- Role-based access control (RBAC)
- Multi-factor authentication
- Session management

### 2. Nursery Service
- Batch management (CRUD operations)
- Production pipeline stages tracking
- Batch history and audit trail
- Location management

### 3. Agronomy Service
- Inspection records and analysis
- Plant growth tracking
- Disease identification and surveillance
- Observation management
- AI-based disease prediction

### 4. Inventory Service
- Stock management
- Barcode/RFID scanning
- Reorder level monitoring
- Expiry date tracking
- Stock forecasting

### 5. Procurement Service
- Purchase requisition workflow
- Supplier management
- Purchase order generation
- Goods receipt and quality verification
- Payment tracking

### 6. CRM Service
- Customer profile management
- Sales pipeline tracking
- Order management
- Lead and prospect tracking
- Customer satisfaction metrics

### 7. Finance Service
- General ledger management
- Financial transaction recording
- Budget management and variance analysis
- Profit & Loss reporting
- Cash flow management

### 8. HR Service
- Employee records
- Attendance tracking (biometric integration)
- Payroll management
- Performance tracking
- Leave management

### 9. Compliance Service
- Audit trail logging
- Compliance audit management
- Certification tracking (GlobalG.A.P, Organic, etc.)
- Finding and corrective action tracking

### 10. Analytics Service
- KPI calculation and reporting
- Business intelligence dashboards
- Predictive analytics (risk forecasting)
- Data warehouse integration

## Data Flow

### Batch Creation Flow

```
1. User creates batch via Web/Mobile App
   ↓
2. API Gateway validates request and authenticates user
   ↓
3. Nursery Service receives request
   ↓
4. Database transaction created
   ↓
5. Batch record inserted into PostgreSQL
   ↓
6. Event published: "batch.created"
   ↓
7. Event triggers:
   - Audit log entry
   - Analytics update
   - Notification to related systems
   ↓
8. Response returned to client with batch ID
```

### Real-time Sync (Mobile Offline)

```
1. Mobile app records data offline (AsyncStorage)
   ↓
2. When online, sync manager checks pending records
   ↓
3. For each pending record:
   - Submit to appropriate service API endpoint
   - Handle conflicts if server version differs
   - Mark as synced when successful
   ↓
4. Download latest server updates
   ↓
5. Merge with local cache
   ↓
6. UI updates with synced data
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **ORM**: Knex.js
- **Authentication**: Passport.js, JWT
- **Validation**: Joi
- **Logging**: Winston
- **Task Queue**: Bull

### Frontend
- **Web**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Custom + Material-UI
- **Charts**: Chart.js / D3.js
- **HTTP Client**: Axios

### Mobile
- **Framework**: React Native (Expo)
- **State Management**: Redux Toolkit
- **Local Storage**: AsyncStorage + SQLite
- **GPS**: Expo Location
- **Camera**: Expo Image Picker
- **HTTP**: Axios

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose / Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Security Architecture

### Authentication Flow

```
User Login
    ↓
Validate Credentials (Identity Service)
    ↓
Generate JWT Token (short-lived: 7 days)
Generate Refresh Token (long-lived: 30 days)
    ↓
Return tokens to client
    ↓
Client stores in secure storage
    ↓
On each request, include JWT in header
    ↓
API Gateway validates JWT signature
    ↓
Check user role against endpoint permissions
    ↓
Allow/Deny request
```

### Data Security Layers

1. **Transport Security**: TLS 1.3 encryption
2. **Authentication**: JWT with RS256 signing
3. **Authorization**: RBAC + ABAC policies
4. **Data Encryption**: AES-256 for sensitive fields
5. **Audit Logging**: All changes tracked
6. **Rate Limiting**: 100 requests/15 min per IP
7. **SQL Injection Prevention**: Parameterized queries
8. **CORS Protection**: Whitelist allowed origins

## Scalability Considerations

### Horizontal Scaling
- Stateless API services (multiple instances)
- Database read replicas for reporting
- Redis cluster for caching
- Load balancer (nginx/HAProxy)

### Vertical Scaling
- Database optimization with indexes
- Connection pooling
- Query optimization
- Caching strategy

### Performance Targets
- API response time: < 3 seconds (p99)
- Database query: < 100ms (average)
- Throughput: 10,000+ concurrent users
- Uptime: 99.9% SLA

## Disaster Recovery

### RTO/RPO
- **Recovery Time Objective (RTO)**: 2 hours
- **Recovery Point Objective (RPO)**: 24 hours

### Backup Strategy
- Daily automated backups
- Off-site backup storage (AWS S3)
- Database replication
- Cross-region replication

## Integration Points

### External Systems
- **Accounting**: QuickBooks, SAP integration
- **Banking**: Direct ACH, wire transfer APIs
- **Messaging**: Twilio (SMS), SendGrid (Email)
- **Weather**: OpenWeatherMap API
- **IoT**: Sensor data ingestion
- **E-commerce**: Shopify, WooCommerce webhooks

## Monitoring & Observability

### Metrics Collected
- API response times
- Database query performance
- Error rates
- User activity
- System resource usage

### Alerting Rules
- API error rate > 5%
- Response time > 3 seconds
- Database connection pool > 90%
- Disk usage > 80%
- Memory usage > 85%

## Development Workflow

1. **Feature branches** from main
2. **Pull request review** before merge
3. **Automated testing** (unit + integration)
4. **Staging deployment** for QA
5. **Production deployment** with blue-green strategy

## Future Enhancements

- Machine learning models for yield prediction
- Advanced IoT sensor integration
- Blockchain for supply chain traceability
- Mobile app offline sync improvements
- Real-time collaborative features
- GraphQL API option
- Kubernetes migration
