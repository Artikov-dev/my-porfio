import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'O_DIRECT' || err.code === 'ENOENT') return;
      throw err;
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let updatedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Rule 1: Replace text-white with text-foreground EXCEPT if it's accompanied by bg-primary, bg-red-500, etc.
  // Actually, a simpler approach: replace text-white with dark:text-white text-gray-900 
  // Wait, text-foreground is better. 
  // Let's just blindly replace text-white with dark:text-white text-gray-900
  // But what about bg-primary text-white? 
  // Let's do a smart regex:
  
  // Replace text-gray-400 with text-foreground/60
  content = content.replace(/text-gray-400/g, 'text-foreground/60');
  
  // Replace text-gray-300 with text-foreground/70
  content = content.replace(/text-gray-300/g, 'text-foreground/70');
  
  // Replace bg-white/5 with bg-foreground/5
  content = content.replace(/bg-white\/5(?!0)/g, 'bg-foreground/5');
  
  // Replace bg-white/10 with bg-foreground/10
  content = content.replace(/bg-white\/10/g, 'bg-foreground/10');
  
  // Replace bg-white/20 with bg-foreground/10
  content = content.replace(/bg-white\/20/g, 'bg-foreground/10');

  // Replace border-white/10 with border-border
  content = content.replace(/border-white\/10/g, 'border-border');
  
  // Fix text-white ONLY if it's NOT inside a button-like class string that has bg-primary or bg-red
  // A safer way is to replace text-white with dark:text-white text-gray-900 but skip lines with bg-primary
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('text-white') && !lines[i].includes('bg-primary') && !lines[i].includes('bg-red-500') && !lines[i].includes('bg-teal')) {
      // If it's something like selection:text-white, don't replace
      lines[i] = lines[i].replace(/(?<!selection:)text-white/g, 'text-foreground dark:text-white');
    }
  }
  content = lines.join('\n');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
  }
});

console.log(`Updated ${updatedFiles} files for light/dark mode optimization.`);
