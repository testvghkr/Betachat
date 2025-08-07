import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sql } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: number
  username: string
  email: string
  display_name?: string
  is_guest: boolean
  email_verified: boolean
  created_at: string
}

export interface UserSettings {
  beta_enabled: boolean
  enter_to_send: boolean
  theme: string
  language: string
  notifications_enabled: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number }
  } catch {
    return null
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string,
  isGuest = false,
): Promise<User | null> {
  try {
    const passwordHash = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (username, email, password_hash, is_guest, display_name)
      VALUES (${username}, ${email}, ${passwordHash}, ${isGuest}, ${username})
      RETURNING id, username, email, display_name, is_guest, email_verified, created_at
    `

    if (result.length > 0) {
      const user = result[0] as User

      // Create default settings for the user
      await sql`
        INSERT INTO user_settings (user_id, beta_enabled, enter_to_send, theme, language, notifications_enabled)
        VALUES (${user.id}, false, true, 'system', 'nl', true)
        ON CONFLICT (user_id) DO NOTHING
      `

      return user
    }

    return null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function getUserByUsername(username: string): Promise<(User & { password_hash: string }) | null> {
  try {
    const result = await sql`
      SELECT id, username, email, password_hash, display_name, is_guest, email_verified, created_at
      FROM users 
      WHERE username = ${username}
    `

    return (result[0] as User & { password_hash: string }) || null
  } catch (error) {
    console.error("Error getting user by username:", error)
    return null
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, username, email, display_name, is_guest, email_verified, created_at
      FROM users 
      WHERE id = ${id}
    `

    return (result[0] as User) || null
  } catch (error) {
    console.error("Error getting user by id:", error)
    return null
  }
}

export async function authenticateUser(username: string, password: string) {
  try {
    const user = await getUserByUsername(username)
    if (!user) {
      return { success: false, error: "Gebruiker niet gevonden" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: "Ongeldig wachtwoord" }
    }

    const token = generateToken(user.id)
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        display_name: user.display_name,
        is_guest: user.is_guest,
      },
      token,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Er is een fout opgetreden" }
  }
}

export async function getUserSettings(userId: number): Promise<UserSettings> {
  try {
    const result = await sql`
      SELECT beta_enabled, enter_to_send, theme, language, notifications_enabled
      FROM user_settings 
      WHERE user_id = ${userId}
    `

    if (result.length > 0) {
      return result[0] as UserSettings
    }

    // Return default settings if none found
    const defaultSettings: UserSettings = {
      beta_enabled: false,
      enter_to_send: true,
      theme: "system",
      language: "nl",
      notifications_enabled: true,
    }

    // Create default settings
    await sql`
      INSERT INTO user_settings (user_id, beta_enabled, enter_to_send, theme, language, notifications_enabled)
      VALUES (${userId}, ${defaultSettings.beta_enabled}, ${defaultSettings.enter_to_send}, ${defaultSettings.theme}, ${defaultSettings.language}, ${defaultSettings.notifications_enabled})
      ON CONFLICT (user_id) DO NOTHING
    `

    return defaultSettings
  } catch (error) {
    console.error("Error getting user settings:", error)
    return {
      beta_enabled: false,
      enter_to_send: true,
      theme: "system",
      language: "nl",
      notifications_enabled: true,
    }
  }
}

export async function updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<boolean> {
  try {
    const updateFields = []
    const values = [userId]

    if (settings.beta_enabled !== undefined) {
      updateFields.push(`beta_enabled = $${values.length + 1}`)
      values.push(settings.beta_enabled)
    }
    if (settings.enter_to_send !== undefined) {
      updateFields.push(`enter_to_send = $${values.length + 1}`)
      values.push(settings.enter_to_send)
    }
    if (settings.theme !== undefined) {
      updateFields.push(`theme = $${values.length + 1}`)
      values.push(settings.theme)
    }
    if (settings.language !== undefined) {
      updateFields.push(`language = $${values.length + 1}`)
      values.push(settings.language)
    }
    if (settings.notifications_enabled !== undefined) {
      updateFields.push(`notifications_enabled = $${values.length + 1}`)
      values.push(settings.notifications_enabled)
    }

    if (updateFields.length === 0) return true

    updateFields.push("updated_at = CURRENT_TIMESTAMP")

    const query = `
      UPDATE user_settings 
      SET ${updateFields.join(", ")}
      WHERE user_id = $1
    `

    await sql(query, values)
    return true
  } catch (error) {
    console.error("Error updating user settings:", error)
    return false
  }
}

export async function createGuestUser(): Promise<User | null> {
  const guestId = Math.random().toString(36).substring(2, 15)
  const username = `guest_${guestId}`
  const email = `${username}@guest.local`
  const password = Math.random().toString(36).substring(2, 15)

  return createUser(username, email, password, true)
}

export async function updateUserProfile(
  userId: number,
  updates: { display_name?: string; email?: string },
): Promise<boolean> {
  try {
    const updateFields = []
    const values = [userId]

    if (updates.display_name !== undefined) {
      updateFields.push(`display_name = $${values.length + 1}`)
      values.push(updates.display_name)
    }
    if (updates.email !== undefined) {
      updateFields.push(`email = $${values.length + 1}`)
      values.push(updates.email)
    }

    if (updateFields.length === 0) return true

    updateFields.push("updated_at = CURRENT_TIMESTAMP")

    const query = `
      UPDATE users 
      SET ${updateFields.join(", ")}
      WHERE id = $1
    `

    await sql(query, values)
    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    return false
  }
}

export async function deleteUser(userId: number): Promise<boolean> {
  try {
    await sql`DELETE FROM users WHERE id = ${userId}`
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}
