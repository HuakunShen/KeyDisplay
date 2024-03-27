<script lang="ts">
	import { onMount } from 'svelte';
	import { WebviewWindow, appWindow, currentMonitor } from '@tauri-apps/api/window';
	import { setting } from '$lib/store';
	import { themes, ThemeUnion } from '$lib/types';
	import { invoke } from '@tauri-apps/api';
	onMount(() => {
		setting.subscribe((s) => {
			// set data-theme attribute of html element to s.theme
			document.documentElement.setAttribute('data-theme', s.theme);
		});
	});

	function themeUpdate(e: Event) {
		const target = e.target as HTMLSelectElement;
		setting.update((s) => {
			s.theme = ThemeUnion.parse(target.value);
			return s;
		});
	}

	function zoomUpdate(e: Event) {
		const target = e.target as HTMLInputElement;
		const newZoom = parseFloat(target.value);
		console.log('newZoom', newZoom);

		setting.update((s) => {
			s.zoom = newZoom;
			return s;
		});
	}
</script>

<div data-tauri-drag-region class="h-8 w-full"></div>
<div class="p-2">
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
				height: 60,
				width: 500,
				decorations: false,
				alwaysOnTop: true
			});
			setTimeout(() => {
				invoke('blur_display_background', { windowLabel: 'display' });
			}, 500);
		}}
		class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900"
	>
		Start
	</button>

	<div class="flex flex-col space-y-3">
		<h2 class="text-xl font-bold">Color Theme</h2>
		<select class="select w-full max-w-xs" on:change={themeUpdate} bind:value={$setting.theme}>
			<option disabled selected>Pick your favorite Simpson</option>
			{#each themes as t}
				<option>{t}</option>
			{/each}
		</select>
		<h2 class="text-xl font-bold">Zoom</h2>
		<input
			bind:value={$setting.zoom}
			on:change={zoomUpdate}
			step="0.1"
			type="number"
			placeholder="Zoom"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
</div>
