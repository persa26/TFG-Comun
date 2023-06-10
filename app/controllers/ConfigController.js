const fs = require('fs');
const path = require('path');


// Obtener la configuración actual
exports.getConfig = (req, res) => {
  try {
    const configPath = path.join(__dirname, '..', 'config', 'settings.json');
    const configData = fs.readFileSync(configPath);
    const config = JSON.parse(configData);
    const syncIPFaceRecognition = config.syncIPFaceRecognition;
    const syncIPCardID = config.syncIPCardID;
    res.json({ syncIPFaceRecognition, syncIPCardID });
  } catch (error) {
    console.error('Error al leer el archivo de configuración:', error);
    res.status(500).json({ error: 'No se pudo obtener la configuración' });
  }
};

// Actualizar las propiedades syncIPFaceRecognition y syncIPCardID
exports.updateSyncIP = (req, res) => {
  const { syncIPFaceRecognition, syncIPCardID } = req.body;

  try {
    const configPath = path.join(__dirname, '..', 'config', 'settings.json');
    const configData = fs.readFileSync(configPath);
    const config = JSON.parse(configData);
    config.syncIPFaceRecognition = syncIPFaceRecognition;
    config.syncIPCardID = syncIPCardID;
    const updatedConfig = JSON.stringify(config, null, 2);
    fs.writeFileSync(configPath, updatedConfig);
    res.status(200).json({ message: 'Configuración actualizada correctamente' });
  } catch (error) {
    console.error('Error al escribir en el archivo de configuración:', error);
    res.status(500).json({ error: 'No se pudo actualizar la configuración' });
  }
};