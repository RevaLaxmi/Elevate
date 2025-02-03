import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      uploadDir: './public/uploads',  // Save files in the 'uploads' folder
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }

      const file = files.file[0];
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Save the file and respond with a success message
      return res.status(200).json({ message: 'File uploaded successfully' });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
