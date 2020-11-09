(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports, require('react'), require('xstate'))
    : typeof define === 'function' && define.amd
    ? define(['exports', 'react', 'xstate'], factory)
    : ((global = global || self),
      factory((global['xstate-react'] = {}), global.React, global.xstate));
})(this, function (exports, React, xstate) {
  'use strict';

  function _extends() {
    _extends =
      Object.assign ||
      function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

    return _extends.apply(this, arguments);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === 'Object' && o.constructor) n = o.constructor.name;
    if (n === 'Map' || n === 'Set') return Array.from(o);
    if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it;

    if (typeof Symbol === 'undefined' || o[Symbol.iterator] == null) {
      if (
        Array.isArray(o) ||
        (it = _unsupportedIterableToArray(o)) ||
        (allowArrayLike && o && typeof o.length === 'number')
      ) {
        if (it) o = it;
        var i = 0;
        return function () {
          if (i >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i++]
          };
        };
      }

      throw new TypeError(
        'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
      );
    }

    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  var index = React.useLayoutEffect;

  function useConstant(fn) {
    var ref = React.useRef();

    if (!ref.current) {
      ref.current = {
        v: fn()
      };
    }

    return ref.current.v;
  }

  function partition(items, predicate) {
    var truthy = [],
      falsy = [];

    for (
      var _iterator = _createForOfIteratorHelperLoose(items), _step;
      !(_step = _iterator()).done;

    ) {
      var item = _step.value;

      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }

    return [truthy, falsy];
  }

  var ReactEffectType;

  (function (ReactEffectType) {
    ReactEffectType[(ReactEffectType['Effect'] = 1)] = 'Effect';
    ReactEffectType[(ReactEffectType['LayoutEffect'] = 2)] = 'LayoutEffect';
  })(ReactEffectType || (ReactEffectType = {}));

  function createReactActionFunction(exec, tag) {
    var effectExec = function effectExec() {
      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      // don't execute; just return
      return function () {
        return exec.apply(void 0, args);
      };
    };

    Object.defineProperties(effectExec, {
      name: {
        value: 'effect:' + exec.name
      },
      __effect: {
        value: tag
      }
    });
    return effectExec;
  }

  function asEffect(exec) {
    return createReactActionFunction(exec, ReactEffectType.Effect);
  }
  function asLayoutEffect(exec) {
    return createReactActionFunction(exec, ReactEffectType.LayoutEffect);
  }

  function executeEffect(action, state) {
    var exec = action.exec;
    var originalExec = exec(state.context, state._event.data, {
      action: action,
      state: state,
      _event: state._event
    });
    originalExec();
  }

  function useMachine(getMachine, options) {
    if (options === void 0) {
      options = {};
    }

    var machine = useConstant(function () {
      return typeof getMachine === 'function' ? getMachine() : getMachine;
    });

    if (typeof getMachine !== 'function') {
      var _useState = React.useState(machine),
        initialMachine = _useState[0];

      if (machine !== initialMachine) {
        console.warn(
          'Machine given to `useMachine` has changed between renders. This is not supported and might lead to unexpected results.\n' +
            'Please make sure that you pass the same Machine as argument each time.'
        );
      }
    }

    var _options = options,
      context = _options.context,
      guards = _options.guards,
      actions = _options.actions,
      activities = _options.activities,
      services = _options.services,
      delays = _options.delays,
      rehydratedState = _options.state,
      interpreterOptions = _objectWithoutPropertiesLoose(_options, [
        'context',
        'guards',
        'actions',
        'activities',
        'services',
        'delays',
        'state'
      ]);

    var _useConstant = useConstant(function () {
        var machineConfig = {
          context: context,
          guards: guards,
          actions: actions,
          activities: activities,
          services: services,
          delays: delays
        };
        var machineWithConfig = machine.withConfig(
          machineConfig,
          _extends({}, machine.context, context)
        );
        return [
          machineWithConfig,
          xstate.interpret(
            machineWithConfig,
            _extends(
              {
                deferEvents: true
              },
              interpreterOptions
            )
          )
        ];
      }),
      resolvedMachine = _useConstant[0],
      service = _useConstant[1];

    var _useState2 = React.useState(function () {
        // Always read the initial state to properly initialize the machine
        // https://github.com/davidkpiano/xstate/issues/1334
        var initialState = resolvedMachine.initialState;
        return rehydratedState
          ? xstate.State.create(rehydratedState)
          : initialState;
      }),
      state = _useState2[0],
      setState = _useState2[1];

    var effectActionsRef = React.useRef([]);
    var layoutEffectActionsRef = React.useRef([]);
    index(function () {
      service
        .onTransition(function (currentState) {
          // Only change the current state if:
          // - the incoming state is the "live" initial state (since it might have new actors)
          // - OR the incoming state actually changed.
          //
          // The "live" initial state will have .changed === undefined.
          var initialStateChanged =
            currentState.changed === undefined &&
            Object.keys(currentState.children).length;

          if (currentState.changed || initialStateChanged) {
            setState(currentState);
          }

          if (currentState.actions.length) {
            var _effectActionsRef$cur, _layoutEffectActionsR;

            var reactEffectActions = currentState.actions.filter(function (
              action
            ) {
              return (
                typeof action.exec === 'function' && '__effect' in action.exec
              );
            });

            var _partition = partition(reactEffectActions, function (action) {
                return action.exec.__effect === ReactEffectType.Effect;
              }),
              effectActions = _partition[0],
              layoutEffectActions = _partition[1];

            (_effectActionsRef$cur = effectActionsRef.current).push.apply(
              _effectActionsRef$cur,
              effectActions.map(function (effectAction) {
                return [effectAction, currentState];
              })
            );

            (_layoutEffectActionsR = layoutEffectActionsRef.current).push.apply(
              _layoutEffectActionsR,
              layoutEffectActions.map(function (layoutEffectAction) {
                return [layoutEffectAction, currentState];
              })
            );
          }
        })
        .start(
          rehydratedState ? xstate.State.create(rehydratedState) : undefined
        );
      return function () {
        service.stop();
      };
    }, []); // Make sure actions and services are kept updated when they change.
    // This mutation assignment is safe because the service instance is only used
    // in one place -- this hook's caller.

    React.useEffect(
      function () {
        Object.assign(service.machine.options.actions, actions);
      },
      [actions]
    );
    React.useEffect(
      function () {
        Object.assign(service.machine.options.services, services);
      },
      [services]
    ); // this is somewhat weird - this should always be flushed within useLayoutEffect
    // but we don't want to receive warnings about useLayoutEffect being used on the server
    // so we have to use `useIsomorphicLayoutEffect` to silence those warnings

    index(
      function () {
        while (layoutEffectActionsRef.current.length) {
          var _layoutEffectActionsR2 = layoutEffectActionsRef.current.shift(),
            layoutEffectAction = _layoutEffectActionsR2[0],
            effectState = _layoutEffectActionsR2[1];

          executeEffect(layoutEffectAction, effectState);
        }
      },
      [state]
    ); // https://github.com/davidkpiano/xstate/pull/1202#discussion_r429677773

    React.useEffect(
      function () {
        while (effectActionsRef.current.length) {
          var _effectActionsRef$cur2 = effectActionsRef.current.shift(),
            effectAction = _effectActionsRef$cur2[0],
            effectState = _effectActionsRef$cur2[1];

          executeEffect(effectAction, effectState);
        }
      },
      [state]
    );
    return [state, service.send, service];
  }

  function useActor(actorRef, getSnapshot) {
    if (getSnapshot === void 0) {
      getSnapshot = function getSnapshot(a) {
        return 'state' in a ? a.state : undefined;
      };
    }

    var actorRefRef = React.useRef(actorRef);
    var deferredEventsRef = React.useRef([]);

    var _useState = React.useState(function () {
        return getSnapshot(actorRef);
      }),
      current = _useState[0],
      setCurrent = _useState[1];

    var send = useConstant(function () {
      return function (event) {
        var currentActorRef = actorRefRef.current; // If the previous actor is a deferred actor,
        // queue the events so that they can be replayed
        // on the non-deferred actor.

        if ('deferred' in currentActorRef && currentActorRef.deferred) {
          deferredEventsRef.current.push(event);
        } else {
          currentActorRef.send(event);
        }
      };
    });
    index(
      function () {
        actorRefRef.current = actorRef;
        setCurrent(getSnapshot(actorRef));
        var subscription = actorRef.subscribe(setCurrent); // Dequeue deferred events from the previous deferred actorRef

        while (deferredEventsRef.current.length > 0) {
          var deferredEvent = deferredEventsRef.current.shift();
          actorRef.send(deferredEvent);
        }

        return function () {
          subscription.unsubscribe();
        };
      },
      [actorRef]
    );
    return [current, send];
  }

  function fromService(service) {
    if (!('machine' in service)) {
      throw new Error(
        'Attempted to use an actor-like object instead of a service in the useService() hook. Please use the useActor() hook instead.'
      );
    }

    var machine = service.machine;
    return {
      send: service.send.bind(service),
      subscribe: function subscribe(cb) {
        return service.subscribe(function (state) {
          return cb(state);
        });
      },
      stop: service.stop,
      // TODO: remove compat lines in a new major, replace literal number with InterpreterStatus then as well
      current:
        ('status' in service ? service.status : service._status) !== 0
          ? service.state
          : machine.initialState,
      name: service.sessionId
    };
  }
  function useService(service) {
    var serviceActor = React.useMemo(
      function () {
        return fromService(service);
      },
      [service]
    );

    var _useActor = useActor(serviceActor, function (actor) {
        return actor.current;
      }),
      state = _useActor[0];

    return [state, service.send];
  }

  exports.asEffect = asEffect;
  exports.asLayoutEffect = asLayoutEffect;
  exports.useActor = useActor;
  exports.useMachine = useMachine;
  exports.useService = useService;
});
//# sourceMappingURL=xstate-react.umd.development.js.map
