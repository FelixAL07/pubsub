<script lang="ts">
	import { joinGroup, sendMessage, getClient } from '$lib/service';
	import { onMount } from 'svelte';
	import { WebPubSubClient } from '@azure/web-pubsub-client';
	import type { messagesType } from '$lib/types';

	let client: WebPubSubClient;
	onMount(async () => {
		client = await getClient();
		joinGroup(client, (data) => {
			messages.push(data);
			console.log(data);
		}).catch(console.error);
	});
	let messages: messagesType[] = $state([]);
	let messageToSend: string = $state('');
	let userName: string = $state('');
</script>

<div class="page">
	<header class="topbar">
		<div>
			<span class="pulse" aria-hidden="true"></span>
			<h1>Fagprøve 2 <span class="divider">·</span> Azure Web PubSub</h1>
		</div>
		<div class="composer">
			<p>Brukernavn:</p>
			<textarea name="username" id="" bind:value={userName}></textarea>
		</div>
	</header>

	<div class="log">
		{#if messages.length === 0}
			<p class="empty">No messages yet. Say something below.</p>
		{/if}
		{#each messages as message}
			<div class="bubble">
				<p class="bubble-username">{message.userName || 'Anonymous'}</p>
				<p class="bubble-message">{message.message}</p>
			</div>
		{/each}
	</div>
	<div class="composer">
		<textarea name="messageTosend" id="" bind:value={messageToSend}></textarea>
		<button
			title="sendbutton"
			onclick={async () => {
				console.log('button clicked, sending:', messageToSend);
				await sendMessage(client, userName, messageToSend);
				console.log('sendMessage finished');
				messageToSend = '';
			}}
			>Send Message
		</button>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: #0f1620;
		color: #e7edf3;
		font-family:
			'Segoe UI',
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-width: 640px;
		margin: 0 auto;
	}

	.topbar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 1.1rem 1.25rem;
		border-bottom: 1px solid #1f2b3a;
		background: #121b27;
		justify-content: space-between;
	}

	.topbar h1 {
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		margin: 0;
		color: #f1f5f9;
	}

	.divider {
		color: #3a4a5e;
		font-weight: 400;
	}

	.pulse {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #2899f5;
		box-shadow: 0 0 0 0 rgba(40, 153, 245, 0.6);
		animation: pulse 2.2s ease-out infinite;
		flex-shrink: 0;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(40, 153, 245, 0.55);
		}
		70% {
			box-shadow: 0 0 0 8px rgba(40, 153, 245, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(40, 153, 245, 0);
		}
	}

	.log {
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.empty {
		color: #5c6b80;
		font-size: 0.9rem;
		margin: auto;
		text-align: center;
	}

	.bubble {
		background: #1b2735;
		border: 1px solid #243348;
		border-radius: 8px;
		padding: 0.65rem 0.85rem 0.75rem;
		color: #dce4ee;
		align-self: flex-start;
		max-width: 80%;
		min-width: 8rem;
		overflow-wrap: anywhere;
	}

	.bubble-username {
		margin: 0 0 0.25rem;
		color: #7cc4ff;
		font-size: 0.78rem;
		font-weight: 700;
		line-height: 1.25;
	}

	.bubble-message {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.45;
		white-space: pre-wrap;
	}

	.composer {
		display: flex;
		gap: 0.6rem;
		align-items: flex-end;
		padding: 0.9rem 0;
	}

	textarea {
		flex: 1;
		resize: none;
		background: #0f1620;
		border: 1px solid #243348;
		border-radius: 8px;
		color: #e7edf3;
		padding: 0.65rem 0.8rem;
		font-size: 0.92rem;
		font-family: inherit;
		line-height: 1.4;
		min-height: 2.6rem;
		max-height: 7rem;
		transition: border-color 0.15s ease;
	}

	textarea:focus {
		outline: none;
		border-color: #2899f5;
	}

	button {
		background: #2899f5;
		color: #051625;
		border: none;
		border-radius: 8px;
		padding: 0.65rem 1.1rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s ease;
		white-space: nowrap;
	}

	button:hover {
		background: #4babf7;
	}

	button:focus-visible {
		outline: 2px solid #4babf7;
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse {
			animation: none;
		}
	}
</style>
