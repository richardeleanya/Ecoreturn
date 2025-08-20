/**
 * Security middleware for EcoReturn API.
 * - Helmet for HTTP headers
 * - Rate limiting per IP
 * - CORS with allowlist
 * - Input validation with Zod schemas
 * - Input sanitization
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { sanitize } = require('express-mongo-sanitize');
const { z } = require('zod');

// Example allowlist
const allowedOrigins = [
  "https://ecoreturn.com",
  "https://app.ecoreturn.com",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  }
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Max 200 requests per 15min per IP
  standardHeaders: true,
  legacyHeaders: false,
});

function applySecurityMiddleware(app) {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(limiter);
  app.use(require('express-mongo-sanitize')());
  // Add other input validators as needed per route using Zod
}

module.exports = { applySecurityMiddleware };

/**
 * Example DTO validation with Zod:
 * 
 * const returnSchema = z.object({
 *   barcode: z.string().min(6).max(32),
 *   deviceId: z.string().min(6),
 *   gps: z.object({
 *     lat: z.number().min(-90).max(90),
 *     lng: z.number().min(-180).max(180)
 *   }),
 *   photo: z.string(), // base64 or URL
 * });
 * 
 * // In route:
 * const result = returnSchema.safeParse(req.body);
 * if (!result.success) return res.status(400).json({ error: 'Invalid input' });
 */

/**
 * JWT/refresh token reuse detection: store refresh token IDs in DB with expiry and revoked flag;
 * on each refresh, rotate token and check for reuse. Invalidate all tokens on logout.
 */