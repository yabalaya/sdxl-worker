import { Ai } from '@cloudflare/ai';

export interface Env {
	AI: any;
	R2: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const ai = new Ai(env.AI);
		const url = new URL(request.url);
		const params = url.searchParams;

		const inputs = {
			prompt: params.get('prompt') ?? 'small black cat',
		};

		const response = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);

		ctx.waitUntil(env.R2.put(params.get('prompt') ?? 'small black cat' + '/' + request.headers.get('cf-ray') + '.png', response));

		return new Response(response, {
			headers: {
				'content-type': 'image/png',
			},
		});
	},
};
