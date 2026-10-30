"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = exports.hashIp = void 0;
const crypto_1 = require("crypto");
const database_1 = require("../config/database");
const geoip_lite_1 = __importDefault(require("geoip-lite"));
// The ip_address column holds this hash for new rows (older rows may still hold raw IPs until
// `npm run db:hash-ips` is run). A dedicated salt keeps hashes stable when JWT secrets rotate.
const hashIp = (ip) => (0, crypto_1.createHash)('sha256')
    .update(`${process.env.IP_HASH_SALT || process.env.JWT_SECRET || ''}:${ip}`)
    .digest('hex');
exports.hashIp = hashIp;
let locationColumnsReady = false;
const ensureLocationColumns = async () => {
    if (locationColumnsReady)
        return;
    await database_1.db.query(`
    ALTER TABLE site_visits
      ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
      ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
  `);
    locationColumnsReady = true;
};
class AnalyticsService {
    static async recordVisit(data) {
        try {
            await ensureLocationColumns();
            await database_1.db.query(`INSERT INTO site_visits (ip_address, latitude, longitude, country, browser, os, device, path)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
                data.ip_hash,
                data.latitude,
                data.longitude,
                data.country,
                data.browser,
                data.os,
                data.device,
                data.path,
            ]);
        }
        catch (err) {
            // Silently catch DB outage during visit tracking
        }
    }
    static async getDashboardStats() {
        // No made-up fallback numbers: if the DB is down the dashboard shows an error
        // instead of fake stats that look real.
        // 1. Projects stats
        const projectsRes = await database_1.db.query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(views) as total_project_views
      FROM projects
    `);
        // 2. Blogs stats
        const blogsRes = await database_1.db.query(`
      SELECT 
        COUNT(*) as total_blogs,
        SUM(views) as total_blog_views
      FROM blogs
    `);
        // 3. Top Projects by Views
        const topProjectsRes = await database_1.db.query(`
      SELECT title->>'en' as name, views
      FROM projects
      ORDER BY views DESC NULLS LAST
      LIMIT 5
    `);
        // 4. Top Blogs by Views
        const topBlogsRes = await database_1.db.query(`
      SELECT title->>'en' as name, views
      FROM blogs
      ORDER BY views DESC NULLS LAST
      LIMIT 5
    `);
        // 5. Chat Activity (Last 30 Days) - grouped by day
        const chatActivityRes = await database_1.db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM chat_messages
      WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);
        // 6. Site Visits (Last 30 Days)
        const siteVisitsRes = await database_1.db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT ip_address) as count
      FROM site_visits
      WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);
        // 7. Site Visits by Country (All time)
        const countryVisitsRes = await database_1.db.query(`
      SELECT country as name, COUNT(DISTINCT ip_address) as value
      FROM site_visits
      GROUP BY country
      ORDER BY value DESC
      LIMIT 5
    `);
        // 8. Total Unique Visitors (All time)
        const totalVisitorsRes = await database_1.db.query(`
      SELECT COUNT(DISTINCT ip_address) as total_visitors
      FROM site_visits
    `);
        return {
            overview: {
                total_projects: parseInt(projectsRes.rows[0]?.total_projects || '0'),
                total_project_views: parseInt(projectsRes.rows[0]?.total_project_views || '0'),
                total_blogs: parseInt(blogsRes.rows[0]?.total_blogs || '0'),
                total_blog_views: parseInt(blogsRes.rows[0]?.total_blog_views || '0'),
                total_visitors: parseInt(totalVisitorsRes.rows[0]?.total_visitors || '0'),
            },
            top_projects: topProjectsRes.rows,
            top_blogs: topBlogsRes.rows,
            chat_activity: chatActivityRes.rows.map((r) => ({
                date: new Date(r.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
                count: parseInt(r.count),
            })),
            visitors_over_time: siteVisitsRes.rows.map((r) => ({
                date: new Date(r.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
                visitors: parseInt(r.count),
            })),
            visitors_by_country: countryVisitsRes.rows.map((r) => ({
                name: r.name,
                value: parseInt(r.value),
            })),
        };
    }
    static async getVisitorLocations() {
        try {
            await ensureLocationColumns();
            const res = await database_1.db.query(`
        SELECT DISTINCT ON (ip_address) ip_address, country, latitude, longitude
        FROM site_visits
        ORDER BY ip_address, created_at DESC
        LIMIT 100
      `);
            const locations = res.rows.map((row) => {
                if (row.latitude !== null && row.longitude !== null) {
                    return { lat: row.latitude, lng: row.longitude, country: row.country };
                }
                // Legacy rows that still hold a raw IP
                const geo = geoip_lite_1.default.lookup(row.ip_address);
                if (geo && geo.ll) {
                    return { lat: geo.ll[0], lng: geo.ll[1], country: geo.country };
                }
                return null;
            }).filter(Boolean);
            return locations;
        }
        catch (err) {
            return [];
        }
    }
}
exports.AnalyticsService = AnalyticsService;
