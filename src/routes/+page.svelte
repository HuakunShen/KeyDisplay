<script lang="ts">
	import { onMount } from 'svelte';
	import { WebviewWindow, appWindow, currentMonitor } from '@tauri-apps/api/window';
	import { setting } from '$lib/store';

	// let setting2;
	// setting.subscribe((value) => {
	// 	setting2 = value;
	// });
</script>

<button
	on:click={async () => {
		let y = 100;
		const curMon = await currentMonitor();
		if (curMon) {
			const size = curMon.size;
			y = size.height - 100;
		}

		// const height = curMon?.hei;
		new WebviewWindow('display', {
			url: 'display',
			transparent: true,
			y: 500,
			x: 500,
			height: 300,
			width: 500,
			decorations: false,
			alwaysOnTop: true
		});
	}}
	class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900"
>
	Start
</button>
