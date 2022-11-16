import Singleton from '../base/Singleton';

interface IItem {
    f: Function
    ctx: unknown
}

export default class EventManager extends Singleton {
    static get Instance() {
        return super.GetInstance<EventManager>()
    }

    private eventDic: Map<string, Array<IItem>> = new Map()

    on(eventName: string, f: Function, ctx?: unknown) {
        if (!this.eventDic.has(eventName)) {
            this.eventDic.set(eventName, [{ f, ctx }])
            return
        }
        this.eventDic.get(eventName).push({ f, ctx })
    }

    off(eventName: string, f: Function) {
        if (!this.eventDic.has(eventName)) {
            return
        }
        const index = this.eventDic.get(eventName).findIndex(i => i.f === f)
        if (index > -1) {
            this.eventDic.get(eventName).splice(index, 1)
        }
    }

    emit(eventName: string, ...args: unknown[]) {
        if (!this.eventDic.has(eventName)) {
            return
        }
        this.eventDic.get(eventName).forEach(({ f, ctx }) => {
            if (ctx) {
                f.apply(ctx, args)
            } else {
                f(...args)
            }
        })
    }

    clear() {
        this.eventDic.clear()
    }
}
