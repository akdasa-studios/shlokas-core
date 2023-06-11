import { SearchOptions } from './../../lib/app/Library'
import { InMemoryRepository } from '@akdasa-studios/framework'
import { SyncRepository } from '@akdasa-studios/framework-sync'
import { Context, Repositories, TimeMachine } from '@lib/app'
import { Application } from '@lib/app/Application'
import { Declamation, InboxCard, Language, ReviewCard, Verse, VerseImage, VerseStatus } from '@lib/models'


export class TestContext {
  private _repositories: Repositories
  private _app: Application

  constructor() {
    this._repositories = new Repositories(
      new InMemoryRepository<Verse>(),
      new InMemoryRepository<VerseImage>(),
      new InMemoryRepository<Declamation>(),
      new SyncRepository(new InMemoryRepository<VerseStatus>()),
      new SyncRepository(new InMemoryRepository<InboxCard>()),
      new SyncRepository(new InMemoryRepository<ReviewCard>())
    )
    this._app = new Application(
      new Context('test', new TimeMachine(), this._repositories)
    )
  }

  get app() : Application {
    return this._app
  }

  get processor() { return this._app.processor }
  get timeMachine() { return this._app.timeMachine }
  get library() { return this._app.library }
  get inboxDeck() { return this._app.inboxDeck }
  get reviewDeck() { return this._app.reviewDeck }

  async findVerse(verseNumber: string, options: SearchOptions = {}) {
    const verse = await this._app.library.getByNumber(verseNumber, options)
    if (!verse) { throw new Error('Not found') }
    return verse
  }
}

export class ContextManagement {
  private _contexts: { [key: string]: TestContext } = {}
  private _active = 'default'

  getContext(name: string) : TestContext {
    if (this._contexts[name] === undefined) {
      this._contexts[name] = new TestContext()
    }
    return this._contexts[name]
  }

  switchTo(name: string) {
    this._active = name
  }

  get allContextNames() : string[] {
    return Object.keys(this._contexts)
  }

  get $() : TestContext {
    return this.getContext(this._active)
  }
}

export let contexts: ContextManagement = new ContextManagement()
export function newContext() {
  contexts = new ContextManagement()
}
export function getContext(name = 'default') { return contexts.getContext(name || 'default') }