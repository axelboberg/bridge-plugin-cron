const cron = require('cron')

const bridge = require('bridge')

const CHECK_INTERVAL_MS = 1000

const ITEM_TYPES = {
  trigger: 'bridge.plugin.cron.trigger'
}

/**
 * Keep track of all registered tasks
 */
const tasks = new Map()

function playItem (id) {
  if (!id) {
    return
  }
  try {
    bridge.items.playItem(id)
  } catch (_) {
    console.log('Failed to play item')
  }
}

/**
 * Loop through all tasks and check if they're supposed
 * to be executed within the next cycle, if so, execute them
 */
function checkTasks () {
  for (const task of tasks.values()) {
    const validation = cron.validateCronExpression(task.expression)
    if (!validation.valid) {
      continue
    }

    const nextEvalInMS = cron.timeout(task.expression)
    if (nextEvalInMS <= CHECK_INTERVAL_MS) {
      playItem(task?.target)
    }
  }
}

const ival = setInterval(() => checkTasks(), CHECK_INTERVAL_MS)

exports.activate = () => {
  /*
   * Add / update tasks
   * for played items
   */
  bridge.events.on('item.play', item => {
    if (item.type !== ITEM_TYPES.trigger) {
      return
    }
    tasks.set(item.id, {
      expression: item?.data?.cron?.expression,
      target: item?.data?.cron?.target
    })
  })

  /*
   * Remove any tasks related
   * to stopped items
   */
  bridge.events.on('item.stop', item => {
    if (item.type !== ITEM_TYPES.trigger) {
      return
    }
    tasks.delete(item.id)
  })
}

exports.deactivate = () => {
  clearInterval(ival)
}
