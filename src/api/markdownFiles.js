import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const markdownFolder = path.join(process.cwd(), 'markdown');
  
  try {
    // Read all files in the markdown folder
    const files = await fs.promises.readdir(markdownFolder);
    
    // Filter only markdown files
    const markdownFiles = files.filter(file => 
      file.toLowerCase().endsWith('.md') || 
      file.toLowerCase().endsWith('.markdown')
    );
    
    res.status(200).json(markdownFiles);
  } catch (error) {
    console.error('Error reading markdown files:', error);
    res.status(500).json({ 
      error: 'Unable to read markdown files', 
      details: error.message 
    });
  }
}