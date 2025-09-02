import { type ReactNode } from "react"

import { ExtensionStateContextProvider } from "./context/ExtensionStateContext"
import { InfinityAuthProvider } from "./context/InfinityAuthContext"
import { HeroUIProvider } from "@heroui/react"
import { CustomPostHogProvider } from "./CustomPostHogProvider"

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ExtensionStateContextProvider>
			<CustomPostHogProvider>
				<InfinityAuthProvider>
					<HeroUIProvider>{children}</HeroUIProvider>
				</InfinityAuthProvider>
			</CustomPostHogProvider>
		</ExtensionStateContextProvider>
	)
}
