/*
 *
 * Copyright (c) 2017 Matheus Medeiros Sarmento
 *
 */
const dispatcherProtocol = require('dispatcher-protocol');
const processManager = require('./task_manager');

const { Command } = dispatcherProtocol.pdu;
const { WorkerState } = dispatcherProtocol.common;

const State = {
  EXECUTING: WorkerState.EXECUTING,
  PAUSED: WorkerState.PAUSED
};

let state = WorkerState.EXECUTING;

function handleCommand(command) {
  switch (command) {
    case Command.PAUSE:
      if (state === WorkerState.Paused) {
        return;
      }

      state = WorkerState.PAUSED;
      processManager.killAll();
      break;

    case Command.RESUME:
      if (state === WorkerState.Executing) {
        return;
      }

      state = WorkerState.EXECUTING;
      break;

    case Command.STOP:
      processManager.killAll();
      process.exit();
      break;

    default:
  }
}

function getCurrentState() {
  return state;
}

module.exports = {
  handleCommand,
  getCurrentState,
  State
};
