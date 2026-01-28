# Real Estate Platform - Backend

Backend API for the real estate platform built with Express.js, Prisma, and MySQL.

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `AWS_ACCESS_KEY_ID` - AWS R2 access key
- `AWS_SECRET_ACCESS_KEY` - AWS R2 secret key
- `R2_BUCKET_NAME` - R2 bucket name
- `R2_ENDPOINT` - R2 endpoint URL
- `R2_PUBLIC_URL` - R2 public URL

3. **Run Prisma migrations:**

```bash
npx prisma migrate dev --name init
```

4. **Seed the database:**

```bash
npm run seed
```

5. **Start the server:**

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Default Admin Credentials

After seeding the database:

- **Email:** admin@example.com
- **Password:** admin123

⚠️ **Change this password immediately after first login!**

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/featured` - Get featured properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (admin)
- `PUT /api/properties/:id` - Update property (admin)
- `DELETE /api/properties/:id` - Delete property (admin)

### Sections

- `GET /api/sections` - Get all sections
- `GET /api/sections/visible` - Get visible sections
- `PUT /api/sections/:id` - Update section (admin)
- `PUT /api/sections/reorder` - Reorder sections (admin)

### Trust Partners

- `GET /api/trust-partners` - Get visible partners
- `GET /api/trust-partners/all` - Get all partners (admin)
- `POST /api/trust-partners` - Create partner (admin)
- `PUT /api/trust-partners/:id` - Update partner (admin)
- `DELETE /api/trust-partners/:id` - Delete partner (admin)
- `POST /api/trust-partners/reorder` - Reorder partners (admin)

### Before/After

- `GET /api/before-after` - Get visible entries
- `GET /api/before-after/all` - Get all entries (admin)
- `POST /api/before-after` - Create entry (admin)
- `PUT /api/before-after/:id` - Update entry (admin)
- `DELETE /api/before-after/:id` - Delete entry (admin)

### ROI Configuration

- `GET /api/roi-config` - Get all ROI configs
- `GET /api/roi-config/:propertyType` - Get by property type
- `POST /api/roi-config/calculate` - Calculate ROI estimate
- `PUT /api/roi-config/:id` - Update config (admin)

### Hero Content

- `GET /api/hero` - Get hero content
- `PUT /api/hero` - Update hero content (admin)

### CTA Section

- `GET /api/cta` - Get CTA content
- `PUT /api/cta` - Update CTA content (admin)

### Marquee Settings

- `GET /api/marquee` - Get marquee settings
- `PUT /api/marquee` - Update marquee settings (admin)

### Upload

- `POST /api/upload` - Upload image to R2 (admin)

## Tech Stack

- **Express.js** - Web framework
- **Prisma** - ORM
- **MySQL** - Database
- **AWS SDK** - R2 (S3-compatible) storage
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
