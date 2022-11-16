import State from '../base/State';
import { PARAMS_NAME_ENUM, SPIKES_COUNT_MAP_NUMBER_ENUM } from '../enums/index';
import { SubStateMachine } from '../base/SubStateMachine';

export default class SpikesSubStateMachine extends SubStateMachine {
    run() {
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
        this.curState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number])
    }
}