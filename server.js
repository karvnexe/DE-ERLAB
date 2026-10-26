const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// iPhone 6'dan iPhone 18'e Kadar Gerçekçi 2. El / Yenilenmiş Baz Fiyat Veritabanı
const iphoneBasePrices = {
    "iphone 6": 2500,
    "iphone 6s": 3200,
    "iphone 7": 4500,
    "iphone 8": 6000,
    "iphone 8 plus": 7800,
    "iphone x": 8500,
    "iphone xr": 9500,
    "iphone xs": 10500,
    "iphone xs max": 12000,
    "iphone se (1.gen)": 3500,
    "iphone se (2.gen)": 7500,
    "iphone se (3.gen)": 13500,
    "iphone 11": 14000,
    "iphone 11 pro": 18500,
    "iphone 11 pro max": 21500,
    "iphone 12": 19500,
    "iphone 12 mini": 16000,
    "iphone 12 pro": 25000,
    "iphone 12 pro max": 29500,
    "iphone 13": 26500,
    "iphone 13 mini": 22000,
    "iphone 13 pro": 34000,
    "iphone 13 pro max": 39000,
    "iphone 14": 32000,
    "iphone 14 plus": 36000,
    "iphone 14 pro": 42000,
    "iphone 14 pro max": 48000,
    "iphone 15": 45000,
    "iphone 15 plus": 50000,
    "iphone 15 pro": 56000,
    "iphone 15 pro max": 64000,
    "iphone 16": 58000,
    "iphone 16 plus": 63000,
    "iphone 16 pro": 71000,
    "iphone 16 pro max": 79000,
    "iphone 17": 75000,
    "iphone 17 pro": 86000,
    "iphone 17 pro max": 95000,
    "iphone 17 air": 82000,
    "iphone 18": 90000,
    "iphone 18 pro": 102000,
    "iphone 18 pro max": 112000
};

app.post('/api/market/analyze', (req, res) => {
    const { query, storage, battery, condition } = req.body;
    
    if (!query) {
        return res.status(400).json({ success: false, message: 'Lütfen bir cihaz modeli seçin.' });
    }

    const cleanQuery = query.toLowerCase().trim();
    let basePrice = iphoneBasePrices[cleanQuery] || 20000; // Listede birebir yoksa akıllı ortalama

    let currentPrice = basePrice;

    // 1. Hafıza Çarpanı
    const storeNum = parseInt(storage) || 128;
    if (storeNum === 64) currentPrice *= 0.92;
    else if (storeNum === 128) currentPrice *= 1.0;
    else if (storeNum === 256) currentPrice *= 1.12;
    else if (storeNum >= 512) currentPrice *= 1.25;

    // 2. Pil Sağlığı Çarpanı
    const batteryVal = parseInt(battery) || 85;
    if (batteryVal >= 90) currentPrice *= 1.06;
    else if (batteryVal >= 80) currentPrice *= 1.0;
    else if (batteryVal >= 70) currentPrice *= 0.88;
    else currentPrice *= 0.75;

    // 3. Kozmetik Durum
    if (condition === 'mukemmel') currentPrice *= 1.10;
    else if (condition === 'normal') currentPrice *= 1.0;
    else if (condition === 'degisen') currentPrice *= 0.78;

    const finalAvg = Math.round(currentPrice);
    const deadBuy = Math.round(finalAvg * 0.74); // Esnaf alış
    const fastSell = Math.round(finalAvg * 0.95); // Sahibinden hızlı
    const storeSell = Math.round(finalAvg * 1.15); // Yenilenmiş mağaza

    let confidenceScore = iphoneBasePrices[cleanQuery] ? 92 : 65;
    if (batteryVal < 70) confidenceScore -= 5;

    res.json({
        success: true,
        data: {
            query: query.toUpperCase(),
            stats: {
                avgPrice: finalAvg,
                deadBuy,
                fastSell,
                storeSell,
                batteryStatus: `${batteryVal}%`,
                score: batteryVal > 85 && condition === 'mukemmel' ? 'A+ (Piyasanın Gözdesi)' : batteryVal < 75 ? 'C (Bakım İstiyor)' : 'B (Standart Temiz)',
                confidence: `${confidenceScore}/100`
            },
            breakdown: {
                storageBonus: `${storeNum} GB`,
                conditionText: condition === 'mukemmel' ? 'Kusursuz / Kutulu' : condition === 'normal' ? 'Kılcal İzli' : 'Değişenli / Zayıf'
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Kaçeder V2.0 Tam Liste Motoru Aktif: http://localhost:${PORT}`));