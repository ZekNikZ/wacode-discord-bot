// Load .env if available
import dotenv from 'dotenv';
dotenv.config();

// Imports
import * as delayedDeletion from './messages/delayed-deletion';
import * as registrationDB from './db/registrations/db';
import { appLogger, botLogger } from './util/log';
import { CommandoClient } from 'discord.js-commando';
import config from './config/config';
import { getEnvVar } from './util/env';
import onFirstJoin from './events/first-join';
import onMessage from './events/message';
import path from 'path';

// Load settings
appLogger.info('Fetching settings from environment variables...');
const BOT_OWNERS = (
    getEnvVar('BOT_OWNER_ID', 'Bot Owner ID', false) || ''
).split(';');
const BOT_TOKEN = getEnvVar('BOT_TOKEN', 'Bot Token');

// Create the client
appLogger.info('Creating Discord bot connection...');
const client = new CommandoClient({
    owner: BOT_OWNERS[0] ? BOT_OWNERS : [],
});

// Attempt login
appLogger.info('Logging into Discord services...');
client.login(BOT_TOKEN);

// Ready
client.on('ready', () => {
    botLogger.info('Connected to Discord servers!');
    client.user?.setPresence({
        status: 'online',
        activity: {
            name: 'Wacode!',
            type: 'COMPETING',
        },
    });
    client.guilds.cache.forEach((guild) =>
        guild.me?.setNickname(config.bot.nickname)
    );
});

// Logging
client.on('error', (e) => botLogger.error(e));
client.on('warn', (e) => botLogger.warn(e));
client.on('debug', (e) => botLogger.debug(e));

// Custom event handler
client.on('message', onMessage.bind(undefined, client));
client.on('guildMemberAdd', onFirstJoin.bind(undefined, client));

// Delayed message deletion
delayedDeletion.setup();

// Setup databases
registrationDB.setup();

// Register commands
client.registry
    .registerGroups([['dev', 'Dev commands']])
    .registerDefaults() // default commands, groups, and arguments
    .registerCommandsIn(path.join(__dirname, 'commands'));
