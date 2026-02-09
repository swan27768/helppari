import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      firstName: string;
      email: string;
      password: string;
      postalCode: string;
    },
  ) {
    return this.authService.register(
      body.firstName,
      body.email,
      body.password,
      body.postalCode,
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // 🔍 DEBUG – voit poistaa myöhemmin
    console.log('LOGIN BODY (controller):', body);

    return this.authService.login(body.email, body.password);
  }

  /**
   * 🔑 GET /auth/me
   * Palauttaa JWT:stä puretun käyttäjän
   * (userId, email, role)
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
  }
}
