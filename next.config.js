/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "lh3.googleusercontent.com"],
  },
  reactStrictMode: true,
  // experimental: {
  //   appDir: true,
  // },
  env: {
    FIREBASE_API_KEY: "AIzaSyCwlmCftGAJuPHWJosjrHRhU84iSiudjfM",
    FIREBASE_AUTH_DOMAIN: "rajshahiraamwala-8b7bf.firebaseapp.com",
    FIREBASE_PROJECT_ID: "rajshahiraamwala-8b7bf",
    FIREBASE_STORAGE_BUCKET: "rajshahiraamwala-8b7bf.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "38548299757",
    FIREBASE_APP_ID: "1:38548299757:web:ea6e60638def1036a511e4",
    FIREBASE_MEASUREMENT_ID: "G-2BZJP3PX28",
    PATHAO_CLIENT_ID: "YqaQkRGdnj",
    PATHAO_CLIENT_SECRET: "BlsLo8rmc621S6mabzxVs2Aq1TwaXa39E8s44bxD",
    PATHAO_BASE_URL: "https://api-hermes.pathao.com",
    PATHAO_USERNAME: "smsiam696@gmail.com",
    PATHAO_PASSWORD: "siam.siam",
  },
};

module.exports = nextConfig;
