import {
  EventObject,
  StateMachine,
  State,
  Interpreter,
  InterpreterOptions,
  MachineOptions,
  StateConfig,
  Typestate,
  ActionObject,
  ActionFunction,
  ActionMeta
} from 'xstate';
import { MaybeLazy } from './types';
declare enum ReactEffectType {
  Effect = 1,
  LayoutEffect = 2
}
export interface ReactActionFunction<TContext, TEvent extends EventObject> {
  (
    context: TContext,
    event: TEvent,
    meta: ActionMeta<TContext, TEvent>
  ): () => void;
  __effect: ReactEffectType;
}
export interface ReactActionObject<TContext, TEvent extends EventObject>
  extends ActionObject<TContext, TEvent> {
  exec: ReactActionFunction<TContext, TEvent>;
}
export declare function asEffect<TContext, TEvent extends EventObject>(
  exec: ActionFunction<TContext, TEvent>
): ReactActionFunction<TContext, TEvent>;
export declare function asLayoutEffect<TContext, TEvent extends EventObject>(
  exec: ActionFunction<TContext, TEvent>
): ReactActionFunction<TContext, TEvent>;
export declare type ActionStateTuple<TContext, TEvent extends EventObject> = [
  ReactActionObject<TContext, TEvent>,
  State<TContext, TEvent>
];
interface UseMachineOptions<TContext, TEvent extends EventObject> {
  /**
   * If provided, will be merged with machine's `context`.
   */
  context?: Partial<TContext>;
  /**
   * The state to rehydrate the machine to. The machine will
   * start at this state instead of its `initialState`.
   */
  state?: StateConfig<TContext, TEvent>;
}
export declare function useMachine<
  TContext,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
>(
  getMachine: MaybeLazy<StateMachine<TContext, any, TEvent, TTypestate>>,
  options?: Partial<InterpreterOptions> &
    Partial<UseMachineOptions<TContext, TEvent>> &
    Partial<MachineOptions<TContext, TEvent>>
): [
  State<TContext, TEvent, any, TTypestate>,
  Interpreter<TContext, any, TEvent, TTypestate>['send'],
  Interpreter<TContext, any, TEvent, TTypestate>
];
export {};
//# sourceMappingURL=useMachine.d.ts.map
