#!/bin/bash
# setup-project.sh - Complete Stock Market Dashboard Setup Script

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if required tools are installed
check_prerequisites() {
    print_header "🔍 Checking Prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
        exit 1
    fi
    
    print_status "✅ Prerequisites check completed"
}

# Create project structure
create_project_structure() {
    print_header "📁 Creating Project Structure..."
    
    PROJECT_NAME="stock-market-dashboard"
    
    if [ -d "$PROJECT_NAME" ]; then
        print_warning "Directory $PROJECT_NAME already exists"
        read -p "Remove existing directory? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$PROJECT_NAME"
        else
            print_error "Please remove or rename the existing directory"
            exit 1
        fi
    fi
    
    # Create main project directory
    mkdir -p "$PROJECT_NAME"
    cd "$PROJECT_NAME"
    
    # Create backend structure
    mkdir -p backend/{scripts,routes,models,config,middleware,tests}
    
    # Create frontend structure
    mkdir -p frontend/{public,src/{components,services,hooks,utils,styles}}
    
    # Create additional directories
    mkdir -p {docs,.vscode}
    
    print_status "✅ Project structure created"
}

# Setup backend
setup_backend() {
    print_header "⚙️ Setting up Backend..."
    
    cd backend
    
    # Create package.json
    cat > package.json << 'EOF'
{
  "name": "stock-market-backend",
  "version": "1.0.0",
  "description": "Stock Market Dashboard Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "db:setup": "node scripts/setupDatabase.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  }
}
EOF
    
    # Create .env.example
    cat > .env.example << 'EOF'
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stockmarket
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF
    
    # Copy .env.example to .env
    cp .env.example .env
    
    # Install dependencies
    print_status "📦 Installing backend dependencies..."
    npm install
    
    print_status "✅ Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_header "🎨 Setting up Frontend..."
    
    cd frontend
    
    # Create package.json
    cat > package.json << 'EOF'
{
  "name": "stock-market-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.8.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.3",
    "autoprefixer": "^10.4.15",
    "postcss": "^8.4.28",
    "@tailwindcss/forms": "^0.5.4"
  },
  "proxy": "http://localhost:5000",
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF
    
    # Create public/index.html
    cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Stock Market Dashboard - Real-time NSE/BSE market data and analytics"
    />
    <title>Stock Market Dashboard</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
    
    # Create .env.example
    cat > .env.example << 'EOF'
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_ENABLE_MOCK_FALLBACK=true
EOF
    
    cp .env.example .env
    
    # Install dependencies
    print_status "📦 Installing frontend dependencies..."
    npm install
    
    # Initialize Tailwind CSS
    print_status "🎨 Setting up Tailwind CSS..."
    npx tailwindcss init -p
    
    # Create tailwind.config.js
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
EOF
    
    # Create basic CSS file
    cat > src/styles/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
EOF
    
    print_status "✅ Frontend setup completed"
    cd ..
}

# Setup VS Code configuration
setup_vscode() {
    print_header "💻 Setting up VS Code Configuration..."
    
    # Create VS Code settings
    cat > .vscode/settings.json << 'EOF'
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.js": "javascriptreact"
  }
}
EOF
    
    # Create launch configuration
    cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Launch Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/react-scripts",
      "args": ["start"],
      "cwd": "${workspaceFolder}/frontend",
      "console": "integratedTerminal"
    }
  ],
  "compounds": [
    {
      "name": "Launch Full Stack",
      "configurations": ["Launch Backend", "Launch Frontend"]
    }
  ]
}
EOF
    
    # Create tasks
    cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Install Backend Dependencies",
      "type": "shell",
      "command": "npm install",
      "group": "build",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      }
    },
    {
      "label": "Install Frontend Dependencies", 
      "type": "shell",
      "command": "npm install",
      "group": "build",
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      }
    },
    {
      "label": "Setup Database",
      "type": "shell",
      "command": "npm run db:setup",
      "group": "build",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      }
    },
    {
      "label": "Start Backend Dev",
      "type": "shell",
      "command": "npm run dev",
      "group": "build",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      }
    },
    {
      "label": "Start Frontend Dev",
      "type": "shell",
      "command": "npm start",
      "group": "build",
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      }
    }
  ]
}
EOF
    
    print_status "✅ VS Code configuration created"
}

