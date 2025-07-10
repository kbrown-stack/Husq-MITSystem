const QRCode = require('qrcode'); // This helps generate codes from any data like objects ,text, URL etc.

const generateQRCode = async (data) => {
  try {
    const qrCodeData = await QRCode.toDataURL(JSON.stringify(data));
    return qrCodeData;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

const generateBarcodeData = (machineId, serialNumber) => {
  return {
    machineId,
    serialNumber,
    timestamp: new Date().toISOString(),
    type: 'machine_inventory' 
  };
};

module.exports = {
  generateQRCode,
  generateBarcodeData
};










