import { _decorator, } from 'cc';
import { SubStateMachine } from './SubStateMachine';
import { PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM } from '../enums/index';

export abstract class DirectionSubStateMachine extends SubStateMachine {
    run() {
        const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION)
        this.curState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    }
}

