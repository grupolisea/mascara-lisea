try {
  process.loadEnvFile();
} catch (e) {}

const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Usamos directamente el enlace de conexión directo a Supabase
const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function main() {
  await client.connect();
  
  const adminUsername = 'admin@grupoolisea.com';
  const adminPassword = 'Olisea$Master2024!'; // Contraseña de acuerdo al diseño original
  const role = 'ADMIN';
  const id = uuidv4();
  const createdAt = new Date();

  // Comprobamos si el administrador ya fue insertado
  const res = await client.query('SELECT * FROM "User" WHERE username = $1', [adminUsername]);

  if (res.rows.length === 0) {
    // Inserción directa en la tabla estructurada por Prisma
    await client.query(
      'INSERT INTO "User" (id, username, password, role, "createdAt") VALUES ($1, $2, $3, $4, $5)',
      [id, adminUsername, adminPassword, role, createdAt]
    );
    console.log('✅ Usuario Administrador inicial creado con éxito en Supabase.');
  } else {
    console.log('ℹ️ El usuario Administrador ya existe en la base de datos.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error al insertar el usuario:', e);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });