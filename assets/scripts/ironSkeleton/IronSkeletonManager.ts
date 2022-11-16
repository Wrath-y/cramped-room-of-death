import { _decorator } from 'cc'
import { IronSkeletonStateMachine } from './IronSkeletonStateMachine';
import { IEntity } from '../levels/index';
import { EnemyManager } from '../base/EnemyManager';
const { ccclass, property } = _decorator

@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
    async init(params: IEntity) {
        this.fsm = this.addComponent(IronSkeletonStateMachine)
        await this.fsm.init()

        super.init(params)
    }
}

