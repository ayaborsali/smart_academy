// test-oauth-final.js
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 TEST FINAL CONFIGURATION OAUTH');
console.log('='.repeat(50));

// Vérification des variables
console.log('✅ Variables d\'environnement chargées:');
console.log(`   GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅' : '❌'}`);
console.log(`   BACKEND_URL: ${process.env.BACKEND_URL}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL}`);

// Construction de l'URI
const redirectUri = `${process.env.BACKEND_URL}/api/auth/google/callback`;
console.log(`\n🔗 URI de redirection calculée:`);
console.log(`   ${redirectUri}`);

// Vérification exacte
const expectedUri = 'http://localhost:5000/api/auth/google/callback';
console.log(`\n🔍 Comparaison avec Google Console:`);
console.log(`   Calculée:  ${redirectUri}`);
console.log(`   Attendue:  ${expectedUri}`);
console.log(`   Correspond: ${redirectUri === expectedUri ? '✅ PARFAIT' : '❌ DIFFÉRENT'}`);

if (redirectUri !== expectedUri) {
  console.log('\n🚨 PROBLEME DÉTECTÉ:');
  console.log('   Les URIs ne correspondent pas!');
  console.log('   Vérifiez votre fichier .env et Google Console');
}

console.log('='.repeat(50));