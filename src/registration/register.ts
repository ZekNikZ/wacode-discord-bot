import { Client, Message } from 'discord.js';
import {
    isEmailAlreadyRegistered,
    isEmailUsedInRegistration,
    linkDiscordToRegistration,
} from '../db/registrations/email';
import config from '../config/config';
import { deleteLaterAsync } from '../messages/delayed-deletion';
import { validate as isEmail } from 'email-validator';

async function linkEmail(msg: Message): Promise<void> {
    if (await isEmailUsedInRegistration(msg.content.trim())) {
        if (await isEmailAlreadyRegistered(msg.content.trim())) {
            deleteLaterAsync(
                msg.reply(
                    'That email address has already been linked to a Discord account. Message @EventStaff for help'
                )
            );
        } else {
            // Record registration
            linkDiscordToRegistration(msg.content.trim(), msg.author);

            // Change the roles around
            if (msg.guild) {
                // Change roles
                msg.member?.roles.remove(config.roles.firstJoin);
                msg.member?.roles.add(config.roles.registered);
            }

            // Indicate success
            deleteLaterAsync(
                msg.reply(
                    'Thank you for completing your registration! You now have full access to the Discord.'
                )
            );
        }
    } else {
        deleteLaterAsync(
            msg.reply(
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
        await linkEmail(msg);
    } else {
        // Message is NOT an email
        deleteLaterAsync(
            msg.reply(
                'That is not a valid email address. Please enter the email address that you used to sign-up.'
            )
        );
    }
    msg.delete();
}
