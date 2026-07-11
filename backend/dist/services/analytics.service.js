"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const database_1 = require("../config/database");
class AnalyticsService {
    static async getDashboardStats() {
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
      ORDER BY views DESC
      LIMIT 5
    `);
        // 4. Top Blogs by Views
        const topBlogsRes = await database_1.db.query(`
      SELECT title->>'en' as name, views
      FROM blogs
      ORDER BY views DESC
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
        return {
            overview: {
                total_projects: parseInt(projectsRes.rows[0].total_projects || '0'),
                total_project_views: parseInt(projectsRes.rows[0].total_project_views || '0'),
                total_blogs: parseInt(blogsRes.rows[0].total_blogs || '0'),
                total_blog_views: parseInt(blogsRes.rows[0].total_blog_views || '0'),
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
        };
    }
}
exports.AnalyticsService = AnalyticsService;
