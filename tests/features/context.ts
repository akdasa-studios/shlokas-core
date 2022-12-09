import { InMemoryRepository, Repository } from '@akdasa-studios/framework'
import { Application } from '@lib/app/Application'
import { Verse } from '@lib/models'



export class Context {
  private _versesRepository: Repository<Verse>
  private _app: Application

  constructor() {
    this._versesRepository = new InMemoryRepository<Verse>()
    this._app = new Application(this._versesRepository)
  }

  get app() : Application {
    return this._app
  }
}

export let context: Context = new Context()
export function newContext() {
  context = new Context()
}