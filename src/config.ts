export type Environment = "production" | "staging" | "local"

const INFINITY_ENVIRONMENT: Environment = (process.env.INFINITY_ENVIRONMENT as Environment) || "production"

interface EnvironmentConfig {
	appBaseUrl: string
	apiBaseUrl: string
	mcpBaseUrl: string
	firebase: {
		apiKey: string
		authDomain: string
		projectId: string
		storageBucket?: string
		messagingSenderId?: string
		appId?: string
	}
}

const configs: Record<Environment, EnvironmentConfig> = {
	production: {
		appBaseUrl: "https://app.infinity.bot",
		apiBaseUrl: "https://api.infinity.bot",
		mcpBaseUrl: "https://api.infinity.bot/v1/mcp",
		firebase: {
			apiKey: "AIzaSyC5rx59Xt8UgwdU3PCfzUF7vCwmp9-K2vk",
			authDomain: "infinity-prod.firebaseapp.com",
			projectId: "infinity-prod",
			storageBucket: "infinity-prod.firebasestorage.app",
			messagingSenderId: "941048379330",
			appId: "1:941048379330:web:45058eedeefc5cdfcc485b",
		},
	},
	staging: {
		appBaseUrl: "https://staging-app.infinity.bot",
		apiBaseUrl: "https://core-api.staging.int.infinity.bot",
		mcpBaseUrl: "https://api.infinity.bot/v1/mcp",
		firebase: {
			apiKey: "AIzaSyASSwkwX1kSO8vddjZkE5N19QU9cVQ0CIk",
			authDomain: "infinity-staging.firebaseapp.com",
			projectId: "infinity-staging",
			storageBucket: "infinity-staging.firebasestorage.app",
			messagingSenderId: "853479478430",
			appId: "1:853479478430:web:2de0dba1c63c3262d4578f",
		},
	},
	local: {
		appBaseUrl: "http://localhost:3000",
		apiBaseUrl: "http://localhost:7777",
		mcpBaseUrl: "https://api.infinity.bot/v1/mcp",
		firebase: {
			apiKey: "AIzaSyD8wtkd1I-EICuAg6xgAQpRdwYTvwxZG2w",
			authDomain: "infinity-preview.firebaseapp.com",
			projectId: "infinity-preview",
		},
	},
}

export const clineEnvConfig = configs[INFINITY_ENVIRONMENT]
