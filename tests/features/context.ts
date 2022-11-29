import { Application } from '@lib/Application'


export class Context {
  private _app = new Application()
  get app() {
    return this._app
  }
}

export const context = new Context()