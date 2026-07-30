import crypto from 'node:crypto'

import { Store } from 'mppx'
import { resolveAccount } from 'mppx/cli'
import { Mppx, tempo } from 'mppx/nextjs'

const MODERATO_CHAIN_ID = 42431
const PATH_USD = '0x20c0000000000000000000000000000000000000'

type RouteHandler = (request: Request) => Promise<Response> | Response

async function createMppx() {
  const account = await resolveAccount(process.env.MPPX_SELLER_ACCOUNT || 'seller')

  return Mppx.create({
    secretKey: process.env.MPP_SECRET_KEY || crypto.randomBytes(32).toString('base64url'),
    methods: [
      tempo.session({
        account,
        chainId: MODERATO_CHAIN_ID,
        currency: PATH_USD,
        store: Store.memory(),
      }),
    ],
  })
}

let mppxPromise: ReturnType<typeof createMppx> | undefined

function getMppx() {
  mppxPromise ??= createMppx()
  return mppxPromise
}

export function paidCompletion(handler: RouteHandler): RouteHandler {
  return async (request) => {
    const mppx = await getMppx()
    return mppx.session({
      amount: '0.001',
      unitType: 'completion',
    })(handler)(request)
  }
}
