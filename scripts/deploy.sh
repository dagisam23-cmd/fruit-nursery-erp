#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Fruit Nursery ERP Setup${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build

echo -e "${YELLOW}🔧 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

echo -e "${YELLOW}📚 Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T api npm run migrate:latest

echo -e "${YELLOW}🌱 Seeding database...${NC}"
docker-compose -f docker-compose.prod.yml exec -T api npm run seed:db

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${GREEN}Services are running at:${NC}"
echo "  API: http://localhost:3000"
echo "  PgAdmin: http://localhost:5050"
echo "  Redis: localhost:6379"
echo ""
echo -e "${YELLOW}To view logs: ${NC}docker-compose -f docker-compose.prod.yml logs -f"
echo -e "${YELLOW}To stop services: ${NC}docker-compose -f docker-compose.prod.yml down"
