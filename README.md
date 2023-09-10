# WhatsApp Chatbot using OpenAI API

A simple tutorial on building a WhatsApp chatbot that integrates with the OpenAI API.

## Getting Started

1. Clone the repository.
2. Run `npm install`.
3. Add your OpenAI API key to the `.env` file.
4. Run `node index.js`.

# Building a Whatsapp Chatbot using OpenAI API

In this tutorial, you will learn how to build a WhatsApp chatbot that replies to messages using the OpenAI API. This tutorial is beginner-friendly and we will go through each step in detail.

## Prerequisites

Before we start, ensure you have Node.js v12 or higher installed on your machine. You can download it from [here](https://nodejs.org/en/).

## Step 1 - Installation of whatsapp-web.js

The first step is to install whatsapp-web.js, which is a simple module that provides APIs for interacting with WhatsApp.

Run the following command:

```bash
$ npm i whatsapp-web.js
```

## Step 2 - Installation on No-GUI systems

If you're using a system without a GUI, you need to install the necessary dependencies. Run the following command:

```bash
$ sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

Then add the `--no-sandbox` flag to your puppeteer launch command

```javascript
new Client({
  puppeteer: {
    args: ['--no-sandbox'],
  }
})
```

## Step 3 - Initialize the Client

Before we can start receiving and sending messages, we need to initialize the client and handle the 'qr' and 'ready' events.

Here's how to do that:

```javascript
const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();
```

## Step 4 - QR Code Generation

Next, authorize the client to use your WhatsApp account by scanning a QR code with your phone.

Here's how you can generate a QR code:

```bash
$ npm i qrcode-terminal
```

Then, modify your code to use the qrcode-terminal module:

```javascript
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();
```

By scanning the displayed QR code, you should be able to authorize the client.

## Step 5 - Listening to Messages

You can listen for incoming messages by adding a 'message' event listener.

```javascript
client.on('message', message => {
  console.log(message.body);
});
```

## Step 6 - Replying to Messages

You can reply to an incoming message directly using the `reply()` method:

```javascript
client.on('message', message => {
  if(message.body === '!ping') {
    message.reply('pong');
  }
});
```

You can also send a message without quoting the original one, using the `sendMessage()` function:

```javascript
client.on('message', message => {
  if(message.body === '!ping') {
    client.sendMessage(message.from, 'pong');
  }
});
```

## OpenAI API Integration

Next, we're going to integrate the OpenAI API to provide intelligent responses to received WhatsApp messages.

### Installation

First, install the OpenAI Node API Library. To do this, run the following command:

```sh
npm install --save openai
# or
yarn add openai
```

### Usage

To use the OpenAI API, you need to provide your OpenAI API key as follows:

```js
import OpenAI from 'openai';

const openai = new OpenAI({
 apiKey: 'my api key',
});
```

Replace `'my api key'` with your actual OpenAI API key.

To generate responses for WhatsApp messages, modify your 'message' event handler as follows:

```javascript
client.on('message', async message => {
  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: message.body }],
    model: 'gpt-3.5-turbo',
  });

  message.reply(response.choices[0]?.message?.content);
});
```

That's it! You now have a WhatsApp bot capable of giving intelligent responses using the OpenAI API! 

For any additional help, please refer to the [OpenAI API documentation](https://github.com/openai/openai-node/blob/master/api.md) and the [whatsapp-web.js GitHub page](https://github.com/pedroslopez/whatsapp-web.js).