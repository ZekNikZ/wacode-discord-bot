import { DMChannel, Message } from 'discord.js';
import commando, { CommandoClient } from 'discord.js-commando';
import { deleteLaterAsync } from '../../messages/delayed-deletion';

export default class ClearCommand extends commando.Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'clearchannel',
            group: 'dev',
            memberName: 'clearchannel',
            description: 'Clears a channel.',
            ownerOnly: true,
            guildOnly: true,
            details:
                'This is an incredibly useful command that clears an entire text channel',
        });
    }

    async run(msg: Message): Promise<Message | null> {
        if (msg.channel instanceof DMChannel) {
            return null;
        }

        let fetched;
        do {
            fetched = await msg.channel.messages.fetch({ limit: 100 });
            msg.channel.bulkDelete(fetched);
        } while (fetched.size >= 2);

        return deleteLaterAsync(msg.reply('Done.'));
    }
}
