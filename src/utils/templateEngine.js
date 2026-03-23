import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

// pour simuler __dirname dans ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compile un template HTML avec des variables dynamiques
export const renderTemplate = (templateName, data) => {
  const filePath = path.resolve(__dirname, '../templates', `${templateName}.html`);
  const source = fs.readFileSync(filePath, 'utf8');
  const template = handlebars.compile(source);
  return template(data);
};