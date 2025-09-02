import * as vscode from "vscode"
import type { Controller } from "../index"
import type { EmptyRequest } from "../../../shared/proto/common"
import { Empty } from "../../../shared/proto/common"
import { telemetryService } from "../../../services/posthog/telemetry/TelemetryService"

/**
 * Opens the Infinity walkthrough in VSCode
 * @param controller The controller instance
 * @param request Empty request
 * @returns Empty response
 */
export async function openWalkthrough(controller: Controller, request: EmptyRequest): Promise<Empty> {
	try {
		await vscode.commands.executeCommand("workbench.action.openWalkthrough", "saoudrizwan.infinity-dev#InfinityWalkthrough")
		telemetryService.captureButtonClick("webview_openWalkthrough")
		return Empty.create({})
	} catch (error) {
		console.error(`Failed to open walkthrough: ${error}`)
		throw error
	}
}
