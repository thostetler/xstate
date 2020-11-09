import { EventObject, State, Interpreter, Typestate } from 'xstate';
import { ActorRef, PayloadSender } from './types';
export declare function fromService<TContext, TEvent extends EventObject>(
  service: Interpreter<TContext, any, TEvent>
): ActorRef<TEvent, State<TContext, TEvent>>;
export declare function useService<
  TContext,
  TEvent extends EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  }
>(
  service: Interpreter<TContext, any, TEvent, TTypestate>
): [State<TContext, TEvent, any, TTypestate>, PayloadSender<TEvent>];
//# sourceMappingURL=useService.d.ts.map
