import { _decorator, } from 'cc';
import State from '../base/State';
import { StateMachine } from './StateMachine';

export abstract class SubStateMachine {
    private _curState: State = null
    stateMachines: Map<string, State> = new Map()

    constructor(public fsm: StateMachine) { }

    get curState(): State {
        return this._curState
    }

    set curState(value: State) {
        this._curState = value
        this._curState.run()
    }

    abstract run(): void
}

