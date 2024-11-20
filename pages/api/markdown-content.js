import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { filename } = req.query;
  const markdownDir = path.join(process.cwd(), 'markdown');

  try {
    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(markdownDir, sanitizedFilename);

    // Verify file exists and is a markdown file
    if (!fs.existsSync(filePath) || 
        !(filePath.toLowerCase().endsWith('.md') || 
          filePath.toLowerCase().endsWith('.markdown'))) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Read file content
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error reading markdown file:', error);
    res.status(500).json({ 
      error: 'Unable to read markdown file', 
      details: error.message 
    });
  }
}