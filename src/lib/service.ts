import { WebPubSubClient } from '@azure/web-pubsub-client';
import type { messagesType } from './types';

export async function getClient() {
	const res = await fetch('/api/token');
	const token = await res.json();

	return new WebPubSubClient(token.url);
}
export async function joinGroup(client: WebPubSubClient, onMessage: (data: messagesType) => void) {
	client.on('group-message', (e) => {
		onMessage(e.message.data as messagesType);
	});
	try {
		await client.start();
		console.log('WebSocket connected');
		await client.joinGroup('group-1');
		console.log('Joined group-1');
	} catch (err) {
		console.error('Failed to start/join:', err);
	}
}

export async function sendMessage(
	client: WebPubSubClient,
	username: string,
	message: string = 'hello world'
) {
	await client.sendToGroup('group-1', { userName: username, message: message }, 'json');
}
