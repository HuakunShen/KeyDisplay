<script lang="ts">
	import { appWindow } from '@tauri-apps/api/window';
	import { onDestroy, onMount } from 'svelte';
	import { emit, listen, type UnlistenFn } from '@tauri-apps/api/event';

	let keys: string[] = [];

	function keyTranslator(key: string) {
		switch (key) {
			case 'Escape':
				return '⎋';
			case 'Enter':
				return '↵';
			case 'Backspace':
				return '⌫';
			case 'MetaLeft':
				return '⌘';
			case 'MetaRight':
				return '⌘';
			case 'ArrowUp':
				return '↑';
			case 'ArrowDown':
				return '↓';
			case 'ArrowLeft':
				return '←';
			case 'ArrowRight':
				return '→';
			case 'ShiftLeft':
				return '⇧';
			case 'Equal':
				return '=';
			case 'Minus':
				return '-';
			case 'ShiftRight':
				return '⇧';
			case 'ControlLeft':
				return 'Ctrl';
			case 'ControlRight':
				return 'Ctrl';
			case 'Alt':
				return 'Alt';
			case 'AltGr':
				return 'Alt';
			default:
				// if key starts with Key, remove the prefix
				if (key.startsWith('Key')) {
					return key.slice(3);
				}
				// if key starts with Num, remove the prefix
				if (key.startsWith('Num')) {
					return key.slice(3);
				}
				return key;
		}
	}

	let unlistenKeypress: UnlistenFn;

	function keypressHandler(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			appWindow.close();
		}
	}

	onMount(async () => {
		unlistenKeypress = await listen('keypress', (event: { payload: { key: string } }) => {
			keys.push(event.payload.key);
			keys = keys;
			setTimeout(() => {
				keys.shift();
				keys = keys;
			}, 2000);
		});
		// escape on Esc pressed
		document.addEventListener('keydown', keypressHandler);
	});

	onDestroy(() => {
		unlistenKeypress();
		document.removeEventListener('keydown', keypressHandler);
	});
</script>

<div data-tauri-drag-region class="container p-2 flex justify-center">
	<div class="-z-10 flex space-x-1">
		{#each keys as key}
			<kbd id="" class="kbd">{keyTranslator(key)}</kbd>
		{/each}
	</div>
</div>

<style>
	:global(html) {
		background-color: transparent !important;
	}
	:global(body) {
		background-color: transparent !important;
	}
</style>
