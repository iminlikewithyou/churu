export default {
  VITE_SERVER_HOST: import.meta.env.VITE_SERVER_HOST,
  VITE_OAUTH_REDIRECT_HOSTNAME:
    import.meta.env.VITE_OAUTH_REDIRECT_HOSTNAME ?? "https://www.churu.live",
  VITE_FIREBASE_CONFIG:
    import.meta.env.VITE_FIREBASE_CONFIG ??
    '{"apiKey":"AIzaSyA2fkXeFokJ-Ei_jnzDso5AmjbIaMdzuEc","authDomain":"churu-273604.firebaseapp.com","databaseURL":"https://churu-273604.firebaseio.com","projectId":"churu-273604","storageBucket":"churu-273604.appspot.com","messagingSenderId":"769614672795","appId":"1:769614672795:web:54bbda86288ab1a034273e"}',
  VITE_STRIPE_PUBLIC_KEY:
    import.meta.env.VITE_STRIPE_PUBLIC_KEY ??
    "pk_live_eVMbIifj5lnvgBleBCRaCv4E00aeXQkPxQ",
  VITE_FIREBASE_SIGNIN_METHODS: "facebook,google,email",
  NODE_ENV: import.meta.env.DEV ? "development" : "production",
};
