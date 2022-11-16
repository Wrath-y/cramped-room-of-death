import { _decorator, Component, Node, AnimationClip, Animation, SpriteFrame } from 'cc';
import State from '../base/State';
import { FSM_PARAMS_TYPE_ENUM } from '../enums/index';
import { SubStateMachine } from './SubStateMachine';
const { ccclass, property } = _decorator;

type ParamsValue = boolean | number

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM,
    value: ParamsValue,
}

export const getInitParamsTrigger = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
        value: false,
    }
}

export const getInitParamsNumber = () => {
    return {
        type: FSM_PARAMS_TYPE_ENUM.NUMBER,
        value: 0,
    }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
    private _curState: State | SubStateMachine = null
    params: Map<string, IParamsValue> = new Map()
    stateMachines: Map<string, State | SubStateMachine> = new Map()
    animationComponent: Animation
    waitingList: Array<Promise<SpriteFrame[]>> = []

    getParams(name: string): ParamsValue {
        if (this.params.has(name)) {
            return this.params.get(name).value
        }
    }

    setParams(name: string, value: ParamsValue) {
        if (this.params.has(name)) {
            this.params.get(name).value = value
            this.run()
            this.resetAniTrigger()
        }
    }

    get curState(): State | SubStateMachine {
        return this._curState
    }

    set curState(value: State | SubStateMachine) {
        this._curState = value
        this._curState.run()
    }

    resetAniTrigger() {
        for (const [_, v] of this.params) {
            if (v.type == FSM_PARAMS_TYPE_ENUM.TRIGGER) {
                v.value = false
            }
        }
    }

    abstract init(): void
    abstract run(): void
}

