import { db } from '../config/database';
import geoip from 'geoip-lite';

export class AnalyticsService {
  static async recordVisit(data: {
    ip_address: string;
    country: string;
    browser: string;
    os: string;
    device: string;
    path: string;
  }) {
    await db.query(
      `INSERT INTO site_visits (ip_address, country, browser, os, device, path)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.ip_address,
        data.country,
        data.browser,
        data.os,
        data.device,
        data.path,
      ],
    );
  }

  static async getDashboardStats() {
    // 1. Projects stats
    const projectsRes = await db.query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(views) as total_project_views
      FROM projects
    `);

    // 2. Blogs stats
    const blogsRes = await db.query(`
      SELECT 
        COUNT(*) as total_blogs,
        SUM(views) as total_blog_views
      FROM blogs
    `);

    // 3. Top Projects by Views
    const topProjectsRes = await db.query(`
      SELECT title->>'en' as name, views
      FROM projects
      ORDER BY views DESC NULLS LAST
      LIMIT 5
    `);

    // 4. Top Blogs by Views
    const topBlogsRes = await db.query(`
      SELECT title->>'en' as name, views
      FROM blogs
      ORDER BY views DESC NULLS LAST
      LIMIT 5
    `);

    // 5. Chat Activity (Last 30 Days) - grouped by day
    const chatActivityRes = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM chat_messages
      WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    // 6. Site Visits (Last 30 Days)
    const siteVisitsRes = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT ip_address) as count
      FROM site_visits
      WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    // 7. Site Visits by Country (All time)
    const countryVisitsRes = await db.query(`
      SELECT country as name, COUNT(DISTINCT ip_address) as value
      FROM site_visits
      GROUP BY country
      ORDER BY value DESC
      LIMIT 5
    `);
    
    // 8. Total Unique Visitors (All time)
    const totalVisitorsRes = await db.query(`
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
      visitors_by_country: countryVisitsRes.rows.map(r => ({
        name: r.name === 'Unknown' ? 'Unknown' : r.name,
        value: parseInt(r.value)
      })),
    };
  }

  static async getVisitorLocations() {
    const res = await db.query(`
      SELECT DISTINCT ON (ip_address) ip_address, country
      FROM site_visits
      ORDER BY ip_address, created_at DESC
      LIMIT 100
    `);

    const locations = res.rows.map((row) => {
      const geo = geoip.lookup(row.ip_address);
      if (geo && geo.ll) {
        return { lat: geo.ll[0], lng: geo.ll[1], country: geo.country };
      }
      return null;
    }).filter(Boolean);

    return locations;
  }
}
