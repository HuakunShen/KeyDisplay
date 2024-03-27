import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';
import { ModeEnum, SettingSchema, type Setting } from '$lib/types';

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

const DEFAULT_SETTING = { duration: 1500, mode: ModeEnum.Enum.timeout, theme: 'dark' };
export const setting = writable<Setting>(SettingSchema.parse(DEFAULT_SETTING));

async function loadSettings() {
	const loadedSetting = await store.get('setting');
	if (loadedSetting === null) {
		store.set('setting', SettingSchema.parse(DEFAULT_SETTING));
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
