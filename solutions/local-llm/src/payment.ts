import { Store } from 'mppx'
import { resolveAccount } from 'mppx/cli'
import { Mppx, tempo } from 'mppx/hono'

const MODERATO_CHAIN_ID = 42431
const PATH_USD = '0x20c0000000000000000000000000000000000000'
const WORKSHOP_SECRET_KEY = 'mpp-irl-public-workshop-secret-key-2026'

const account = await resolveAccount(
  process.env.MPPX_SELLER_ACCOUNT || 'seller',
)

function secretKey() {
  return process.env.MPP_SECRET_KEY || WORKSHOP_SECRET_KEY
}

export const mppx = Mppx.create({
  secretKey: secretKey(),
  methods: [
    tempo.session({
      account,
      chainId: MODERATO_CHAIN_ID,
      currency: PATH_USD,
      store: Store.memory(),
    }),
  ],
})

export const paidCompletion = mppx.session({
  amount: '0.001',
  unitType: 'completion',
})
