const { spawn } = require('child_process');
const localtunnel = require('localtunnel');

const PORT = 8080;

// Start the node server
const server = spawn('node', ['server.js'], { stdio: 'inherit' });

server.on('error', (err) => {
    console.error('Failed to start server:', err);
});

// Start localtunnel
(async () => {
    try {
        const tunnel = await localtunnel({ port: PORT });
        
        console.log('\n======================================================');
        console.log('✅ SERVER IS RUNNING GLOBALLY! ✅');
        console.log('🌍 You can access it on your iPhone/Android at:');
        console.log(`➡️  ${tunnel.url}`);
        console.log('======================================================\n');
        
        tunnel.on('close', () => {
            console.log('Tunnel closed.');
        });
    } catch (err) {
        console.error('Localtunnel Error:', err);
    }
})();

// Handle graceful shutdown
process.on('SIGINT', () => {
    server.kill('SIGINT');
    process.exit();
});
