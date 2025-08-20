import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        role: 'CONSUMER',
        status: 'ACTIVE',
        preferences: {},
      },
    });
    return { user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user.id, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async generateTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId: string, refreshToken: string) {
    // MVP: store in user.preferences.refreshToken
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          ...(await this.getPreferences(userId)),
          refreshToken,
        },
      },
    });
  }

  async getPreferences(userId: string): Promise<Record<string, any>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.preferences) return {};
    return user.preferences as Record<string, any>;
  }

  async getStoredRefreshToken(userId: string): Promise<string | null> {
    const prefs = await this.getPreferences(userId);
    return prefs && prefs.refreshToken ? prefs.refreshToken : null;
  }

  async verifyRefreshToken(refreshToken: string): Promise<User> {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    const stored = await this.getStoredRefreshToken(user.id);
    if (stored !== refreshToken) throw new UnauthorizedException('Token mismatch');
    return user;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          ...(await this.getPreferences(userId)),
          refreshToken: null,
        },
      },
    });
  }
}