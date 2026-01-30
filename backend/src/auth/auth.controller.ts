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
  constructor(private authService: AuthService) {}

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
    // 🔍 TÄMÄ LOGI ON KRIITTINEN – älä poista vielä
    console.log('LOGIN BODY (controller):', body);

    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
