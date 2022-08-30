import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ResponseMessage } from '../../shared/constants/ResponseMessage';
import { User } from '../../entities/user.entity';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  /**
   * @description createUserToken will create JWT Token for user
   * @param walletAddress
   * @param User
   * @returns it will return user details with JWT Token
   * @author Ritwik Rohitashwa
   */
  async createUserToken(email: string, user: User): Promise<any> {
    const bufferObj = Buffer.from('user', 'utf8');
    const base64String = bufferObj.toString('base64');

    const payload: JwtPayload = {
      email,
      id: user.id,
      data: base64String
    };

    const validity = process.env.JWT_TOKEN_VALIDITY;

    if (user.is_banned)
      return {
        message: ResponseMessage.USER_BANNED
      };

    if (user.is_blocked)
      return {
        message: ResponseMessage.USER_BLOCKED
      };

    // generates access token just for completing verification
    if (!user.is_email_verified)
      return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: `${validity}`
        }),
        message: ResponseMessage.EMAIL_NOT_VERIFIED
      };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: `${validity}`
      })
    };
  }
}
