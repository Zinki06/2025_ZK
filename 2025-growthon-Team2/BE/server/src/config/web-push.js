require('dotenv').config();

module.exports = {
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY || 'vapid_public_key',
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || 'vapid_private_key'
};
