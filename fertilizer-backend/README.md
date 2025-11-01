# Fertilizer Backend

This is the Express + MongoDB backend for the Fertilizer platform.

## Setup

1. Create a `.env` file in `fertilizer-backend/` based on `.env.example`:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=<appName>
JWT_SECRET=change_this_secret
PORT=5001
```

- Use your MongoDB Atlas connection string for `MONGO_URI`.
- Ensure your IP / network access is allowed in Atlas.

2. Install dependencies:

```
npm install
```

3. Run the server:

```
npm start
```

The server will start at `http://localhost:5001` by default.

## API Highlights

- Products
  - GET `/api/products` — list products
  - GET `/api/products/:id` — get a product by id
- Reviews
  - GET `/api/reviews/product/:productId` — list reviews for a product
  - POST `/api/reviews` — create a review (auth)
  - PUT `/api/reviews/:id` — update a review (owner)
  - DELETE `/api/reviews/:id` — delete a review (owner)
  - PUT `/api/reviews/:id/like` — like/unlike a review (auth)
- Orders
  - GET `/api/orders/check-purchase/:productId` — check if the current user purchased a product (auth)

## Uploads

Uploaded review images are stored under `uploads/reviews/` and are served statically via `/uploads`.

## Notes

- JWT payload includes `{ userId: <ObjectId> }`. Admin role checks are not included in JWT. Review deletion is allowed only by the review owner.
- Product rating display prefers `averageRating` computed from reviews; falls back to seeded `rating`.
