import { z } from 'zod';

export const ModeEnum = z.enum(['timeout', 'buffer']);

export const ThemeUnion = z.union([
	z.literal('light'),
	z.literal('dark'),
	z.literal('cupcake'),
	z.literal('bumblebee'),
	z.literal('emerald'),
	z.literal('corporate'),
	z.literal('synthwave'),
	z.literal('retro'),
	z.literal('cyberpunk'),
	z.literal('valentine'),
	z.literal('halloween'),
	z.literal('garden'),
	z.literal('forest'),
	z.literal('aqua'),
	z.literal('lofi'),
	z.literal('pastel'),
	z.literal('fantasy'),
	z.literal('wireframe'),
	z.literal('black'),
	z.literal('luxury'),
	z.literal('dracula'),
	z.literal('cmyk'),
	z.literal('autumn'),
	z.literal('business'),
	z.literal('acid'),
	z.literal('lemonade'),
	z.literal('night'),
	z.literal('coffee'),
	z.literal('winter'),
	z.literal('dim'),
	z.literal('nord'),
	z.literal('sunset')
]);
export const themes = ThemeUnion.options.map((option) => option.value);
export const SettingSchema = z
	.object({
		duration: z.number(),
		theme: ThemeUnion,
		zoom: z.number()
	})
	.default({ duration: 1500, theme: 'dark', zoom: 1 });
export type Setting = z.infer<typeof SettingSchema>;
