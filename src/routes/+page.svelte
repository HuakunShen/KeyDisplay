<script lang="ts">
	import { onMount } from 'svelte';
	import { WebviewWindow, appWindow, currentMonitor } from '@tauri-apps/api/window';
	import { setting } from '$lib/store';
	import { themes, ThemeUnion } from '$lib/types';
	import { invoke } from '@tauri-apps/api';
	import { emit, listen, type UnlistenFn } from '@tauri-apps/api/event';
	import { get } from 'svelte/store';

	let appStatus = false;

	onMount(() => {
		setting.subscribe((s) => {
			console.log(s);

			// set data-theme attribute of html element to s.theme
			document.documentElement.setAttribute('data-theme', s.theme);
		});
		setInterval(() => {
			const win = WebviewWindow.getByLabel('display');
			if (win) {
				appStatus = true;
			} else {
				appStatus = false;
			}
		}, 2000);
	});

	function themeUpdate(e: Event) {
		const target = e.target as HTMLSelectElement;
		setting.update((s) => {
			s.theme = ThemeUnion.parse(target.value);
			return s;
		});
		emit('setting-update', get(setting));
	}

	function zoomUpdate(e: Event) {
		const target = e.target as HTMLInputElement;
		const newZoom = parseFloat(target.value);
		console.log('newZoom', newZoom);

		setting.update((s) => {
			s.zoom = newZoom;
			return s;
		});
		emit('setting-update', get(setting));
	}

	async function appToggle(e: Event) {
		const target = e.target as HTMLInputElement;
		const checked = target.checked;
		if (checked) {
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
				center: true,
				// y: 500,
				// x: 500,
				height: 55 * get(setting).zoom,
				width: 500,
				decorations: false,
				alwaysOnTop: true
			});
		} else {
			const window = WebviewWindow.getByLabel('display');
			if (window) {
				window.close();
			}
		}
	}
</script>

<div data-tauri-drag-region class="h-8 w-full"></div>
<div class="p-2 px-5 flex flex-col space-y-3">
	<div class="form-control w-52">
		<label class="cursor-pointer label">
			<span class="label-text text-xl font-bold">App Status</span>
			<input
				type="checkbox"
				class="toggle toggle-success"
				on:change={appToggle}
				bind:checked={appStatus}
			/>
		</label>
	</div>
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
