require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js'); 
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');
let messages = [
    // @todo: history of messages
];
(async () => {
// Initialize OpenAI API
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
        ],
    }
});

client.initialize();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.on('message',  (message) => {
    // Identify the sender's name or number
    const sender = message.from.split('@')[0]; // Assuming the sender's ID is in the format "name@something"

    // Construct the system prompt
    let prompt = `Reply on my behalf to the sender's ${sender} message: "${message.body}"`;

    // Generate reply using OpenAI API
    openai.chat.completions.create({
        messages: [{ role: 'system', content: prompt }],
        model: 'gpt-3.5-turbo'
    }).then((response) => {
        const reply = response.choices[0]?.message?.content.trim();
        // Reply to the sender
        message.reply(reply);
    }).catch((error) => {
        console.log(error);
    });


});


client.on('error', error => {
    console.error('An error occurred:', error);
});
})();
