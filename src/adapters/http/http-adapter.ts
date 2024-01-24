import fetch from 'node-fetch';
import crypto from 'crypto';

const API_KEY = '<ваш_api_key>';
const API_SECRET = '<ваш_api_secret>';
const BASE_URL = 'https://api.binance.com';

function createSignature(queryString: crypto.BinaryLike) {
    return crypto.createHmac('sha256', API_SECRET).update(queryString).digest('hex');
}

async function placeOrder(symbol: any, quantity: any, side: any) {
    const data:any = {
        symbol: symbol,
        side: side,
        type: 'MARKET',
        quantity: quantity,
        timestamp: Date.now()
    };

    const queryString = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
    const signature = createSignature(queryString);

    const url = `${BASE_URL}/api/v3/order`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-MBX-APIKEY': API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `${queryString}&signature=${signature}`
        });

        const responseData = await response.json();
        console.log('Order response:', responseData);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Пример вызова функции для размещения ордера
// placeOrder('BTCUSDT', 0.001, 'BUY');
