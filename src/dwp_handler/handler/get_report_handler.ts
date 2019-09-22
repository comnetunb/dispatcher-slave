import { GetReport, Report, ProtocolType, EncapsulatePDU } from "dispatcher-protocol";
import * as resource from '../../resource';
import * as Config from '../../configuration';
import * as stateManager from './../../manager/state_manager';
import * as taskManager from './../../manager/task_manager';
import * as languageManager from './../../manager/language_manager';
import * as net from 'net';

const configuration = Config.getConfiguration();

export async function execute(pdu: GetReport, socket: net.Socket): Promise<void> {
  const response: Report = {
    type: ProtocolType.Report,
  };

  if (pdu.resources) {
    response.resources = {
      cpu: 1 - (await resource.getCpuUsageAsync()),
      memory: resource.getAvailableMemory(),
    };
  }

  if (pdu.state) {
    response.state = {
      state: stateManager.getCurrentState(),
    };
  }

  if (pdu.tasks) {
    response.tasks = {
      tasks: taskManager.getTasks(),
    };
  }

  if (pdu.alias) {
    response.alias = configuration.alias;
  }

  if (pdu.supportedLanguages) {
    response.languages = {
      languages: languageManager.getSupportedLanguages(),
    }
  }

  socket.write(EncapsulatePDU(response));
};