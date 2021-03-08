import { rest } from 'msw'
import { UserForm, NewUser } from '../Signup'

export const handlers = [

	rest.post<UserForm, NewUser>('/signup', (req, res, ctx) => {
		return res(ctx.json({ ...req.body, token: "wow" }))
	})

]