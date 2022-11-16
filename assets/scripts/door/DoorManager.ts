import { _decorator } from 'cc'
import { EVENT_ENUM, PLAYER_CTRL_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../enums/index';
import EventManager from '../runtime/EventManager';
import { EntityManager } from '../base/EntityManager';
import DataManager from '../runtime/DataManager';
import { DoorStateMachine } from './DoorStateMachine';
import { IEntity } from '../levels/index';
const { ccclass, property } = _decorator

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(DoorStateMachine)
        await this.fsm.init()

        super.init(params)

        EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
    }

    onDestroy() {
        super.onDestroy()
        EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen)
    }

    onOpen() {
        if (DataManager.Instance.enemies.every(v => v.state == ENTITY_STATE_ENUM.DEATH) && this.state != ENTITY_STATE_ENUM.DEATH) {
            this.state = ENTITY_STATE_ENUM.DEATH
        }
    }
}

