const { app } = require('hyperapp');
const freeze = require('./');

const mutatingApp = assert => ({
  state: {
    counter: 0,
    canDelete: false,
    child: {
      isFrozen: true,
      canDelete: false
    }
  },
  actions: {
    inc(state) {
      state.counter++;
      state.canAdd = true;
      delete state.canDelete;

      state.child.isFrozen = false;
      state.child.canAdd = true;
      delete state.child.canDelete;
    }
  },
  events: {
    load(state, actions) {
      actions.inc();
      assert(state);
    }
  }
});

it('is needed because Hyperapp allows state mutations', done => {
  app(
    mutatingApp(state => {
      expect(state).toEqual({
        counter: 1,
        canAdd: true,
        child: {
          isFrozen: false,
          canAdd: true
        }
      });
      done();
    })
  );
});

it('prevents Hyperapp state mutations when added as a mixin', done => {
  app(
    Object.assign(
      mutatingApp(state => {
        expect(state).toEqual({
          counter: 0,
          canDelete: false,
          child: {
            isFrozen: true,
            canDelete: false
          }
        });
        done();
      }),
      { mixins: [freeze] }
    )
  );
});
