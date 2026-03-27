// TEMPLATE — No contiene secretos reales.
// En CI/CD se reemplaza con variables de entorno del servidor via envsubst.
export const environment = {
  production: true,
  n8nWebhookUrl: '${N8N_WEBHOOK_URL}',
  cubepathApiUrl: '${CUBEPATH_API_URL}',
  firebase: {
    apiKey: '${FIREBASE_API_KEY}',
    authDomain: '${FIREBASE_AUTH_DOMAIN}',
    projectId: '${FIREBASE_PROJECT_ID}',
    storageBucket: '${FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${FIREBASE_APP_ID}',
    measurementId: '${FIREBASE_MEASUREMENT_ID}'
  }
};
