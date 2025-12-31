'use server'

import { auth } from "../better-auth/auth"
import { inngest } from "../inngest/client"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName,
            }
        })
        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }
        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log('Sign up fialed ', error)
        return {
            success: false,
            error: 'Sign up failed'
        }
    }
}
export const signInWithEmail = async ({ email, password}: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({
            body: {
                email,
                password
            }
        })
        return {
            success: true,
            data: response
        }
    } catch (error) {
        console.log('Sign in fialed ', error)
        return {
            success: false,
            error: 'Sign in failed'
        }
    }
}
export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() })
        // Revalidate all paths to ensure session is cleared
        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.log('Sign out failed, ', error)
        return { success: false, error: 'Sign out failed' }
    }
}
