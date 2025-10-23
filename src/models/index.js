import './Order.js';
import './IoTOrder.js';
import './DemoRequest.js';
import './BrochureRequest.js';
import './Formation.js';

console.log('📦 Modèles MongoDB chargés:');
console.log('   - Order');
console.log('   - IoTOrder');
console.log('   - DemoRequest');
console.log('   - BrochureRequest');
console.log('   - Formation');

export { default as Order } from './Order.js';
export { default as IoTOrder } from './IoTOrder.js';
export { default as DemoRequest } from './DemoRequest.js';
export { default as BrochureRequest } from './BrochureRequest.js';
export { default as Formation } from './Formation.js';