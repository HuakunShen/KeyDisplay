<script lang="ts">
	import { appWindow } from '@tauri-apps/api/window';
	import { onDestroy, onMount } from 'svelte';
	import { emit, listen, type UnlistenFn } from '@tauri-apps/api/event';
	import { setting } from '$lib/store';

	let keys: string[] = [];
	let displayElement: HTMLElement;

	function keyTranslator(key: string) {
		switch (key) {
			case 'Escape':
				return 'ESC';
			case 'Enter':
				return '↵';
			case 'Return':
				return '↵';
			case 'Delete':
				return 'DEL';
			case 'Backspace':
				return '⌫';
			case 'MetaLeft':
				return '⌘';
			case 'MetaRight':
				return '⌘';
			case 'UpArrow':
				return '↑';
			case 'DownArrow':
				return '↓';
			case 'LeftArrow':
				return '←';
			case 'RightArrow':
				return '→';
			case 'ShiftLeft':
				return '⇧';
			case 'Equal':
				return '=';
			case 'Minus':
				return '-';
			case 'Space':
				return '␣';
			case 'Tab':
				return '⇥';
			case 'CapsLock':
				return '⇪';
			case 'Comma':
				return ',';
			case 'Dot':
				return '.';
			case 'Slash':
				return '/';
			case 'SemiColon':
				return ';';
			case 'Quote':
				"'";
			case 'LeftBracket':
				return '[';
			case 'RightBracket':
				return ']';
			case 'BackSlash':
				return '\\';
			case 'BackQuote':
				return '`';
			case 'ShiftRight':
				return '⇧';
			case 'ControlLeft':
				return 'Ctrl';
			case 'ControlRight':
				return 'Ctrl';
			case 'Alt':
				return '⎇';
			case 'AltGr':
				return '⎇';
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

	onMount(() => {
		setting.subscribe((s) => {
			console.log("setting update");
			
			// set data-theme attribute of html element to s.theme
			document.documentElement.setAttribute('data-theme', s.theme);
		});
	});

	let unlistenKeypress: UnlistenFn;

	function keypressHandler(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			appWindow.close();
		}
	}

	// setting.subscribe((s) => {
	// 	displayElement.style.setProperty('--zoom', s.zoom.toString());
	// });

	onMount(async () => {
		unlistenKeypress = await listen('keypress', (event: { payload: { key: string } }) => {
			// keys.push(event.payload.key);
			keys = [event.payload.key, ...keys];
			setTimeout(() => {
				// keys.shift();
				keys.pop();
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

<div
	bind:this={displayElement}
	data-tauri-drag-region
	class="container p-2 flex justify-center border rounded-lg border-gray-300/10 right-0 backdrop-blur-md h-full zoom"
>
	<div class="-z-10 flex space-x-1 min-h-8 min-w-16 text-right rtl-overflow">
		<span></span>
		<!--  -->
		{#each keys as key}
			<kbd class="kbd">{keyTranslator(key)}</kbd>
		{/each}
	</div>
</div>

<style scoped>
	:global(html) {
		background-color: transparent !important;
	}
	:global(body) {
		background-color: transparent !important;
	}

	.rtl-overflow {
		direction: rtl;
	}

	.zoom {
		/* zoom: setting.zoom; */
		zoom: var(--zoom, 1);
	}
</style>
