const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Uso:");
  console.log("node scripts/generate-hash.js TU_CONTRASEÑA");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nHash generado:\n");
  console.log(hash);
});