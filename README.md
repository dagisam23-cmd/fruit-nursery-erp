# Fruit Nursery ERP Platform

## Digital Nursery Operating System (DNOS)

A comprehensive Enterprise Resource Planning platform designed for large-scale commercial fruit nurseries, supporting operations from 10,000 to over 10 million seedlings annually.

## 🎯 Strategic Vision

### Supported Nursery Types
- Large-scale commercial nurseries
- Export-oriented fruit plant producers
- Multi-location nursery operations
- Cooperative-based production networks
- Government and research nurseries
- Contract propagation enterprises

### Key Capabilities
- **Full Plant Traceability** - Complete audit trail for every batch
- **Production Management** - 11-stage grafting and propagation pipeline
- **Agronomy Intelligence** - AI-powered plant health analytics
- **Inventory Control** - Real-time warehouse management with RFID/Barcode support
- **Procurement** - Fully digital purchasing workflows
- **Financial Management** - Complete accounting and budgeting
- **HR & Workforce** - Biometric integration and productivity tracking
- **Compliance** - GlobalG.A.P., Organic, and Export certification support
- **Mobile Ecosystem** - Offline-capable mobile app with GPS and photo capture

## 📁 Project Structure

```
fruit-nursery-erp/
├── src/
│   ├── api/                    # Backend API services
│   │   ├── services/           # Core business logic
│   │   │   ├── nursery/        # Production management
│   │   │   ├── agronomy/       # Plant health & analytics
│   │   │   ├── inventory/      # Warehouse management
│   │   │   ├── procurement/    # Purchasing workflows
│   │   │   ├── crm/            # Customer management
│   │   │   ├── finance/        # Accounting & reporting
│   │   │   ├── hr/             # Human resources
│   │   ���   ├── compliance/     # Audit & certification
│   │   │   └── analytics/      # BI & reporting
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── models/             # Data models & schemas
│   │   ├── routes/             # API endpoints
│   │   └── utils/              # Helper functions
│   ├── database/
│   │   ├── migrations/         # Database schema versions
│   │   ├── seeds/              # Initial data
│   │   └── schema/             # Database definition
│   ├── config/                 # Configuration management
│   └── types/                  # TypeScript type definitions
├── apps/
│   ├── web/                    # React web application
│   │   ├── src/
│   │   │   ├── components/     # Reusable React components
│   │   │   ├── pages/          # Page components
│   │   │   ├── services/       # API client services
│   │   │   ├── store/          # Redux state management
│   │   │   └── styles/         # CSS/SCSS files
│   │   └── package.json
│   └── mobile/                 # React Native mobile app
│       ├── src/
│       │   ├── screens/        # Mobile screens
│       │   ├── components/     # Reusable components
│       │   ├── services/       # Offline sync & API
│       │   └── storage/        # Local database
│       └── package.json
├── tests/                      # Integration & e2e tests
├── docs/                       # Documentation
│   ├── api/                    # API documentation
│   ├── architecture/           # System design
│   ├── deployment/             # Deployment guides
│   └── user-guides/            # User documentation
├── docker/                     # Docker configurations
├── scripts/                    # Utility scripts
└── package.json
```

## 🏗️ Architecture

### Microservices
1. **Identity Service** - Authentication (OAuth 2.0, JWT, MFA)
2. **Nursery Service** - Production operations and batch management
3. **Agronomy Service** - Plant health, disease surveillance, growth analytics
4. **Inventory Service** - Stock management, barcode/RFID, forecasting
5. **Procurement Service** - Purchase orders, supplier management
6. **CRM Service** - Customer lifecycle, sales pipeline
7. **HR Service** - Workforce management, biometric integration
8. **Finance Service** - Accounting, budgeting, reporting
9. **Compliance Service** - Audit trails, certifications
10. **Analytics Service** - Business intelligence and reporting

### Role-Centered Interface
Dynamic UI adapts based on:
- **User Roles** (CEO, Manager, Agronomist, Worker, etc.)
- **Location** (Headquarters, Nursery Block, Warehouse, etc.)
- **Device Type** (Desktop, Tablet, Mobile, Industrial Device)
- **Operational Context** (Online, Offline, Low Connectivity)

### Three-Layer Navigation
1. **Strategic** - Executive dashboards and KPIs
2. **Functional** - Department-specific workflows
3. **Operational** - Task-specific actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/fruit-nursery-erp.git
cd fruit-nursery-erp

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start services with Docker
docker-compose up -d

# Run migrations
npm run migrate:latest

# Seed initial data
npm run seed:db

# Start development server
npm run dev
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts and authentication
- `roles` - User roles and permissions
- `batches` - Production batches with complete history
- `batch_stages` - Production pipeline stages (11 stages)
- `plants` - Individual plant records
- `inspections` - Agronomic inspections and observations
- `diseases` - Disease records and treatments
- `inventory_items` - Warehouse inventory
- `suppliers` - Supplier management
- `purchase_orders` - Procurement workflow
- `customers` - Customer profiles and history
- `orders` - Sales orders
- `employees` - HR records with biometrics
- `attendance` - Workforce tracking
- `transactions` - Financial transactions
- `audit_logs` - Compliance audit trail

## 🔐 Security

### Authentication & Authorization
- OAuth 2.0 with Google and Microsoft
- JWT tokens with refresh mechanism
- Multi-Factor Authentication (MFA)
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)

### Data Security
- TLS encryption for data in transit
- AES-256 encryption for sensitive data at rest
- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- Rate limiting and DDoS protection

### Monitoring
- Intrusion detection system
- Activity logging and audit trails
- Security analytics and alerts

## 📱 Mobile Ecosystem

### Features
- Offline data entry and sync
- GPS tracking and mapping
- Photo and video capture
- QR/Barcode scanning
- Voice notes and annotations
- Digital signatures
- Biometric authentication

### Synchronization
- Automatic conflict resolution
- Data compression
- Secure encryption
- Status indicators (Draft → Synced)

## 📈 Performance Targets

- Support 10,000+ concurrent users
- Handle millions of plant records
- Sub-3-second API response times
- 99.9% uptime SLA
- Multi-country deployment capability

## 📚 Documentation

- [API Documentation](docs/api/README.md)
- [Architecture Guide](docs/architecture/README.md)
- [Deployment Guide](docs/deployment/README.md)
- [User Guides](docs/user-guides/README.md)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- services/nursery

# Generate coverage report
npm test -- --coverage
```

## 🌍 Integration

Supported integrations:
- Accounting software (QuickBooks, SAP)
- Banking systems (ACH, wire transfers)
- SMS gateways (Twilio, AWS SNS)
- Email systems (SMTP, SendGrid)
- IoT sensors (temperature, humidity, soil moisture)
- Weather services (OpenWeatherMap, Weather API)
- GPS devices (mobile tracking)
- Government certification portals
- E-commerce platforms (Shopify, WooCommerce)

## 📞 Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/yourusername/fruit-nursery-erp/issues)
- Documentation: [Read the docs](docs/)
- Email: support@fruiitnerseryyerp.com

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

This project is maintained by the Fruit Nursery ERP Team.

---

**Built with ❤️ for modern fruit nursery enterprises worldwide**
