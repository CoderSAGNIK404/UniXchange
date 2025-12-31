
import fs from 'fs';

async function testChat() {
    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Hello" })
        });
        const data = await response.json();
        fs.writeFileSync('error.txt', JSON.stringify(data, null, 2));
    } catch (error) {
        fs.writeFileSync('error.txt', error.toString());
    }
}
testChat();
