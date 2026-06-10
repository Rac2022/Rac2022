import { useState } from 'react'
import { THESIS } from '../lib/copy'
import { Button } from '../components/ui'

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [screen, setScreen] = useState(0)
  const [signed, setSigned] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col bg-paper px-6 py-10">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="flex items-center justify-between">
          <span className="font-mono text-caption tracking-[0.12em] text-soft uppercase">
            The Failure Log · {screen + 1}/3
          </span>
          <button
            onClick={onDone}
            className="font-mono text-caption text-soft underline decoration-rule underline-offset-4 hover:text-ink"
          >
            Skip
          </button>
        </div>

        {screen === 0 && (
          <div className="flex flex-1 flex-col justify-center gap-6">
            <h1 className="font-display text-display text-red">{THESIS}</h1>
            <p className="text-lede text-soft">
              This is a ledger of attempts. One honest entry a day — what you tried, how it missed.
            </p>
            <div>
              <Button variant="primary" onClick={() => setScreen(1)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {screen === 1 && (
          <div className="flex flex-1 flex-col justify-center gap-8">
            <h1 className="font-display text-h2">How it works</h1>
            <ol className="flex flex-col gap-6">
              {[
                ['01', 'Log one failure daily', 'The attempt, the miss, the lesson. Ninety seconds.'],
                ['02', 'Tag what kind it was', 'Rejection, execution, judgment, courage. Stakes too.'],
                ['03', 'Watch your calibration improve', 'The ledger shows whether the shots are getting bigger.'],
              ].map(([num, head, body]) => (
                <li key={num} className="flex gap-4 border-l-2 border-red pl-4">
                  <span className="font-mono text-caption text-red">{num}</span>
                  <span>
                    <span className="block font-display text-h3">{head}</span>
                    <span className="mt-1 block text-small text-soft">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div>
              <Button variant="primary" onClick={() => setScreen(2)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {screen === 2 && (
          <div className="flex flex-1 flex-col justify-center gap-8">
            <h1 className="font-display text-h2">The contract</h1>
            <p className="text-lede text-soft">
              The ledger is only worth what goes into it. No spin, no rounding up, no flattering
              categories.
            </p>
            <label className="flex cursor-pointer items-start gap-3 border border-rule bg-card px-4 py-4">
              <input
                type="checkbox"
                checked={signed}
                onChange={(e) => setSigned(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#b3382c]"
              />
              <span className="text-base">I'll be honest with this thing.</span>
            </label>
            <div>
              <Button variant="primary" disabled={!signed} onClick={onDone}>
                Open the ledger
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
