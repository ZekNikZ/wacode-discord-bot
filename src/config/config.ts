import { Snowflake } from 'discord.js';
import { getEnvVar } from '../util/env';
import { readFileSync } from 'fs';

export interface Config {
    bot: Bot;
    roles: Roles;
    registration: Registration;
}

export interface Bot {
    nickname: string;
}

export interface Roles {
    firstJoin: Snowflake;
    registered: Snowflake;
}

export interface Registration {
    channel: Snowflake;
}

const config: Config = JSON.parse(
    readFileSync(
        getEnvVar('CONFIG_FILE', 'Config File', false) || './config.json',
        'utf-8'
    )
);

export default config;
