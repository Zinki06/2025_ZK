const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const swaggerDocument = YAML.load('./src/docs/swagger.yaml');
const authRoutes = require('./routes/auth');
const notiRoutes = require('./routes/noti');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const roleRoutes = require('./routes/role');
const { JAVASCRIPT_KEY, REDIRECT_URI } = require('./config/kakao');
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = require('./config/web-push');
const { newpost, applypost, matchpost, thispost, allposts } = require('./controllers/postController');
const { myinfo, userdata, myposts } = require('./controllers/userController');
const cookieParser = require('cookie-parser');

const publicPath = path.join(__dirname, '..', 'public');

const app = express();
// 서버 설정값 (환경변수에서 가져옴)
const PORT = process.env.PORT || 80;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));//스웨거 세팅
// CORS 설정 (클라이언트 도메인 허용)
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://gachitda.netlify.app',
  credentials: true
}));
app.use(cookieParser());
app.get('/api/posts', allposts);
app.get('/api/posts/my', myposts);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017");
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
  });
}
app.use('/api/auth', authRoutes);//라우터 사용
app.use('/api/noti', notiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/role', roleRoutes);
console.log('[DEBUG] publicPath =', publicPath);
app.use(express.static(publicPath));
app.post('/logout', (req, res) => {
  res.clearCookie('refreshtoken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  res.status(200).json({ message: '로그아웃 완료' });
});
app.get('/service-worker.js', (req, res) => {//웹 알림용 js파일 전송
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
self.addEventListener('push', function(event) {
  console.log('[SW] Push received');

  let data = {};
  try {
    data = event.data?.json() || {};
  } catch (e) {
    console.error('[SW] JSON parse failed:', e);
  }

  const title = data.title || 'No Title';
  const body = data.body || 'No Content';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
      requireInteraction: true
    })
  );
});

  console.log('실행됨');
  `);
});
console.log('[라우터 등록] * -> React fallback');

app.get(/^\/(?!api\/|service-worker\.js).*/, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

main();