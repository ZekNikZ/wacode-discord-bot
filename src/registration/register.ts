import { Client, Message } from 'discord.js';
import {
    isEmailAlreadyRegistered,
    isEmailUsedInRegistration,
    linkDiscordToRegistration,
} from '../db/registrations/email';
import { commandLogger } from '../util/log';
import { deleteLater } from '../messages/delayed-deletion';
import { validate as isEmail } from 'email-validator';

async function linkEmail(client: Client, msg: Message): Promise<void> {
    if (await isEmailUsedInRegistration(msg.content.trim())) {
        if (await isEmailAlreadyRegistered(msg.content.trim())) {
            deleteLater(
                await msg.reply(
                    'That email address has already been linked to a Discord account. Message @EventStaff for help'
                )
            );
        } else {
            linkDiscordToRegistration(msg.content.trim(), msg.author);

            deleteLater(
                await msg.reply(
                    'Thank you for completing your registration. You now have full access to the Discord.'
                )
            );
        }
    } else {
        deleteLater(
            await msg.reply(
                'That email address has not been used to register for Wacode yet' +
                    '. Have you filled out the registration form?'
            )
        );
    }
}

export default async function onRegistrationAttempt(
    client: Client,
    msg: Message
): Promise<void> {
    if (client.user?.id === msg.author.id) {
        return;
    }

    // Check if the message is an email
    if (isEmail(msg.content.trim())) {
        // Message is an email
        await linkEmail(client, msg);
    } else {
        // Message is NOT an email
        deleteLater(
            await msg.reply(
                'That is not a valid email address. Please enter the email address that you used to sign-up.'
            )
        );
    }
    msg.delete();
}
