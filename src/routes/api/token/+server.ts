import { WebPubSubServiceClient } from '@azure/web-pubsub';
import { PUBLIC_AZURE_PUBSUB_CONNECTION_STRING } from '$env/static/public';
import { json } from '@sveltejs/kit';

const serviceClient = new WebPubSubServiceClient(PUBLIC_AZURE_PUBSUB_CONNECTION_STRING, 'Hub');

export const GET = async () => {
	const token = await serviceClient.getClientAccessToken({
		roles: ['webpubsub.joinLeaveGroup', 'webpubsub.sendToGroup'],
		expirationTimeInMinutes: 60
	});
	return json(token);
};

