import { InMemoryRepository } from '@akdasa-studios/framework'
import { SyncRepository } from '@akdasa-studios/framework-sync'
import { Application, Repositories } from '@lib/app/Application'
import { InboxCard, ReviewCard, Verse, VerseStatus } from '@lib/models'


export class Context {
  private _repositories: Repositories
  private _app: Application

  constructor() {
    this._repositories = new Repositories(
      new InMemoryRepository<Verse>(),
      new InMemoryRepository<VerseStatus>(),
      new SyncRepository(new InMemoryRepository<InboxCard>()),
      new InMemoryRepository<ReviewCard>()
    )
    this._app = new Application(this._repositories)
  }

  get app() : Application {
    return this._app
  }

  get processor() { return this._app.processor }
  get timeMachine() { return this._app.timeMachine }
  get library() { return this._app.library }
  get settings() { return this._app.settings }
  get inboxDeck() { return this._app.inboxDeck }
  get reviewDeck() { return this._app.reviewDeck }

  async findVerse(verseNumber: string) {
    const verse = await this._app.library.getByNumber(this._app.settings.language, verseNumber)
    if (verse.isFailure) { throw new Error(verse.error) }
    return verse.value
  }
}

export class ContextManagement {
  private _contexts: { [key: string]: Context } = {}
  private _active = 'default'

  getContext(name: string) : Context {
    if (this._contexts[name] === undefined) {
      this._contexts[name] = new Context()
    }
    return this._contexts[name]
  }

  switchTo(name: string) {
    this._active = name
  }

  get allContextNames() : string[] {
    return Object.keys(this._contexts)
  }

  get $() : Context {
    return this.getContext(this._active)
  }
}

export let contexts: ContextManagement = new ContextManagement()
export function newContext() {
  contexts = new ContextManagement()
}