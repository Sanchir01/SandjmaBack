import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuards implements CanActivate {
	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext()
		if (!ctx.req.cookies.refreshToken) {
			return false
		}
		ctx.user = await this.validateToken(ctx.req.cookies.refreshToken)
		const user = ctx.user
		return user
	}

	async validateToken(auth: string) {
		try {
			return jwt.verify(auth, process.env.JWT_KEY)
		} catch (e) {
			throw new UnauthorizedException('Невалидный токен')
		}
	}
}
