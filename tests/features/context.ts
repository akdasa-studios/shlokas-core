import { InMemoryRepository } from '@akdasa-studios/framework'
import { Application, Repositories } from '@lib/app/Application'
import { Verse, VerseStatus } from '@lib/models'


export class Context {
  private _repositories: Repositories
  private _app: Application

  constructor() {
    this._repositories = new Repositories(
      new InMemoryRepository<Verse>(),
      new InMemoryRepository<VerseStatus>()
    )
    this._app = new Application(this._repositories)
  }

  get app() : Application {
    return this._app
  }
}

export let context: Context = new Context()
export function newContext() {
  context = new Context()
}