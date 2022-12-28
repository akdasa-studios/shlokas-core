import { InMemoryRepository } from '@akdasa-studios/framework'
import { Application, Repositories } from '@lib/app/Application'
import { Verse, VerseStatus, InboxCard } from '@lib/models'


export class Context {
  private _repositories: Repositories
  private _app: Application

  constructor() {
    this._repositories = new Repositories(
      new InMemoryRepository<Verse>(),
      new InMemoryRepository<VerseStatus>(),
      new InMemoryRepository<InboxCard>()
    )
    this._app = new Application(this._repositories)
  }

  get app() : Application {
    return this._app
  }

  async findVerse(verseNumber: string) {
    const verse = await this._app.library.getByNumber(context.app.settings.language, verseNumber)
    if (verse.isFailure) { throw new Error(verse.error) }
    return verse.value
  }
}

export let context: Context = new Context()
export function newContext() {
  context = new Context()
}