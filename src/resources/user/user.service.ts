import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SecurityUtility } from '../../common/utils/encrypt'
import { CreateUserRequest } from './dto/create-user-request.dto'
import { User } from './schema/user.schema'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  async createUser(request: CreateUserRequest) {
    const user = await this.usersRepository.create({
      ...request,
      password: await SecurityUtility.hash(request.password),
    })

    return user
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email })
    const paswordIsValid = await SecurityUtility.compare(
      password,
      user.password,
    )
    if (!paswordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
    return user
  }

  async getUser(getUserArgs: Partial<User>) {
    return this.usersRepository.findOne(getUserArgs)
  }
}
