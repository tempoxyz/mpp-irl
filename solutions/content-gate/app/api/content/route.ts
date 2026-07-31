import { getContent } from '../../../lib/content'
import { paidContent } from '../../../lib/payment'

export const GET = paidContent(getContent)
