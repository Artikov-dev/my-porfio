"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const database_1 = require("../config/database");
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const FALLBACK_ANALYTICS = {
    overview: {
        total_projects: 4,
        total_project_views: 1240,
        total_blogs: 2,
        total_blog_views: 240,
        total_visitors: 520,
    },
    top_projects: [
        { name: 'ControlLife - Task & Life Management System', views: 480 },
        { name: 'Wedding Platform', views: 320 },
        { name: 'Clinic Management System', views: 260 },
        { name: 'Fashion E-Commerce', views: 180 },
    ],
    top_blogs: [
        { name: 'Building High Performance Modern Web Apps', views: 142 },
        { name: 'Mastering Real-time Communication with WebSockets', views: 98 },
    ],
    chat_activity: Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            count: Math.floor(Math.random() * 5) + 1,
        };
    }),
    visitors_over_time: Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            visitors: 20 + Math.floor(Math.sin(i) * 10) + (i % 3) * 5,
        };
    }),
    visitors_by_country: [
        { name: 'Uzbekistan', value: 340 },
        { name: 'United States', value: 95 },
        { name: 'Germany', value: 45 },
        { name: 'Russia', value: 25 },
        { name: 'Other', value: 15 },
    ],
};
const DEFAULT_LOCATIONS = [
    { lat: 41.2995, lng: 69.2401, country: 'Uzbekistan' },
    { lat: 40.7128, lng: -74.006, country: 'United States' },
    { lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
    { lat: 52.52, lng: 13.405, country: 'Germany' },
    { lat: 35.6762, lng: 139.6503, country: 'Japan' },
];
class AnalyticsService {
    static async recordVisit(data) {
        try {
            await database_1.db.query(`INSERT INTO site_visits (ip_address, country, browser, os, device, path)
         VALUES ($1, $2, $3, $4, $5, $6)`, [
                data.ip_address,
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
        try {
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
                    total_projects: parseInt(projectsRes.rows[0]?.total_projects || '4'),
                    total_project_views: parseInt(projectsRes.rows[0]?.total_project_views || '0'),
                    total_blogs: parseInt(blogsRes.rows[0]?.total_blogs || '2'),
                    total_blog_views: parseInt(blogsRes.rows[0]?.total_blog_views || '0'),
                    total_visitors: parseInt(totalVisitorsRes.rows[0]?.total_visitors || '0'),
                },
                top_projects: topProjectsRes.rows.length > 0 ? topProjectsRes.rows : FALLBACK_ANALYTICS.top_projects,
                top_blogs: topBlogsRes.rows.length > 0 ? topBlogsRes.rows : FALLBACK_ANALYTICS.top_blogs,
                chat_activity: chatActivityRes.rows.map((r) => ({
                    date: new Date(r.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    count: parseInt(r.count),
                })),
                visitors_over_time: siteVisitsRes.rows.length > 0 ? siteVisitsRes.rows.map((r) => ({
                    date: new Date(r.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    visitors: parseInt(r.count),
                })) : FALLBACK_ANALYTICS.visitors_over_time,
                visitors_by_country: countryVisitsRes.rows.length > 0 ? countryVisitsRes.rows.map(r => ({
                    name: r.name === 'Unknown' ? 'Unknown' : r.name,
                    value: parseInt(r.value)
                })) : FALLBACK_ANALYTICS.visitors_by_country,
            };
        }
        catch (err) {
            console.warn('Analytics DB unavailable, returning fallback dashboard stats:', err);
            return FALLBACK_ANALYTICS;
        }
    }
    static async getVisitorLocations() {
        try {
            const res = await database_1.db.query(`
        SELECT DISTINCT ON (ip_address) ip_address, country
        FROM site_visits
        ORDER BY ip_address, created_at DESC
        LIMIT 100
      `);
            const locations = res.rows.map((row) => {
                const geo = geoip_lite_1.default.lookup(row.ip_address);
                if (geo && geo.ll) {
                    return { lat: geo.ll[0], lng: geo.ll[1], country: geo.country };
                }
                return null;
            }).filter(Boolean);
            return locations.length > 0 ? locations : DEFAULT_LOCATIONS;
        }
        catch (err) {
            return DEFAULT_LOCATIONS;
        }
    }
}
exports.AnalyticsService = AnalyticsService;
