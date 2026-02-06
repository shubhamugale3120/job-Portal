/**
 * Recommendation Routes
 * 
 * Purpose: API endpoints for AI-powered job recommendations
 * 
 * Endpoints:
 * - GET /api/recommendations/jobs - Get personalized job recommendations
 * - GET /api/recommendations/similar/:jobId - Get similar jobs
 * 
 * Why separate route file:
 * - Keeps code organized and modular
 * - Easy to add more recommendation features later
 * - Clear separation of concerns
 */

const express = require('express');
const router = express.Router();
const { getJobRecommendations, getSimilarJobs } = require('../service/recommendations');
const { requireRole } = require('../middleware/authorization');

/**
 * GET /api/recommendations/jobs
 * 
 * Get personalized job recommendations for logged-in student
 * 
 * Why: Students need relevant job suggestions without manual searching
 * 
 * Access: Students only (recruiters don't need job recommendations)
 * 
 * Query Parameters:
 * - limit: Number of recommendations to return (default: 10, max: 20)
 * 
 * Response Format:
 * {
 *   success: true,
 *   count: 5,
 *   data: [
 *     {
 *       _id: "job123",
 *       title: "Software Engineer",
 *       company: "Tech Corp",
 *       matchScore: 85,
 *       matchReasons: ["Matches 5 of your skills: JavaScript, React, Node.js"]
 *     }
 *   ]
 * }
 */
router.get('/api/recommendations/jobs', requireRole('student'), async (req, res) => {
    try {
        // Parse limit from query string, default to 10
        // Why Math.min: Prevent excessive data transfer (max 20)
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);
        
        // req.user._id comes from authentication middleware
        // Why: User is already authenticated, no need to pass userId
        const recommendations = await getJobRecommendations(req.user._id, limit);
        
        // Return successful response with data
        res.json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });
        
    } catch (error) {
        // Log error for debugging
        console.error('Recommendations API error:', error);
        
        // Return error response
        // Why 500: Server error, not user's fault
        res.status(500).json({
            success: false,
            message: 'Failed to get job recommendations',
            error: error.message
        });
    }
});

/**
 * GET /api/recommendations/similar/:jobId
 * 
 * Get similar jobs based on a specific job
 * 
 * Why: "You might also like" feature increases job discovery
 * 
 * Access: All authenticated users (students and recruiters can view)
 * 
 * URL Parameters:
 * - jobId: MongoDB ObjectId of the job
 * 
 * Query Parameters:
 * - limit: Number of similar jobs (default: 5, max: 10)
 * 
 * Use Cases:
 * - Show on job details page
 * - Email "similar jobs" when user applies
 * - Increase engagement and applications
 */
router.get('/api/recommendations/similar/:jobId', async (req, res) => {
    try {
        // Parse limit with maximum cap
        const limit = Math.min(parseInt(req.query.limit) || 5, 10);
        
        // Get jobId from URL parameter
        const { jobId } = req.params;
        
        // Fetch similar jobs
        const similarJobs = await getSimilarJobs(jobId, limit);
        
        // Return response
        res.json({
            success: true,
            count: similarJobs.length,
            data: similarJobs
        });
        
    } catch (error) {
        console.error('Similar jobs API error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to get similar jobs',
            error: error.message
        });
    }
});

/**
 * GET /api/recommendations/refresh
 * 
 * Force refresh recommendations (clear cache if implemented)
 * 
 * Why: Allow users to manually refresh if they update their profile
 * 
 * Future enhancement: Add Redis caching and this will clear it
 */
router.post('/api/recommendations/refresh', requireRole('student'), async (req, res) => {
    try {
        // Get fresh recommendations
        const recommendations = await getJobRecommendations(req.user._id, 10);
        
        res.json({
            success: true,
            message: 'Recommendations refreshed',
            count: recommendations.length,
            data: recommendations
        });
        
    } catch (error) {
        console.error('Refresh recommendations error:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to refresh recommendations'
        });
    }
});

// Export router to be used in index.js
module.exports = router;
