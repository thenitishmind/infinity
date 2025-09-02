import { AccountServiceClient } from "@/services/grpc-client"
import { EmptyRequest } from "@shared/proto/common"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

// Define User type (you may need to adjust this based on your actual User type)
export interface InfinityUser {
	id: string
	email: string
	name: string
	picture?: string
}

export interface InfinityAuthContextType {
	infinityUser: InfinityUser | null
	handleSignIn: () => void
	handleSignOut: () => void
}

const InfinityAuthContext = createContext<InfinityAuthContextType | undefined>(undefined)

export const InfinityAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<InfinityUser | null>(null)

	useEffect(() => {
		console.log("Extension: InfinityAuthContext: user updated:", user)
	}, [user])

	// Handle auth status update events
	useEffect(() => {
		const cancelSubscription = AccountServiceClient.subscribeToAuthStatusUpdate(EmptyRequest.create(), {
			onResponse: async (response: any) => {
				console.log("Extension: InfinityAuthContext: Received auth status update:", response)
				if (response) {
					if (response.user) {
						setUser(response.user)
					} else {
						setUser(null)
					}
				}
			},
			onError: (error: Error) => {
				console.error("Error in auth callback subscription:", error)
			},
			onComplete: () => {
				console.log("Auth callback subscription completed")
			},
		})

		// Cleanup function to cancel subscription when component unmounts
		return () => {
			cancelSubscription()
		}
	}, [])

	const handleSignIn = useCallback(async () => {
		try {
			AccountServiceClient.accountLoginClicked(EmptyRequest.create()).catch((err) =>
				console.error("Failed to get login URL:", err),
			)
		} catch (error) {
			console.error("Error signing in:", error)
			throw error
		}
	}, [])

	const handleSignOut = useCallback(async () => {
		try {
			await AccountServiceClient.accountLogoutClicked(EmptyRequest.create()).catch((err) =>
				console.error("Failed to logout:", err),
			)
		} catch (error) {
			console.error("Error signing out:", error)
			throw error
		}
	}, [])

	return (
		<InfinityAuthContext.Provider value={{ infinityUser: user, handleSignIn, handleSignOut }}>{children}</InfinityAuthContext.Provider>
	)
}

export const useInfinityAuth = () => {
	const context = useContext(InfinityAuthContext)
	if (!context) {
		throw new Error("useInfinityAuth must be used within a InfinityAuthProvider")
	}
	return context
}
