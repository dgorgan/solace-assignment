## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Database set up

The app is configured to return a default list of advocates. This will allow you to get the app up and running without needing to configure a database. If you’d like to configure a database, you’re encouraged to do so. You can uncomment the url in `.env` and the line in `src/app/api/advocates/route.ts` to test retrieving advocates from the database.

1. Feel free to use whatever configuration of postgres you like. The project is set up to use docker-compose.yml to set up postgres. The url is in .env.

```bash
docker compose up -d
```

2. Create a `solaceassignment` database.

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```

## API Endpoints

### GET /api/advocates

Retrieves a paginated list of advocates with optional search and sorting capabilities.

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `pageSize` (number, default: 25, max: 100) - Number of items per page
- `search` (string, optional) - Case-insensitive search term for filtering advocates
- `sort` (string, default: 'lastName') - Sort column (allowed: 'lastName', 'city', 'yearsOfExperience')
- `dir` (string, default: 'asc') - Sort direction ('asc' or 'desc')

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string", 
      "city": "string",
      "degree": "string",
      "specialties": ["string"],
      "yearsOfExperience": "number",
      "phoneNumber": "string"
    }
  ],
  "page": "number",
  "pageSize": "number", 
  "total": "number",
  "hasMore": "boolean"
}
```

**Example:**
```
GET /api/advocates?page=2&pageSize=25&search=jane&sort=lastName&dir=desc
```

**Cache Headers:**
- `Cache-Control: public, max-age=30, stale-while-revalidate=60`
