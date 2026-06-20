import express from 'express';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Security Boosters: Prevent site fingerprinting and enforce security headers
app.disable('x-powered-by');

app.use((req, res, next) => {
  // Prevent frame-busting (clickjacking protection)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Prevent MIME-type sniffing exploits
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Control referrer leakage to other domains
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Secure cross-site-scripting standard browser protections
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Seed Unsplash Images on Startup to create fully functional local files
// EVERY SINGLE item has its own dedicated, high-quality, authentic food asset!
const imagesMap: Record<string, string> = {
  "hero_bg.jpg": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200",
  "burger.jpg": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
  "fries.jpg": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800",
  "coffee.jpg": "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800",
  "shake_oreo.jpg": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800",
  "shake_kitkat.jpg": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=800",
  "mojito.jpg": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
  "nachos.jpg": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=800",
  "interior_1.jpg": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800",
  "interior_2.jpg": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800",
  "interior_3.jpg": "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800",
  "vibe_gaming.jpg": "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800",
  
  // Specific Gourmet Burger Images
  "burger_classic.jpg": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600",
  "burger_aloo.jpg": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=600",
  "burger_cheese.jpg": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600",
  "burger_monster.jpg": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600",
  
  // Fries Range
  "fries_salted.jpg": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600",
  "fries_periperi.jpg": "https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=600",
  "fries_loaded.jpg": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600",
  "fries_pizza.jpg": "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=600",
  
  // Milkshake Flavors
  "shake_vanilla.jpg": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600",
  "shake_chocolate.jpg": "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?q=80&w=600",
  "shake_strawberry.jpg": "https://images.unsplash.com/photo-1553787499-6f9133860278?q=80&w=600",
  
  // Coffee Triggers
  "coffee_cold.jpg": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600",
  "coffee_frappe.jpg": "https://images.unsplash.com/photo-1572286258217-402423106274?q=80&w=600",
  "coffee_latte.jpg": "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600",
  "coffee_espresso.jpg": "https://images.unsplash.com/photo-1510707513156-4b6d52f5b0ca?q=80&w=600",
  
  // Mocktails fizzes
  "mojito_mint.jpg": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600",
  "mojito_blue.jpg": "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600",
  "mojito_strawberry.jpg": "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=600",
  
  // Snack sides
  "nachos_cheesy.jpg": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=600",
  "snacks_garlic_bread.jpg": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=600",
  "snacks_nuggets.jpg": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=600",
  "snacks_sandwich.jpg": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600"
};

async function downloadImages() {
  const imgDir = path.join(process.cwd(), 'images');
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }

  for (const [filename, url] of Object.entries(imagesMap)) {
    const filePath = path.join(imgDir, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`Downloading default mockup asset '${filename}' from Unsplash...`);
      try {
        const response = await fetch(url);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          fs.writeFileSync(filePath, Buffer.from(buffer));
          console.log(`Successfully saved '${filename}'.`);
        } else {
          console.warn(`Failed to seed asset '${filename}': ${response.statusText}`);
        }
      } catch (err) {
        console.error(`Error downloading asset '${filename}':`, err);
      }
    }
  }
}

async function startServer() {
  // Download static images first
  await downloadImages();

  // API route FIRST
  app.get('/api/download-zip', (req, res) => {
    try {
      const zip = new AdmZip();
      const rootDir = process.cwd();

      // Add HTML Pages
      const pages = ['index.html', 'menu.html', 'gallery.html', 'about.html', 'reviews.html', 'contact.html', 'cart.html'];
      pages.forEach(page => {
        const filePath = path.join(rootDir, page);
        if (fs.existsSync(filePath)) {
          zip.addLocalFile(filePath);
        }
      });

      // Add CSS Folder
      const cssDir = path.join(rootDir, 'css');
      if (fs.existsSync(cssDir)) {
        zip.addLocalFolder(cssDir, 'css');
      }

      // Add JS Folder
      const jsDir = path.join(rootDir, 'js');
      if (fs.existsSync(jsDir)) {
        zip.addLocalFolder(jsDir, 'js');
      }

      // Add Images Folder with raw binaries
      const imgDir = path.join(rootDir, 'images');
      if (fs.existsSync(imgDir)) {
        zip.addLocalFolder(imgDir, 'images');
      }

      const zipBuffer = zip.toBuffer();

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="sadda-adda-ready-to-host.zip"');
      res.send(zipBuffer);
    } catch (err) {
      console.error('Error generating zip downloadable package:', err);
      res.status(500).send('Error packaging website directory.');
    }
  });

  // Serve static files (images, css, js) natively
  app.use('/images', express.static(path.join(process.cwd(), 'images')));
  app.use('/css', express.static(path.join(process.cwd(), 'css')));
  app.use('/js', express.static(path.join(process.cwd(), 'js')));

  // Vite Integration for high performance HTML router rendering
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve HTML directly in Production mode
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      // Direct root fallback
      app.use(express.static(process.cwd()));
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sadda Adda server is live and running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to boot Sadda Adda server:', err);
});
