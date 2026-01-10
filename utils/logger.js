const chalk = require('chalk');
const Table = require('cli-table3');

const botStartTime = Date.now();

function formatTimestamp() {
    return new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
}

function truncateText(text, maxLength = 40) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function logMessage(messageInfo) {
    const { 
        messageId, 
        senderId, 
        senderLid, 
        senderName, 
        content, 
        isGroup, 
        groupName,
        timestamp 
    } = messageInfo;

    const table = new Table({
        head: [
            chalk.cyan.bold('Field'),
            chalk.cyan.bold('Value')
        ],
        colWidths: [20, 55],
        style: {
            head: [],
            border: ['cyan']
        },
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
            'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });

    table.push(
        [chalk.yellow('Time'), chalk.white(formatTimestamp())],
        [chalk.yellow('Message ID'), chalk.gray(truncateText(messageId, 50))],
        [chalk.yellow('Sender ID'), chalk.green(senderId || 'N/A')],
        [chalk.yellow('Sender LID'), chalk.magenta(senderLid || 'N/A')],
        [chalk.yellow('Sender Name'), chalk.blue(senderName || 'Unknown')],
        [chalk.yellow('Chat Type'), isGroup ? chalk.red('Group') : chalk.green('Private')],
        [chalk.yellow('Group Name'), isGroup ? chalk.yellow(groupName || 'N/A') : chalk.gray('N/A')],
        [chalk.yellow('Content'), chalk.white(truncateText(content, 50))]
    );

    console.log('\n' + chalk.bgCyan.black.bold(' NEW MESSAGE '));
    console.log(table.toString());
}

function logBotStatus(status, details = '') {
    const statusColors = {
        'CONNECTED': chalk.bgGreen.black,
        'DISCONNECTED': chalk.bgRed.white,
        'RECONNECTING': chalk.bgYellow.black,
        'ERROR': chalk.bgRed.white,
        'INFO': chalk.bgBlue.white,
        'MODE': chalk.bgMagenta.white
    };

    const colorFn = statusColors[status] || chalk.bgWhite.black;
    console.log(`\n${colorFn(` ${status} `)} ${chalk.white(details)}`);
}

function logCommand(command, sender, success = true) {
    const status = success ? chalk.green('✓') : chalk.red('✗');
    console.log(`${chalk.bgBlue.white(' COMMAND ')} ${status} ${chalk.yellow(command)} from ${chalk.cyan(sender)}`);
}

function getUptime() {
    const uptime = Date.now() - botStartTime;
    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    let uptimeStr = '';
    if (days > 0) uptimeStr += `${days}d `;
    if (hours > 0) uptimeStr += `${hours}h `;
    if (minutes > 0) uptimeStr += `${minutes}m `;
    uptimeStr += `${seconds}s`;

    return uptimeStr;
}

function printBanner() {
    console.log(chalk.red.bold('\n🔥 MADARA UCHIHA Bot v1.0.0 🔥\n'));
}

module.exports = {
    logMessage,
    logBotStatus,
    logCommand,
    getUptime,
    printBanner,
    formatTimestamp
};
