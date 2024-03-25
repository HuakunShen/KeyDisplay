<script lang="ts">
	import { onMount } from 'svelte';
	import { WebviewWindow, appWindow, currentMonitor } from '@tauri-apps/api/window';

	onMount(() => {
		// new WebviewWindow('display', {
		// 	url: 'http://localhost:5173/display'
		// });
	});
</script>

<button
	on:click={async () => {
		// const curMon = await currentMonitor();
		// const height = curMon?.hei;
		new WebviewWindow('display', {
			url: 'display',
			transparent: true,
			height: 200,
			width: 500,
			decorations: false,
			alwaysOnTop: true
		});
	}}
	class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900"
>
	Start
</button>
