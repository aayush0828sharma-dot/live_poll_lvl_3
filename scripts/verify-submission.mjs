import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const requiredFiles = [
  'poll_contract/Cargo.toml',
  'poll_contract/src/lib.rs',
  'src/lib/stellar.js',
  'public/contracts/poll_contract.wasm',
]

const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)

const problems = requiredFiles.filter(
  (file) => !existsSync(file) || !trackedFiles.includes(file),
)

if (trackedFiles.some((file) => file.startsWith('poll_contract/target/'))) {
  problems.push('poll_contract/target/ is tracked; remove compiled Rust build output from Git.')
}

if (problems.length > 0) {
  console.error('Submission evidence check failed:')
  for (const problem of problems) console.error(`- ${problem}`)
  process.exit(1)
}

console.log('Submission evidence check passed.')
