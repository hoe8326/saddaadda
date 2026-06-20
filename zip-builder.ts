import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

async function buildZip() {
  console.log('--- Generating Sadda Adda static hosting zip package ---');
  const zip = new AdmZip();
  const rootDir = process.cwd();

  // Add html views
  const pages = ['index.html', 'menu.html', 'gallery.html', 'about.html', 'reviews.html', 'contact.html', 'cart.html'];
  pages.forEach(page => {
    const filePath = path.join(rootDir, page);
    if (fs.existsSync(filePath)) {
      zip.addLocalFile(filePath);
      console.log(`Zipped page: ${page}`);
    }
  });

  // Add css
  const cssDir = path.join(rootDir, 'css');
  if (fs.existsSync(cssDir)) {
    zip.addLocalFolder(cssDir, 'css');
    console.log('Zipped folder: css/');
  }

  // Add js
  const jsDir = path.join(rootDir, 'js');
  if (fs.existsSync(jsDir)) {
    zip.addLocalFolder(jsDir, 'js');
    console.log('Zipped folder: js/');
  }

  // Add images
  const imgDir = path.join(rootDir, 'images');
  if (fs.existsSync(imgDir)) {
    zip.addLocalFolder(imgDir, 'images');
    console.log('Zipped folder: images/');
  }

  const zipPath = path.join(rootDir, 'sadda-adda-ready-to-host.zip');
  zip.writeZip(zipPath);
  console.log(`--- Zip generated successfully at: ${zipPath} ---`);
}

buildZip().catch(err => {
  console.error('Error generating prepackaged zip:', err);
});
