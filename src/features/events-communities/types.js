/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {'event'} type
 * @property {string} title
 * @property {string} description
 * @property {string} organizerName
 * @property {string} organizerId
 * @property {Date} eventDate
 * @property {string} eventTime
 * @property {string} location
 * @property {string} [club]
 * @property {number} [maxParticipants]
 * @property {number} currentParticipants
 * @property {string[]} tags
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Community
 * @property {string} id
 * @property {'community'} type
 * @property {string} name
 * @property {string} description
 * @property {'Academic'|'Research'|'Creative'|'Business'} category
 * @property {string} organizerName
 * @property {string} organizerId
 * @property {number} memberCount
 * @property {string} [meetingSchedule]
 * @property {string[]} tags
 * @property {Date} createdAt
 */

/**
 * @typedef {'admin'|'student'} UserRole
 */

export default {};
