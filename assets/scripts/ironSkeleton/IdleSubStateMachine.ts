import State from '../base/State';
import { StateMachine } from '../base/StateMachine';
import { SubStateMachine } from '../base/SubStateMachine';
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM } from '../enums/index';
import { AnimationClip } from 'cc';
import { DirectionSubStateMachine } from '../base/DirectionSubStateMachine';

const BASE_URL = 'texture/ironskeleton/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Loop))
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Loop))
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Loop))
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Loop))
    }
}