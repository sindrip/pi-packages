import {
	createProvider,
	envApiKeyAuth,
	openAICompletionsApi,
	type ApiKeyCredential,
	type Model,
	type Provider,
	type RefreshModelsContext,
	type ThinkingLevelMap,
} from "@earendil-works/pi-ai/compat";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const BASE_URL = "https://ai.eu.corti.app/v1";
const PROVIDER_ID = "corti";

// =============================================================================
// Catalog
// =============================================================================

type CortiRemoteModel = {
	id: string;
	max_input_tokens?: number;
	cost?: { input?: number; output?: number; cache_read?: number };
	capabilities?: {
		image_input?: boolean;
		reasoning?: boolean;
		temperature?: boolean;
		tool_call?: boolean;
	};
	effort?: { supported?: boolean; levels?: string[] };
};

function mapRemoteModels(models: CortiRemoteModel[]): Model<"openai-completions">[] {
	return models
		.filter(
			(
				m,
			): m is CortiRemoteModel & { capabilities: NonNullable<CortiRemoteModel["capabilities"]> } =>
				m.capabilities !== undefined,
		)
		.map((m) => {
			const reasoning = m.capabilities.reasoning ?? false;
			const input: ("text" | "image")[] = m.capabilities.image_input ? ["text", "image"] : ["text"];
			const cost = {
				input: m.cost?.input ?? 0,
				output: m.cost?.output ?? 0,
				cacheRead: m.cost?.cache_read ?? 0,
				cacheWrite: 0,
			};
			return {
				id: m.id,
				name: m.id,
				api: "openai-completions",
				provider: PROVIDER_ID,
				baseUrl: BASE_URL,
				reasoning,
				thinkingLevelMap: thinkingLevelMapFromEffort(m.effort, reasoning),
				input,
				cost,
				contextWindow: m.max_input_tokens ?? 262144,
				maxTokens: 16384,
			} satisfies Model<"openai-completions">;
		});
}

function thinkingLevelMapFromEffort(
	effort: { supported?: boolean; levels?: string[] } | undefined,
	reasoning: boolean,
): ThinkingLevelMap | undefined {
	if (!reasoning) {
		return undefined;
	}

	if (effort && !effort.supported) {
		return {
			off: null,
			minimal: null,
			low: null,
			medium: null,
			high: null,
			xhigh: null,
			max: null,
		};
	}

	const supported = new Set(effort?.levels ?? []);

	if (supported.size === 0) {
		return undefined;
	}

	const map: ThinkingLevelMap = { off: null };
	for (const level of ["minimal", "low", "medium", "high", "xhigh", "max"] as const) {
		map[level] = supported.has(level) ? level : null;
	}
	return map;
}

async function fetchCatalog(
	context: RefreshModelsContext,
	key: string,
): Promise<readonly Model<"openai-completions">[]> {
	const modelsUrl = new URL(`${BASE_URL}/models`);
	modelsUrl.searchParams.set("experimental", "true");

	const response = await fetch(modelsUrl, {
		headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
		signal: context.signal,
	});

	if (!response.ok) {
		throw new Error(`Corti /models failed: ${response.status} ${await response.text()}`);
	}

	const payload: { data?: CortiRemoteModel[] } = await response.json();

	if (!Array.isArray(payload.data)) {
		throw new Error(`Corti /models returned malformed payload`);
	}

	return mapRemoteModels(payload.data);
}

// =============================================================================
// Extension entry point
// =============================================================================

export default function (pi: ExtensionAPI): void {
	const provider: Provider<"openai-completions"> = createProvider<"openai-completions">({
		id: PROVIDER_ID,
		name: "Corti",
		baseUrl: BASE_URL,
		auth: { apiKey: envApiKeyAuth("Corti API key", ["CORTI_BEARER"]) },
		models: [],
		fetchModels: async (context) => {
			const cred = context.credential as ApiKeyCredential | undefined;
			if (!cred?.key) {
				throw new Error(`No Corti credential. Run /login ${PROVIDER_ID}.`);
			}

			return fetchCatalog(context, cred.key);
		},
		api: openAICompletionsApi(),
	});

	pi.registerProvider(provider);
}
