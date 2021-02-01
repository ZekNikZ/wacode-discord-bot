import { Client, GuildMember } from 'discord.js';
import config from '../config/config';

export default function onFirstJoin(client: Client, member: GuildMember): void {
    member.roles.add(config.roles.firstJoin);
}
