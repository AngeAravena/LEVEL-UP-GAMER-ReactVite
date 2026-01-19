export const defaultProducts = [
  { id: 0, name: 'PlayStation 5', type: 'consola', price: 549990, image: '/assets/images/ps5.jpg', description: 'Consola next-gen con SSD ultra rápido y control háptico DualSense.' },
  { id: 1, name: 'Xbox Series X', type: 'consola', price: 529990, image: '/assets/images/Xbox series X.jpg', description: 'Potencia 4K, Quick Resume y catálogo Game Pass.' },
  { id: 2, name: 'Nintendo Switch OLED', type: 'consola', price: 349990, image: '/assets/images/Switch OLED.webp', description: 'Híbrida con pantalla OLED de 7" para juego portátil y sobremesa.' },
  { id: 3, name: 'Control DualSense', type: 'accesorio', price: 69990, image: '/assets/images/Control DualSense.webp', description: 'Vibración háptica, gatillos adaptativos y micrófono integrado.' },
  { id: 4, name: 'Auriculares HyperX Cloud', type: 'accesorio', price: 79990, image: '/assets/images/Hyper X Headset.webp', description: 'Sonido envolvente y almohadillas de espuma viscoelástica para largas sesiones.' },
  { id: 5, name: 'PC Gamer ASUS ROG', type: 'pc', price: 1299990, image: '/assets/images/Pc gamer Asus ROG.jpg', description: 'RTX, procesador de alto rendimiento y chasis con flujo de aire optimizado.' }
];

export const defaultUsers = [
  { id: 1, name: 'Pepito', lastName: '', email: 'pepitoPro@gmail.com', password: 'Pepitogod123', role: 'admin' }
];

export const legacyIdMap = {
  'ps5': 0,
  'xsx': 1,
  'switch-oled': 2,
  'dualsense': 3,
  'hyperx-cloud': 4,
  'pc-rog': 5
};
