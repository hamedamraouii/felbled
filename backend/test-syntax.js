// Simple syntax test for our models and controllers
const path = require('path');

console.log('Testing model syntax...');

try {
  // Test Secteur model
  const SecteurSchema = require('./models/secteur');
  console.log('✓ Secteur model loaded successfully');

  // Test User model (should not throw)
  const UserSchema = require('./models/user');
  console.log('✓ User model loaded successfully');

  // Test UserController (should not throw)  
  const userController = require('./controllers/userController');
  console.log('✓ UserController loaded successfully');

  // Check if new methods exist
  const methods = ['getSecteurs', 'getSecteurById', 'getCategoriesBySecteur'];
  methods.forEach(method => {
    if (typeof userController[method] === 'function') {
      console.log(`✓ Method ${method} exists`);
    } else {
      console.log(`✗ Method ${method} missing`);
    }
  });

  console.log('\n✅ All syntax tests passed!');

} catch (err) {
  console.error('❌ Syntax error:', err.message);
  process.exit(1);
}