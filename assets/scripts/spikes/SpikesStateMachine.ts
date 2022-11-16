import { _decorator, Component, Node, AnimationClip, Animation, SpriteFrame } from 'cc';
import State from '../base/State';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM } from '../enums/index';
import { getInitParamsTrigger, StateMachine, getInitParamsNumber } from '../base/StateMachine';
import { EntityManager } from '../base/EntityManager';
import SpikesOneSubStateMachine from './SpikesOneSubStateMachine';
import SpikesTwoSubStateMachine from './SpikesTwoSubStateMachine';
import SpikesThreeSubStateMachine from './SpikesThreeSubStateMachine';
import SpikesFourSubStateMachine from './SpikesFourSubStateMachine';
import { SpikesManager } from './SpikesManager';
const { ccclass, property } = _decorator;

@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.addComponent(Animation)
        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParams() {
        this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
        this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
    }

    initStateMachine() {
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubStateMachine(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesTwoSubStateMachine(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubStateMachine(this))
        this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubStateMachine(this))
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
            if (value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikesone/two') ||
                value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO && name.includes('spikesone/three') ||
                value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE && name.includes('spikesone/four') ||
                value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR && name.includes('spikesone/five')
            ) {
                this.node.getComponent(SpikesManager).backZero()
            }
            // const whiteList = ['attack']
            // if (whiteList.some(v => name.includes(v))) {
            //     this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
            // }
        })
    }

    run() {
        const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
        switch (this.curState) {
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE):
            case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR):
                if (value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE) {
                    this.curState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
                } else if (value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO) {
                    this.curState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_TWO)
                } else if (value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE) {
                    this.curState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_THREE)
                } else if (value == SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR) {
                    this.curState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_FOUR)
                } else {
                    this.curState = this.curState
                }
                break
            default: ENTITY_TYPE_ENUM
                this.curState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
        }
    }
}