# Create root configuration files
create_root_files() {
    print_header "📋 Creating Root Configuration Files..."
    
    # Create .gitignore
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
dist/
*/build/
*/dist/

# Logs
logs
*.log
npm-debug.log*

# Database
*.sqlite
*.db

# OS files
.DS_Store
Thumbs.db

# IDE
*.swp
*.swo
.vscode/settings.json

# Coverage
coverage/
EOF
    
    # Create README.md
    cat > README.md << 'EOF'
# Stock Market Dashboard

A full-stack web application for tracking and analyzing stock market data with real-time charts and analytics.

## 🚀 Features

- **Real-time Stock Data**: Live NSE/BSE market data
- **Interactive Charts**: Beautiful stock price visualizations
- **Company Analytics**: Detailed company information and metrics
- **Responsive Design**: Works on desktop and mobile devices
- **PostgreSQL Backend**: Robust data storage and retrieval

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Deployment**: Docker (optional)

## 📋 Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

1. **Clone and Setup**:
   ```bash
   git clone <your-repo-url>
   cd stock-market-dashboard
   ```

2. **Setup Database**:
   ```bash
   # Update backend/.env with your PostgreSQL credentials
   cd backend
   npm run db:setup
   ```

3. **Start Backend**:
   ```bash
   npm run dev
   ```

4. **Start Frontend** (new terminal):
   ```bash
   cd frontend
   npm start
   ```

5. **Access Application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api

## 📚 API Endpoints

- `GET /api/companies` - List all companies
- `GET /api/companies/:id/stock-data` - Get stock data
- `GET /api/market/summary` - Market overview

## 🔧 Development

### VS Code Setup
- Open project in VS Code
- Install recommended extensions
- Use `Ctrl+Shift+P` → "Tasks: Run Task" for common operations

### Database Management
```bash
# Setup/Reset database
npm run db:setup

# Start PostgreSQL (Ubuntu)
sudo systemctl start postgresql
```

## 🐳 Docker Support

```bash
# Start with Docker Compose
docker-compose up -d

# Access logs
docker-compose logs -f
```

## 📄 License

MIT License
EOF
    
    # Create docker-compose.yml (optional)
    cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: stockmarket
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      DB_USER: postgres
      DB_PASSWORD: password
      DB_NAME: stockmarket
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres_data:
EOF
    
    print_status "✅ Root configuration files created"
}

# Setup database prompt
setup_database() {
    print_header "🗄️ Database Setup..."
    
    print_status "Database setup requires PostgreSQL to be running"
    echo
    echo "Please ensure:"
    echo "1. PostgreSQL is installed and running"
    echo "2. You have database credentials ready"
    echo "3. Update backend/.env with your database settings"
    echo
    
    read -p "Setup database now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd backend
        
        print_status "Please update .env file with your database credentials..."
        echo "Opening .env file for editing..."
        
        # Try to open .env with available editors
        if command -v code &> /dev/null; then
            code .env
        elif command -v nano &> /dev/null; then
            nano .env
        elif command -v vim &> /dev/null; then
            vim .env
        else
            print_warning "Please manually edit backend/.env file"
        fi
        
        echo
        read -p "Press Enter after updating .env file..."
        
        print_status "Running database setup..."
        if npm run db:setup; then
            print_status "✅ Database setup completed successfully"
        else
            print_error "Database setup failed. Please check your PostgreSQL connection and credentials."
        fi
        
        cd ..
    else
        print_warning "Skipping database setup. Run 'cd backend && npm run db:setup' later."
    fi
}

# Final instructions
show_final_instructions() {
    print_header "🎉 Setup Complete!"
    
    echo
    echo "Your Stock Market Dashboard is ready! 🚀"
    echo
    echo "📁 Project Structure:"
    echo "   stock-market-dashboard/"
    echo "   ├── backend/     (Node.js API)"
    echo "   ├── frontend/    (React App)" 
    echo "   ├── .vscode/     (VS Code config)"
    echo "   └── docs/        (Documentation)"
    echo
    echo "🚀 To start development:"
    echo "   1. cd stock-market-dashboard"
    echo "   2. code .                    # Open in VS Code"
    echo
    echo "▶️  Start the application:"
    echo "   Terminal 1: cd backend && npm run dev"
    echo "   Terminal 2: cd frontend && npm start"
    echo
    echo "🌐 Access URLs:"
    echo "   • Frontend: http://localhost:3000"
    echo "   • Backend API: http://localhost:5000/api"
    echo "   • Health Check: http://localhost:5000/api/health"
    echo
    echo "💡 VS Code Tips:"
    echo "   • Use Ctrl+Shift+P → 'Tasks: Run Task' for common operations"
    echo "   • Press F5 to debug with 'Launch Full Stack' configuration"
    echo "   • Install recommended extensions for better development experience"
    echo
    print_status "Happy coding! 💻✨"
}

# Main execution
main() {
    clear
    print_header "🏗️  Stock Market Dashboard - Project Setup"
    echo "=================================================="
    echo
    
    check_prerequisites
    create_project_structure
    setup_backend
    setup_frontend
    setup_vscode
    create_root_files
    setup_database
    show_final_instructions
}

# Run main function
main "$@"
    NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client not found. Please install PostgreSQL"
        echo "Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
        echo "macOS: brew install postgresql"
        echo "Windows: Download from https://www.postgresql.org/download/windows/"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi