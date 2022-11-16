import { _decorator, Component, Node, AnimationClip, Animation, SpriteFrame } from 'cc';
import State from '../base/State';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM, ENTITY_STATE_ENUM } from '../enums/index';
import { getInitParamsTrigger, StateMachine, getInitParamsNumber } from '../base/StateMachine';
import { EntityManager } from '../base/EntityManager';
const { ccclass, property } = _decorator;

const BASE_URL = 'texture/burst'
@ccclass('DoorStateMachine')
export class BurstStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.addComponent(Animation)
        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
        this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }

    initStateMachine() {
        this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, `${BASE_URL}/idle`))
        this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new State(this, `${BASE_URL}/attack`))
        this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new State(this, `${BASE_URL}/death`))
    }

    initAnimationEvent() {
    }

    run() {
        switch (this.curState) {
            case this.stateMachines.get(PARAMS_NAME_ENUM.DEATH):
            case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
            case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
                if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
                    this.curState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
                } else if (this.params.get(PARAMS_NAME_ENUM.DEATH).value) {
                    this.curState = this.stateMachines.get(PARAMS_NAME_ENUM.DEATH)
                } else if (this.params.get(PARAMS_NAME_ENUM.ATTACK).value) {
                    this.curState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
                } else {
                    this.curState = this.curState
                }
                break
            default:
                this.curState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        }
    }
}

