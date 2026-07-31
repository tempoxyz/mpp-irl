import { Mppx, tempo } from 'mppx/nextjs'
import { isAddress, type Address } from 'viem'

const PATH_USD = '0x20c0000000000000000000000000000000000000'
const WORKSHOP_SECRET_KEY = 'mpp-irl-public-workshop-secret-key-2026'

function recipientAddress(): Address {
  const address = process.env.RECIPIENT_ADDRESS
  if (address && isAddress(address)) return address
  if (process.env.NODE_ENV === 'test') {
    return '0x0000000000000000000000000000000000000001'
  }
  throw new Error('RECIPIENT_ADDRESS must be a valid Tempo address')
}

function secretKey() {
  return process.env.MPP_SECRET_KEY || WORKSHOP_SECRET_KEY
}

export const mppx = Mppx.create({
  secretKey: secretKey(),
  methods: [
    tempo.charge({
      currency: PATH_USD,
      recipient: recipientAddress(),
      testnet: true,
    }),
  ],
})

export const paidContent = mppx.charge({
  amount: '0.01',
  description: 'Download the MPP agent runtimes article',
})
