const fs = require('fs');
const path = require('path');

function parseSessionId(sessionId) {
    if (!sessionId) {
        throw new Error('SESSION_ID is not provided');
    }

    const parts = sessionId.split('~');
    if (parts.length < 2) {
        throw new Error('Invalid SESSION_ID format. Expected: prefix~base64data');
    }

    const prefix = parts[0];
    const base64Data = parts.slice(1).join('~');

    try {
        const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
        return {
            prefix,
            credentials: JSON.parse(decodedData)
        };
    } catch (error) {
        throw new Error(`Failed to parse SESSION_ID: ${error.message}`);
    }
}

function initializeSession(sessionId, authFolder = './auth_info') {
    const { prefix, credentials } = parseSessionId(sessionId);
    
    if (!fs.existsSync(authFolder)) {
        fs.mkdirSync(authFolder, { recursive: true });
    }

    const credsPath = path.join(authFolder, 'creds.json');
    fs.writeFileSync(credsPath, JSON.stringify(credentials, null, 2));

    console.log(`Session initialized with prefix: ${prefix}`);
    return { prefix, credsPath, authFolder };
}

function getCredsPath(authFolder = './auth_info') {
    return path.join(authFolder, 'creds.json');
}

module.exports = {
    parseSessionId,
    initializeSession,
    getCredsPath
};
