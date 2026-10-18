# Data flow: browser, API, MongoDB, and Cloudinary

This describes behavior visible in the current source. It does not contain live credentials or assume that external services are currently reachable.

## System overview

```text
React pages and feature components
  |  JSON / multipart HTTP requests
  v
Express app -> routes -> HTTP controllers -> domain services -> Mongoose models -> MongoDB
                                                |
                                                +-> Cloudinary for product image upload/delete

API JSON response -> client state / rendered catalogue
Enquiry list state -> browser localStorage
```

The browser sends requests through `client/src/api.js`. The homepage is composed of sections under `client/src/features/home/components/`; its motion lifecycle lives in `client/src/features/home/useHomeMotion.js`. The admin workspace is grouped under `client/src/features/admin/`. During Vite development, `/api` is proxied to `http://localhost:5000`. `server/app.js` mounts auth, category, product, and enquiry routes under `/api`; `server/index.js` calls `connectDb()` from `server/db/db.js` and waits for MongoDB before opening the HTTP listener.

The catalogue client also ships a snapshot at `client/src/data/staging-catalogue.json`. Catalogue routes read this snapshot, while `client/src/data/catalogueFallback.js` and `client/src/defaultCategories.js` provide data when API requests cannot be served. The admin workspace still requires MongoDB-backed API operations. Snapshot import/export commands live in `server/scripts/` and are exposed as `catalogue:import` and `catalogue:export` npm scripts.

## What MongoDB stores

### Categories

Category documents contain:

- `name`
- unique `slug`
- `parent` (null for top-level categories, or a Category ObjectId for a subcategory)
- `description`
- `order`

The public categories response is assembled from Category records plus an aggregate count of products grouped by category. It returns a tree with `children` and product `count`; the aggregate count is calculated for the response, not stored as a category field.

### Products

Product documents contain:

- `name`, unique `slug`
- required `category` ObjectId referencing a Category
- optional `type`, `finish`, and `description`
- `images`, an array of strings containing secure Cloudinary URLs
- `featured`
- Mongoose `createdAt` and `updatedAt` timestamps

Image file bytes are not stored in MongoDB. The server uploads accepted image files to Cloudinary in `sak-nexora/products`, then stores Cloudinary's returned secure URL in `Product.images`.

### Enquiries

Enquiry documents contain:

- `name`, `phone`
- optional `email`, `business`, and `message`
- `items`, each with a Product ObjectId, server-resolved product `name`, and `qty`
- `status` (`new`, `quoted`, or `closed`)
- Mongoose timestamps

## Catalogue read flow

1. `useCategories()` in the client requests `GET /api/categories`, then caches the category tree in memory for the current page session. Public navigation and catalogue views display built-in fallback categories if the API returns no categories or is unavailable; an API error is still shown on the home/catalogue page. Admin forms do not use fallback categories because product writes require real database ObjectIds.
2. The catalogue page reads the route's category slug and URL search parameters: `q`, `finish`, `type`, `sort`, and `page`. A category with no matching products displays an empty-state message that says products are not added yet and suggests checking back or contacting the business.
3. It requests `GET /api/products/filters?category=<slug>` for available finish/type choices.
4. It requests `GET /api/products` with `category`, `q`, `finish`, `type`, `sort`, `page`, and `limit`.
5. The product service resolves a category slug to its MongoDB ID and includes its direct children in a parent-category filter. Text search is a case-insensitive escaped regular expression over product `name`, `type`, `finish`, and `description`; finish and type filters match exact values case-insensitively.
6. The products response is `{ items, total, page, pages }`; each product's category is populated with category `name` and `slug`.
7. Filter options are read from distinct product `finish` and `type` values matching the category filter. With no matching products, these arrays can be empty.

Supported product sort values are `featured`, `newest`, `oldest`, `name-asc`, and `name-desc`. The category listing displays 24 snapshot products per page.

The empty Crockery subcategories are Pizza Pans & Plates (`/catalogue/crockery/pizza-pans-plates/`) and Buffet & Servingware (`/catalogue/crockery/buffet-servingware/`). They are represented in the client category snapshot and fallback tree with zero products.

## Product create/update flow

