import { Application } from '@lib/app/Application'
import { Context } from '@lib/app/Context'
import { createApplication, createContext } from '@tests/env'


describe('App Context', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  let app: Application
  let secondContext: Context

  beforeEach(() => {
    app = createApplication()
    secondContext = createContext('second')
  })


  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.changeContext', () => {
    it('adds translation and text cards to the inbox deck', () => {
      app.changeContext(secondContext)
      expect(app.context.name).toEqual('second')
    })
  })

})