import { ITile } from "../levels";
import Singleton from '../base/Singleton';
import { TileManager } from '../map/TileManager';
import { PlayerManager } from '../player/PlayerManager';
import { DoorManager } from '../door/DoorManager';
import { EnemyManager } from '../base/EnemyManager';
import { BurstManager } from '../burst/BurstManager';
import { SpikesManager } from '../spikes/SpikesManager';

export default class DataManager extends Singleton {
    static get Instance() {
        return super.GetInstance<DataManager>();
    }

    mapInfo: Array<Array<ITile>>
    tileInfo: Array<Array<TileManager>>
    mapRowNumber: number
    mapColNumber: number
    levelIndex: number = 1
    player: PlayerManager
    door: DoorManager
    bursts: BurstManager[]
    spikes: SpikesManager[]
    enemies: EnemyManager[]

    reset() {
        this.mapInfo = []
        this.tileInfo = []
        this.player = null
        this.enemies = []
        this.bursts = []
        this.spikes = []
        this.door = null
        this.mapRowNumber = this.mapColNumber = 0
    }
}
