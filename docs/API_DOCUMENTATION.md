# API Documentation
* POST /api/auth/login - User/Admin Login
* POST /api/auth/register - Register new user
* GET /api/auth/demo-credentials - Demo credentials
* GET /api/profile/me - User profile details
* PATCH /api/profile/me - Update display name
* GET /api/profile/rewards - Wallet currencies (VEs, SVEs, Gems, Tokens, XP)
* GET /api/profile/level-progress - Level progression
* GET /api/profile/withdrawal-summary - Payout status summary
* POST /api/profile/withdraw - Submit payout request
* GET /api/admin/dashboard - Admin metrics
* GET /api/admin/users - User management
* PATCH /api/admin/users/:id/status - Suspend/Activate user
* POST /api/admin/adjust-balance - Audited balance adjustments
* PATCH /api/admin/withdrawals/:id - Approve/Reject payouts
* GET /api/admin/audit-logs - Audit trail
