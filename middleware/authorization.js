// Role-based authorization middleware
// Usage: app.get('/admin', requireRole('admin'), handler)
function requireRole(...allowedRoles) {
	return function (req, res, next) {
		if (!req.user) {
			return res.status(401).send('Authentication required');
		}

		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).send('Forbidden'); // Block if role not allowed
		}

		next();
	};
}

module.exports = { requireRole };
