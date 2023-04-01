import * as dayjs from 'dayjs'


export class TimeMachine {
  private _now: Date | undefined

  get now(): Date {
    return this._now || new Date()
  }

  get today(): Date {
    return dayjs(this.now).startOf('date').toDate()
  }

  add(date: Date, value: number, unit: 's'|'m'|'h') {
    return dayjs(date).add(value, unit).toDate()
  }

  set(to: Date) {
    this._now = to
  }
}
