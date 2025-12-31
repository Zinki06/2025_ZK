require('dotenv').config();

module.exports = {
    JAVASCRIPT_KEY: process.env.KAKAO_JS_KEY || 'kakao_js_key',
    REDIRECT_URI: process.env.REDIRECT_URI || 'http://localhost/auth/kakao/callback',
    REST_API_KEY: process.env.KAKAO_REST_KEY || 'kakao_rest_key'
};