1. An administrator signs in via `POST /api/auth/login` with JSON `{ "email": "...", "password": "..." }`.
2. The backend checks credentials against server environment variables and returns `{ "token": "..." }`. Admin requests send `Authorization: Bearer <token>`.
3. The product form sends `POST /api/products` or `PUT /api/products/:id` as multipart form data:
   - text fields: `name`, `slug`, `category`, `type`, `finish`, `description`, `featured`
   - `existingImages`: JSON array of retained Cloudinary URLs (updates)
   - repeated `images` file fields for newly selected files
4. The route's Multer middleware accepts JPEG, PNG, WebP, or AVIF up to 8 MB per file and at most 12 files in the request. The product service validates the fields and confirms that the category ObjectId exists.
5. New file buffers are uploaded server-side to Cloudinary. The product service saves the product data and returned Cloudinary URLs to MongoDB.
6. Create responds with the saved product and HTTP 201. Update responds with the updated product; it may include `mediaCleanupWarning` if removed images could not be deleted from Cloudinary.
7. A failed product write attempts to remove newly uploaded Cloudinary assets. Delete removes the MongoDB product and then attempts to remove its Cloudinary images; a cleanup issue is returned as a warning.

## Admin access and overview

1. `/admin` displays the sign-in screen when there is no saved admin token. It requests `GET /api/auth/status`, which returns only whether sign-in is configured and the names of missing environment settings; it never returns credential values.
2. Admin sign-in requires server `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` (at least 32 characters). A missing setting is surfaced on the sign-in screen; login remains disabled until configuration is complete.
3. After sign-in, the overview checks `GET /api/health` for database readiness, then loads product totals, featured product totals, category totals and product counts by top-level catalogue range, plus enquiry totals and new enquiry totals from existing API endpoints. If MongoDB is disconnected, the admin shows that specific cause instead of a generic failure.
4. Product and category management use the existing protected create, update, and delete endpoints. Product edits accept multiple image files (up to 12 total), retain/remove existing Cloudinary URLs, and display the first two catalogue images as an on-hover crossfade in the admin product grid.
5. Enquiry management uses the protected listing, status update, and delete endpoints.

## Enquiry flow

1. The browser enquiry list is stored in `localStorage` under `sak-enquiry`. Each browser-side row keeps product `_id`, `slug`, `name`, first image URL, and `qty`.
2. The WhatsApp action builds a message from the local list and opens WhatsApp; that action does not persist an enquiry in MongoDB.
3. The contact form sends JSON to `POST /api/enquiries`, shaped as `{ name, phone, email, business, message, items }`. The `items` are the local enquiry rows.
4. The backend validates contact fields and quantities, looks up submitted product IDs in MongoDB, discards client-supplied item names, and writes a new Enquiry using names read from Product records.
5. The API responds with HTTP 201 and `{ "ok": true, "id": "<enquiry id>" }`. The browser clears its local enquiry list after success.
6. Admin enquiry listing reads `GET /api/enquiries` with optional `status`, `q`, `page`, and `limit`; status updates use `PATCH /api/enquiries/:id` with `{ "status": "new|quoted|closed" }`, and deletion uses `DELETE /api/enquiries/:id`.

Customer-facing phone labels use `+92` followed by the national number without its domestic leading zero. The Contact page arranges the contact channels and office map beside the enquiry form on desktop, and stacks them on narrow screens.

## Error behavior

- Controllers forward operational/validation errors from services to Express error middleware.
- The API returns JSON error objects with a `message` for handled errors.
- The client helper parses JSON and throws the returned `message` for non-success responses.
- If MongoDB connection does not succeed at startup, the server does not call `app.listen()`, so browser API requests cannot succeed.

## Evidence

- `client/src/api.js`
- `client/vite.config.js`
- `client/src/hooks.js`
- `client/src/pages/Catalogue.jsx`
- `client/src/pages/Admin.jsx`
- `client/src/pages/Static.jsx`
- `client/src/context/EnquiryContext.jsx`
- `server/index.js`
- `server/controllers/auth.controller.js`
- `server/routes/auth.routes.js`
- `client/src/styles/admin.css`
- `server/app.js`
- `server/db/db.js`
- `server/routes/*.routes.js`
- `server/controllers/*.controller.js`
- `server/services/*.service.js`
- `server/models/*.js`
- `server/lib/inputs.js`
- `server/lib/cloudinary.js`
