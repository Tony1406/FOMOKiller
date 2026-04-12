import bcrypt from 'bcrypt';
import { sequelize } from '../config/db.js';
import { User } from '../models/UserModel.js';
import { defineAssociations } from '../models/associations.js';

const USERNAME = 'admin';
const EMAIL = 'admin@fomokiller.com';
const PASSWORD = 'Admin123!';

const main = async () => {
    defineAssociations();
    await sequelize.sync();

    const existing = await User.findOne({ where: { email: EMAIL } });
    if (existing) {
        console.log('El usuario admin ya existe.');
        process.exit(0);
    }

    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    await User.create({ username: USERNAME, email: EMAIL, passwordHash, role: 'admin' });

    console.log('✓ Usuario admin creado:');
    console.log(`  Email:    ${EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
    process.exit(0);
};

main().catch(e => { console.error(e); process.exit(1); });
