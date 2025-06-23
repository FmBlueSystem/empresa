# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlueSystem.io is a modern full-stack web application with a containerized architecture. It's a Spanish-language business application with complete user authentication, modern React frontend, and enterprise-grade backend infrastructure.

## Architecture

**Stack**: Node.js + Express + MySQL + Redis + React + Vite + Docker + Nginx
**Language**: Primarily Spanish (UI, documentation, comments)
**Deployment**: Fully containerized with development and production Docker configurations

### Key Services:
- **Frontend**: React 18 with Vite, served through Nginx (port 80/443)
- **Backend**: Node.js Express API with comprehensive middleware (port 3000)
- **Database**: MySQL 8.0 with health checks and optimized configuration
- **Cache**: Redis 7 with persistence and LRU eviction
- **Proxy**: Nginx with rate limiting and security headers
- **Management**: Portainer for Docker container management (port 9000)

## Development Commands

### Local Development (with hot reload):
```bash
# Start complete development stack
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View development logs
docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Stop development stack
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

### Frontend Commands:
```bash
cd frontend
npm run dev          # Vite dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # ESLint check
npm run lint:fix     # Fix ESLint issues
```

### Backend Commands:
```bash
cd app
npm run dev          # Development with nodemon
npm start            # Production server
npm test             # Jest tests
npm run test:watch   # Tests in watch mode
npm run test:coverage # Test coverage report
npm run health       # Health check
```

### Production Deployment:
```bash
# Recommended: Use deployment script
./scripts/deploy.sh deploy

# Alternative: Direct Docker Compose
docker-compose up -d
```

## Code Architecture

### Frontend Structure (`frontend/src/`):
- **Components**: Reusable React components (Navbar, Hero, Footer, ServiceCard, etc.)
- **Pages**: Page-level components with routing
- **App.jsx**: Main application component with routing setup
- **Styling**: Tailwind CSS with custom blue theme configuration

### Backend Structure (`app/`):
- **server.js**: Express app with comprehensive security middleware (Helmet, CORS, rate limiting)
- **config/**: Database, Redis, and Winston logger configurations
- **routes/**: API endpoints (`/health`, `/api`) with structured routing
- **tests/**: Jest test files for API endpoints

### Key Development Patterns:

1. **API Proxy Setup**: Vite dev server proxies `/api` and `/health` to backend (localhost:3000)
2. **Security-First**: Comprehensive middleware stack with CSP, rate limiting, CORS
3. **Health Monitoring**: Multiple health check endpoints (`/health`, `/health/detailed`)
4. **Caching Strategy**: Redis integration with configurable TTL and LRU eviction
5. **Logging**: Winston with daily rotate files and structured logging
6. **Validation**: Joi schema validation for API inputs

### Build Optimization:
- **Frontend**: Manual chunking (vendor, router, utils) for optimal loading
- **Backend**: Multi-stage Docker builds with development/production variants
- **Database**: Optimized MySQL configuration with slow query logging

## Environment Configuration

The project uses comprehensive environment variables in `.env` file:
- Database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
- Redis configuration (REDIS_PASSWORD)
- Security tokens (JWT_SECRET, API_KEY, SESSION_SECRET)
- Application settings (NODE_ENV, LOG_LEVEL)

## Testing and Quality Assurance

- **Backend**: Jest with Supertest for API testing
- **Frontend**: ESLint for code quality
- **Database**: Health checks and connection testing endpoints
- **Integration**: Docker health checks for all services

## Deployment Scripts

Located in `scripts/` directory:
- **deploy.sh**: Complete deployment automation with health checks
- **backup_db.sh**: Database backup and restore utilities

## Common Development URLs

### Development Mode:
- Frontend (Vite): http://localhost:5173
- Backend API: http://localhost:3000
- Nginx Proxy: http://localhost:8080

### Production Mode:
- Application: http://localhost
- Portainer: http://localhost:9000
- Health Check: http://localhost/health

## UI Components and Design System

### Component Architecture:
**Navigation & Layout:**
- **Navbar.jsx**: Fixed navigation with blur effect, active link detection, and mobile menu
- **PageHeader.jsx**: Decorative page headers with breadcrumbs and animated backgrounds
- **Footer.jsx**: Comprehensive footer with contact info, links, newsletter, and social media

**Home Page Components:**
- **Hero.jsx**: Full-screen hero section with gradient background, CTA buttons, and animated elements
- **ServiceCard.jsx**: Reusable service cards with icons, descriptions, and hover effects
- **ServicesSection.jsx**: Grid layout showcasing 4 main services (SAP, IA, Office365, Web Dev)
- **TrustSection.jsx**: Client testimonials and trust indicators with placeholder logos

**Services Page Components:**
- **ServicesPage.jsx**: Complete services page with detailed service descriptions
- **ServiceDetail.jsx**: Enhanced service cards with features, technologies, and detailed descriptions

### Design System:
- **Color Palette**: Primary blue (#1C5DC4), secondary blue (#2563EB), gradient hero backgrounds
- **Typography**: Inter font family with weight variations (300-800)
- **Animations**: Fade-in, slide-up/down/left/right, bounce, pulse-soft, float effects with staggered delays
- **Responsive**: Mobile-first design with md/lg breakpoints
- **Custom CSS Classes**: `.btn-primary`, `.btn-secondary`, `.card`, `.text-gradient`, `.section-padding`
- **Navigation**: Active link detection with `useLocation`, smooth transitions, mobile hamburger menu

### Accessibility Features:
- Semantic HTML structure with proper headings
- ARIA labels on interactive elements
- Focus states and keyboard navigation
- Alt text and screen reader support
- High contrast ratios for text

### Development Server:
- Vite dev server runs on `http://localhost:5173` (or next available port)
- Hot reload enabled for all React components
- API proxy configured for `/api` and `/health` endpoints

## Important Notes

- The project is primarily in Spanish (comments, documentation, UI)
- Security is prioritized with comprehensive middleware and validation
- All services have health checks and proper error handling
- Database includes user authentication schema with bcrypt password hashing
- Redis is configured for both caching and session storage
- Nginx includes rate limiting and security headers
- Complete home page UI is functional with modern design and animations
- Professional services page with detailed service descriptions and interactive elements
- Full navigation system with active state detection and responsive mobile menu