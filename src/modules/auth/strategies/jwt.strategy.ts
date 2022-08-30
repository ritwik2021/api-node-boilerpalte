import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { Constants } from '../../../shared/constants/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  /**
   * Validating payload
   * @param payload
   * @returns admin
   * @author Ritwik Rohitashwa
   */
  async validate(payload: any): Promise<any> {
    const bufferObj = Buffer.from(payload.data, 'base64');
    const decodedString = bufferObj.toString('utf8');

    if (decodedString === Constants.USER) {
      const user = await this.userRepository.findOne({
        where: { email: payload.email }
      });
      if (!user) {
        throw new UnauthorizedException('Unauthorized');
      }
      if (user.is_blocked || user.is_banned) return null;

      return {
        email: payload.email,
        userId: payload.id,
        data: decodedString
      };
    } else if (decodedString === Constants.ADMIN) {
      return {
        username: payload.sub,
        data: decodedString
      };
    }
  }
}
