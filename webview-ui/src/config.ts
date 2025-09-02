export type Environment = "production" | "staging" | "local"

const INFINITY_ENVIRONMENT: Environment = (process.env.INFINITY_ENVIRONMENT as Environment) || "production"

interface EnvironmentConfig {
	appBaseUrl: string
}

const configs: Record<Environment, EnvironmentConfig> = {
	production: {
		appBaseUrl: "https://app.infinity.bot",
	},
	staging: {
		appBaseUrl: "https://staging-app.infinity.bot",
	},
	local: {
		appBaseUrl: "http://localhost:3000",
	},
}

export const infinityEnvConfig = configs[INFINITY_ENVIRONMENT]
