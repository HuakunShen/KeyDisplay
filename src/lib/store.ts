import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';
import { SettingSchema, type Setting } from '$lib/types';

const store = new Store('.settings.dat');
// try {
// 	const loadedSetting = await store.get('setting');
// } catch (error) {
// 	console.log(error);
// }
// console.log(loadedSetting);
// if (loadedSetting === null) {
// 	store.set('setting', { duration: 1500, mode: ModeEnum.Enum.timeout, theme: 'dark' });
// }

const DEFAULT_SETTING = { duration: 1500, theme: 'dark', zoom: 1 };
export const setting = writable<Setting>(SettingSchema.parse(DEFAULT_SETTING));

async function loadSettings() {
	// return SettingSchema.parse(DEFAULT_SETTING);
	let loadedSetting;
	try {
		loadedSetting = await store.get('setting');
	} catch (error) {
		store.set('setting', SettingSchema.parse(DEFAULT_SETTING));
		loadedSetting = SettingSchema.parse(DEFAULT_SETTING);
	}

	if (loadedSetting === null) {
		store.set('setting', SettingSchema.parse(DEFAULT_SETTING));
		loadedSetting = SettingSchema.parse(DEFAULT_SETTING);
	}
	return SettingSchema.parse(loadedSetting);
}

loadSettings()
	.then((s) => {
		setting.set(s);
	})
	.catch((err) => {
		console.log(err);
	});

setting.subscribe((val) => {
	store.set('setting', val);
});
// console.log(loadedSetting);

// export const setting = writable(loadedSetting);

// console.log(await store.get('setting'));
// export const setting = {};
// export const setting = SettingSchema.parse(loadedSetting);
// console.log(setting);

// const disappearTimeout = writable(1000);
// disappearTimeout.subscribe((val) => {
// 	store.set('disappear-timeout', { value: val });
// });
// const started = writable(false);
// const val = await store.get('some-key');
// assert(val, { value: 5 });

// await store.save();
