import { rest } from 'msw'
import { SignupForm, User } from '../User'

export const handlers = [

	rest.post<SignupForm, User>('/signup', (req, res, ctx) => {
		console.debug(req.body)
		const user: User = {
			token: "wow",
			fullName: req.body.fullName,
			email: req.body.email,
		}
		return res(ctx.json(user))
	})

]