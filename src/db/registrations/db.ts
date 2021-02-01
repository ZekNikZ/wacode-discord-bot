import { GoogleSpreadsheet } from 'google-spreadsheet';
import { appLogger } from '../../util/log';
import { getEnvVar } from '../../util/env';

let doc: GoogleSpreadsheet | undefined = undefined;

export async function setup(): Promise<void> {
    doc = new GoogleSpreadsheet(
        getEnvVar(
            'GOOGLE_REGISTRATION_SPREADSHEET_ID',
            'Registration Spreadsheet ID'
        ) || ''
    );

    await doc.useServiceAccountAuth({
        client_email:
            getEnvVar(
                'GOOGLE_SERVICE_ACCOUNT_EMAIL',
                'Google Service Account Email Address'
            ) || '',
        private_key:
            getEnvVar(
                'GOOGLE_PRIVATE_KEY',
                'Google Service Account Private Key'
            )?.replaceAll('\\n', '\n') || '',
    });

    await doc.loadInfo();
    appLogger.info(`Loaded registration spreadsheet "${doc.title}"`);
}

export default function db(): GoogleSpreadsheet {
    if (doc === undefined) {
        throw new Error('Database has not been loaded');
    }

    return doc;
}
