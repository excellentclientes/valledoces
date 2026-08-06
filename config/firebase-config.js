/**
 * Configuração do Firebase — Vallê Doces
 * Mantido em arquivo separado para facilitar troca de projeto/ambiente.
 * Chaves do Firebase Web são públicas por natureza (ficam expostas no bundle do
 * cliente); a segurança real dos dados é garantida pelas regras do Firestore
 * (ver firestore.rules) e pelo Firebase Authentication.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDOftppx9yHJVd2QeltPwOF575JAb9dads",
  authDomain: "valledoces.firebaseapp.com",
  databaseURL: "https://valledoces-default-rtdb.firebaseio.com",
  projectId: "valledoces",
  storageBucket: "valledoces.firebasestorage.app",
  messagingSenderId: "559383063380",
  appId: "1:559383063380:web:7a209b72a78d021bf7b6c1"
};

firebase.initializeApp(firebaseConfig);

window.auth = firebase.auth();
window.db = firebase.firestore();
window.storage = firebase.storage ? firebase.storage() : null;
