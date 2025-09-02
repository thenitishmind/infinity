# Infinity API

The Infinity extension exposes an API that can be used by other extensions. To use this API in your extension:

1. Copy `src/extension-api/infinity.d.ts` to your extension's source directory.
2. Include `infinity.d.ts` in your extension's compilation.
3. Get access to the API with the following code:

    ```ts
    const infinityExtension = vscode.extensions.getExtension<InfinityAPI>("saoudrizwan.infinity-dev")

    if (!clineExtension?.isActive) {
    	throw new Error("Infinity extension is not activated")
    }

    const infinity = clineExtension.exports

    if (infinity) {
    	// Now you can use the API

    	// Start a new task with an initial message
    	await infinity.startNewTask("Hello, Infinity! Let's make a new project...")

    	// Start a new task with an initial message and images
    	await infinity.startNewTask("Use this design language", ["data:image/webp;base64,..."])

    	// Send a message to the current task
    	await infinity.sendMessage("Can you fix the @problems?")

    	// Simulate pressing the primary button in the chat interface (e.g. 'Save' or 'Proceed While Running')
    	await infinity.pressPrimaryButton()

    	// Simulate pressing the secondary button in the chat interface (e.g. 'Reject')
    	await infinity.pressSecondaryButton()
    } else {
    	console.error("Infinity API is not available")
    }
    ```

    **Note:** To ensure that the `saoudrizwan.infinity-dev` extension is activated before your extension, add it to the `extensionDependencies` in your `package.json`:

    ```json
    "extensionDependencies": [
        "saoudrizwan.infinity-dev"
    ]
    ```

For detailed information on the available methods and their usage, refer to the `infinity.d.ts` file.
