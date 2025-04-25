import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

import { API_HASH, API_ID } from '$env/static/private';

export const clientsMap = new Map<string, TelegramClient>();

export const createTelegramClient = () => {
	const stringSession = new StringSession('');
	const client = new TelegramClient(stringSession, Number(API_ID), API_HASH, {
		connectionRetries: 5
	});

	return client;
};

export const getClient = (phoneNumber: string) => {
	if (clientsMap.has(phoneNumber)) {
		return clientsMap.get(phoneNumber)!;
	}

	const client = createTelegramClient();
	clientsMap.set(phoneNumber, client);

	return client;
};
