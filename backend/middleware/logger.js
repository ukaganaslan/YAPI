const AuditLog = require('../models/AuditLog');

/**
 * Creates an audit log entry.
 * Usage: await log({ action, req, targetEntity, targetType, result, details })
 */
const log = async ({ action, req, targetEntity = null, targetType = null, result = 'SUCCESS', details = '' }) => {
  try {
    const user = req.user;
    // Anonymize IP: store only first 3 octets (GDPR)
    const rawIp = req.ip || req.headers['x-forwarded-for'] || '';
    const anonIp = rawIp.split('.').slice(0, 3).join('.') + '.xxx';

    await AuditLog.create({
      userId: user?._id || null,
      userEmail: user?.email || 'anonymous',
      userRole: user?.role || 'unknown',
      action,
      targetEntity: targetEntity ? String(targetEntity) : undefined,
      targetType,
      result,
      details,
      ipAddress: anonIp,
    });
  } catch (err) {
    // Log errors must NOT crash the main request
    console.error('[AuditLog Error]', err.message);
  }
};

module.exports = { log };
