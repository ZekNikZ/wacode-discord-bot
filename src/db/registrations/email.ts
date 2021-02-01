import { User } from 'discord.js';
import db from './db';

export async function isEmailUsedInRegistration(
    email: string
): Promise<boolean> {
    const sheet = db().sheetsByTitle.Responses;

    await sheet.loadCells('B2:B');

    // Search through the email addresses
    let row = 1;
    do {
        // Get the cell
        const cell = sheet.getCell(row++, 1);

        // If the cell is empty, we have reached the end.
        if (!cell.value?.toString().trim()) {
            break;
        }

        // Check the cell email against the passed value
        const cellEmail = cell.value.toString().trim().toLowerCase();
        if (cellEmail === email.trim().toLowerCase()) {
            return true;
        }
        // eslint-disable-next-line no-constant-condition
    } while (true);

    return false;
}

export async function isEmailAlreadyRegistered(
    email: string
): Promise<boolean> {
    const sheet = db().sheetsByTitle['Discord Accounts'];

    await sheet.loadCells('A2:A');

    // Search through the email addresses
    let row = 1;
    do {
        // Get the cell
        const cell = sheet.getCell(row++, 0);

        // If the cell is empty, we have reached the end.
        if (!cell.value?.toString().trim()) {
            break;
        }

        // Check the cell email against the passed value
        const cellEmail = cell.value.toString().trim().toLowerCase();
        if (cellEmail === email.trim().toLowerCase()) {
            return true;
        }
        // eslint-disable-next-line no-constant-condition
    } while (true);

    return false;
}

export async function linkDiscordToRegistration(
    email: string,
    user: User
): Promise<void> {
    const sheet = db().sheetsByTitle['Discord Accounts'];

    await sheet.addRow([
        email,
        `${user.username}#${user.discriminator}`,
        user.id,
    ]);
}
