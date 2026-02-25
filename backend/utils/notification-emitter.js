const EventEmitter = require('events');

/**
 * Singleton EventEmitter partagé entre le service de notifications
 * et les connexions SSE actives.
 *
 * Événements émis :
 *  `notification:<userId>` → payload : { unreadCount, notification }
 */
const notificationEmitter = new EventEmitter();
notificationEmitter.setMaxListeners(200); // 1 listener par connexion SSE active

module.exports = notificationEmitter;
