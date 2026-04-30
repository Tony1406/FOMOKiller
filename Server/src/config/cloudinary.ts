import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { v2: cloudinary } = require('cloudinary') as any;

export default cloudinary;
