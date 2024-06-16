import * as bcrypt from 'bcrypt'

export class SecurityUtility {
  private constructor() {}

  static async hash(str: string): Promise<string> {
    return await bcrypt.hash(str, 10)
  }

  static async compare(str1: string, str2: string): Promise<boolean> {
    return await bcrypt.compare(str1, str2)
  }
}
