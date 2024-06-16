import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { ObjectId } from 'mongodb'
import { SecurityUtility } from '../../common/utils/encrypt'
import { CreateUserRequest } from './dto/create-user-request.dto'
import { User } from './schema/user.schema'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

describe('UserService', () => {
  let userService: UserService
  let userRepository: UserRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get<UserRepository>(UserRepository)
  })

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const request: CreateUserRequest = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        profilePic: 'http://example.com/pic.jpg',
      }

      const hashedPassword = 'hashedPassword123'
      const createdUser: User = {
        _id: new ObjectId(),
        ...request,
        password: hashedPassword,
      }
      jest.spyOn(SecurityUtility, 'hash').mockResolvedValue(hashedPassword)
      jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser)

      const result = await userService.createUser(request)

      expect(SecurityUtility.hash).toHaveBeenCalledWith(request.password)
      expect(userRepository.create).toHaveBeenCalledWith({
        ...request,
        password: hashedPassword,
      })
      expect(result).toEqual(createdUser)
    })
  })

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const hashedPassword = 'hashedPassword123'
      const user = {
        email,
        password: hashedPassword,
        username: 'testuser',
      } as User

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user)
      jest.spyOn(SecurityUtility, 'compare').mockResolvedValue(true)

      const result = await userService.validateUser(email, password)

      expect(userRepository.findOne).toHaveBeenCalledWith({ email })
      expect(SecurityUtility.compare).toHaveBeenCalledWith(
        password,
        hashedPassword,
      )
      expect(result).toEqual(user)
    })

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com'
      const password = 'wrongpassword'
      const hashedPassword = 'hashedPassword123'
      const user = {
        email,
        password: hashedPassword,
        username: 'testuser',
      } as User

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user)
      jest.spyOn(SecurityUtility, 'compare').mockResolvedValue(false)

      await expect(userService.validateUser(email, password)).rejects.toThrow(
        new UnauthorizedException('Credentials are not valid.'),
      )

      expect(userRepository.findOne).toHaveBeenCalledWith({ email })
      expect(SecurityUtility.compare).toHaveBeenCalledWith(
        password,
        hashedPassword,
      )
    })
  })

  describe('getUser', () => {
    it('should return a user', async () => {
      const userArgs: Partial<User> = { email: 'test@example.com' }
      const user = { email: 'test@example.com', username: 'testuser' } as User

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user)

      const result = await userService.getUser(userArgs)

      expect(userRepository.findOne).toHaveBeenCalledWith(userArgs)
      expect(result).toEqual(user)
    })
  })
})
