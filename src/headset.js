/*
 * Headset
 * ********
 *
 * This example shows the different headset-related APIs, including listing
 * headsets, getting headset information, querying headsets, and checking
 * headset battery level and signal/contact quality.
 *
 */

const Cortex = require('../lib/cortex')

if (require.main === module) {
  process.on('unhandledRejection', (err) => { throw err })

  const verbose = process.env.LOG_LEVEL
  const args = process.argv.slice(2)
  const cmd = args.shift()

  const USAGE =
`Usage: node headset.js list
       node headset.js show [headsetid]
       node headset.js status [headsetid]
       node headset.js update <headsetid> <setting=value> [setting=value...]

       Updating settings can only be done via USB cable. You must turn the
       headset on before plugging in the cable. Make sure no other dongles are
       attached.
`

  class UsageError extends Error {}

  if (!cmd) {
    console.warn(USAGE)
    process.exit(1)
  }

  const client = new Cortex({verbose})
  client.ready
  .init()
  // .then(() => new Promise((resolve) => setTimeout(resolve, 2000)))
  .then(() => {
    switch (cmd) {
      case 'list': {
        return client
          .queryHeadsets()
          .then(headsets => {
            if (headsets.length) {
              console.log('Headsets:')
              for (const headset of headsets) {
                console.log(`   ${headset.id} [${headset.status}]`)
              }
            } else {
              console.log('No headsets')
            }
          })
      }

      case 'show': {
        const [id] = args

        return client
          .queryHeadsets({id})
          .then(headsets => {
            const headset = headsets[0]
            if (!headset) throw new Error('Headset not found')

            const len = headset.id.length

            console.log('='.repeat(len))
            console.log(headset.id)
            console.log('='.repeat(len))
            console.log()

            console.log('Info')
            console.log('-'.repeat(len))
            for (const k of Object.keys(headset)) {
              const v = headset[k]
              if (!v || ['id', 'settings'].indexOf(k) > -1) continue
              console.log(`${k}: ${v}`)
            }
            console.log()

            console.log('Settings')
            console.log('-'.repeat(len))
            for (const k of Object.keys(headset.settings)) {
              const v = headset.settings[k]
              console.log(`${k}=${v}`)
            }
          })
      }

      case 'update': {
        const id = args.shift()
        if (!id) throw new UsageError('No headset id specified')
        if (args.length < 1) throw new UsageError('No settings specified')

        const settings = {}
        for (const arg of args) {
          const match = arg.match(/^(\w+)=(\w+)$/)
          if (!match) throw new Error(`Invalid setting: ${arg}`)
          const k = match[1]
          const v = +match[2] ? +match[2] : match[2]

          settings[k] = v
        }
        return client
          .updateHeadset({headset: id, setting: settings})
          .then(() => console.log('Update succeeded!'))
      }

      case 'status': {
        const [headset] = args

        return client
          .createSession({status: 'open', headset})
          .subscribe({streams: ['dev']})
          .then(subs => {
            if (!subs[0].dev) throw new Error("Couldn't subscribe to device stream")
            const cols = subs[0].dev.cols

            client.on('dev', ({dev}) => {
              const out = []
              for (let i = 0; i < cols.length; i++) {
                const subcols = Array.isArray(cols[i]) ? cols[i] : [cols[i]]
                const subdev = Array.isArray(dev[i]) ? dev[i] : [dev[i]]
                for (let j = 0; j < subcols.length; j++) {
                  out.push(`${subcols[j].replace(/^.*_/, '')}: ${subdev[j]}`)
                }
              }
              console.log(out.join(', '))
            })
            return new Promise(() => {})
          })
      }

      default:
        throw new UsageError(`Unknown command: ${cmd}`)
    }
  })
  .catch(err => {
    console.warn(`Error: ${err.message}`)
    if (err instanceof UsageError) {
      console.warn()
      console.warn(USAGE)
    }
    process.exitCode = 1
  })
  .close()
}
