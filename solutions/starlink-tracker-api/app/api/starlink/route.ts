import { getStarlink } from '../../../lib/handler'
import { paidStarlinkRequest } from '../../../lib/payment'

export const GET = paidStarlinkRequest(getStarlink)
