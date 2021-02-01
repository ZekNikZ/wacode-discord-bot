import { Client, Message } from 'discord.js';
import { getEnvVar } from '../util/env';
import { commandLogger as log } from '../util/log';
import onRegistrationAttempt from '../registration/register';

const REGISTRATION_CHANNEL =
    getEnvVar('BOT_REGISTRATION_CHANNEL', 'Registration Channel ID') || '';

export default function onMessage(client: Client, msg: Message): void {
    // Check if message was in a guild or in a DM
    if (!msg.guild) {
        // Message is a DM
    } else {
        // Message is in a guild

        // Registration
        if (
            msg.channel.id === REGISTRATION_CHANNEL &&
            !msg.content.startsWith('!')
        ) {
            onRegistrationAttempt(client, msg);
        }
    }
}
