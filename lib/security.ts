import bcrypt from "bcryptjs"
import crypto from "crypto"
import { prisma } from "./db"

export interface SecurityQuestionData {
  question: string
  answer: string
}

export class SecurityService {
  /**
   * Genereert een unieke salt voor extra beveiliging
   */
  private static generateSalt(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  /**
   * Hash een beveiligingsantwoord met salt
   */
  private static async hashAnswer(answer: string, salt: string): Promise<string> {
    const normalizedAnswer = answer.toLowerCase().trim()
    const saltedAnswer = normalizedAnswer + salt
    return await bcrypt.hash(saltedAnswer, 12)
  }

  /**
   * Verifieer een beveiligingsantwoord
   */
  private static async verifyAnswer(answer: string, hash: string, salt: string): Promise<boolean> {
    const normalizedAnswer = answer.toLowerCase().trim()
    const saltedAnswer = normalizedAnswer + salt
    return await bcrypt.compare(saltedAnswer, hash)
  }

  /**
   * Sla een nieuwe beveiligingsvraag op voor een gebruiker
   */
  static async saveSecurityQuestion(userId: string, questionData: SecurityQuestionData): Promise<void> {
    console.log("🔐 Saving security question for user:", userId)

    try {
      // Deactiveer bestaande beveiligingsvragen
      await prisma.securityQuestion.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      })

      // Genereer salt en hash het antwoord
      const salt = this.generateSalt()
      const answerHash = await this.hashAnswer(questionData.answer, salt)

      // Maak nieuwe beveiligingsvraag
      await prisma.securityQuestion.create({
        data: {
          userId,
          question: questionData.question,
          answerHash,
          salt,
          isActive: true,
        },
      })

      console.log("✅ Security question saved successfully")
    } catch (error) {
      console.error("❌ Failed to save security question:", error)
      throw new Error("Failed to save security question")
    }
  }

  /**
   * Haal de actieve beveiligingsvraag op voor een gebruiker
   */
  static async getSecurityQuestion(userId: string): Promise<string | null> {
    console.log("🔍 Getting security question for user:", userId)

    try {
      const securityQuestion = await prisma.securityQuestion.findFirst({
        where: {
          userId,
          isActive: true,
        },
        select: {
          question: true,
        },
      })

      return securityQuestion?.question || null
    } catch (error) {
      console.error("❌ Failed to get security question:", error)
      return null
    }
  }

  /**
   * Haal de actieve beveiligingsvraag op via email
   */
  static async getSecurityQuestionByEmail(email: string): Promise<{ question: string; userId: string } | null> {
    console.log("🔍 Getting security question by email:", email)

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          securityQuestions: {
            where: { isActive: true },
            select: {
              question: true,
            },
          },
        },
      })

      if (!user || user.securityQuestions.length === 0) {
        return null
      }

      return {
        question: user.securityQuestions[0].question,
        userId: user.id,
      }
    } catch (error) {
      console.error("❌ Failed to get security question by email:", error)
      return null
    }
  }

  /**
   * Verifieer een beveiligingsantwoord
   */
  static async verifySecurityAnswer(userId: string, answer: string): Promise<boolean> {
    console.log("🔐 Verifying security answer for user:", userId)

    try {
      const securityQuestion = await prisma.securityQuestion.findFirst({
        where: {
          userId,
          isActive: true,
        },
        select: {
          answerHash: true,
          salt: true,
        },
      })

      if (!securityQuestion) {
        console.log("❌ No active security question found")
        return false
      }

      const isValid = await this.verifyAnswer(answer, securityQuestion.answerHash, securityQuestion.salt)
      console.log(isValid ? "✅ Security answer verified" : "❌ Security answer invalid")

      return isValid
    } catch (error) {
      console.error("❌ Failed to verify security answer:", error)
      return false
    }
  }

  /**
   * Verifieer een beveiligingsantwoord via email
   */
  static async verifySecurityAnswerByEmail(email: string, answer: string): Promise<boolean> {
    console.log("🔐 Verifying security answer by email:", email)

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          securityQuestions: {
            where: { isActive: true },
            select: {
              answerHash: true,
              salt: true,
            },
          },
        },
      })

      if (!user || user.securityQuestions.length === 0) {
        console.log("❌ No user or security question found")
        return false
      }

      const securityQuestion = user.securityQuestions[0]
      const isValid = await this.verifyAnswer(answer, securityQuestion.answerHash, securityQuestion.salt)
      console.log(isValid ? "✅ Security answer verified" : "❌ Security answer invalid")

      return isValid
    } catch (error) {
      console.error("❌ Failed to verify security answer by email:", error)
      return false
    }
  }

  /**
   * Verwijder alle beveiligingsvragen voor een gebruiker
   */
  static async removeSecurityQuestions(userId: string): Promise<void> {
    console.log("🗑️ Removing security questions for user:", userId)

    try {
      await prisma.securityQuestion.deleteMany({
        where: { userId },
      })

      console.log("✅ Security questions removed successfully")
    } catch (error) {
      console.error("❌ Failed to remove security questions:", error)
      throw new Error("Failed to remove security questions")
    }
  }

  /**
   * Controleer of een gebruiker een actieve beveiligingsvraag heeft
   */
  static async hasSecurityQuestion(userId: string): Promise<boolean> {
    try {
      const count = await prisma.securityQuestion.count({
        where: {
          userId,
          isActive: true,
        },
      })

      return count > 0
    } catch (error) {
      console.error("❌ Failed to check security question:", error)
      return false
    }
  }
}
