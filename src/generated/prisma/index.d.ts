
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model api_key
 * 
 */
export type api_key = $Result.DefaultSelection<Prisma.$api_keyPayload>
/**
 * Model api_key_logs
 * 
 */
export type api_key_logs = $Result.DefaultSelection<Prisma.$api_key_logsPayload>
/**
 * Model channel_notify_webhook
 * 
 */
export type channel_notify_webhook = $Result.DefaultSelection<Prisma.$channel_notify_webhookPayload>
/**
 * Model favorite_track
 * 
 */
export type favorite_track = $Result.DefaultSelection<Prisma.$favorite_trackPayload>
/**
 * Model feedback
 * 
 */
export type feedback = $Result.DefaultSelection<Prisma.$feedbackPayload>
/**
 * Model guilds
 * 
 */
export type guilds = $Result.DefaultSelection<Prisma.$guildsPayload>
/**
 * Model player_action_history
 * 
 */
export type player_action_history = $Result.DefaultSelection<Prisma.$player_action_historyPayload>
/**
 * Model player_track_history
 * 
 */
export type player_track_history = $Result.DefaultSelection<Prisma.$player_track_historyPayload>
/**
 * Model pona_flipflop_state
 * 
 */
export type pona_flipflop_state = $Result.DefaultSelection<Prisma.$pona_flipflop_statePayload>
/**
 * Model pona_heartbeat_interval
 * 
 */
export type pona_heartbeat_interval = $Result.DefaultSelection<Prisma.$pona_heartbeat_intervalPayload>
/**
 * Model pona_voicestate_history
 * 
 */
export type pona_voicestate_history = $Result.DefaultSelection<Prisma.$pona_voicestate_historyPayload>
/**
 * Model search_history
 * 
 */
export type search_history = $Result.DefaultSelection<Prisma.$search_historyPayload>
/**
 * Model subscribe_artist
 * 
 */
export type subscribe_artist = $Result.DefaultSelection<Prisma.$subscribe_artistPayload>
/**
 * Model subscribe_news
 * 
 */
export type subscribe_news = $Result.DefaultSelection<Prisma.$subscribe_newsPayload>
/**
 * Model user_session
 * 
 */
export type user_session = $Result.DefaultSelection<Prisma.$user_sessionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Api_keys
 * const api_keys = await prisma.api_key.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Api_keys
   * const api_keys = await prisma.api_key.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.api_key`: Exposes CRUD operations for the **api_key** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Api_keys
    * const api_keys = await prisma.api_key.findMany()
    * ```
    */
  get api_key(): Prisma.api_keyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.api_key_logs`: Exposes CRUD operations for the **api_key_logs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Api_key_logs
    * const api_key_logs = await prisma.api_key_logs.findMany()
    * ```
    */
  get api_key_logs(): Prisma.api_key_logsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.channel_notify_webhook`: Exposes CRUD operations for the **channel_notify_webhook** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Channel_notify_webhooks
    * const channel_notify_webhooks = await prisma.channel_notify_webhook.findMany()
    * ```
    */
  get channel_notify_webhook(): Prisma.channel_notify_webhookDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.favorite_track`: Exposes CRUD operations for the **favorite_track** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Favorite_tracks
    * const favorite_tracks = await prisma.favorite_track.findMany()
    * ```
    */
  get favorite_track(): Prisma.favorite_trackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedback`: Exposes CRUD operations for the **feedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedback.findMany()
    * ```
    */
  get feedback(): Prisma.feedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guilds`: Exposes CRUD operations for the **guilds** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guilds
    * const guilds = await prisma.guilds.findMany()
    * ```
    */
  get guilds(): Prisma.guildsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player_action_history`: Exposes CRUD operations for the **player_action_history** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Player_action_histories
    * const player_action_histories = await prisma.player_action_history.findMany()
    * ```
    */
  get player_action_history(): Prisma.player_action_historyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player_track_history`: Exposes CRUD operations for the **player_track_history** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Player_track_histories
    * const player_track_histories = await prisma.player_track_history.findMany()
    * ```
    */
  get player_track_history(): Prisma.player_track_historyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pona_flipflop_state`: Exposes CRUD operations for the **pona_flipflop_state** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pona_flipflop_states
    * const pona_flipflop_states = await prisma.pona_flipflop_state.findMany()
    * ```
    */
  get pona_flipflop_state(): Prisma.pona_flipflop_stateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pona_heartbeat_interval`: Exposes CRUD operations for the **pona_heartbeat_interval** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pona_heartbeat_intervals
    * const pona_heartbeat_intervals = await prisma.pona_heartbeat_interval.findMany()
    * ```
    */
  get pona_heartbeat_interval(): Prisma.pona_heartbeat_intervalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pona_voicestate_history`: Exposes CRUD operations for the **pona_voicestate_history** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pona_voicestate_histories
    * const pona_voicestate_histories = await prisma.pona_voicestate_history.findMany()
    * ```
    */
  get pona_voicestate_history(): Prisma.pona_voicestate_historyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.search_history`: Exposes CRUD operations for the **search_history** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Search_histories
    * const search_histories = await prisma.search_history.findMany()
    * ```
    */
  get search_history(): Prisma.search_historyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscribe_artist`: Exposes CRUD operations for the **subscribe_artist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscribe_artists
    * const subscribe_artists = await prisma.subscribe_artist.findMany()
    * ```
    */
  get subscribe_artist(): Prisma.subscribe_artistDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscribe_news`: Exposes CRUD operations for the **subscribe_news** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscribe_news
    * const subscribe_news = await prisma.subscribe_news.findMany()
    * ```
    */
  get subscribe_news(): Prisma.subscribe_newsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user_session`: Exposes CRUD operations for the **user_session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_sessions
    * const user_sessions = await prisma.user_session.findMany()
    * ```
    */
  get user_session(): Prisma.user_sessionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    api_key: 'api_key',
    api_key_logs: 'api_key_logs',
    channel_notify_webhook: 'channel_notify_webhook',
    favorite_track: 'favorite_track',
    feedback: 'feedback',
    guilds: 'guilds',
    player_action_history: 'player_action_history',
    player_track_history: 'player_track_history',
    pona_flipflop_state: 'pona_flipflop_state',
    pona_heartbeat_interval: 'pona_heartbeat_interval',
    pona_voicestate_history: 'pona_voicestate_history',
    search_history: 'search_history',
    subscribe_artist: 'subscribe_artist',
    subscribe_news: 'subscribe_news',
    user_session: 'user_session'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "api_key" | "api_key_logs" | "channel_notify_webhook" | "favorite_track" | "feedback" | "guilds" | "player_action_history" | "player_track_history" | "pona_flipflop_state" | "pona_heartbeat_interval" | "pona_voicestate_history" | "search_history" | "subscribe_artist" | "subscribe_news" | "user_session"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      api_key: {
        payload: Prisma.$api_keyPayload<ExtArgs>
        fields: Prisma.api_keyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.api_keyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.api_keyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload>
          }
          findFirst: {
            args: Prisma.api_keyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.api_keyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload>
          }
          findMany: {
            args: Prisma.api_keyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload>[]
          }
          create: {
            args: Prisma.api_keyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload>
          }
          createMany: {
            args: Prisma.api_keyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.api_keyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload>
          }
          update: {
            args: Prisma.api_keyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload>
          }
          deleteMany: {
            args: Prisma.api_keyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.api_keyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.api_keyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_keyPayload>
          }
          aggregate: {
            args: Prisma.Api_keyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApi_key>
          }
          groupBy: {
            args: Prisma.api_keyGroupByArgs<ExtArgs>
            result: $Utils.Optional<Api_keyGroupByOutputType>[]
          }
          count: {
            args: Prisma.api_keyCountArgs<ExtArgs>
            result: $Utils.Optional<Api_keyCountAggregateOutputType> | number
          }
        }
      }
      api_key_logs: {
        payload: Prisma.$api_key_logsPayload<ExtArgs>
        fields: Prisma.api_key_logsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.api_key_logsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.api_key_logsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload>
          }
          findFirst: {
            args: Prisma.api_key_logsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.api_key_logsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload>
          }
          findMany: {
            args: Prisma.api_key_logsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload>[]
          }
          create: {
            args: Prisma.api_key_logsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload>
          }
          createMany: {
            args: Prisma.api_key_logsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.api_key_logsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload>
          }
          update: {
            args: Prisma.api_key_logsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload>
          }
          deleteMany: {
            args: Prisma.api_key_logsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.api_key_logsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.api_key_logsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$api_key_logsPayload>
          }
          aggregate: {
            args: Prisma.Api_key_logsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApi_key_logs>
          }
          groupBy: {
            args: Prisma.api_key_logsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Api_key_logsGroupByOutputType>[]
          }
          count: {
            args: Prisma.api_key_logsCountArgs<ExtArgs>
            result: $Utils.Optional<Api_key_logsCountAggregateOutputType> | number
          }
        }
      }
      channel_notify_webhook: {
        payload: Prisma.$channel_notify_webhookPayload<ExtArgs>
        fields: Prisma.channel_notify_webhookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.channel_notify_webhookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.channel_notify_webhookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload>
          }
          findFirst: {
            args: Prisma.channel_notify_webhookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.channel_notify_webhookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload>
          }
          findMany: {
            args: Prisma.channel_notify_webhookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload>[]
          }
          create: {
            args: Prisma.channel_notify_webhookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload>
          }
          createMany: {
            args: Prisma.channel_notify_webhookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.channel_notify_webhookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload>
          }
          update: {
            args: Prisma.channel_notify_webhookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload>
          }
          deleteMany: {
            args: Prisma.channel_notify_webhookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.channel_notify_webhookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.channel_notify_webhookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channel_notify_webhookPayload>
          }
          aggregate: {
            args: Prisma.Channel_notify_webhookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChannel_notify_webhook>
          }
          groupBy: {
            args: Prisma.channel_notify_webhookGroupByArgs<ExtArgs>
            result: $Utils.Optional<Channel_notify_webhookGroupByOutputType>[]
          }
          count: {
            args: Prisma.channel_notify_webhookCountArgs<ExtArgs>
            result: $Utils.Optional<Channel_notify_webhookCountAggregateOutputType> | number
          }
        }
      }
      favorite_track: {
        payload: Prisma.$favorite_trackPayload<ExtArgs>
        fields: Prisma.favorite_trackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.favorite_trackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.favorite_trackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload>
          }
          findFirst: {
            args: Prisma.favorite_trackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.favorite_trackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload>
          }
          findMany: {
            args: Prisma.favorite_trackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload>[]
          }
          create: {
            args: Prisma.favorite_trackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload>
          }
          createMany: {
            args: Prisma.favorite_trackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.favorite_trackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload>
          }
          update: {
            args: Prisma.favorite_trackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload>
          }
          deleteMany: {
            args: Prisma.favorite_trackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.favorite_trackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.favorite_trackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$favorite_trackPayload>
          }
          aggregate: {
            args: Prisma.Favorite_trackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFavorite_track>
          }
          groupBy: {
            args: Prisma.favorite_trackGroupByArgs<ExtArgs>
            result: $Utils.Optional<Favorite_trackGroupByOutputType>[]
          }
          count: {
            args: Prisma.favorite_trackCountArgs<ExtArgs>
            result: $Utils.Optional<Favorite_trackCountAggregateOutputType> | number
          }
        }
      }
      feedback: {
        payload: Prisma.$feedbackPayload<ExtArgs>
        fields: Prisma.feedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.feedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.feedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload>
          }
          findFirst: {
            args: Prisma.feedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.feedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload>
          }
          findMany: {
            args: Prisma.feedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload>[]
          }
          create: {
            args: Prisma.feedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload>
          }
          createMany: {
            args: Prisma.feedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.feedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload>
          }
          update: {
            args: Prisma.feedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload>
          }
          deleteMany: {
            args: Prisma.feedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.feedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.feedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$feedbackPayload>
          }
          aggregate: {
            args: Prisma.FeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedback>
          }
          groupBy: {
            args: Prisma.feedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.feedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbackCountAggregateOutputType> | number
          }
        }
      }
      guilds: {
        payload: Prisma.$guildsPayload<ExtArgs>
        fields: Prisma.guildsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.guildsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.guildsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload>
          }
          findFirst: {
            args: Prisma.guildsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.guildsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload>
          }
          findMany: {
            args: Prisma.guildsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload>[]
          }
          create: {
            args: Prisma.guildsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload>
          }
          createMany: {
            args: Prisma.guildsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.guildsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload>
          }
          update: {
            args: Prisma.guildsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload>
          }
          deleteMany: {
            args: Prisma.guildsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.guildsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.guildsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$guildsPayload>
          }
          aggregate: {
            args: Prisma.GuildsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuilds>
          }
          groupBy: {
            args: Prisma.guildsGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuildsGroupByOutputType>[]
          }
          count: {
            args: Prisma.guildsCountArgs<ExtArgs>
            result: $Utils.Optional<GuildsCountAggregateOutputType> | number
          }
        }
      }
      player_action_history: {
        payload: Prisma.$player_action_historyPayload<ExtArgs>
        fields: Prisma.player_action_historyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.player_action_historyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.player_action_historyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload>
          }
          findFirst: {
            args: Prisma.player_action_historyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.player_action_historyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload>
          }
          findMany: {
            args: Prisma.player_action_historyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload>[]
          }
          create: {
            args: Prisma.player_action_historyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload>
          }
          createMany: {
            args: Prisma.player_action_historyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.player_action_historyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload>
          }
          update: {
            args: Prisma.player_action_historyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload>
          }
          deleteMany: {
            args: Prisma.player_action_historyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.player_action_historyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.player_action_historyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_action_historyPayload>
          }
          aggregate: {
            args: Prisma.Player_action_historyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer_action_history>
          }
          groupBy: {
            args: Prisma.player_action_historyGroupByArgs<ExtArgs>
            result: $Utils.Optional<Player_action_historyGroupByOutputType>[]
          }
          count: {
            args: Prisma.player_action_historyCountArgs<ExtArgs>
            result: $Utils.Optional<Player_action_historyCountAggregateOutputType> | number
          }
        }
      }
      player_track_history: {
        payload: Prisma.$player_track_historyPayload<ExtArgs>
        fields: Prisma.player_track_historyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.player_track_historyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.player_track_historyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload>
          }
          findFirst: {
            args: Prisma.player_track_historyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.player_track_historyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload>
          }
          findMany: {
            args: Prisma.player_track_historyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload>[]
          }
          create: {
            args: Prisma.player_track_historyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload>
          }
          createMany: {
            args: Prisma.player_track_historyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.player_track_historyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload>
          }
          update: {
            args: Prisma.player_track_historyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload>
          }
          deleteMany: {
            args: Prisma.player_track_historyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.player_track_historyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.player_track_historyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$player_track_historyPayload>
          }
          aggregate: {
            args: Prisma.Player_track_historyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer_track_history>
          }
          groupBy: {
            args: Prisma.player_track_historyGroupByArgs<ExtArgs>
            result: $Utils.Optional<Player_track_historyGroupByOutputType>[]
          }
          count: {
            args: Prisma.player_track_historyCountArgs<ExtArgs>
            result: $Utils.Optional<Player_track_historyCountAggregateOutputType> | number
          }
        }
      }
      pona_flipflop_state: {
        payload: Prisma.$pona_flipflop_statePayload<ExtArgs>
        fields: Prisma.pona_flipflop_stateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pona_flipflop_stateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pona_flipflop_stateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload>
          }
          findFirst: {
            args: Prisma.pona_flipflop_stateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pona_flipflop_stateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload>
          }
          findMany: {
            args: Prisma.pona_flipflop_stateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload>[]
          }
          create: {
            args: Prisma.pona_flipflop_stateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload>
          }
          createMany: {
            args: Prisma.pona_flipflop_stateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.pona_flipflop_stateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload>
          }
          update: {
            args: Prisma.pona_flipflop_stateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload>
          }
          deleteMany: {
            args: Prisma.pona_flipflop_stateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.pona_flipflop_stateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.pona_flipflop_stateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_flipflop_statePayload>
          }
          aggregate: {
            args: Prisma.Pona_flipflop_stateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePona_flipflop_state>
          }
          groupBy: {
            args: Prisma.pona_flipflop_stateGroupByArgs<ExtArgs>
            result: $Utils.Optional<Pona_flipflop_stateGroupByOutputType>[]
          }
          count: {
            args: Prisma.pona_flipflop_stateCountArgs<ExtArgs>
            result: $Utils.Optional<Pona_flipflop_stateCountAggregateOutputType> | number
          }
        }
      }
      pona_heartbeat_interval: {
        payload: Prisma.$pona_heartbeat_intervalPayload<ExtArgs>
        fields: Prisma.pona_heartbeat_intervalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pona_heartbeat_intervalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pona_heartbeat_intervalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload>
          }
          findFirst: {
            args: Prisma.pona_heartbeat_intervalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pona_heartbeat_intervalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload>
          }
          findMany: {
            args: Prisma.pona_heartbeat_intervalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload>[]
          }
          create: {
            args: Prisma.pona_heartbeat_intervalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload>
          }
          createMany: {
            args: Prisma.pona_heartbeat_intervalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.pona_heartbeat_intervalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload>
          }
          update: {
            args: Prisma.pona_heartbeat_intervalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload>
          }
          deleteMany: {
            args: Prisma.pona_heartbeat_intervalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.pona_heartbeat_intervalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.pona_heartbeat_intervalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_heartbeat_intervalPayload>
          }
          aggregate: {
            args: Prisma.Pona_heartbeat_intervalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePona_heartbeat_interval>
          }
          groupBy: {
            args: Prisma.pona_heartbeat_intervalGroupByArgs<ExtArgs>
            result: $Utils.Optional<Pona_heartbeat_intervalGroupByOutputType>[]
          }
          count: {
            args: Prisma.pona_heartbeat_intervalCountArgs<ExtArgs>
            result: $Utils.Optional<Pona_heartbeat_intervalCountAggregateOutputType> | number
          }
        }
      }
      pona_voicestate_history: {
        payload: Prisma.$pona_voicestate_historyPayload<ExtArgs>
        fields: Prisma.pona_voicestate_historyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.pona_voicestate_historyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.pona_voicestate_historyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload>
          }
          findFirst: {
            args: Prisma.pona_voicestate_historyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.pona_voicestate_historyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload>
          }
          findMany: {
            args: Prisma.pona_voicestate_historyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload>[]
          }
          create: {
            args: Prisma.pona_voicestate_historyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload>
          }
          createMany: {
            args: Prisma.pona_voicestate_historyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.pona_voicestate_historyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload>
          }
          update: {
            args: Prisma.pona_voicestate_historyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload>
          }
          deleteMany: {
            args: Prisma.pona_voicestate_historyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.pona_voicestate_historyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.pona_voicestate_historyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$pona_voicestate_historyPayload>
          }
          aggregate: {
            args: Prisma.Pona_voicestate_historyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePona_voicestate_history>
          }
          groupBy: {
            args: Prisma.pona_voicestate_historyGroupByArgs<ExtArgs>
            result: $Utils.Optional<Pona_voicestate_historyGroupByOutputType>[]
          }
          count: {
            args: Prisma.pona_voicestate_historyCountArgs<ExtArgs>
            result: $Utils.Optional<Pona_voicestate_historyCountAggregateOutputType> | number
          }
        }
      }
      search_history: {
        payload: Prisma.$search_historyPayload<ExtArgs>
        fields: Prisma.search_historyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.search_historyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.search_historyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload>
          }
          findFirst: {
            args: Prisma.search_historyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.search_historyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload>
          }
          findMany: {
            args: Prisma.search_historyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload>[]
          }
          create: {
            args: Prisma.search_historyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload>
          }
          createMany: {
            args: Prisma.search_historyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.search_historyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload>
          }
          update: {
            args: Prisma.search_historyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload>
          }
          deleteMany: {
            args: Prisma.search_historyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.search_historyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.search_historyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$search_historyPayload>
          }
          aggregate: {
            args: Prisma.Search_historyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSearch_history>
          }
          groupBy: {
            args: Prisma.search_historyGroupByArgs<ExtArgs>
            result: $Utils.Optional<Search_historyGroupByOutputType>[]
          }
          count: {
            args: Prisma.search_historyCountArgs<ExtArgs>
            result: $Utils.Optional<Search_historyCountAggregateOutputType> | number
          }
        }
      }
      subscribe_artist: {
        payload: Prisma.$subscribe_artistPayload<ExtArgs>
        fields: Prisma.subscribe_artistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.subscribe_artistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.subscribe_artistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload>
          }
          findFirst: {
            args: Prisma.subscribe_artistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.subscribe_artistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload>
          }
          findMany: {
            args: Prisma.subscribe_artistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload>[]
          }
          create: {
            args: Prisma.subscribe_artistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload>
          }
          createMany: {
            args: Prisma.subscribe_artistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.subscribe_artistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload>
          }
          update: {
            args: Prisma.subscribe_artistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload>
          }
          deleteMany: {
            args: Prisma.subscribe_artistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.subscribe_artistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.subscribe_artistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_artistPayload>
          }
          aggregate: {
            args: Prisma.Subscribe_artistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscribe_artist>
          }
          groupBy: {
            args: Prisma.subscribe_artistGroupByArgs<ExtArgs>
            result: $Utils.Optional<Subscribe_artistGroupByOutputType>[]
          }
          count: {
            args: Prisma.subscribe_artistCountArgs<ExtArgs>
            result: $Utils.Optional<Subscribe_artistCountAggregateOutputType> | number
          }
        }
      }
      subscribe_news: {
        payload: Prisma.$subscribe_newsPayload<ExtArgs>
        fields: Prisma.subscribe_newsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.subscribe_newsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.subscribe_newsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload>
          }
          findFirst: {
            args: Prisma.subscribe_newsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.subscribe_newsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload>
          }
          findMany: {
            args: Prisma.subscribe_newsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload>[]
          }
          create: {
            args: Prisma.subscribe_newsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload>
          }
          createMany: {
            args: Prisma.subscribe_newsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.subscribe_newsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload>
          }
          update: {
            args: Prisma.subscribe_newsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload>
          }
          deleteMany: {
            args: Prisma.subscribe_newsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.subscribe_newsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.subscribe_newsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$subscribe_newsPayload>
          }
          aggregate: {
            args: Prisma.Subscribe_newsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscribe_news>
          }
          groupBy: {
            args: Prisma.subscribe_newsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Subscribe_newsGroupByOutputType>[]
          }
          count: {
            args: Prisma.subscribe_newsCountArgs<ExtArgs>
            result: $Utils.Optional<Subscribe_newsCountAggregateOutputType> | number
          }
        }
      }
      user_session: {
        payload: Prisma.$user_sessionPayload<ExtArgs>
        fields: Prisma.user_sessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_sessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_sessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload>
          }
          findFirst: {
            args: Prisma.user_sessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_sessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload>
          }
          findMany: {
            args: Prisma.user_sessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload>[]
          }
          create: {
            args: Prisma.user_sessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload>
          }
          createMany: {
            args: Prisma.user_sessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.user_sessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload>
          }
          update: {
            args: Prisma.user_sessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload>
          }
          deleteMany: {
            args: Prisma.user_sessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_sessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.user_sessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_sessionPayload>
          }
          aggregate: {
            args: Prisma.User_sessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_session>
          }
          groupBy: {
            args: Prisma.user_sessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_sessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_sessionCountArgs<ExtArgs>
            result: $Utils.Optional<User_sessionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    api_key?: api_keyOmit
    api_key_logs?: api_key_logsOmit
    channel_notify_webhook?: channel_notify_webhookOmit
    favorite_track?: favorite_trackOmit
    feedback?: feedbackOmit
    guilds?: guildsOmit
    player_action_history?: player_action_historyOmit
    player_track_history?: player_track_historyOmit
    pona_flipflop_state?: pona_flipflop_stateOmit
    pona_heartbeat_interval?: pona_heartbeat_intervalOmit
    pona_voicestate_history?: pona_voicestate_historyOmit
    search_history?: search_historyOmit
    subscribe_artist?: subscribe_artistOmit
    subscribe_news?: subscribe_newsOmit
    user_session?: user_sessionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type Api_keyCountOutputType
   */

  export type Api_keyCountOutputType = {
    api_key_logs: number
  }

  export type Api_keyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    api_key_logs?: boolean | Api_keyCountOutputTypeCountApi_key_logsArgs
  }

  // Custom InputTypes
  /**
   * Api_keyCountOutputType without action
   */
  export type Api_keyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Api_keyCountOutputType
     */
    select?: Api_keyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Api_keyCountOutputType without action
   */
  export type Api_keyCountOutputTypeCountApi_key_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: api_key_logsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model api_key
   */

  export type AggregateApi_key = {
    _count: Api_keyCountAggregateOutputType | null
    _avg: Api_keyAvgAggregateOutputType | null
    _sum: Api_keySumAggregateOutputType | null
    _min: Api_keyMinAggregateOutputType | null
    _max: Api_keyMaxAggregateOutputType | null
  }

  export type Api_keyAvgAggregateOutputType = {
    id: number | null
    permission: number | null
    ratelimitpermin: number | null
  }

  export type Api_keySumAggregateOutputType = {
    id: number | null
    permission: number | null
    ratelimitpermin: number | null
  }

  export type Api_keyMinAggregateOutputType = {
    id: number | null
    time: Date | null
    createby: string | null
    key: string | null
    permission: number | null
    ratelimitpermin: number | null
    allowedipaddresses: string | null
    expiredat: Date | null
    isdisabled: Date | null
    isdeleted: Date | null
  }

  export type Api_keyMaxAggregateOutputType = {
    id: number | null
    time: Date | null
    createby: string | null
    key: string | null
    permission: number | null
    ratelimitpermin: number | null
    allowedipaddresses: string | null
    expiredat: Date | null
    isdisabled: Date | null
    isdeleted: Date | null
  }

  export type Api_keyCountAggregateOutputType = {
    id: number
    time: number
    createby: number
    key: number
    permission: number
    ratelimitpermin: number
    allowedipaddresses: number
    expiredat: number
    isdisabled: number
    isdeleted: number
    _all: number
  }


  export type Api_keyAvgAggregateInputType = {
    id?: true
    permission?: true
    ratelimitpermin?: true
  }

  export type Api_keySumAggregateInputType = {
    id?: true
    permission?: true
    ratelimitpermin?: true
  }

  export type Api_keyMinAggregateInputType = {
    id?: true
    time?: true
    createby?: true
    key?: true
    permission?: true
    ratelimitpermin?: true
    allowedipaddresses?: true
    expiredat?: true
    isdisabled?: true
    isdeleted?: true
  }

  export type Api_keyMaxAggregateInputType = {
    id?: true
    time?: true
    createby?: true
    key?: true
    permission?: true
    ratelimitpermin?: true
    allowedipaddresses?: true
    expiredat?: true
    isdisabled?: true
    isdeleted?: true
  }

  export type Api_keyCountAggregateInputType = {
    id?: true
    time?: true
    createby?: true
    key?: true
    permission?: true
    ratelimitpermin?: true
    allowedipaddresses?: true
    expiredat?: true
    isdisabled?: true
    isdeleted?: true
    _all?: true
  }

  export type Api_keyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which api_key to aggregate.
     */
    where?: api_keyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_keys to fetch.
     */
    orderBy?: api_keyOrderByWithRelationInput | api_keyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: api_keyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_keys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_keys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned api_keys
    **/
    _count?: true | Api_keyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Api_keyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Api_keySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Api_keyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Api_keyMaxAggregateInputType
  }

  export type GetApi_keyAggregateType<T extends Api_keyAggregateArgs> = {
        [P in keyof T & keyof AggregateApi_key]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApi_key[P]>
      : GetScalarType<T[P], AggregateApi_key[P]>
  }




  export type api_keyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: api_keyWhereInput
    orderBy?: api_keyOrderByWithAggregationInput | api_keyOrderByWithAggregationInput[]
    by: Api_keyScalarFieldEnum[] | Api_keyScalarFieldEnum
    having?: api_keyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Api_keyCountAggregateInputType | true
    _avg?: Api_keyAvgAggregateInputType
    _sum?: Api_keySumAggregateInputType
    _min?: Api_keyMinAggregateInputType
    _max?: Api_keyMaxAggregateInputType
  }

  export type Api_keyGroupByOutputType = {
    id: number
    time: Date
    createby: string
    key: string
    permission: number
    ratelimitpermin: number
    allowedipaddresses: string
    expiredat: Date | null
    isdisabled: Date | null
    isdeleted: Date | null
    _count: Api_keyCountAggregateOutputType | null
    _avg: Api_keyAvgAggregateOutputType | null
    _sum: Api_keySumAggregateOutputType | null
    _min: Api_keyMinAggregateOutputType | null
    _max: Api_keyMaxAggregateOutputType | null
  }

  type GetApi_keyGroupByPayload<T extends api_keyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Api_keyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Api_keyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Api_keyGroupByOutputType[P]>
            : GetScalarType<T[P], Api_keyGroupByOutputType[P]>
        }
      >
    >


  export type api_keySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    createby?: boolean
    key?: boolean
    permission?: boolean
    ratelimitpermin?: boolean
    allowedipaddresses?: boolean
    expiredat?: boolean
    isdisabled?: boolean
    isdeleted?: boolean
    api_key_logs?: boolean | api_key$api_key_logsArgs<ExtArgs>
    _count?: boolean | Api_keyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["api_key"]>



  export type api_keySelectScalar = {
    id?: boolean
    time?: boolean
    createby?: boolean
    key?: boolean
    permission?: boolean
    ratelimitpermin?: boolean
    allowedipaddresses?: boolean
    expiredat?: boolean
    isdisabled?: boolean
    isdeleted?: boolean
  }

  export type api_keyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "time" | "createby" | "key" | "permission" | "ratelimitpermin" | "allowedipaddresses" | "expiredat" | "isdisabled" | "isdeleted", ExtArgs["result"]["api_key"]>
  export type api_keyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    api_key_logs?: boolean | api_key$api_key_logsArgs<ExtArgs>
    _count?: boolean | Api_keyCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $api_keyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "api_key"
    objects: {
      api_key_logs: Prisma.$api_key_logsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      time: Date
      createby: string
      key: string
      permission: number
      ratelimitpermin: number
      allowedipaddresses: string
      expiredat: Date | null
      isdisabled: Date | null
      isdeleted: Date | null
    }, ExtArgs["result"]["api_key"]>
    composites: {}
  }

  type api_keyGetPayload<S extends boolean | null | undefined | api_keyDefaultArgs> = $Result.GetResult<Prisma.$api_keyPayload, S>

  type api_keyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<api_keyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Api_keyCountAggregateInputType | true
    }

  export interface api_keyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['api_key'], meta: { name: 'api_key' } }
    /**
     * Find zero or one Api_key that matches the filter.
     * @param {api_keyFindUniqueArgs} args - Arguments to find a Api_key
     * @example
     * // Get one Api_key
     * const api_key = await prisma.api_key.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends api_keyFindUniqueArgs>(args: SelectSubset<T, api_keyFindUniqueArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Api_key that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {api_keyFindUniqueOrThrowArgs} args - Arguments to find a Api_key
     * @example
     * // Get one Api_key
     * const api_key = await prisma.api_key.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends api_keyFindUniqueOrThrowArgs>(args: SelectSubset<T, api_keyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Api_key that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_keyFindFirstArgs} args - Arguments to find a Api_key
     * @example
     * // Get one Api_key
     * const api_key = await prisma.api_key.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends api_keyFindFirstArgs>(args?: SelectSubset<T, api_keyFindFirstArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Api_key that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_keyFindFirstOrThrowArgs} args - Arguments to find a Api_key
     * @example
     * // Get one Api_key
     * const api_key = await prisma.api_key.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends api_keyFindFirstOrThrowArgs>(args?: SelectSubset<T, api_keyFindFirstOrThrowArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Api_keys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_keyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Api_keys
     * const api_keys = await prisma.api_key.findMany()
     * 
     * // Get first 10 Api_keys
     * const api_keys = await prisma.api_key.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const api_keyWithIdOnly = await prisma.api_key.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends api_keyFindManyArgs>(args?: SelectSubset<T, api_keyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Api_key.
     * @param {api_keyCreateArgs} args - Arguments to create a Api_key.
     * @example
     * // Create one Api_key
     * const Api_key = await prisma.api_key.create({
     *   data: {
     *     // ... data to create a Api_key
     *   }
     * })
     * 
     */
    create<T extends api_keyCreateArgs>(args: SelectSubset<T, api_keyCreateArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Api_keys.
     * @param {api_keyCreateManyArgs} args - Arguments to create many Api_keys.
     * @example
     * // Create many Api_keys
     * const api_key = await prisma.api_key.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends api_keyCreateManyArgs>(args?: SelectSubset<T, api_keyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Api_key.
     * @param {api_keyDeleteArgs} args - Arguments to delete one Api_key.
     * @example
     * // Delete one Api_key
     * const Api_key = await prisma.api_key.delete({
     *   where: {
     *     // ... filter to delete one Api_key
     *   }
     * })
     * 
     */
    delete<T extends api_keyDeleteArgs>(args: SelectSubset<T, api_keyDeleteArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Api_key.
     * @param {api_keyUpdateArgs} args - Arguments to update one Api_key.
     * @example
     * // Update one Api_key
     * const api_key = await prisma.api_key.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends api_keyUpdateArgs>(args: SelectSubset<T, api_keyUpdateArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Api_keys.
     * @param {api_keyDeleteManyArgs} args - Arguments to filter Api_keys to delete.
     * @example
     * // Delete a few Api_keys
     * const { count } = await prisma.api_key.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends api_keyDeleteManyArgs>(args?: SelectSubset<T, api_keyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Api_keys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_keyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Api_keys
     * const api_key = await prisma.api_key.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends api_keyUpdateManyArgs>(args: SelectSubset<T, api_keyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Api_key.
     * @param {api_keyUpsertArgs} args - Arguments to update or create a Api_key.
     * @example
     * // Update or create a Api_key
     * const api_key = await prisma.api_key.upsert({
     *   create: {
     *     // ... data to create a Api_key
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Api_key we want to update
     *   }
     * })
     */
    upsert<T extends api_keyUpsertArgs>(args: SelectSubset<T, api_keyUpsertArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Api_keys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_keyCountArgs} args - Arguments to filter Api_keys to count.
     * @example
     * // Count the number of Api_keys
     * const count = await prisma.api_key.count({
     *   where: {
     *     // ... the filter for the Api_keys we want to count
     *   }
     * })
    **/
    count<T extends api_keyCountArgs>(
      args?: Subset<T, api_keyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Api_keyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Api_key.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Api_keyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Api_keyAggregateArgs>(args: Subset<T, Api_keyAggregateArgs>): Prisma.PrismaPromise<GetApi_keyAggregateType<T>>

    /**
     * Group by Api_key.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_keyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends api_keyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: api_keyGroupByArgs['orderBy'] }
        : { orderBy?: api_keyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, api_keyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApi_keyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the api_key model
   */
  readonly fields: api_keyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for api_key.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__api_keyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    api_key_logs<T extends api_key$api_key_logsArgs<ExtArgs> = {}>(args?: Subset<T, api_key$api_key_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the api_key model
   */
  interface api_keyFieldRefs {
    readonly id: FieldRef<"api_key", 'Int'>
    readonly time: FieldRef<"api_key", 'DateTime'>
    readonly createby: FieldRef<"api_key", 'String'>
    readonly key: FieldRef<"api_key", 'String'>
    readonly permission: FieldRef<"api_key", 'Int'>
    readonly ratelimitpermin: FieldRef<"api_key", 'Int'>
    readonly allowedipaddresses: FieldRef<"api_key", 'String'>
    readonly expiredat: FieldRef<"api_key", 'DateTime'>
    readonly isdisabled: FieldRef<"api_key", 'DateTime'>
    readonly isdeleted: FieldRef<"api_key", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * api_key findUnique
   */
  export type api_keyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * Filter, which api_key to fetch.
     */
    where: api_keyWhereUniqueInput
  }

  /**
   * api_key findUniqueOrThrow
   */
  export type api_keyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * Filter, which api_key to fetch.
     */
    where: api_keyWhereUniqueInput
  }

  /**
   * api_key findFirst
   */
  export type api_keyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * Filter, which api_key to fetch.
     */
    where?: api_keyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_keys to fetch.
     */
    orderBy?: api_keyOrderByWithRelationInput | api_keyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for api_keys.
     */
    cursor?: api_keyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_keys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_keys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_keys.
     */
    distinct?: Api_keyScalarFieldEnum | Api_keyScalarFieldEnum[]
  }

  /**
   * api_key findFirstOrThrow
   */
  export type api_keyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * Filter, which api_key to fetch.
     */
    where?: api_keyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_keys to fetch.
     */
    orderBy?: api_keyOrderByWithRelationInput | api_keyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for api_keys.
     */
    cursor?: api_keyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_keys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_keys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_keys.
     */
    distinct?: Api_keyScalarFieldEnum | Api_keyScalarFieldEnum[]
  }

  /**
   * api_key findMany
   */
  export type api_keyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * Filter, which api_keys to fetch.
     */
    where?: api_keyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_keys to fetch.
     */
    orderBy?: api_keyOrderByWithRelationInput | api_keyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing api_keys.
     */
    cursor?: api_keyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_keys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_keys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_keys.
     */
    distinct?: Api_keyScalarFieldEnum | Api_keyScalarFieldEnum[]
  }

  /**
   * api_key create
   */
  export type api_keyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * The data needed to create a api_key.
     */
    data: XOR<api_keyCreateInput, api_keyUncheckedCreateInput>
  }

  /**
   * api_key createMany
   */
  export type api_keyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many api_keys.
     */
    data: api_keyCreateManyInput | api_keyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * api_key update
   */
  export type api_keyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * The data needed to update a api_key.
     */
    data: XOR<api_keyUpdateInput, api_keyUncheckedUpdateInput>
    /**
     * Choose, which api_key to update.
     */
    where: api_keyWhereUniqueInput
  }

  /**
   * api_key updateMany
   */
  export type api_keyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update api_keys.
     */
    data: XOR<api_keyUpdateManyMutationInput, api_keyUncheckedUpdateManyInput>
    /**
     * Filter which api_keys to update
     */
    where?: api_keyWhereInput
    /**
     * Limit how many api_keys to update.
     */
    limit?: number
  }

  /**
   * api_key upsert
   */
  export type api_keyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * The filter to search for the api_key to update in case it exists.
     */
    where: api_keyWhereUniqueInput
    /**
     * In case the api_key found by the `where` argument doesn't exist, create a new api_key with this data.
     */
    create: XOR<api_keyCreateInput, api_keyUncheckedCreateInput>
    /**
     * In case the api_key was found with the provided `where` argument, update it with this data.
     */
    update: XOR<api_keyUpdateInput, api_keyUncheckedUpdateInput>
  }

  /**
   * api_key delete
   */
  export type api_keyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
    /**
     * Filter which api_key to delete.
     */
    where: api_keyWhereUniqueInput
  }

  /**
   * api_key deleteMany
   */
  export type api_keyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which api_keys to delete
     */
    where?: api_keyWhereInput
    /**
     * Limit how many api_keys to delete.
     */
    limit?: number
  }

  /**
   * api_key.api_key_logs
   */
  export type api_key$api_key_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    where?: api_key_logsWhereInput
    orderBy?: api_key_logsOrderByWithRelationInput | api_key_logsOrderByWithRelationInput[]
    cursor?: api_key_logsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Api_key_logsScalarFieldEnum | Api_key_logsScalarFieldEnum[]
  }

  /**
   * api_key without action
   */
  export type api_keyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key
     */
    select?: api_keySelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key
     */
    omit?: api_keyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_keyInclude<ExtArgs> | null
  }


  /**
   * Model api_key_logs
   */

  export type AggregateApi_key_logs = {
    _count: Api_key_logsCountAggregateOutputType | null
    _avg: Api_key_logsAvgAggregateOutputType | null
    _sum: Api_key_logsSumAggregateOutputType | null
    _min: Api_key_logsMinAggregateOutputType | null
    _max: Api_key_logsMaxAggregateOutputType | null
  }

  export type Api_key_logsAvgAggregateOutputType = {
    id: number | null
  }

  export type Api_key_logsSumAggregateOutputType = {
    id: number | null
  }

  export type Api_key_logsMinAggregateOutputType = {
    id: number | null
    time: Date | null
    ip: string | null
    user_agent: string | null
    key: string | null
  }

  export type Api_key_logsMaxAggregateOutputType = {
    id: number | null
    time: Date | null
    ip: string | null
    user_agent: string | null
    key: string | null
  }

  export type Api_key_logsCountAggregateOutputType = {
    id: number
    time: number
    ip: number
    user_agent: number
    key: number
    _all: number
  }


  export type Api_key_logsAvgAggregateInputType = {
    id?: true
  }

  export type Api_key_logsSumAggregateInputType = {
    id?: true
  }

  export type Api_key_logsMinAggregateInputType = {
    id?: true
    time?: true
    ip?: true
    user_agent?: true
    key?: true
  }

  export type Api_key_logsMaxAggregateInputType = {
    id?: true
    time?: true
    ip?: true
    user_agent?: true
    key?: true
  }

  export type Api_key_logsCountAggregateInputType = {
    id?: true
    time?: true
    ip?: true
    user_agent?: true
    key?: true
    _all?: true
  }

  export type Api_key_logsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which api_key_logs to aggregate.
     */
    where?: api_key_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_key_logs to fetch.
     */
    orderBy?: api_key_logsOrderByWithRelationInput | api_key_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: api_key_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_key_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_key_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned api_key_logs
    **/
    _count?: true | Api_key_logsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Api_key_logsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Api_key_logsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Api_key_logsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Api_key_logsMaxAggregateInputType
  }

  export type GetApi_key_logsAggregateType<T extends Api_key_logsAggregateArgs> = {
        [P in keyof T & keyof AggregateApi_key_logs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApi_key_logs[P]>
      : GetScalarType<T[P], AggregateApi_key_logs[P]>
  }




  export type api_key_logsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: api_key_logsWhereInput
    orderBy?: api_key_logsOrderByWithAggregationInput | api_key_logsOrderByWithAggregationInput[]
    by: Api_key_logsScalarFieldEnum[] | Api_key_logsScalarFieldEnum
    having?: api_key_logsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Api_key_logsCountAggregateInputType | true
    _avg?: Api_key_logsAvgAggregateInputType
    _sum?: Api_key_logsSumAggregateInputType
    _min?: Api_key_logsMinAggregateInputType
    _max?: Api_key_logsMaxAggregateInputType
  }

  export type Api_key_logsGroupByOutputType = {
    id: number
    time: Date
    ip: string
    user_agent: string
    key: string
    _count: Api_key_logsCountAggregateOutputType | null
    _avg: Api_key_logsAvgAggregateOutputType | null
    _sum: Api_key_logsSumAggregateOutputType | null
    _min: Api_key_logsMinAggregateOutputType | null
    _max: Api_key_logsMaxAggregateOutputType | null
  }

  type GetApi_key_logsGroupByPayload<T extends api_key_logsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Api_key_logsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Api_key_logsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Api_key_logsGroupByOutputType[P]>
            : GetScalarType<T[P], Api_key_logsGroupByOutputType[P]>
        }
      >
    >


  export type api_key_logsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    ip?: boolean
    user_agent?: boolean
    key?: boolean
    api_key?: boolean | api_keyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["api_key_logs"]>



  export type api_key_logsSelectScalar = {
    id?: boolean
    time?: boolean
    ip?: boolean
    user_agent?: boolean
    key?: boolean
  }

  export type api_key_logsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "time" | "ip" | "user_agent" | "key", ExtArgs["result"]["api_key_logs"]>
  export type api_key_logsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    api_key?: boolean | api_keyDefaultArgs<ExtArgs>
  }

  export type $api_key_logsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "api_key_logs"
    objects: {
      api_key: Prisma.$api_keyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      time: Date
      ip: string
      user_agent: string
      key: string
    }, ExtArgs["result"]["api_key_logs"]>
    composites: {}
  }

  type api_key_logsGetPayload<S extends boolean | null | undefined | api_key_logsDefaultArgs> = $Result.GetResult<Prisma.$api_key_logsPayload, S>

  type api_key_logsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<api_key_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Api_key_logsCountAggregateInputType | true
    }

  export interface api_key_logsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['api_key_logs'], meta: { name: 'api_key_logs' } }
    /**
     * Find zero or one Api_key_logs that matches the filter.
     * @param {api_key_logsFindUniqueArgs} args - Arguments to find a Api_key_logs
     * @example
     * // Get one Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends api_key_logsFindUniqueArgs>(args: SelectSubset<T, api_key_logsFindUniqueArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Api_key_logs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {api_key_logsFindUniqueOrThrowArgs} args - Arguments to find a Api_key_logs
     * @example
     * // Get one Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends api_key_logsFindUniqueOrThrowArgs>(args: SelectSubset<T, api_key_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Api_key_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_key_logsFindFirstArgs} args - Arguments to find a Api_key_logs
     * @example
     * // Get one Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends api_key_logsFindFirstArgs>(args?: SelectSubset<T, api_key_logsFindFirstArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Api_key_logs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_key_logsFindFirstOrThrowArgs} args - Arguments to find a Api_key_logs
     * @example
     * // Get one Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends api_key_logsFindFirstOrThrowArgs>(args?: SelectSubset<T, api_key_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Api_key_logs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_key_logsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.findMany()
     * 
     * // Get first 10 Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const api_key_logsWithIdOnly = await prisma.api_key_logs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends api_key_logsFindManyArgs>(args?: SelectSubset<T, api_key_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Api_key_logs.
     * @param {api_key_logsCreateArgs} args - Arguments to create a Api_key_logs.
     * @example
     * // Create one Api_key_logs
     * const Api_key_logs = await prisma.api_key_logs.create({
     *   data: {
     *     // ... data to create a Api_key_logs
     *   }
     * })
     * 
     */
    create<T extends api_key_logsCreateArgs>(args: SelectSubset<T, api_key_logsCreateArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Api_key_logs.
     * @param {api_key_logsCreateManyArgs} args - Arguments to create many Api_key_logs.
     * @example
     * // Create many Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends api_key_logsCreateManyArgs>(args?: SelectSubset<T, api_key_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Api_key_logs.
     * @param {api_key_logsDeleteArgs} args - Arguments to delete one Api_key_logs.
     * @example
     * // Delete one Api_key_logs
     * const Api_key_logs = await prisma.api_key_logs.delete({
     *   where: {
     *     // ... filter to delete one Api_key_logs
     *   }
     * })
     * 
     */
    delete<T extends api_key_logsDeleteArgs>(args: SelectSubset<T, api_key_logsDeleteArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Api_key_logs.
     * @param {api_key_logsUpdateArgs} args - Arguments to update one Api_key_logs.
     * @example
     * // Update one Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends api_key_logsUpdateArgs>(args: SelectSubset<T, api_key_logsUpdateArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Api_key_logs.
     * @param {api_key_logsDeleteManyArgs} args - Arguments to filter Api_key_logs to delete.
     * @example
     * // Delete a few Api_key_logs
     * const { count } = await prisma.api_key_logs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends api_key_logsDeleteManyArgs>(args?: SelectSubset<T, api_key_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Api_key_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_key_logsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends api_key_logsUpdateManyArgs>(args: SelectSubset<T, api_key_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Api_key_logs.
     * @param {api_key_logsUpsertArgs} args - Arguments to update or create a Api_key_logs.
     * @example
     * // Update or create a Api_key_logs
     * const api_key_logs = await prisma.api_key_logs.upsert({
     *   create: {
     *     // ... data to create a Api_key_logs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Api_key_logs we want to update
     *   }
     * })
     */
    upsert<T extends api_key_logsUpsertArgs>(args: SelectSubset<T, api_key_logsUpsertArgs<ExtArgs>>): Prisma__api_key_logsClient<$Result.GetResult<Prisma.$api_key_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Api_key_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_key_logsCountArgs} args - Arguments to filter Api_key_logs to count.
     * @example
     * // Count the number of Api_key_logs
     * const count = await prisma.api_key_logs.count({
     *   where: {
     *     // ... the filter for the Api_key_logs we want to count
     *   }
     * })
    **/
    count<T extends api_key_logsCountArgs>(
      args?: Subset<T, api_key_logsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Api_key_logsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Api_key_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Api_key_logsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Api_key_logsAggregateArgs>(args: Subset<T, Api_key_logsAggregateArgs>): Prisma.PrismaPromise<GetApi_key_logsAggregateType<T>>

    /**
     * Group by Api_key_logs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {api_key_logsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends api_key_logsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: api_key_logsGroupByArgs['orderBy'] }
        : { orderBy?: api_key_logsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, api_key_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApi_key_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the api_key_logs model
   */
  readonly fields: api_key_logsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for api_key_logs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__api_key_logsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    api_key<T extends api_keyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, api_keyDefaultArgs<ExtArgs>>): Prisma__api_keyClient<$Result.GetResult<Prisma.$api_keyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the api_key_logs model
   */
  interface api_key_logsFieldRefs {
    readonly id: FieldRef<"api_key_logs", 'Int'>
    readonly time: FieldRef<"api_key_logs", 'DateTime'>
    readonly ip: FieldRef<"api_key_logs", 'String'>
    readonly user_agent: FieldRef<"api_key_logs", 'String'>
    readonly key: FieldRef<"api_key_logs", 'String'>
  }
    

  // Custom InputTypes
  /**
   * api_key_logs findUnique
   */
  export type api_key_logsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * Filter, which api_key_logs to fetch.
     */
    where: api_key_logsWhereUniqueInput
  }

  /**
   * api_key_logs findUniqueOrThrow
   */
  export type api_key_logsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * Filter, which api_key_logs to fetch.
     */
    where: api_key_logsWhereUniqueInput
  }

  /**
   * api_key_logs findFirst
   */
  export type api_key_logsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * Filter, which api_key_logs to fetch.
     */
    where?: api_key_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_key_logs to fetch.
     */
    orderBy?: api_key_logsOrderByWithRelationInput | api_key_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for api_key_logs.
     */
    cursor?: api_key_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_key_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_key_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_key_logs.
     */
    distinct?: Api_key_logsScalarFieldEnum | Api_key_logsScalarFieldEnum[]
  }

  /**
   * api_key_logs findFirstOrThrow
   */
  export type api_key_logsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * Filter, which api_key_logs to fetch.
     */
    where?: api_key_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_key_logs to fetch.
     */
    orderBy?: api_key_logsOrderByWithRelationInput | api_key_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for api_key_logs.
     */
    cursor?: api_key_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_key_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_key_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_key_logs.
     */
    distinct?: Api_key_logsScalarFieldEnum | Api_key_logsScalarFieldEnum[]
  }

  /**
   * api_key_logs findMany
   */
  export type api_key_logsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * Filter, which api_key_logs to fetch.
     */
    where?: api_key_logsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of api_key_logs to fetch.
     */
    orderBy?: api_key_logsOrderByWithRelationInput | api_key_logsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing api_key_logs.
     */
    cursor?: api_key_logsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` api_key_logs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` api_key_logs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of api_key_logs.
     */
    distinct?: Api_key_logsScalarFieldEnum | Api_key_logsScalarFieldEnum[]
  }

  /**
   * api_key_logs create
   */
  export type api_key_logsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * The data needed to create a api_key_logs.
     */
    data: XOR<api_key_logsCreateInput, api_key_logsUncheckedCreateInput>
  }

  /**
   * api_key_logs createMany
   */
  export type api_key_logsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many api_key_logs.
     */
    data: api_key_logsCreateManyInput | api_key_logsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * api_key_logs update
   */
  export type api_key_logsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * The data needed to update a api_key_logs.
     */
    data: XOR<api_key_logsUpdateInput, api_key_logsUncheckedUpdateInput>
    /**
     * Choose, which api_key_logs to update.
     */
    where: api_key_logsWhereUniqueInput
  }

  /**
   * api_key_logs updateMany
   */
  export type api_key_logsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update api_key_logs.
     */
    data: XOR<api_key_logsUpdateManyMutationInput, api_key_logsUncheckedUpdateManyInput>
    /**
     * Filter which api_key_logs to update
     */
    where?: api_key_logsWhereInput
    /**
     * Limit how many api_key_logs to update.
     */
    limit?: number
  }

  /**
   * api_key_logs upsert
   */
  export type api_key_logsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * The filter to search for the api_key_logs to update in case it exists.
     */
    where: api_key_logsWhereUniqueInput
    /**
     * In case the api_key_logs found by the `where` argument doesn't exist, create a new api_key_logs with this data.
     */
    create: XOR<api_key_logsCreateInput, api_key_logsUncheckedCreateInput>
    /**
     * In case the api_key_logs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<api_key_logsUpdateInput, api_key_logsUncheckedUpdateInput>
  }

  /**
   * api_key_logs delete
   */
  export type api_key_logsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
    /**
     * Filter which api_key_logs to delete.
     */
    where: api_key_logsWhereUniqueInput
  }

  /**
   * api_key_logs deleteMany
   */
  export type api_key_logsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which api_key_logs to delete
     */
    where?: api_key_logsWhereInput
    /**
     * Limit how many api_key_logs to delete.
     */
    limit?: number
  }

  /**
   * api_key_logs without action
   */
  export type api_key_logsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the api_key_logs
     */
    select?: api_key_logsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the api_key_logs
     */
    omit?: api_key_logsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: api_key_logsInclude<ExtArgs> | null
  }


  /**
   * Model channel_notify_webhook
   */

  export type AggregateChannel_notify_webhook = {
    _count: Channel_notify_webhookCountAggregateOutputType | null
    _avg: Channel_notify_webhookAvgAggregateOutputType | null
    _sum: Channel_notify_webhookSumAggregateOutputType | null
    _min: Channel_notify_webhookMinAggregateOutputType | null
    _max: Channel_notify_webhookMaxAggregateOutputType | null
  }

  export type Channel_notify_webhookAvgAggregateOutputType = {
    id: number | null
    lease_sec: number | null
  }

  export type Channel_notify_webhookSumAggregateOutputType = {
    id: bigint | null
    lease_sec: number | null
  }

  export type Channel_notify_webhookMinAggregateOutputType = {
    id: bigint | null
    uuid: string | null
    time: Date | null
    by: string | null
    guild_id: string | null
    broadcaster_id: string | null
    webhook_url: string | null
    message: string | null
    verify_type: string | null
    verify_code: string | null
    hmac_secret: string | null
    lease_sec: number | null
    disabled: Date | null
    deleted: Date | null
  }

  export type Channel_notify_webhookMaxAggregateOutputType = {
    id: bigint | null
    uuid: string | null
    time: Date | null
    by: string | null
    guild_id: string | null
    broadcaster_id: string | null
    webhook_url: string | null
    message: string | null
    verify_type: string | null
    verify_code: string | null
    hmac_secret: string | null
    lease_sec: number | null
    disabled: Date | null
    deleted: Date | null
  }

  export type Channel_notify_webhookCountAggregateOutputType = {
    id: number
    uuid: number
    time: number
    by: number
    guild_id: number
    broadcaster_id: number
    webhook_url: number
    message: number
    verify_type: number
    verify_code: number
    hmac_secret: number
    lease_sec: number
    disabled: number
    deleted: number
    _all: number
  }


  export type Channel_notify_webhookAvgAggregateInputType = {
    id?: true
    lease_sec?: true
  }

  export type Channel_notify_webhookSumAggregateInputType = {
    id?: true
    lease_sec?: true
  }

  export type Channel_notify_webhookMinAggregateInputType = {
    id?: true
    uuid?: true
    time?: true
    by?: true
    guild_id?: true
    broadcaster_id?: true
    webhook_url?: true
    message?: true
    verify_type?: true
    verify_code?: true
    hmac_secret?: true
    lease_sec?: true
    disabled?: true
    deleted?: true
  }

  export type Channel_notify_webhookMaxAggregateInputType = {
    id?: true
    uuid?: true
    time?: true
    by?: true
    guild_id?: true
    broadcaster_id?: true
    webhook_url?: true
    message?: true
    verify_type?: true
    verify_code?: true
    hmac_secret?: true
    lease_sec?: true
    disabled?: true
    deleted?: true
  }

  export type Channel_notify_webhookCountAggregateInputType = {
    id?: true
    uuid?: true
    time?: true
    by?: true
    guild_id?: true
    broadcaster_id?: true
    webhook_url?: true
    message?: true
    verify_type?: true
    verify_code?: true
    hmac_secret?: true
    lease_sec?: true
    disabled?: true
    deleted?: true
    _all?: true
  }

  export type Channel_notify_webhookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which channel_notify_webhook to aggregate.
     */
    where?: channel_notify_webhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channel_notify_webhooks to fetch.
     */
    orderBy?: channel_notify_webhookOrderByWithRelationInput | channel_notify_webhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: channel_notify_webhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channel_notify_webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channel_notify_webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned channel_notify_webhooks
    **/
    _count?: true | Channel_notify_webhookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Channel_notify_webhookAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Channel_notify_webhookSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Channel_notify_webhookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Channel_notify_webhookMaxAggregateInputType
  }

  export type GetChannel_notify_webhookAggregateType<T extends Channel_notify_webhookAggregateArgs> = {
        [P in keyof T & keyof AggregateChannel_notify_webhook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChannel_notify_webhook[P]>
      : GetScalarType<T[P], AggregateChannel_notify_webhook[P]>
  }




  export type channel_notify_webhookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: channel_notify_webhookWhereInput
    orderBy?: channel_notify_webhookOrderByWithAggregationInput | channel_notify_webhookOrderByWithAggregationInput[]
    by: Channel_notify_webhookScalarFieldEnum[] | Channel_notify_webhookScalarFieldEnum
    having?: channel_notify_webhookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Channel_notify_webhookCountAggregateInputType | true
    _avg?: Channel_notify_webhookAvgAggregateInputType
    _sum?: Channel_notify_webhookSumAggregateInputType
    _min?: Channel_notify_webhookMinAggregateInputType
    _max?: Channel_notify_webhookMaxAggregateInputType
  }

  export type Channel_notify_webhookGroupByOutputType = {
    id: bigint
    uuid: string
    time: Date
    by: string
    guild_id: string
    broadcaster_id: string
    webhook_url: string
    message: string
    verify_type: string | null
    verify_code: string | null
    hmac_secret: string | null
    lease_sec: number | null
    disabled: Date | null
    deleted: Date | null
    _count: Channel_notify_webhookCountAggregateOutputType | null
    _avg: Channel_notify_webhookAvgAggregateOutputType | null
    _sum: Channel_notify_webhookSumAggregateOutputType | null
    _min: Channel_notify_webhookMinAggregateOutputType | null
    _max: Channel_notify_webhookMaxAggregateOutputType | null
  }

  type GetChannel_notify_webhookGroupByPayload<T extends channel_notify_webhookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Channel_notify_webhookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Channel_notify_webhookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Channel_notify_webhookGroupByOutputType[P]>
            : GetScalarType<T[P], Channel_notify_webhookGroupByOutputType[P]>
        }
      >
    >


  export type channel_notify_webhookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    time?: boolean
    by?: boolean
    guild_id?: boolean
    broadcaster_id?: boolean
    webhook_url?: boolean
    message?: boolean
    verify_type?: boolean
    verify_code?: boolean
    hmac_secret?: boolean
    lease_sec?: boolean
    disabled?: boolean
    deleted?: boolean
  }, ExtArgs["result"]["channel_notify_webhook"]>



  export type channel_notify_webhookSelectScalar = {
    id?: boolean
    uuid?: boolean
    time?: boolean
    by?: boolean
    guild_id?: boolean
    broadcaster_id?: boolean
    webhook_url?: boolean
    message?: boolean
    verify_type?: boolean
    verify_code?: boolean
    hmac_secret?: boolean
    lease_sec?: boolean
    disabled?: boolean
    deleted?: boolean
  }

  export type channel_notify_webhookOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "time" | "by" | "guild_id" | "broadcaster_id" | "webhook_url" | "message" | "verify_type" | "verify_code" | "hmac_secret" | "lease_sec" | "disabled" | "deleted", ExtArgs["result"]["channel_notify_webhook"]>

  export type $channel_notify_webhookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "channel_notify_webhook"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      uuid: string
      time: Date
      by: string
      guild_id: string
      broadcaster_id: string
      webhook_url: string
      message: string
      verify_type: string | null
      verify_code: string | null
      hmac_secret: string | null
      lease_sec: number | null
      disabled: Date | null
      deleted: Date | null
    }, ExtArgs["result"]["channel_notify_webhook"]>
    composites: {}
  }

  type channel_notify_webhookGetPayload<S extends boolean | null | undefined | channel_notify_webhookDefaultArgs> = $Result.GetResult<Prisma.$channel_notify_webhookPayload, S>

  type channel_notify_webhookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<channel_notify_webhookFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Channel_notify_webhookCountAggregateInputType | true
    }

  export interface channel_notify_webhookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['channel_notify_webhook'], meta: { name: 'channel_notify_webhook' } }
    /**
     * Find zero or one Channel_notify_webhook that matches the filter.
     * @param {channel_notify_webhookFindUniqueArgs} args - Arguments to find a Channel_notify_webhook
     * @example
     * // Get one Channel_notify_webhook
     * const channel_notify_webhook = await prisma.channel_notify_webhook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends channel_notify_webhookFindUniqueArgs>(args: SelectSubset<T, channel_notify_webhookFindUniqueArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Channel_notify_webhook that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {channel_notify_webhookFindUniqueOrThrowArgs} args - Arguments to find a Channel_notify_webhook
     * @example
     * // Get one Channel_notify_webhook
     * const channel_notify_webhook = await prisma.channel_notify_webhook.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends channel_notify_webhookFindUniqueOrThrowArgs>(args: SelectSubset<T, channel_notify_webhookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Channel_notify_webhook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channel_notify_webhookFindFirstArgs} args - Arguments to find a Channel_notify_webhook
     * @example
     * // Get one Channel_notify_webhook
     * const channel_notify_webhook = await prisma.channel_notify_webhook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends channel_notify_webhookFindFirstArgs>(args?: SelectSubset<T, channel_notify_webhookFindFirstArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Channel_notify_webhook that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channel_notify_webhookFindFirstOrThrowArgs} args - Arguments to find a Channel_notify_webhook
     * @example
     * // Get one Channel_notify_webhook
     * const channel_notify_webhook = await prisma.channel_notify_webhook.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends channel_notify_webhookFindFirstOrThrowArgs>(args?: SelectSubset<T, channel_notify_webhookFindFirstOrThrowArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Channel_notify_webhooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channel_notify_webhookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Channel_notify_webhooks
     * const channel_notify_webhooks = await prisma.channel_notify_webhook.findMany()
     * 
     * // Get first 10 Channel_notify_webhooks
     * const channel_notify_webhooks = await prisma.channel_notify_webhook.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const channel_notify_webhookWithIdOnly = await prisma.channel_notify_webhook.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends channel_notify_webhookFindManyArgs>(args?: SelectSubset<T, channel_notify_webhookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Channel_notify_webhook.
     * @param {channel_notify_webhookCreateArgs} args - Arguments to create a Channel_notify_webhook.
     * @example
     * // Create one Channel_notify_webhook
     * const Channel_notify_webhook = await prisma.channel_notify_webhook.create({
     *   data: {
     *     // ... data to create a Channel_notify_webhook
     *   }
     * })
     * 
     */
    create<T extends channel_notify_webhookCreateArgs>(args: SelectSubset<T, channel_notify_webhookCreateArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Channel_notify_webhooks.
     * @param {channel_notify_webhookCreateManyArgs} args - Arguments to create many Channel_notify_webhooks.
     * @example
     * // Create many Channel_notify_webhooks
     * const channel_notify_webhook = await prisma.channel_notify_webhook.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends channel_notify_webhookCreateManyArgs>(args?: SelectSubset<T, channel_notify_webhookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Channel_notify_webhook.
     * @param {channel_notify_webhookDeleteArgs} args - Arguments to delete one Channel_notify_webhook.
     * @example
     * // Delete one Channel_notify_webhook
     * const Channel_notify_webhook = await prisma.channel_notify_webhook.delete({
     *   where: {
     *     // ... filter to delete one Channel_notify_webhook
     *   }
     * })
     * 
     */
    delete<T extends channel_notify_webhookDeleteArgs>(args: SelectSubset<T, channel_notify_webhookDeleteArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Channel_notify_webhook.
     * @param {channel_notify_webhookUpdateArgs} args - Arguments to update one Channel_notify_webhook.
     * @example
     * // Update one Channel_notify_webhook
     * const channel_notify_webhook = await prisma.channel_notify_webhook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends channel_notify_webhookUpdateArgs>(args: SelectSubset<T, channel_notify_webhookUpdateArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Channel_notify_webhooks.
     * @param {channel_notify_webhookDeleteManyArgs} args - Arguments to filter Channel_notify_webhooks to delete.
     * @example
     * // Delete a few Channel_notify_webhooks
     * const { count } = await prisma.channel_notify_webhook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends channel_notify_webhookDeleteManyArgs>(args?: SelectSubset<T, channel_notify_webhookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Channel_notify_webhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channel_notify_webhookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Channel_notify_webhooks
     * const channel_notify_webhook = await prisma.channel_notify_webhook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends channel_notify_webhookUpdateManyArgs>(args: SelectSubset<T, channel_notify_webhookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Channel_notify_webhook.
     * @param {channel_notify_webhookUpsertArgs} args - Arguments to update or create a Channel_notify_webhook.
     * @example
     * // Update or create a Channel_notify_webhook
     * const channel_notify_webhook = await prisma.channel_notify_webhook.upsert({
     *   create: {
     *     // ... data to create a Channel_notify_webhook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Channel_notify_webhook we want to update
     *   }
     * })
     */
    upsert<T extends channel_notify_webhookUpsertArgs>(args: SelectSubset<T, channel_notify_webhookUpsertArgs<ExtArgs>>): Prisma__channel_notify_webhookClient<$Result.GetResult<Prisma.$channel_notify_webhookPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Channel_notify_webhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channel_notify_webhookCountArgs} args - Arguments to filter Channel_notify_webhooks to count.
     * @example
     * // Count the number of Channel_notify_webhooks
     * const count = await prisma.channel_notify_webhook.count({
     *   where: {
     *     // ... the filter for the Channel_notify_webhooks we want to count
     *   }
     * })
    **/
    count<T extends channel_notify_webhookCountArgs>(
      args?: Subset<T, channel_notify_webhookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Channel_notify_webhookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Channel_notify_webhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Channel_notify_webhookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Channel_notify_webhookAggregateArgs>(args: Subset<T, Channel_notify_webhookAggregateArgs>): Prisma.PrismaPromise<GetChannel_notify_webhookAggregateType<T>>

    /**
     * Group by Channel_notify_webhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channel_notify_webhookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends channel_notify_webhookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: channel_notify_webhookGroupByArgs['orderBy'] }
        : { orderBy?: channel_notify_webhookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, channel_notify_webhookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannel_notify_webhookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the channel_notify_webhook model
   */
  readonly fields: channel_notify_webhookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for channel_notify_webhook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__channel_notify_webhookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the channel_notify_webhook model
   */
  interface channel_notify_webhookFieldRefs {
    readonly id: FieldRef<"channel_notify_webhook", 'BigInt'>
    readonly uuid: FieldRef<"channel_notify_webhook", 'String'>
    readonly time: FieldRef<"channel_notify_webhook", 'DateTime'>
    readonly by: FieldRef<"channel_notify_webhook", 'String'>
    readonly guild_id: FieldRef<"channel_notify_webhook", 'String'>
    readonly broadcaster_id: FieldRef<"channel_notify_webhook", 'String'>
    readonly webhook_url: FieldRef<"channel_notify_webhook", 'String'>
    readonly message: FieldRef<"channel_notify_webhook", 'String'>
    readonly verify_type: FieldRef<"channel_notify_webhook", 'String'>
    readonly verify_code: FieldRef<"channel_notify_webhook", 'String'>
    readonly hmac_secret: FieldRef<"channel_notify_webhook", 'String'>
    readonly lease_sec: FieldRef<"channel_notify_webhook", 'Int'>
    readonly disabled: FieldRef<"channel_notify_webhook", 'DateTime'>
    readonly deleted: FieldRef<"channel_notify_webhook", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * channel_notify_webhook findUnique
   */
  export type channel_notify_webhookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * Filter, which channel_notify_webhook to fetch.
     */
    where: channel_notify_webhookWhereUniqueInput
  }

  /**
   * channel_notify_webhook findUniqueOrThrow
   */
  export type channel_notify_webhookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * Filter, which channel_notify_webhook to fetch.
     */
    where: channel_notify_webhookWhereUniqueInput
  }

  /**
   * channel_notify_webhook findFirst
   */
  export type channel_notify_webhookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * Filter, which channel_notify_webhook to fetch.
     */
    where?: channel_notify_webhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channel_notify_webhooks to fetch.
     */
    orderBy?: channel_notify_webhookOrderByWithRelationInput | channel_notify_webhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for channel_notify_webhooks.
     */
    cursor?: channel_notify_webhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channel_notify_webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channel_notify_webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of channel_notify_webhooks.
     */
    distinct?: Channel_notify_webhookScalarFieldEnum | Channel_notify_webhookScalarFieldEnum[]
  }

  /**
   * channel_notify_webhook findFirstOrThrow
   */
  export type channel_notify_webhookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * Filter, which channel_notify_webhook to fetch.
     */
    where?: channel_notify_webhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channel_notify_webhooks to fetch.
     */
    orderBy?: channel_notify_webhookOrderByWithRelationInput | channel_notify_webhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for channel_notify_webhooks.
     */
    cursor?: channel_notify_webhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channel_notify_webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channel_notify_webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of channel_notify_webhooks.
     */
    distinct?: Channel_notify_webhookScalarFieldEnum | Channel_notify_webhookScalarFieldEnum[]
  }

  /**
   * channel_notify_webhook findMany
   */
  export type channel_notify_webhookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * Filter, which channel_notify_webhooks to fetch.
     */
    where?: channel_notify_webhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channel_notify_webhooks to fetch.
     */
    orderBy?: channel_notify_webhookOrderByWithRelationInput | channel_notify_webhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing channel_notify_webhooks.
     */
    cursor?: channel_notify_webhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channel_notify_webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channel_notify_webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of channel_notify_webhooks.
     */
    distinct?: Channel_notify_webhookScalarFieldEnum | Channel_notify_webhookScalarFieldEnum[]
  }

  /**
   * channel_notify_webhook create
   */
  export type channel_notify_webhookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * The data needed to create a channel_notify_webhook.
     */
    data: XOR<channel_notify_webhookCreateInput, channel_notify_webhookUncheckedCreateInput>
  }

  /**
   * channel_notify_webhook createMany
   */
  export type channel_notify_webhookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many channel_notify_webhooks.
     */
    data: channel_notify_webhookCreateManyInput | channel_notify_webhookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * channel_notify_webhook update
   */
  export type channel_notify_webhookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * The data needed to update a channel_notify_webhook.
     */
    data: XOR<channel_notify_webhookUpdateInput, channel_notify_webhookUncheckedUpdateInput>
    /**
     * Choose, which channel_notify_webhook to update.
     */
    where: channel_notify_webhookWhereUniqueInput
  }

  /**
   * channel_notify_webhook updateMany
   */
  export type channel_notify_webhookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update channel_notify_webhooks.
     */
    data: XOR<channel_notify_webhookUpdateManyMutationInput, channel_notify_webhookUncheckedUpdateManyInput>
    /**
     * Filter which channel_notify_webhooks to update
     */
    where?: channel_notify_webhookWhereInput
    /**
     * Limit how many channel_notify_webhooks to update.
     */
    limit?: number
  }

  /**
   * channel_notify_webhook upsert
   */
  export type channel_notify_webhookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * The filter to search for the channel_notify_webhook to update in case it exists.
     */
    where: channel_notify_webhookWhereUniqueInput
    /**
     * In case the channel_notify_webhook found by the `where` argument doesn't exist, create a new channel_notify_webhook with this data.
     */
    create: XOR<channel_notify_webhookCreateInput, channel_notify_webhookUncheckedCreateInput>
    /**
     * In case the channel_notify_webhook was found with the provided `where` argument, update it with this data.
     */
    update: XOR<channel_notify_webhookUpdateInput, channel_notify_webhookUncheckedUpdateInput>
  }

  /**
   * channel_notify_webhook delete
   */
  export type channel_notify_webhookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
    /**
     * Filter which channel_notify_webhook to delete.
     */
    where: channel_notify_webhookWhereUniqueInput
  }

  /**
   * channel_notify_webhook deleteMany
   */
  export type channel_notify_webhookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which channel_notify_webhooks to delete
     */
    where?: channel_notify_webhookWhereInput
    /**
     * Limit how many channel_notify_webhooks to delete.
     */
    limit?: number
  }

  /**
   * channel_notify_webhook without action
   */
  export type channel_notify_webhookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel_notify_webhook
     */
    select?: channel_notify_webhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel_notify_webhook
     */
    omit?: channel_notify_webhookOmit<ExtArgs> | null
  }


  /**
   * Model favorite_track
   */

  export type AggregateFavorite_track = {
    _count: Favorite_trackCountAggregateOutputType | null
    _avg: Favorite_trackAvgAggregateOutputType | null
    _sum: Favorite_trackSumAggregateOutputType | null
    _min: Favorite_trackMinAggregateOutputType | null
    _max: Favorite_trackMaxAggregateOutputType | null
  }

  export type Favorite_trackAvgAggregateOutputType = {
    id: number | null
  }

  export type Favorite_trackSumAggregateOutputType = {
    id: bigint | null
  }

  export type Favorite_trackMinAggregateOutputType = {
    id: bigint | null
    uid: string | null
    time: Date | null
    target: string | null
    source: string | null
    cache: string | null
    cache_lastupdated: Date | null
  }

  export type Favorite_trackMaxAggregateOutputType = {
    id: bigint | null
    uid: string | null
    time: Date | null
    target: string | null
    source: string | null
    cache: string | null
    cache_lastupdated: Date | null
  }

  export type Favorite_trackCountAggregateOutputType = {
    id: number
    uid: number
    time: number
    target: number
    source: number
    cache: number
    cache_lastupdated: number
    _all: number
  }


  export type Favorite_trackAvgAggregateInputType = {
    id?: true
  }

  export type Favorite_trackSumAggregateInputType = {
    id?: true
  }

  export type Favorite_trackMinAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    target?: true
    source?: true
    cache?: true
    cache_lastupdated?: true
  }

  export type Favorite_trackMaxAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    target?: true
    source?: true
    cache?: true
    cache_lastupdated?: true
  }

  export type Favorite_trackCountAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    target?: true
    source?: true
    cache?: true
    cache_lastupdated?: true
    _all?: true
  }

  export type Favorite_trackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which favorite_track to aggregate.
     */
    where?: favorite_trackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of favorite_tracks to fetch.
     */
    orderBy?: favorite_trackOrderByWithRelationInput | favorite_trackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: favorite_trackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` favorite_tracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` favorite_tracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned favorite_tracks
    **/
    _count?: true | Favorite_trackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Favorite_trackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Favorite_trackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Favorite_trackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Favorite_trackMaxAggregateInputType
  }

  export type GetFavorite_trackAggregateType<T extends Favorite_trackAggregateArgs> = {
        [P in keyof T & keyof AggregateFavorite_track]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFavorite_track[P]>
      : GetScalarType<T[P], AggregateFavorite_track[P]>
  }




  export type favorite_trackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: favorite_trackWhereInput
    orderBy?: favorite_trackOrderByWithAggregationInput | favorite_trackOrderByWithAggregationInput[]
    by: Favorite_trackScalarFieldEnum[] | Favorite_trackScalarFieldEnum
    having?: favorite_trackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Favorite_trackCountAggregateInputType | true
    _avg?: Favorite_trackAvgAggregateInputType
    _sum?: Favorite_trackSumAggregateInputType
    _min?: Favorite_trackMinAggregateInputType
    _max?: Favorite_trackMaxAggregateInputType
  }

  export type Favorite_trackGroupByOutputType = {
    id: bigint
    uid: string
    time: Date
    target: string
    source: string
    cache: string | null
    cache_lastupdated: Date | null
    _count: Favorite_trackCountAggregateOutputType | null
    _avg: Favorite_trackAvgAggregateOutputType | null
    _sum: Favorite_trackSumAggregateOutputType | null
    _min: Favorite_trackMinAggregateOutputType | null
    _max: Favorite_trackMaxAggregateOutputType | null
  }

  type GetFavorite_trackGroupByPayload<T extends favorite_trackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Favorite_trackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Favorite_trackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Favorite_trackGroupByOutputType[P]>
            : GetScalarType<T[P], Favorite_trackGroupByOutputType[P]>
        }
      >
    >


  export type favorite_trackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    time?: boolean
    target?: boolean
    source?: boolean
    cache?: boolean
    cache_lastupdated?: boolean
  }, ExtArgs["result"]["favorite_track"]>



  export type favorite_trackSelectScalar = {
    id?: boolean
    uid?: boolean
    time?: boolean
    target?: boolean
    source?: boolean
    cache?: boolean
    cache_lastupdated?: boolean
  }

  export type favorite_trackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "time" | "target" | "source" | "cache" | "cache_lastupdated", ExtArgs["result"]["favorite_track"]>

  export type $favorite_trackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "favorite_track"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      uid: string
      time: Date
      target: string
      source: string
      cache: string | null
      cache_lastupdated: Date | null
    }, ExtArgs["result"]["favorite_track"]>
    composites: {}
  }

  type favorite_trackGetPayload<S extends boolean | null | undefined | favorite_trackDefaultArgs> = $Result.GetResult<Prisma.$favorite_trackPayload, S>

  type favorite_trackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<favorite_trackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Favorite_trackCountAggregateInputType | true
    }

  export interface favorite_trackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['favorite_track'], meta: { name: 'favorite_track' } }
    /**
     * Find zero or one Favorite_track that matches the filter.
     * @param {favorite_trackFindUniqueArgs} args - Arguments to find a Favorite_track
     * @example
     * // Get one Favorite_track
     * const favorite_track = await prisma.favorite_track.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends favorite_trackFindUniqueArgs>(args: SelectSubset<T, favorite_trackFindUniqueArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Favorite_track that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {favorite_trackFindUniqueOrThrowArgs} args - Arguments to find a Favorite_track
     * @example
     * // Get one Favorite_track
     * const favorite_track = await prisma.favorite_track.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends favorite_trackFindUniqueOrThrowArgs>(args: SelectSubset<T, favorite_trackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Favorite_track that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {favorite_trackFindFirstArgs} args - Arguments to find a Favorite_track
     * @example
     * // Get one Favorite_track
     * const favorite_track = await prisma.favorite_track.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends favorite_trackFindFirstArgs>(args?: SelectSubset<T, favorite_trackFindFirstArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Favorite_track that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {favorite_trackFindFirstOrThrowArgs} args - Arguments to find a Favorite_track
     * @example
     * // Get one Favorite_track
     * const favorite_track = await prisma.favorite_track.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends favorite_trackFindFirstOrThrowArgs>(args?: SelectSubset<T, favorite_trackFindFirstOrThrowArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Favorite_tracks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {favorite_trackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Favorite_tracks
     * const favorite_tracks = await prisma.favorite_track.findMany()
     * 
     * // Get first 10 Favorite_tracks
     * const favorite_tracks = await prisma.favorite_track.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const favorite_trackWithIdOnly = await prisma.favorite_track.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends favorite_trackFindManyArgs>(args?: SelectSubset<T, favorite_trackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Favorite_track.
     * @param {favorite_trackCreateArgs} args - Arguments to create a Favorite_track.
     * @example
     * // Create one Favorite_track
     * const Favorite_track = await prisma.favorite_track.create({
     *   data: {
     *     // ... data to create a Favorite_track
     *   }
     * })
     * 
     */
    create<T extends favorite_trackCreateArgs>(args: SelectSubset<T, favorite_trackCreateArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Favorite_tracks.
     * @param {favorite_trackCreateManyArgs} args - Arguments to create many Favorite_tracks.
     * @example
     * // Create many Favorite_tracks
     * const favorite_track = await prisma.favorite_track.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends favorite_trackCreateManyArgs>(args?: SelectSubset<T, favorite_trackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Favorite_track.
     * @param {favorite_trackDeleteArgs} args - Arguments to delete one Favorite_track.
     * @example
     * // Delete one Favorite_track
     * const Favorite_track = await prisma.favorite_track.delete({
     *   where: {
     *     // ... filter to delete one Favorite_track
     *   }
     * })
     * 
     */
    delete<T extends favorite_trackDeleteArgs>(args: SelectSubset<T, favorite_trackDeleteArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Favorite_track.
     * @param {favorite_trackUpdateArgs} args - Arguments to update one Favorite_track.
     * @example
     * // Update one Favorite_track
     * const favorite_track = await prisma.favorite_track.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends favorite_trackUpdateArgs>(args: SelectSubset<T, favorite_trackUpdateArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Favorite_tracks.
     * @param {favorite_trackDeleteManyArgs} args - Arguments to filter Favorite_tracks to delete.
     * @example
     * // Delete a few Favorite_tracks
     * const { count } = await prisma.favorite_track.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends favorite_trackDeleteManyArgs>(args?: SelectSubset<T, favorite_trackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Favorite_tracks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {favorite_trackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Favorite_tracks
     * const favorite_track = await prisma.favorite_track.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends favorite_trackUpdateManyArgs>(args: SelectSubset<T, favorite_trackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Favorite_track.
     * @param {favorite_trackUpsertArgs} args - Arguments to update or create a Favorite_track.
     * @example
     * // Update or create a Favorite_track
     * const favorite_track = await prisma.favorite_track.upsert({
     *   create: {
     *     // ... data to create a Favorite_track
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Favorite_track we want to update
     *   }
     * })
     */
    upsert<T extends favorite_trackUpsertArgs>(args: SelectSubset<T, favorite_trackUpsertArgs<ExtArgs>>): Prisma__favorite_trackClient<$Result.GetResult<Prisma.$favorite_trackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Favorite_tracks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {favorite_trackCountArgs} args - Arguments to filter Favorite_tracks to count.
     * @example
     * // Count the number of Favorite_tracks
     * const count = await prisma.favorite_track.count({
     *   where: {
     *     // ... the filter for the Favorite_tracks we want to count
     *   }
     * })
    **/
    count<T extends favorite_trackCountArgs>(
      args?: Subset<T, favorite_trackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Favorite_trackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Favorite_track.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Favorite_trackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Favorite_trackAggregateArgs>(args: Subset<T, Favorite_trackAggregateArgs>): Prisma.PrismaPromise<GetFavorite_trackAggregateType<T>>

    /**
     * Group by Favorite_track.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {favorite_trackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends favorite_trackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: favorite_trackGroupByArgs['orderBy'] }
        : { orderBy?: favorite_trackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, favorite_trackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFavorite_trackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the favorite_track model
   */
  readonly fields: favorite_trackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for favorite_track.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__favorite_trackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the favorite_track model
   */
  interface favorite_trackFieldRefs {
    readonly id: FieldRef<"favorite_track", 'BigInt'>
    readonly uid: FieldRef<"favorite_track", 'String'>
    readonly time: FieldRef<"favorite_track", 'DateTime'>
    readonly target: FieldRef<"favorite_track", 'String'>
    readonly source: FieldRef<"favorite_track", 'String'>
    readonly cache: FieldRef<"favorite_track", 'String'>
    readonly cache_lastupdated: FieldRef<"favorite_track", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * favorite_track findUnique
   */
  export type favorite_trackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * Filter, which favorite_track to fetch.
     */
    where: favorite_trackWhereUniqueInput
  }

  /**
   * favorite_track findUniqueOrThrow
   */
  export type favorite_trackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * Filter, which favorite_track to fetch.
     */
    where: favorite_trackWhereUniqueInput
  }

  /**
   * favorite_track findFirst
   */
  export type favorite_trackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * Filter, which favorite_track to fetch.
     */
    where?: favorite_trackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of favorite_tracks to fetch.
     */
    orderBy?: favorite_trackOrderByWithRelationInput | favorite_trackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for favorite_tracks.
     */
    cursor?: favorite_trackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` favorite_tracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` favorite_tracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of favorite_tracks.
     */
    distinct?: Favorite_trackScalarFieldEnum | Favorite_trackScalarFieldEnum[]
  }

  /**
   * favorite_track findFirstOrThrow
   */
  export type favorite_trackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * Filter, which favorite_track to fetch.
     */
    where?: favorite_trackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of favorite_tracks to fetch.
     */
    orderBy?: favorite_trackOrderByWithRelationInput | favorite_trackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for favorite_tracks.
     */
    cursor?: favorite_trackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` favorite_tracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` favorite_tracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of favorite_tracks.
     */
    distinct?: Favorite_trackScalarFieldEnum | Favorite_trackScalarFieldEnum[]
  }

  /**
   * favorite_track findMany
   */
  export type favorite_trackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * Filter, which favorite_tracks to fetch.
     */
    where?: favorite_trackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of favorite_tracks to fetch.
     */
    orderBy?: favorite_trackOrderByWithRelationInput | favorite_trackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing favorite_tracks.
     */
    cursor?: favorite_trackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` favorite_tracks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` favorite_tracks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of favorite_tracks.
     */
    distinct?: Favorite_trackScalarFieldEnum | Favorite_trackScalarFieldEnum[]
  }

  /**
   * favorite_track create
   */
  export type favorite_trackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * The data needed to create a favorite_track.
     */
    data: XOR<favorite_trackCreateInput, favorite_trackUncheckedCreateInput>
  }

  /**
   * favorite_track createMany
   */
  export type favorite_trackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many favorite_tracks.
     */
    data: favorite_trackCreateManyInput | favorite_trackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * favorite_track update
   */
  export type favorite_trackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * The data needed to update a favorite_track.
     */
    data: XOR<favorite_trackUpdateInput, favorite_trackUncheckedUpdateInput>
    /**
     * Choose, which favorite_track to update.
     */
    where: favorite_trackWhereUniqueInput
  }

  /**
   * favorite_track updateMany
   */
  export type favorite_trackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update favorite_tracks.
     */
    data: XOR<favorite_trackUpdateManyMutationInput, favorite_trackUncheckedUpdateManyInput>
    /**
     * Filter which favorite_tracks to update
     */
    where?: favorite_trackWhereInput
    /**
     * Limit how many favorite_tracks to update.
     */
    limit?: number
  }

  /**
   * favorite_track upsert
   */
  export type favorite_trackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * The filter to search for the favorite_track to update in case it exists.
     */
    where: favorite_trackWhereUniqueInput
    /**
     * In case the favorite_track found by the `where` argument doesn't exist, create a new favorite_track with this data.
     */
    create: XOR<favorite_trackCreateInput, favorite_trackUncheckedCreateInput>
    /**
     * In case the favorite_track was found with the provided `where` argument, update it with this data.
     */
    update: XOR<favorite_trackUpdateInput, favorite_trackUncheckedUpdateInput>
  }

  /**
   * favorite_track delete
   */
  export type favorite_trackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
    /**
     * Filter which favorite_track to delete.
     */
    where: favorite_trackWhereUniqueInput
  }

  /**
   * favorite_track deleteMany
   */
  export type favorite_trackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which favorite_tracks to delete
     */
    where?: favorite_trackWhereInput
    /**
     * Limit how many favorite_tracks to delete.
     */
    limit?: number
  }

  /**
   * favorite_track without action
   */
  export type favorite_trackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the favorite_track
     */
    select?: favorite_trackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the favorite_track
     */
    omit?: favorite_trackOmit<ExtArgs> | null
  }


  /**
   * Model feedback
   */

  export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  export type FeedbackAvgAggregateOutputType = {
    id: number | null
  }

  export type FeedbackSumAggregateOutputType = {
    id: number | null
  }

  export type FeedbackMinAggregateOutputType = {
    id: number | null
    time: Date | null
    message: string | null
    email: string | null
  }

  export type FeedbackMaxAggregateOutputType = {
    id: number | null
    time: Date | null
    message: string | null
    email: string | null
  }

  export type FeedbackCountAggregateOutputType = {
    id: number
    time: number
    message: number
    email: number
    _all: number
  }


  export type FeedbackAvgAggregateInputType = {
    id?: true
  }

  export type FeedbackSumAggregateInputType = {
    id?: true
  }

  export type FeedbackMinAggregateInputType = {
    id?: true
    time?: true
    message?: true
    email?: true
  }

  export type FeedbackMaxAggregateInputType = {
    id?: true
    time?: true
    message?: true
    email?: true
  }

  export type FeedbackCountAggregateInputType = {
    id?: true
    time?: true
    message?: true
    email?: true
    _all?: true
  }

  export type FeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which feedback to aggregate.
     */
    where?: feedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbackOrderByWithRelationInput | feedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: feedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned feedbacks
    **/
    _count?: true | FeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbackMaxAggregateInputType
  }

  export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedback[P]>
      : GetScalarType<T[P], AggregateFeedback[P]>
  }




  export type feedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: feedbackWhereInput
    orderBy?: feedbackOrderByWithAggregationInput | feedbackOrderByWithAggregationInput[]
    by: FeedbackScalarFieldEnum[] | FeedbackScalarFieldEnum
    having?: feedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbackCountAggregateInputType | true
    _avg?: FeedbackAvgAggregateInputType
    _sum?: FeedbackSumAggregateInputType
    _min?: FeedbackMinAggregateInputType
    _max?: FeedbackMaxAggregateInputType
  }

  export type FeedbackGroupByOutputType = {
    id: number
    time: Date
    message: string
    email: string | null
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  type GetFeedbackGroupByPayload<T extends feedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
        }
      >
    >


  export type feedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    message?: boolean
    email?: boolean
  }, ExtArgs["result"]["feedback"]>



  export type feedbackSelectScalar = {
    id?: boolean
    time?: boolean
    message?: boolean
    email?: boolean
  }

  export type feedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "time" | "message" | "email", ExtArgs["result"]["feedback"]>

  export type $feedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "feedback"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      time: Date
      message: string
      email: string | null
    }, ExtArgs["result"]["feedback"]>
    composites: {}
  }

  type feedbackGetPayload<S extends boolean | null | undefined | feedbackDefaultArgs> = $Result.GetResult<Prisma.$feedbackPayload, S>

  type feedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<feedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbackCountAggregateInputType | true
    }

  export interface feedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['feedback'], meta: { name: 'feedback' } }
    /**
     * Find zero or one Feedback that matches the filter.
     * @param {feedbackFindUniqueArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends feedbackFindUniqueArgs>(args: SelectSubset<T, feedbackFindUniqueArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {feedbackFindUniqueOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends feedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, feedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbackFindFirstArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends feedbackFindFirstArgs>(args?: SelectSubset<T, feedbackFindFirstArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbackFindFirstOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends feedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, feedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedback.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbackWithIdOnly = await prisma.feedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends feedbackFindManyArgs>(args?: SelectSubset<T, feedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedback.
     * @param {feedbackCreateArgs} args - Arguments to create a Feedback.
     * @example
     * // Create one Feedback
     * const Feedback = await prisma.feedback.create({
     *   data: {
     *     // ... data to create a Feedback
     *   }
     * })
     * 
     */
    create<T extends feedbackCreateArgs>(args: SelectSubset<T, feedbackCreateArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {feedbackCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends feedbackCreateManyArgs>(args?: SelectSubset<T, feedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Feedback.
     * @param {feedbackDeleteArgs} args - Arguments to delete one Feedback.
     * @example
     * // Delete one Feedback
     * const Feedback = await prisma.feedback.delete({
     *   where: {
     *     // ... filter to delete one Feedback
     *   }
     * })
     * 
     */
    delete<T extends feedbackDeleteArgs>(args: SelectSubset<T, feedbackDeleteArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedback.
     * @param {feedbackUpdateArgs} args - Arguments to update one Feedback.
     * @example
     * // Update one Feedback
     * const feedback = await prisma.feedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends feedbackUpdateArgs>(args: SelectSubset<T, feedbackUpdateArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {feedbackDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends feedbackDeleteManyArgs>(args?: SelectSubset<T, feedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends feedbackUpdateManyArgs>(args: SelectSubset<T, feedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Feedback.
     * @param {feedbackUpsertArgs} args - Arguments to update or create a Feedback.
     * @example
     * // Update or create a Feedback
     * const feedback = await prisma.feedback.upsert({
     *   create: {
     *     // ... data to create a Feedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedback we want to update
     *   }
     * })
     */
    upsert<T extends feedbackUpsertArgs>(args: SelectSubset<T, feedbackUpsertArgs<ExtArgs>>): Prisma__feedbackClient<$Result.GetResult<Prisma.$feedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbackCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedback.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends feedbackCountArgs>(
      args?: Subset<T, feedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbackAggregateArgs>(args: Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>

    /**
     * Group by Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {feedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends feedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: feedbackGroupByArgs['orderBy'] }
        : { orderBy?: feedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, feedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the feedback model
   */
  readonly fields: feedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for feedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__feedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the feedback model
   */
  interface feedbackFieldRefs {
    readonly id: FieldRef<"feedback", 'Int'>
    readonly time: FieldRef<"feedback", 'DateTime'>
    readonly message: FieldRef<"feedback", 'String'>
    readonly email: FieldRef<"feedback", 'String'>
  }
    

  // Custom InputTypes
  /**
   * feedback findUnique
   */
  export type feedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * Filter, which feedback to fetch.
     */
    where: feedbackWhereUniqueInput
  }

  /**
   * feedback findUniqueOrThrow
   */
  export type feedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * Filter, which feedback to fetch.
     */
    where: feedbackWhereUniqueInput
  }

  /**
   * feedback findFirst
   */
  export type feedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * Filter, which feedback to fetch.
     */
    where?: feedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbackOrderByWithRelationInput | feedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for feedbacks.
     */
    cursor?: feedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * feedback findFirstOrThrow
   */
  export type feedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * Filter, which feedback to fetch.
     */
    where?: feedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbackOrderByWithRelationInput | feedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for feedbacks.
     */
    cursor?: feedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * feedback findMany
   */
  export type feedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * Filter, which feedbacks to fetch.
     */
    where?: feedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of feedbacks to fetch.
     */
    orderBy?: feedbackOrderByWithRelationInput | feedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing feedbacks.
     */
    cursor?: feedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * feedback create
   */
  export type feedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * The data needed to create a feedback.
     */
    data: XOR<feedbackCreateInput, feedbackUncheckedCreateInput>
  }

  /**
   * feedback createMany
   */
  export type feedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many feedbacks.
     */
    data: feedbackCreateManyInput | feedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * feedback update
   */
  export type feedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * The data needed to update a feedback.
     */
    data: XOR<feedbackUpdateInput, feedbackUncheckedUpdateInput>
    /**
     * Choose, which feedback to update.
     */
    where: feedbackWhereUniqueInput
  }

  /**
   * feedback updateMany
   */
  export type feedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update feedbacks.
     */
    data: XOR<feedbackUpdateManyMutationInput, feedbackUncheckedUpdateManyInput>
    /**
     * Filter which feedbacks to update
     */
    where?: feedbackWhereInput
    /**
     * Limit how many feedbacks to update.
     */
    limit?: number
  }

  /**
   * feedback upsert
   */
  export type feedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * The filter to search for the feedback to update in case it exists.
     */
    where: feedbackWhereUniqueInput
    /**
     * In case the feedback found by the `where` argument doesn't exist, create a new feedback with this data.
     */
    create: XOR<feedbackCreateInput, feedbackUncheckedCreateInput>
    /**
     * In case the feedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<feedbackUpdateInput, feedbackUncheckedUpdateInput>
  }

  /**
   * feedback delete
   */
  export type feedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
    /**
     * Filter which feedback to delete.
     */
    where: feedbackWhereUniqueInput
  }

  /**
   * feedback deleteMany
   */
  export type feedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which feedbacks to delete
     */
    where?: feedbackWhereInput
    /**
     * Limit how many feedbacks to delete.
     */
    limit?: number
  }

  /**
   * feedback without action
   */
  export type feedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the feedback
     */
    select?: feedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the feedback
     */
    omit?: feedbackOmit<ExtArgs> | null
  }


  /**
   * Model guilds
   */

  export type AggregateGuilds = {
    _count: GuildsCountAggregateOutputType | null
    _avg: GuildsAvgAggregateOutputType | null
    _sum: GuildsSumAggregateOutputType | null
    _min: GuildsMinAggregateOutputType | null
    _max: GuildsMaxAggregateOutputType | null
  }

  export type GuildsAvgAggregateOutputType = {
    id: number | null
  }

  export type GuildsSumAggregateOutputType = {
    id: bigint | null
  }

  export type GuildsMinAggregateOutputType = {
    id: bigint | null
    guildid: string | null
    args: string | null
  }

  export type GuildsMaxAggregateOutputType = {
    id: bigint | null
    guildid: string | null
    args: string | null
  }

  export type GuildsCountAggregateOutputType = {
    id: number
    guildid: number
    args: number
    _all: number
  }


  export type GuildsAvgAggregateInputType = {
    id?: true
  }

  export type GuildsSumAggregateInputType = {
    id?: true
  }

  export type GuildsMinAggregateInputType = {
    id?: true
    guildid?: true
    args?: true
  }

  export type GuildsMaxAggregateInputType = {
    id?: true
    guildid?: true
    args?: true
  }

  export type GuildsCountAggregateInputType = {
    id?: true
    guildid?: true
    args?: true
    _all?: true
  }

  export type GuildsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which guilds to aggregate.
     */
    where?: guildsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of guilds to fetch.
     */
    orderBy?: guildsOrderByWithRelationInput | guildsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: guildsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned guilds
    **/
    _count?: true | GuildsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuildsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuildsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuildsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuildsMaxAggregateInputType
  }

  export type GetGuildsAggregateType<T extends GuildsAggregateArgs> = {
        [P in keyof T & keyof AggregateGuilds]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuilds[P]>
      : GetScalarType<T[P], AggregateGuilds[P]>
  }




  export type guildsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: guildsWhereInput
    orderBy?: guildsOrderByWithAggregationInput | guildsOrderByWithAggregationInput[]
    by: GuildsScalarFieldEnum[] | GuildsScalarFieldEnum
    having?: guildsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuildsCountAggregateInputType | true
    _avg?: GuildsAvgAggregateInputType
    _sum?: GuildsSumAggregateInputType
    _min?: GuildsMinAggregateInputType
    _max?: GuildsMaxAggregateInputType
  }

  export type GuildsGroupByOutputType = {
    id: bigint
    guildid: string
    args: string | null
    _count: GuildsCountAggregateOutputType | null
    _avg: GuildsAvgAggregateOutputType | null
    _sum: GuildsSumAggregateOutputType | null
    _min: GuildsMinAggregateOutputType | null
    _max: GuildsMaxAggregateOutputType | null
  }

  type GetGuildsGroupByPayload<T extends guildsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuildsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuildsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuildsGroupByOutputType[P]>
            : GetScalarType<T[P], GuildsGroupByOutputType[P]>
        }
      >
    >


  export type guildsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildid?: boolean
    args?: boolean
  }, ExtArgs["result"]["guilds"]>



  export type guildsSelectScalar = {
    id?: boolean
    guildid?: boolean
    args?: boolean
  }

  export type guildsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildid" | "args", ExtArgs["result"]["guilds"]>

  export type $guildsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "guilds"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      guildid: string
      args: string | null
    }, ExtArgs["result"]["guilds"]>
    composites: {}
  }

  type guildsGetPayload<S extends boolean | null | undefined | guildsDefaultArgs> = $Result.GetResult<Prisma.$guildsPayload, S>

  type guildsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<guildsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuildsCountAggregateInputType | true
    }

  export interface guildsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['guilds'], meta: { name: 'guilds' } }
    /**
     * Find zero or one Guilds that matches the filter.
     * @param {guildsFindUniqueArgs} args - Arguments to find a Guilds
     * @example
     * // Get one Guilds
     * const guilds = await prisma.guilds.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends guildsFindUniqueArgs>(args: SelectSubset<T, guildsFindUniqueArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Guilds that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {guildsFindUniqueOrThrowArgs} args - Arguments to find a Guilds
     * @example
     * // Get one Guilds
     * const guilds = await prisma.guilds.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends guildsFindUniqueOrThrowArgs>(args: SelectSubset<T, guildsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guilds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {guildsFindFirstArgs} args - Arguments to find a Guilds
     * @example
     * // Get one Guilds
     * const guilds = await prisma.guilds.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends guildsFindFirstArgs>(args?: SelectSubset<T, guildsFindFirstArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guilds that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {guildsFindFirstOrThrowArgs} args - Arguments to find a Guilds
     * @example
     * // Get one Guilds
     * const guilds = await prisma.guilds.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends guildsFindFirstOrThrowArgs>(args?: SelectSubset<T, guildsFindFirstOrThrowArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Guilds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {guildsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guilds
     * const guilds = await prisma.guilds.findMany()
     * 
     * // Get first 10 Guilds
     * const guilds = await prisma.guilds.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guildsWithIdOnly = await prisma.guilds.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends guildsFindManyArgs>(args?: SelectSubset<T, guildsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Guilds.
     * @param {guildsCreateArgs} args - Arguments to create a Guilds.
     * @example
     * // Create one Guilds
     * const Guilds = await prisma.guilds.create({
     *   data: {
     *     // ... data to create a Guilds
     *   }
     * })
     * 
     */
    create<T extends guildsCreateArgs>(args: SelectSubset<T, guildsCreateArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Guilds.
     * @param {guildsCreateManyArgs} args - Arguments to create many Guilds.
     * @example
     * // Create many Guilds
     * const guilds = await prisma.guilds.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends guildsCreateManyArgs>(args?: SelectSubset<T, guildsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Guilds.
     * @param {guildsDeleteArgs} args - Arguments to delete one Guilds.
     * @example
     * // Delete one Guilds
     * const Guilds = await prisma.guilds.delete({
     *   where: {
     *     // ... filter to delete one Guilds
     *   }
     * })
     * 
     */
    delete<T extends guildsDeleteArgs>(args: SelectSubset<T, guildsDeleteArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Guilds.
     * @param {guildsUpdateArgs} args - Arguments to update one Guilds.
     * @example
     * // Update one Guilds
     * const guilds = await prisma.guilds.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends guildsUpdateArgs>(args: SelectSubset<T, guildsUpdateArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Guilds.
     * @param {guildsDeleteManyArgs} args - Arguments to filter Guilds to delete.
     * @example
     * // Delete a few Guilds
     * const { count } = await prisma.guilds.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends guildsDeleteManyArgs>(args?: SelectSubset<T, guildsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {guildsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guilds
     * const guilds = await prisma.guilds.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends guildsUpdateManyArgs>(args: SelectSubset<T, guildsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Guilds.
     * @param {guildsUpsertArgs} args - Arguments to update or create a Guilds.
     * @example
     * // Update or create a Guilds
     * const guilds = await prisma.guilds.upsert({
     *   create: {
     *     // ... data to create a Guilds
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guilds we want to update
     *   }
     * })
     */
    upsert<T extends guildsUpsertArgs>(args: SelectSubset<T, guildsUpsertArgs<ExtArgs>>): Prisma__guildsClient<$Result.GetResult<Prisma.$guildsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {guildsCountArgs} args - Arguments to filter Guilds to count.
     * @example
     * // Count the number of Guilds
     * const count = await prisma.guilds.count({
     *   where: {
     *     // ... the filter for the Guilds we want to count
     *   }
     * })
    **/
    count<T extends guildsCountArgs>(
      args?: Subset<T, guildsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuildsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuildsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuildsAggregateArgs>(args: Subset<T, GuildsAggregateArgs>): Prisma.PrismaPromise<GetGuildsAggregateType<T>>

    /**
     * Group by Guilds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {guildsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends guildsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: guildsGroupByArgs['orderBy'] }
        : { orderBy?: guildsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, guildsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuildsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the guilds model
   */
  readonly fields: guildsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for guilds.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__guildsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the guilds model
   */
  interface guildsFieldRefs {
    readonly id: FieldRef<"guilds", 'BigInt'>
    readonly guildid: FieldRef<"guilds", 'String'>
    readonly args: FieldRef<"guilds", 'String'>
  }
    

  // Custom InputTypes
  /**
   * guilds findUnique
   */
  export type guildsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * Filter, which guilds to fetch.
     */
    where: guildsWhereUniqueInput
  }

  /**
   * guilds findUniqueOrThrow
   */
  export type guildsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * Filter, which guilds to fetch.
     */
    where: guildsWhereUniqueInput
  }

  /**
   * guilds findFirst
   */
  export type guildsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * Filter, which guilds to fetch.
     */
    where?: guildsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of guilds to fetch.
     */
    orderBy?: guildsOrderByWithRelationInput | guildsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for guilds.
     */
    cursor?: guildsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of guilds.
     */
    distinct?: GuildsScalarFieldEnum | GuildsScalarFieldEnum[]
  }

  /**
   * guilds findFirstOrThrow
   */
  export type guildsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * Filter, which guilds to fetch.
     */
    where?: guildsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of guilds to fetch.
     */
    orderBy?: guildsOrderByWithRelationInput | guildsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for guilds.
     */
    cursor?: guildsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of guilds.
     */
    distinct?: GuildsScalarFieldEnum | GuildsScalarFieldEnum[]
  }

  /**
   * guilds findMany
   */
  export type guildsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * Filter, which guilds to fetch.
     */
    where?: guildsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of guilds to fetch.
     */
    orderBy?: guildsOrderByWithRelationInput | guildsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing guilds.
     */
    cursor?: guildsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` guilds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` guilds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of guilds.
     */
    distinct?: GuildsScalarFieldEnum | GuildsScalarFieldEnum[]
  }

  /**
   * guilds create
   */
  export type guildsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * The data needed to create a guilds.
     */
    data: XOR<guildsCreateInput, guildsUncheckedCreateInput>
  }

  /**
   * guilds createMany
   */
  export type guildsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many guilds.
     */
    data: guildsCreateManyInput | guildsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * guilds update
   */
  export type guildsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * The data needed to update a guilds.
     */
    data: XOR<guildsUpdateInput, guildsUncheckedUpdateInput>
    /**
     * Choose, which guilds to update.
     */
    where: guildsWhereUniqueInput
  }

  /**
   * guilds updateMany
   */
  export type guildsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update guilds.
     */
    data: XOR<guildsUpdateManyMutationInput, guildsUncheckedUpdateManyInput>
    /**
     * Filter which guilds to update
     */
    where?: guildsWhereInput
    /**
     * Limit how many guilds to update.
     */
    limit?: number
  }

  /**
   * guilds upsert
   */
  export type guildsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * The filter to search for the guilds to update in case it exists.
     */
    where: guildsWhereUniqueInput
    /**
     * In case the guilds found by the `where` argument doesn't exist, create a new guilds with this data.
     */
    create: XOR<guildsCreateInput, guildsUncheckedCreateInput>
    /**
     * In case the guilds was found with the provided `where` argument, update it with this data.
     */
    update: XOR<guildsUpdateInput, guildsUncheckedUpdateInput>
  }

  /**
   * guilds delete
   */
  export type guildsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
    /**
     * Filter which guilds to delete.
     */
    where: guildsWhereUniqueInput
  }

  /**
   * guilds deleteMany
   */
  export type guildsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which guilds to delete
     */
    where?: guildsWhereInput
    /**
     * Limit how many guilds to delete.
     */
    limit?: number
  }

  /**
   * guilds without action
   */
  export type guildsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the guilds
     */
    select?: guildsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the guilds
     */
    omit?: guildsOmit<ExtArgs> | null
  }


  /**
   * Model player_action_history
   */

  export type AggregatePlayer_action_history = {
    _count: Player_action_historyCountAggregateOutputType | null
    _avg: Player_action_historyAvgAggregateOutputType | null
    _sum: Player_action_historySumAggregateOutputType | null
    _min: Player_action_historyMinAggregateOutputType | null
    _max: Player_action_historyMaxAggregateOutputType | null
  }

  export type Player_action_historyAvgAggregateOutputType = {
    id: number | null
  }

  export type Player_action_historySumAggregateOutputType = {
    id: bigint | null
  }

  export type Player_action_historyMinAggregateOutputType = {
    id: bigint | null
    actionby: string | null
    timestamp: Date | null
    action_name: string | null
    data: string | null
    guild: string | null
    channel: string | null
  }

  export type Player_action_historyMaxAggregateOutputType = {
    id: bigint | null
    actionby: string | null
    timestamp: Date | null
    action_name: string | null
    data: string | null
    guild: string | null
    channel: string | null
  }

  export type Player_action_historyCountAggregateOutputType = {
    id: number
    actionby: number
    timestamp: number
    action_name: number
    data: number
    guild: number
    channel: number
    _all: number
  }


  export type Player_action_historyAvgAggregateInputType = {
    id?: true
  }

  export type Player_action_historySumAggregateInputType = {
    id?: true
  }

  export type Player_action_historyMinAggregateInputType = {
    id?: true
    actionby?: true
    timestamp?: true
    action_name?: true
    data?: true
    guild?: true
    channel?: true
  }

  export type Player_action_historyMaxAggregateInputType = {
    id?: true
    actionby?: true
    timestamp?: true
    action_name?: true
    data?: true
    guild?: true
    channel?: true
  }

  export type Player_action_historyCountAggregateInputType = {
    id?: true
    actionby?: true
    timestamp?: true
    action_name?: true
    data?: true
    guild?: true
    channel?: true
    _all?: true
  }

  export type Player_action_historyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which player_action_history to aggregate.
     */
    where?: player_action_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_action_histories to fetch.
     */
    orderBy?: player_action_historyOrderByWithRelationInput | player_action_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: player_action_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_action_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_action_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned player_action_histories
    **/
    _count?: true | Player_action_historyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Player_action_historyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Player_action_historySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Player_action_historyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Player_action_historyMaxAggregateInputType
  }

  export type GetPlayer_action_historyAggregateType<T extends Player_action_historyAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer_action_history]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer_action_history[P]>
      : GetScalarType<T[P], AggregatePlayer_action_history[P]>
  }




  export type player_action_historyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: player_action_historyWhereInput
    orderBy?: player_action_historyOrderByWithAggregationInput | player_action_historyOrderByWithAggregationInput[]
    by: Player_action_historyScalarFieldEnum[] | Player_action_historyScalarFieldEnum
    having?: player_action_historyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Player_action_historyCountAggregateInputType | true
    _avg?: Player_action_historyAvgAggregateInputType
    _sum?: Player_action_historySumAggregateInputType
    _min?: Player_action_historyMinAggregateInputType
    _max?: Player_action_historyMaxAggregateInputType
  }

  export type Player_action_historyGroupByOutputType = {
    id: bigint
    actionby: string
    timestamp: Date
    action_name: string
    data: string | null
    guild: string | null
    channel: string | null
    _count: Player_action_historyCountAggregateOutputType | null
    _avg: Player_action_historyAvgAggregateOutputType | null
    _sum: Player_action_historySumAggregateOutputType | null
    _min: Player_action_historyMinAggregateOutputType | null
    _max: Player_action_historyMaxAggregateOutputType | null
  }

  type GetPlayer_action_historyGroupByPayload<T extends player_action_historyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Player_action_historyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Player_action_historyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Player_action_historyGroupByOutputType[P]>
            : GetScalarType<T[P], Player_action_historyGroupByOutputType[P]>
        }
      >
    >


  export type player_action_historySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actionby?: boolean
    timestamp?: boolean
    action_name?: boolean
    data?: boolean
    guild?: boolean
    channel?: boolean
  }, ExtArgs["result"]["player_action_history"]>



  export type player_action_historySelectScalar = {
    id?: boolean
    actionby?: boolean
    timestamp?: boolean
    action_name?: boolean
    data?: boolean
    guild?: boolean
    channel?: boolean
  }

  export type player_action_historyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "actionby" | "timestamp" | "action_name" | "data" | "guild" | "channel", ExtArgs["result"]["player_action_history"]>

  export type $player_action_historyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "player_action_history"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      actionby: string
      timestamp: Date
      action_name: string
      data: string | null
      guild: string | null
      channel: string | null
    }, ExtArgs["result"]["player_action_history"]>
    composites: {}
  }

  type player_action_historyGetPayload<S extends boolean | null | undefined | player_action_historyDefaultArgs> = $Result.GetResult<Prisma.$player_action_historyPayload, S>

  type player_action_historyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<player_action_historyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Player_action_historyCountAggregateInputType | true
    }

  export interface player_action_historyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['player_action_history'], meta: { name: 'player_action_history' } }
    /**
     * Find zero or one Player_action_history that matches the filter.
     * @param {player_action_historyFindUniqueArgs} args - Arguments to find a Player_action_history
     * @example
     * // Get one Player_action_history
     * const player_action_history = await prisma.player_action_history.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends player_action_historyFindUniqueArgs>(args: SelectSubset<T, player_action_historyFindUniqueArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player_action_history that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {player_action_historyFindUniqueOrThrowArgs} args - Arguments to find a Player_action_history
     * @example
     * // Get one Player_action_history
     * const player_action_history = await prisma.player_action_history.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends player_action_historyFindUniqueOrThrowArgs>(args: SelectSubset<T, player_action_historyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player_action_history that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_action_historyFindFirstArgs} args - Arguments to find a Player_action_history
     * @example
     * // Get one Player_action_history
     * const player_action_history = await prisma.player_action_history.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends player_action_historyFindFirstArgs>(args?: SelectSubset<T, player_action_historyFindFirstArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player_action_history that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_action_historyFindFirstOrThrowArgs} args - Arguments to find a Player_action_history
     * @example
     * // Get one Player_action_history
     * const player_action_history = await prisma.player_action_history.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends player_action_historyFindFirstOrThrowArgs>(args?: SelectSubset<T, player_action_historyFindFirstOrThrowArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Player_action_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_action_historyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Player_action_histories
     * const player_action_histories = await prisma.player_action_history.findMany()
     * 
     * // Get first 10 Player_action_histories
     * const player_action_histories = await prisma.player_action_history.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const player_action_historyWithIdOnly = await prisma.player_action_history.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends player_action_historyFindManyArgs>(args?: SelectSubset<T, player_action_historyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player_action_history.
     * @param {player_action_historyCreateArgs} args - Arguments to create a Player_action_history.
     * @example
     * // Create one Player_action_history
     * const Player_action_history = await prisma.player_action_history.create({
     *   data: {
     *     // ... data to create a Player_action_history
     *   }
     * })
     * 
     */
    create<T extends player_action_historyCreateArgs>(args: SelectSubset<T, player_action_historyCreateArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Player_action_histories.
     * @param {player_action_historyCreateManyArgs} args - Arguments to create many Player_action_histories.
     * @example
     * // Create many Player_action_histories
     * const player_action_history = await prisma.player_action_history.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends player_action_historyCreateManyArgs>(args?: SelectSubset<T, player_action_historyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Player_action_history.
     * @param {player_action_historyDeleteArgs} args - Arguments to delete one Player_action_history.
     * @example
     * // Delete one Player_action_history
     * const Player_action_history = await prisma.player_action_history.delete({
     *   where: {
     *     // ... filter to delete one Player_action_history
     *   }
     * })
     * 
     */
    delete<T extends player_action_historyDeleteArgs>(args: SelectSubset<T, player_action_historyDeleteArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player_action_history.
     * @param {player_action_historyUpdateArgs} args - Arguments to update one Player_action_history.
     * @example
     * // Update one Player_action_history
     * const player_action_history = await prisma.player_action_history.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends player_action_historyUpdateArgs>(args: SelectSubset<T, player_action_historyUpdateArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Player_action_histories.
     * @param {player_action_historyDeleteManyArgs} args - Arguments to filter Player_action_histories to delete.
     * @example
     * // Delete a few Player_action_histories
     * const { count } = await prisma.player_action_history.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends player_action_historyDeleteManyArgs>(args?: SelectSubset<T, player_action_historyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Player_action_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_action_historyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Player_action_histories
     * const player_action_history = await prisma.player_action_history.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends player_action_historyUpdateManyArgs>(args: SelectSubset<T, player_action_historyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Player_action_history.
     * @param {player_action_historyUpsertArgs} args - Arguments to update or create a Player_action_history.
     * @example
     * // Update or create a Player_action_history
     * const player_action_history = await prisma.player_action_history.upsert({
     *   create: {
     *     // ... data to create a Player_action_history
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player_action_history we want to update
     *   }
     * })
     */
    upsert<T extends player_action_historyUpsertArgs>(args: SelectSubset<T, player_action_historyUpsertArgs<ExtArgs>>): Prisma__player_action_historyClient<$Result.GetResult<Prisma.$player_action_historyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Player_action_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_action_historyCountArgs} args - Arguments to filter Player_action_histories to count.
     * @example
     * // Count the number of Player_action_histories
     * const count = await prisma.player_action_history.count({
     *   where: {
     *     // ... the filter for the Player_action_histories we want to count
     *   }
     * })
    **/
    count<T extends player_action_historyCountArgs>(
      args?: Subset<T, player_action_historyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Player_action_historyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player_action_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Player_action_historyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Player_action_historyAggregateArgs>(args: Subset<T, Player_action_historyAggregateArgs>): Prisma.PrismaPromise<GetPlayer_action_historyAggregateType<T>>

    /**
     * Group by Player_action_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_action_historyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends player_action_historyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: player_action_historyGroupByArgs['orderBy'] }
        : { orderBy?: player_action_historyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, player_action_historyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayer_action_historyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the player_action_history model
   */
  readonly fields: player_action_historyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for player_action_history.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__player_action_historyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the player_action_history model
   */
  interface player_action_historyFieldRefs {
    readonly id: FieldRef<"player_action_history", 'BigInt'>
    readonly actionby: FieldRef<"player_action_history", 'String'>
    readonly timestamp: FieldRef<"player_action_history", 'DateTime'>
    readonly action_name: FieldRef<"player_action_history", 'String'>
    readonly data: FieldRef<"player_action_history", 'String'>
    readonly guild: FieldRef<"player_action_history", 'String'>
    readonly channel: FieldRef<"player_action_history", 'String'>
  }
    

  // Custom InputTypes
  /**
   * player_action_history findUnique
   */
  export type player_action_historyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_action_history to fetch.
     */
    where: player_action_historyWhereUniqueInput
  }

  /**
   * player_action_history findUniqueOrThrow
   */
  export type player_action_historyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_action_history to fetch.
     */
    where: player_action_historyWhereUniqueInput
  }

  /**
   * player_action_history findFirst
   */
  export type player_action_historyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_action_history to fetch.
     */
    where?: player_action_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_action_histories to fetch.
     */
    orderBy?: player_action_historyOrderByWithRelationInput | player_action_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for player_action_histories.
     */
    cursor?: player_action_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_action_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_action_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_action_histories.
     */
    distinct?: Player_action_historyScalarFieldEnum | Player_action_historyScalarFieldEnum[]
  }

  /**
   * player_action_history findFirstOrThrow
   */
  export type player_action_historyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_action_history to fetch.
     */
    where?: player_action_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_action_histories to fetch.
     */
    orderBy?: player_action_historyOrderByWithRelationInput | player_action_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for player_action_histories.
     */
    cursor?: player_action_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_action_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_action_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_action_histories.
     */
    distinct?: Player_action_historyScalarFieldEnum | Player_action_historyScalarFieldEnum[]
  }

  /**
   * player_action_history findMany
   */
  export type player_action_historyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_action_histories to fetch.
     */
    where?: player_action_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_action_histories to fetch.
     */
    orderBy?: player_action_historyOrderByWithRelationInput | player_action_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing player_action_histories.
     */
    cursor?: player_action_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_action_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_action_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_action_histories.
     */
    distinct?: Player_action_historyScalarFieldEnum | Player_action_historyScalarFieldEnum[]
  }

  /**
   * player_action_history create
   */
  export type player_action_historyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * The data needed to create a player_action_history.
     */
    data: XOR<player_action_historyCreateInput, player_action_historyUncheckedCreateInput>
  }

  /**
   * player_action_history createMany
   */
  export type player_action_historyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many player_action_histories.
     */
    data: player_action_historyCreateManyInput | player_action_historyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * player_action_history update
   */
  export type player_action_historyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * The data needed to update a player_action_history.
     */
    data: XOR<player_action_historyUpdateInput, player_action_historyUncheckedUpdateInput>
    /**
     * Choose, which player_action_history to update.
     */
    where: player_action_historyWhereUniqueInput
  }

  /**
   * player_action_history updateMany
   */
  export type player_action_historyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update player_action_histories.
     */
    data: XOR<player_action_historyUpdateManyMutationInput, player_action_historyUncheckedUpdateManyInput>
    /**
     * Filter which player_action_histories to update
     */
    where?: player_action_historyWhereInput
    /**
     * Limit how many player_action_histories to update.
     */
    limit?: number
  }

  /**
   * player_action_history upsert
   */
  export type player_action_historyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * The filter to search for the player_action_history to update in case it exists.
     */
    where: player_action_historyWhereUniqueInput
    /**
     * In case the player_action_history found by the `where` argument doesn't exist, create a new player_action_history with this data.
     */
    create: XOR<player_action_historyCreateInput, player_action_historyUncheckedCreateInput>
    /**
     * In case the player_action_history was found with the provided `where` argument, update it with this data.
     */
    update: XOR<player_action_historyUpdateInput, player_action_historyUncheckedUpdateInput>
  }

  /**
   * player_action_history delete
   */
  export type player_action_historyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
    /**
     * Filter which player_action_history to delete.
     */
    where: player_action_historyWhereUniqueInput
  }

  /**
   * player_action_history deleteMany
   */
  export type player_action_historyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which player_action_histories to delete
     */
    where?: player_action_historyWhereInput
    /**
     * Limit how many player_action_histories to delete.
     */
    limit?: number
  }

  /**
   * player_action_history without action
   */
  export type player_action_historyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_action_history
     */
    select?: player_action_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_action_history
     */
    omit?: player_action_historyOmit<ExtArgs> | null
  }


  /**
   * Model player_track_history
   */

  export type AggregatePlayer_track_history = {
    _count: Player_track_historyCountAggregateOutputType | null
    _avg: Player_track_historyAvgAggregateOutputType | null
    _sum: Player_track_historySumAggregateOutputType | null
    _min: Player_track_historyMinAggregateOutputType | null
    _max: Player_track_historyMaxAggregateOutputType | null
  }

  export type Player_track_historyAvgAggregateOutputType = {
    id: number | null
  }

  export type Player_track_historySumAggregateOutputType = {
    id: bigint | null
  }

  export type Player_track_historyMinAggregateOutputType = {
    id: bigint | null
    requestby: string | null
    uniqueid: string | null
    time: Date | null
    voicechannel: string | null
    guildid: string | null
    track: string | null
  }

  export type Player_track_historyMaxAggregateOutputType = {
    id: bigint | null
    requestby: string | null
    uniqueid: string | null
    time: Date | null
    voicechannel: string | null
    guildid: string | null
    track: string | null
  }

  export type Player_track_historyCountAggregateOutputType = {
    id: number
    requestby: number
    uniqueid: number
    time: number
    voicechannel: number
    guildid: number
    track: number
    _all: number
  }


  export type Player_track_historyAvgAggregateInputType = {
    id?: true
  }

  export type Player_track_historySumAggregateInputType = {
    id?: true
  }

  export type Player_track_historyMinAggregateInputType = {
    id?: true
    requestby?: true
    uniqueid?: true
    time?: true
    voicechannel?: true
    guildid?: true
    track?: true
  }

  export type Player_track_historyMaxAggregateInputType = {
    id?: true
    requestby?: true
    uniqueid?: true
    time?: true
    voicechannel?: true
    guildid?: true
    track?: true
  }

  export type Player_track_historyCountAggregateInputType = {
    id?: true
    requestby?: true
    uniqueid?: true
    time?: true
    voicechannel?: true
    guildid?: true
    track?: true
    _all?: true
  }

  export type Player_track_historyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which player_track_history to aggregate.
     */
    where?: player_track_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_track_histories to fetch.
     */
    orderBy?: player_track_historyOrderByWithRelationInput | player_track_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: player_track_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_track_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_track_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned player_track_histories
    **/
    _count?: true | Player_track_historyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Player_track_historyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Player_track_historySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Player_track_historyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Player_track_historyMaxAggregateInputType
  }

  export type GetPlayer_track_historyAggregateType<T extends Player_track_historyAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer_track_history]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer_track_history[P]>
      : GetScalarType<T[P], AggregatePlayer_track_history[P]>
  }




  export type player_track_historyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: player_track_historyWhereInput
    orderBy?: player_track_historyOrderByWithAggregationInput | player_track_historyOrderByWithAggregationInput[]
    by: Player_track_historyScalarFieldEnum[] | Player_track_historyScalarFieldEnum
    having?: player_track_historyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Player_track_historyCountAggregateInputType | true
    _avg?: Player_track_historyAvgAggregateInputType
    _sum?: Player_track_historySumAggregateInputType
    _min?: Player_track_historyMinAggregateInputType
    _max?: Player_track_historyMaxAggregateInputType
  }

  export type Player_track_historyGroupByOutputType = {
    id: bigint
    requestby: string
    uniqueid: string
    time: Date
    voicechannel: string
    guildid: string
    track: string
    _count: Player_track_historyCountAggregateOutputType | null
    _avg: Player_track_historyAvgAggregateOutputType | null
    _sum: Player_track_historySumAggregateOutputType | null
    _min: Player_track_historyMinAggregateOutputType | null
    _max: Player_track_historyMaxAggregateOutputType | null
  }

  type GetPlayer_track_historyGroupByPayload<T extends player_track_historyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Player_track_historyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Player_track_historyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Player_track_historyGroupByOutputType[P]>
            : GetScalarType<T[P], Player_track_historyGroupByOutputType[P]>
        }
      >
    >


  export type player_track_historySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requestby?: boolean
    uniqueid?: boolean
    time?: boolean
    voicechannel?: boolean
    guildid?: boolean
    track?: boolean
  }, ExtArgs["result"]["player_track_history"]>



  export type player_track_historySelectScalar = {
    id?: boolean
    requestby?: boolean
    uniqueid?: boolean
    time?: boolean
    voicechannel?: boolean
    guildid?: boolean
    track?: boolean
  }

  export type player_track_historyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requestby" | "uniqueid" | "time" | "voicechannel" | "guildid" | "track", ExtArgs["result"]["player_track_history"]>

  export type $player_track_historyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "player_track_history"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      requestby: string
      uniqueid: string
      time: Date
      voicechannel: string
      guildid: string
      track: string
    }, ExtArgs["result"]["player_track_history"]>
    composites: {}
  }

  type player_track_historyGetPayload<S extends boolean | null | undefined | player_track_historyDefaultArgs> = $Result.GetResult<Prisma.$player_track_historyPayload, S>

  type player_track_historyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<player_track_historyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Player_track_historyCountAggregateInputType | true
    }

  export interface player_track_historyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['player_track_history'], meta: { name: 'player_track_history' } }
    /**
     * Find zero or one Player_track_history that matches the filter.
     * @param {player_track_historyFindUniqueArgs} args - Arguments to find a Player_track_history
     * @example
     * // Get one Player_track_history
     * const player_track_history = await prisma.player_track_history.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends player_track_historyFindUniqueArgs>(args: SelectSubset<T, player_track_historyFindUniqueArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player_track_history that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {player_track_historyFindUniqueOrThrowArgs} args - Arguments to find a Player_track_history
     * @example
     * // Get one Player_track_history
     * const player_track_history = await prisma.player_track_history.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends player_track_historyFindUniqueOrThrowArgs>(args: SelectSubset<T, player_track_historyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player_track_history that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_track_historyFindFirstArgs} args - Arguments to find a Player_track_history
     * @example
     * // Get one Player_track_history
     * const player_track_history = await prisma.player_track_history.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends player_track_historyFindFirstArgs>(args?: SelectSubset<T, player_track_historyFindFirstArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player_track_history that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_track_historyFindFirstOrThrowArgs} args - Arguments to find a Player_track_history
     * @example
     * // Get one Player_track_history
     * const player_track_history = await prisma.player_track_history.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends player_track_historyFindFirstOrThrowArgs>(args?: SelectSubset<T, player_track_historyFindFirstOrThrowArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Player_track_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_track_historyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Player_track_histories
     * const player_track_histories = await prisma.player_track_history.findMany()
     * 
     * // Get first 10 Player_track_histories
     * const player_track_histories = await prisma.player_track_history.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const player_track_historyWithIdOnly = await prisma.player_track_history.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends player_track_historyFindManyArgs>(args?: SelectSubset<T, player_track_historyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player_track_history.
     * @param {player_track_historyCreateArgs} args - Arguments to create a Player_track_history.
     * @example
     * // Create one Player_track_history
     * const Player_track_history = await prisma.player_track_history.create({
     *   data: {
     *     // ... data to create a Player_track_history
     *   }
     * })
     * 
     */
    create<T extends player_track_historyCreateArgs>(args: SelectSubset<T, player_track_historyCreateArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Player_track_histories.
     * @param {player_track_historyCreateManyArgs} args - Arguments to create many Player_track_histories.
     * @example
     * // Create many Player_track_histories
     * const player_track_history = await prisma.player_track_history.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends player_track_historyCreateManyArgs>(args?: SelectSubset<T, player_track_historyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Player_track_history.
     * @param {player_track_historyDeleteArgs} args - Arguments to delete one Player_track_history.
     * @example
     * // Delete one Player_track_history
     * const Player_track_history = await prisma.player_track_history.delete({
     *   where: {
     *     // ... filter to delete one Player_track_history
     *   }
     * })
     * 
     */
    delete<T extends player_track_historyDeleteArgs>(args: SelectSubset<T, player_track_historyDeleteArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player_track_history.
     * @param {player_track_historyUpdateArgs} args - Arguments to update one Player_track_history.
     * @example
     * // Update one Player_track_history
     * const player_track_history = await prisma.player_track_history.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends player_track_historyUpdateArgs>(args: SelectSubset<T, player_track_historyUpdateArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Player_track_histories.
     * @param {player_track_historyDeleteManyArgs} args - Arguments to filter Player_track_histories to delete.
     * @example
     * // Delete a few Player_track_histories
     * const { count } = await prisma.player_track_history.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends player_track_historyDeleteManyArgs>(args?: SelectSubset<T, player_track_historyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Player_track_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_track_historyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Player_track_histories
     * const player_track_history = await prisma.player_track_history.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends player_track_historyUpdateManyArgs>(args: SelectSubset<T, player_track_historyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Player_track_history.
     * @param {player_track_historyUpsertArgs} args - Arguments to update or create a Player_track_history.
     * @example
     * // Update or create a Player_track_history
     * const player_track_history = await prisma.player_track_history.upsert({
     *   create: {
     *     // ... data to create a Player_track_history
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player_track_history we want to update
     *   }
     * })
     */
    upsert<T extends player_track_historyUpsertArgs>(args: SelectSubset<T, player_track_historyUpsertArgs<ExtArgs>>): Prisma__player_track_historyClient<$Result.GetResult<Prisma.$player_track_historyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Player_track_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_track_historyCountArgs} args - Arguments to filter Player_track_histories to count.
     * @example
     * // Count the number of Player_track_histories
     * const count = await prisma.player_track_history.count({
     *   where: {
     *     // ... the filter for the Player_track_histories we want to count
     *   }
     * })
    **/
    count<T extends player_track_historyCountArgs>(
      args?: Subset<T, player_track_historyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Player_track_historyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player_track_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Player_track_historyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Player_track_historyAggregateArgs>(args: Subset<T, Player_track_historyAggregateArgs>): Prisma.PrismaPromise<GetPlayer_track_historyAggregateType<T>>

    /**
     * Group by Player_track_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {player_track_historyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends player_track_historyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: player_track_historyGroupByArgs['orderBy'] }
        : { orderBy?: player_track_historyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, player_track_historyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayer_track_historyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the player_track_history model
   */
  readonly fields: player_track_historyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for player_track_history.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__player_track_historyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the player_track_history model
   */
  interface player_track_historyFieldRefs {
    readonly id: FieldRef<"player_track_history", 'BigInt'>
    readonly requestby: FieldRef<"player_track_history", 'String'>
    readonly uniqueid: FieldRef<"player_track_history", 'String'>
    readonly time: FieldRef<"player_track_history", 'DateTime'>
    readonly voicechannel: FieldRef<"player_track_history", 'String'>
    readonly guildid: FieldRef<"player_track_history", 'String'>
    readonly track: FieldRef<"player_track_history", 'String'>
  }
    

  // Custom InputTypes
  /**
   * player_track_history findUnique
   */
  export type player_track_historyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_track_history to fetch.
     */
    where: player_track_historyWhereUniqueInput
  }

  /**
   * player_track_history findUniqueOrThrow
   */
  export type player_track_historyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_track_history to fetch.
     */
    where: player_track_historyWhereUniqueInput
  }

  /**
   * player_track_history findFirst
   */
  export type player_track_historyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_track_history to fetch.
     */
    where?: player_track_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_track_histories to fetch.
     */
    orderBy?: player_track_historyOrderByWithRelationInput | player_track_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for player_track_histories.
     */
    cursor?: player_track_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_track_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_track_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_track_histories.
     */
    distinct?: Player_track_historyScalarFieldEnum | Player_track_historyScalarFieldEnum[]
  }

  /**
   * player_track_history findFirstOrThrow
   */
  export type player_track_historyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_track_history to fetch.
     */
    where?: player_track_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_track_histories to fetch.
     */
    orderBy?: player_track_historyOrderByWithRelationInput | player_track_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for player_track_histories.
     */
    cursor?: player_track_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_track_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_track_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_track_histories.
     */
    distinct?: Player_track_historyScalarFieldEnum | Player_track_historyScalarFieldEnum[]
  }

  /**
   * player_track_history findMany
   */
  export type player_track_historyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * Filter, which player_track_histories to fetch.
     */
    where?: player_track_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of player_track_histories to fetch.
     */
    orderBy?: player_track_historyOrderByWithRelationInput | player_track_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing player_track_histories.
     */
    cursor?: player_track_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` player_track_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` player_track_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of player_track_histories.
     */
    distinct?: Player_track_historyScalarFieldEnum | Player_track_historyScalarFieldEnum[]
  }

  /**
   * player_track_history create
   */
  export type player_track_historyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * The data needed to create a player_track_history.
     */
    data: XOR<player_track_historyCreateInput, player_track_historyUncheckedCreateInput>
  }

  /**
   * player_track_history createMany
   */
  export type player_track_historyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many player_track_histories.
     */
    data: player_track_historyCreateManyInput | player_track_historyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * player_track_history update
   */
  export type player_track_historyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * The data needed to update a player_track_history.
     */
    data: XOR<player_track_historyUpdateInput, player_track_historyUncheckedUpdateInput>
    /**
     * Choose, which player_track_history to update.
     */
    where: player_track_historyWhereUniqueInput
  }

  /**
   * player_track_history updateMany
   */
  export type player_track_historyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update player_track_histories.
     */
    data: XOR<player_track_historyUpdateManyMutationInput, player_track_historyUncheckedUpdateManyInput>
    /**
     * Filter which player_track_histories to update
     */
    where?: player_track_historyWhereInput
    /**
     * Limit how many player_track_histories to update.
     */
    limit?: number
  }

  /**
   * player_track_history upsert
   */
  export type player_track_historyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * The filter to search for the player_track_history to update in case it exists.
     */
    where: player_track_historyWhereUniqueInput
    /**
     * In case the player_track_history found by the `where` argument doesn't exist, create a new player_track_history with this data.
     */
    create: XOR<player_track_historyCreateInput, player_track_historyUncheckedCreateInput>
    /**
     * In case the player_track_history was found with the provided `where` argument, update it with this data.
     */
    update: XOR<player_track_historyUpdateInput, player_track_historyUncheckedUpdateInput>
  }

  /**
   * player_track_history delete
   */
  export type player_track_historyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
    /**
     * Filter which player_track_history to delete.
     */
    where: player_track_historyWhereUniqueInput
  }

  /**
   * player_track_history deleteMany
   */
  export type player_track_historyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which player_track_histories to delete
     */
    where?: player_track_historyWhereInput
    /**
     * Limit how many player_track_histories to delete.
     */
    limit?: number
  }

  /**
   * player_track_history without action
   */
  export type player_track_historyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the player_track_history
     */
    select?: player_track_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the player_track_history
     */
    omit?: player_track_historyOmit<ExtArgs> | null
  }


  /**
   * Model pona_flipflop_state
   */

  export type AggregatePona_flipflop_state = {
    _count: Pona_flipflop_stateCountAggregateOutputType | null
    _avg: Pona_flipflop_stateAvgAggregateOutputType | null
    _sum: Pona_flipflop_stateSumAggregateOutputType | null
    _min: Pona_flipflop_stateMinAggregateOutputType | null
    _max: Pona_flipflop_stateMaxAggregateOutputType | null
  }

  export type Pona_flipflop_stateAvgAggregateOutputType = {
    id: number | null
  }

  export type Pona_flipflop_stateSumAggregateOutputType = {
    id: bigint | null
  }

  export type Pona_flipflop_stateMinAggregateOutputType = {
    id: bigint | null
    time: Date | null
    guildid: string | null
    active: boolean | null
  }

  export type Pona_flipflop_stateMaxAggregateOutputType = {
    id: bigint | null
    time: Date | null
    guildid: string | null
    active: boolean | null
  }

  export type Pona_flipflop_stateCountAggregateOutputType = {
    id: number
    time: number
    guildid: number
    active: number
    _all: number
  }


  export type Pona_flipflop_stateAvgAggregateInputType = {
    id?: true
  }

  export type Pona_flipflop_stateSumAggregateInputType = {
    id?: true
  }

  export type Pona_flipflop_stateMinAggregateInputType = {
    id?: true
    time?: true
    guildid?: true
    active?: true
  }

  export type Pona_flipflop_stateMaxAggregateInputType = {
    id?: true
    time?: true
    guildid?: true
    active?: true
  }

  export type Pona_flipflop_stateCountAggregateInputType = {
    id?: true
    time?: true
    guildid?: true
    active?: true
    _all?: true
  }

  export type Pona_flipflop_stateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pona_flipflop_state to aggregate.
     */
    where?: pona_flipflop_stateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_flipflop_states to fetch.
     */
    orderBy?: pona_flipflop_stateOrderByWithRelationInput | pona_flipflop_stateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pona_flipflop_stateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_flipflop_states from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_flipflop_states.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pona_flipflop_states
    **/
    _count?: true | Pona_flipflop_stateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Pona_flipflop_stateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Pona_flipflop_stateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Pona_flipflop_stateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Pona_flipflop_stateMaxAggregateInputType
  }

  export type GetPona_flipflop_stateAggregateType<T extends Pona_flipflop_stateAggregateArgs> = {
        [P in keyof T & keyof AggregatePona_flipflop_state]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePona_flipflop_state[P]>
      : GetScalarType<T[P], AggregatePona_flipflop_state[P]>
  }




  export type pona_flipflop_stateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pona_flipflop_stateWhereInput
    orderBy?: pona_flipflop_stateOrderByWithAggregationInput | pona_flipflop_stateOrderByWithAggregationInput[]
    by: Pona_flipflop_stateScalarFieldEnum[] | Pona_flipflop_stateScalarFieldEnum
    having?: pona_flipflop_stateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Pona_flipflop_stateCountAggregateInputType | true
    _avg?: Pona_flipflop_stateAvgAggregateInputType
    _sum?: Pona_flipflop_stateSumAggregateInputType
    _min?: Pona_flipflop_stateMinAggregateInputType
    _max?: Pona_flipflop_stateMaxAggregateInputType
  }

  export type Pona_flipflop_stateGroupByOutputType = {
    id: bigint
    time: Date
    guildid: string
    active: boolean
    _count: Pona_flipflop_stateCountAggregateOutputType | null
    _avg: Pona_flipflop_stateAvgAggregateOutputType | null
    _sum: Pona_flipflop_stateSumAggregateOutputType | null
    _min: Pona_flipflop_stateMinAggregateOutputType | null
    _max: Pona_flipflop_stateMaxAggregateOutputType | null
  }

  type GetPona_flipflop_stateGroupByPayload<T extends pona_flipflop_stateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Pona_flipflop_stateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Pona_flipflop_stateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Pona_flipflop_stateGroupByOutputType[P]>
            : GetScalarType<T[P], Pona_flipflop_stateGroupByOutputType[P]>
        }
      >
    >


  export type pona_flipflop_stateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    guildid?: boolean
    active?: boolean
  }, ExtArgs["result"]["pona_flipflop_state"]>



  export type pona_flipflop_stateSelectScalar = {
    id?: boolean
    time?: boolean
    guildid?: boolean
    active?: boolean
  }

  export type pona_flipflop_stateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "time" | "guildid" | "active", ExtArgs["result"]["pona_flipflop_state"]>

  export type $pona_flipflop_statePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pona_flipflop_state"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      time: Date
      guildid: string
      active: boolean
    }, ExtArgs["result"]["pona_flipflop_state"]>
    composites: {}
  }

  type pona_flipflop_stateGetPayload<S extends boolean | null | undefined | pona_flipflop_stateDefaultArgs> = $Result.GetResult<Prisma.$pona_flipflop_statePayload, S>

  type pona_flipflop_stateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<pona_flipflop_stateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Pona_flipflop_stateCountAggregateInputType | true
    }

  export interface pona_flipflop_stateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pona_flipflop_state'], meta: { name: 'pona_flipflop_state' } }
    /**
     * Find zero or one Pona_flipflop_state that matches the filter.
     * @param {pona_flipflop_stateFindUniqueArgs} args - Arguments to find a Pona_flipflop_state
     * @example
     * // Get one Pona_flipflop_state
     * const pona_flipflop_state = await prisma.pona_flipflop_state.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends pona_flipflop_stateFindUniqueArgs>(args: SelectSubset<T, pona_flipflop_stateFindUniqueArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pona_flipflop_state that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {pona_flipflop_stateFindUniqueOrThrowArgs} args - Arguments to find a Pona_flipflop_state
     * @example
     * // Get one Pona_flipflop_state
     * const pona_flipflop_state = await prisma.pona_flipflop_state.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends pona_flipflop_stateFindUniqueOrThrowArgs>(args: SelectSubset<T, pona_flipflop_stateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pona_flipflop_state that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_flipflop_stateFindFirstArgs} args - Arguments to find a Pona_flipflop_state
     * @example
     * // Get one Pona_flipflop_state
     * const pona_flipflop_state = await prisma.pona_flipflop_state.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends pona_flipflop_stateFindFirstArgs>(args?: SelectSubset<T, pona_flipflop_stateFindFirstArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pona_flipflop_state that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_flipflop_stateFindFirstOrThrowArgs} args - Arguments to find a Pona_flipflop_state
     * @example
     * // Get one Pona_flipflop_state
     * const pona_flipflop_state = await prisma.pona_flipflop_state.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends pona_flipflop_stateFindFirstOrThrowArgs>(args?: SelectSubset<T, pona_flipflop_stateFindFirstOrThrowArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pona_flipflop_states that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_flipflop_stateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pona_flipflop_states
     * const pona_flipflop_states = await prisma.pona_flipflop_state.findMany()
     * 
     * // Get first 10 Pona_flipflop_states
     * const pona_flipflop_states = await prisma.pona_flipflop_state.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pona_flipflop_stateWithIdOnly = await prisma.pona_flipflop_state.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends pona_flipflop_stateFindManyArgs>(args?: SelectSubset<T, pona_flipflop_stateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pona_flipflop_state.
     * @param {pona_flipflop_stateCreateArgs} args - Arguments to create a Pona_flipflop_state.
     * @example
     * // Create one Pona_flipflop_state
     * const Pona_flipflop_state = await prisma.pona_flipflop_state.create({
     *   data: {
     *     // ... data to create a Pona_flipflop_state
     *   }
     * })
     * 
     */
    create<T extends pona_flipflop_stateCreateArgs>(args: SelectSubset<T, pona_flipflop_stateCreateArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pona_flipflop_states.
     * @param {pona_flipflop_stateCreateManyArgs} args - Arguments to create many Pona_flipflop_states.
     * @example
     * // Create many Pona_flipflop_states
     * const pona_flipflop_state = await prisma.pona_flipflop_state.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends pona_flipflop_stateCreateManyArgs>(args?: SelectSubset<T, pona_flipflop_stateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pona_flipflop_state.
     * @param {pona_flipflop_stateDeleteArgs} args - Arguments to delete one Pona_flipflop_state.
     * @example
     * // Delete one Pona_flipflop_state
     * const Pona_flipflop_state = await prisma.pona_flipflop_state.delete({
     *   where: {
     *     // ... filter to delete one Pona_flipflop_state
     *   }
     * })
     * 
     */
    delete<T extends pona_flipflop_stateDeleteArgs>(args: SelectSubset<T, pona_flipflop_stateDeleteArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pona_flipflop_state.
     * @param {pona_flipflop_stateUpdateArgs} args - Arguments to update one Pona_flipflop_state.
     * @example
     * // Update one Pona_flipflop_state
     * const pona_flipflop_state = await prisma.pona_flipflop_state.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends pona_flipflop_stateUpdateArgs>(args: SelectSubset<T, pona_flipflop_stateUpdateArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pona_flipflop_states.
     * @param {pona_flipflop_stateDeleteManyArgs} args - Arguments to filter Pona_flipflop_states to delete.
     * @example
     * // Delete a few Pona_flipflop_states
     * const { count } = await prisma.pona_flipflop_state.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends pona_flipflop_stateDeleteManyArgs>(args?: SelectSubset<T, pona_flipflop_stateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pona_flipflop_states.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_flipflop_stateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pona_flipflop_states
     * const pona_flipflop_state = await prisma.pona_flipflop_state.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends pona_flipflop_stateUpdateManyArgs>(args: SelectSubset<T, pona_flipflop_stateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pona_flipflop_state.
     * @param {pona_flipflop_stateUpsertArgs} args - Arguments to update or create a Pona_flipflop_state.
     * @example
     * // Update or create a Pona_flipflop_state
     * const pona_flipflop_state = await prisma.pona_flipflop_state.upsert({
     *   create: {
     *     // ... data to create a Pona_flipflop_state
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pona_flipflop_state we want to update
     *   }
     * })
     */
    upsert<T extends pona_flipflop_stateUpsertArgs>(args: SelectSubset<T, pona_flipflop_stateUpsertArgs<ExtArgs>>): Prisma__pona_flipflop_stateClient<$Result.GetResult<Prisma.$pona_flipflop_statePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pona_flipflop_states.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_flipflop_stateCountArgs} args - Arguments to filter Pona_flipflop_states to count.
     * @example
     * // Count the number of Pona_flipflop_states
     * const count = await prisma.pona_flipflop_state.count({
     *   where: {
     *     // ... the filter for the Pona_flipflop_states we want to count
     *   }
     * })
    **/
    count<T extends pona_flipflop_stateCountArgs>(
      args?: Subset<T, pona_flipflop_stateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Pona_flipflop_stateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pona_flipflop_state.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Pona_flipflop_stateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Pona_flipflop_stateAggregateArgs>(args: Subset<T, Pona_flipflop_stateAggregateArgs>): Prisma.PrismaPromise<GetPona_flipflop_stateAggregateType<T>>

    /**
     * Group by Pona_flipflop_state.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_flipflop_stateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends pona_flipflop_stateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pona_flipflop_stateGroupByArgs['orderBy'] }
        : { orderBy?: pona_flipflop_stateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, pona_flipflop_stateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPona_flipflop_stateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pona_flipflop_state model
   */
  readonly fields: pona_flipflop_stateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pona_flipflop_state.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pona_flipflop_stateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the pona_flipflop_state model
   */
  interface pona_flipflop_stateFieldRefs {
    readonly id: FieldRef<"pona_flipflop_state", 'BigInt'>
    readonly time: FieldRef<"pona_flipflop_state", 'DateTime'>
    readonly guildid: FieldRef<"pona_flipflop_state", 'String'>
    readonly active: FieldRef<"pona_flipflop_state", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * pona_flipflop_state findUnique
   */
  export type pona_flipflop_stateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * Filter, which pona_flipflop_state to fetch.
     */
    where: pona_flipflop_stateWhereUniqueInput
  }

  /**
   * pona_flipflop_state findUniqueOrThrow
   */
  export type pona_flipflop_stateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * Filter, which pona_flipflop_state to fetch.
     */
    where: pona_flipflop_stateWhereUniqueInput
  }

  /**
   * pona_flipflop_state findFirst
   */
  export type pona_flipflop_stateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * Filter, which pona_flipflop_state to fetch.
     */
    where?: pona_flipflop_stateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_flipflop_states to fetch.
     */
    orderBy?: pona_flipflop_stateOrderByWithRelationInput | pona_flipflop_stateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pona_flipflop_states.
     */
    cursor?: pona_flipflop_stateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_flipflop_states from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_flipflop_states.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_flipflop_states.
     */
    distinct?: Pona_flipflop_stateScalarFieldEnum | Pona_flipflop_stateScalarFieldEnum[]
  }

  /**
   * pona_flipflop_state findFirstOrThrow
   */
  export type pona_flipflop_stateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * Filter, which pona_flipflop_state to fetch.
     */
    where?: pona_flipflop_stateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_flipflop_states to fetch.
     */
    orderBy?: pona_flipflop_stateOrderByWithRelationInput | pona_flipflop_stateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pona_flipflop_states.
     */
    cursor?: pona_flipflop_stateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_flipflop_states from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_flipflop_states.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_flipflop_states.
     */
    distinct?: Pona_flipflop_stateScalarFieldEnum | Pona_flipflop_stateScalarFieldEnum[]
  }

  /**
   * pona_flipflop_state findMany
   */
  export type pona_flipflop_stateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * Filter, which pona_flipflop_states to fetch.
     */
    where?: pona_flipflop_stateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_flipflop_states to fetch.
     */
    orderBy?: pona_flipflop_stateOrderByWithRelationInput | pona_flipflop_stateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pona_flipflop_states.
     */
    cursor?: pona_flipflop_stateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_flipflop_states from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_flipflop_states.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_flipflop_states.
     */
    distinct?: Pona_flipflop_stateScalarFieldEnum | Pona_flipflop_stateScalarFieldEnum[]
  }

  /**
   * pona_flipflop_state create
   */
  export type pona_flipflop_stateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * The data needed to create a pona_flipflop_state.
     */
    data: XOR<pona_flipflop_stateCreateInput, pona_flipflop_stateUncheckedCreateInput>
  }

  /**
   * pona_flipflop_state createMany
   */
  export type pona_flipflop_stateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pona_flipflop_states.
     */
    data: pona_flipflop_stateCreateManyInput | pona_flipflop_stateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pona_flipflop_state update
   */
  export type pona_flipflop_stateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * The data needed to update a pona_flipflop_state.
     */
    data: XOR<pona_flipflop_stateUpdateInput, pona_flipflop_stateUncheckedUpdateInput>
    /**
     * Choose, which pona_flipflop_state to update.
     */
    where: pona_flipflop_stateWhereUniqueInput
  }

  /**
   * pona_flipflop_state updateMany
   */
  export type pona_flipflop_stateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pona_flipflop_states.
     */
    data: XOR<pona_flipflop_stateUpdateManyMutationInput, pona_flipflop_stateUncheckedUpdateManyInput>
    /**
     * Filter which pona_flipflop_states to update
     */
    where?: pona_flipflop_stateWhereInput
    /**
     * Limit how many pona_flipflop_states to update.
     */
    limit?: number
  }

  /**
   * pona_flipflop_state upsert
   */
  export type pona_flipflop_stateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * The filter to search for the pona_flipflop_state to update in case it exists.
     */
    where: pona_flipflop_stateWhereUniqueInput
    /**
     * In case the pona_flipflop_state found by the `where` argument doesn't exist, create a new pona_flipflop_state with this data.
     */
    create: XOR<pona_flipflop_stateCreateInput, pona_flipflop_stateUncheckedCreateInput>
    /**
     * In case the pona_flipflop_state was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pona_flipflop_stateUpdateInput, pona_flipflop_stateUncheckedUpdateInput>
  }

  /**
   * pona_flipflop_state delete
   */
  export type pona_flipflop_stateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
    /**
     * Filter which pona_flipflop_state to delete.
     */
    where: pona_flipflop_stateWhereUniqueInput
  }

  /**
   * pona_flipflop_state deleteMany
   */
  export type pona_flipflop_stateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pona_flipflop_states to delete
     */
    where?: pona_flipflop_stateWhereInput
    /**
     * Limit how many pona_flipflop_states to delete.
     */
    limit?: number
  }

  /**
   * pona_flipflop_state without action
   */
  export type pona_flipflop_stateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_flipflop_state
     */
    select?: pona_flipflop_stateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_flipflop_state
     */
    omit?: pona_flipflop_stateOmit<ExtArgs> | null
  }


  /**
   * Model pona_heartbeat_interval
   */

  export type AggregatePona_heartbeat_interval = {
    _count: Pona_heartbeat_intervalCountAggregateOutputType | null
    _avg: Pona_heartbeat_intervalAvgAggregateOutputType | null
    _sum: Pona_heartbeat_intervalSumAggregateOutputType | null
    _min: Pona_heartbeat_intervalMinAggregateOutputType | null
    _max: Pona_heartbeat_intervalMaxAggregateOutputType | null
  }

  export type Pona_heartbeat_intervalAvgAggregateOutputType = {
    id: number | null
    ptm: number | null
  }

  export type Pona_heartbeat_intervalSumAggregateOutputType = {
    id: bigint | null
    ptm: number | null
  }

  export type Pona_heartbeat_intervalMinAggregateOutputType = {
    id: bigint | null
    time: Date | null
    clusterid: string | null
    shardid: string | null
    ptm: number | null
  }

  export type Pona_heartbeat_intervalMaxAggregateOutputType = {
    id: bigint | null
    time: Date | null
    clusterid: string | null
    shardid: string | null
    ptm: number | null
  }

  export type Pona_heartbeat_intervalCountAggregateOutputType = {
    id: number
    time: number
    clusterid: number
    shardid: number
    ptm: number
    _all: number
  }


  export type Pona_heartbeat_intervalAvgAggregateInputType = {
    id?: true
    ptm?: true
  }

  export type Pona_heartbeat_intervalSumAggregateInputType = {
    id?: true
    ptm?: true
  }

  export type Pona_heartbeat_intervalMinAggregateInputType = {
    id?: true
    time?: true
    clusterid?: true
    shardid?: true
    ptm?: true
  }

  export type Pona_heartbeat_intervalMaxAggregateInputType = {
    id?: true
    time?: true
    clusterid?: true
    shardid?: true
    ptm?: true
  }

  export type Pona_heartbeat_intervalCountAggregateInputType = {
    id?: true
    time?: true
    clusterid?: true
    shardid?: true
    ptm?: true
    _all?: true
  }

  export type Pona_heartbeat_intervalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pona_heartbeat_interval to aggregate.
     */
    where?: pona_heartbeat_intervalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_heartbeat_intervals to fetch.
     */
    orderBy?: pona_heartbeat_intervalOrderByWithRelationInput | pona_heartbeat_intervalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pona_heartbeat_intervalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_heartbeat_intervals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_heartbeat_intervals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pona_heartbeat_intervals
    **/
    _count?: true | Pona_heartbeat_intervalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Pona_heartbeat_intervalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Pona_heartbeat_intervalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Pona_heartbeat_intervalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Pona_heartbeat_intervalMaxAggregateInputType
  }

  export type GetPona_heartbeat_intervalAggregateType<T extends Pona_heartbeat_intervalAggregateArgs> = {
        [P in keyof T & keyof AggregatePona_heartbeat_interval]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePona_heartbeat_interval[P]>
      : GetScalarType<T[P], AggregatePona_heartbeat_interval[P]>
  }




  export type pona_heartbeat_intervalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pona_heartbeat_intervalWhereInput
    orderBy?: pona_heartbeat_intervalOrderByWithAggregationInput | pona_heartbeat_intervalOrderByWithAggregationInput[]
    by: Pona_heartbeat_intervalScalarFieldEnum[] | Pona_heartbeat_intervalScalarFieldEnum
    having?: pona_heartbeat_intervalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Pona_heartbeat_intervalCountAggregateInputType | true
    _avg?: Pona_heartbeat_intervalAvgAggregateInputType
    _sum?: Pona_heartbeat_intervalSumAggregateInputType
    _min?: Pona_heartbeat_intervalMinAggregateInputType
    _max?: Pona_heartbeat_intervalMaxAggregateInputType
  }

  export type Pona_heartbeat_intervalGroupByOutputType = {
    id: bigint
    time: Date
    clusterid: string | null
    shardid: string | null
    ptm: number
    _count: Pona_heartbeat_intervalCountAggregateOutputType | null
    _avg: Pona_heartbeat_intervalAvgAggregateOutputType | null
    _sum: Pona_heartbeat_intervalSumAggregateOutputType | null
    _min: Pona_heartbeat_intervalMinAggregateOutputType | null
    _max: Pona_heartbeat_intervalMaxAggregateOutputType | null
  }

  type GetPona_heartbeat_intervalGroupByPayload<T extends pona_heartbeat_intervalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Pona_heartbeat_intervalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Pona_heartbeat_intervalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Pona_heartbeat_intervalGroupByOutputType[P]>
            : GetScalarType<T[P], Pona_heartbeat_intervalGroupByOutputType[P]>
        }
      >
    >


  export type pona_heartbeat_intervalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    time?: boolean
    clusterid?: boolean
    shardid?: boolean
    ptm?: boolean
  }, ExtArgs["result"]["pona_heartbeat_interval"]>



  export type pona_heartbeat_intervalSelectScalar = {
    id?: boolean
    time?: boolean
    clusterid?: boolean
    shardid?: boolean
    ptm?: boolean
  }

  export type pona_heartbeat_intervalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "time" | "clusterid" | "shardid" | "ptm", ExtArgs["result"]["pona_heartbeat_interval"]>

  export type $pona_heartbeat_intervalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pona_heartbeat_interval"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      time: Date
      clusterid: string | null
      shardid: string | null
      ptm: number
    }, ExtArgs["result"]["pona_heartbeat_interval"]>
    composites: {}
  }

  type pona_heartbeat_intervalGetPayload<S extends boolean | null | undefined | pona_heartbeat_intervalDefaultArgs> = $Result.GetResult<Prisma.$pona_heartbeat_intervalPayload, S>

  type pona_heartbeat_intervalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<pona_heartbeat_intervalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Pona_heartbeat_intervalCountAggregateInputType | true
    }

  export interface pona_heartbeat_intervalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pona_heartbeat_interval'], meta: { name: 'pona_heartbeat_interval' } }
    /**
     * Find zero or one Pona_heartbeat_interval that matches the filter.
     * @param {pona_heartbeat_intervalFindUniqueArgs} args - Arguments to find a Pona_heartbeat_interval
     * @example
     * // Get one Pona_heartbeat_interval
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends pona_heartbeat_intervalFindUniqueArgs>(args: SelectSubset<T, pona_heartbeat_intervalFindUniqueArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pona_heartbeat_interval that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {pona_heartbeat_intervalFindUniqueOrThrowArgs} args - Arguments to find a Pona_heartbeat_interval
     * @example
     * // Get one Pona_heartbeat_interval
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends pona_heartbeat_intervalFindUniqueOrThrowArgs>(args: SelectSubset<T, pona_heartbeat_intervalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pona_heartbeat_interval that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_heartbeat_intervalFindFirstArgs} args - Arguments to find a Pona_heartbeat_interval
     * @example
     * // Get one Pona_heartbeat_interval
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends pona_heartbeat_intervalFindFirstArgs>(args?: SelectSubset<T, pona_heartbeat_intervalFindFirstArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pona_heartbeat_interval that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_heartbeat_intervalFindFirstOrThrowArgs} args - Arguments to find a Pona_heartbeat_interval
     * @example
     * // Get one Pona_heartbeat_interval
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends pona_heartbeat_intervalFindFirstOrThrowArgs>(args?: SelectSubset<T, pona_heartbeat_intervalFindFirstOrThrowArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pona_heartbeat_intervals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_heartbeat_intervalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pona_heartbeat_intervals
     * const pona_heartbeat_intervals = await prisma.pona_heartbeat_interval.findMany()
     * 
     * // Get first 10 Pona_heartbeat_intervals
     * const pona_heartbeat_intervals = await prisma.pona_heartbeat_interval.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pona_heartbeat_intervalWithIdOnly = await prisma.pona_heartbeat_interval.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends pona_heartbeat_intervalFindManyArgs>(args?: SelectSubset<T, pona_heartbeat_intervalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pona_heartbeat_interval.
     * @param {pona_heartbeat_intervalCreateArgs} args - Arguments to create a Pona_heartbeat_interval.
     * @example
     * // Create one Pona_heartbeat_interval
     * const Pona_heartbeat_interval = await prisma.pona_heartbeat_interval.create({
     *   data: {
     *     // ... data to create a Pona_heartbeat_interval
     *   }
     * })
     * 
     */
    create<T extends pona_heartbeat_intervalCreateArgs>(args: SelectSubset<T, pona_heartbeat_intervalCreateArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pona_heartbeat_intervals.
     * @param {pona_heartbeat_intervalCreateManyArgs} args - Arguments to create many Pona_heartbeat_intervals.
     * @example
     * // Create many Pona_heartbeat_intervals
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends pona_heartbeat_intervalCreateManyArgs>(args?: SelectSubset<T, pona_heartbeat_intervalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pona_heartbeat_interval.
     * @param {pona_heartbeat_intervalDeleteArgs} args - Arguments to delete one Pona_heartbeat_interval.
     * @example
     * // Delete one Pona_heartbeat_interval
     * const Pona_heartbeat_interval = await prisma.pona_heartbeat_interval.delete({
     *   where: {
     *     // ... filter to delete one Pona_heartbeat_interval
     *   }
     * })
     * 
     */
    delete<T extends pona_heartbeat_intervalDeleteArgs>(args: SelectSubset<T, pona_heartbeat_intervalDeleteArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pona_heartbeat_interval.
     * @param {pona_heartbeat_intervalUpdateArgs} args - Arguments to update one Pona_heartbeat_interval.
     * @example
     * // Update one Pona_heartbeat_interval
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends pona_heartbeat_intervalUpdateArgs>(args: SelectSubset<T, pona_heartbeat_intervalUpdateArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pona_heartbeat_intervals.
     * @param {pona_heartbeat_intervalDeleteManyArgs} args - Arguments to filter Pona_heartbeat_intervals to delete.
     * @example
     * // Delete a few Pona_heartbeat_intervals
     * const { count } = await prisma.pona_heartbeat_interval.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends pona_heartbeat_intervalDeleteManyArgs>(args?: SelectSubset<T, pona_heartbeat_intervalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pona_heartbeat_intervals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_heartbeat_intervalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pona_heartbeat_intervals
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends pona_heartbeat_intervalUpdateManyArgs>(args: SelectSubset<T, pona_heartbeat_intervalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pona_heartbeat_interval.
     * @param {pona_heartbeat_intervalUpsertArgs} args - Arguments to update or create a Pona_heartbeat_interval.
     * @example
     * // Update or create a Pona_heartbeat_interval
     * const pona_heartbeat_interval = await prisma.pona_heartbeat_interval.upsert({
     *   create: {
     *     // ... data to create a Pona_heartbeat_interval
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pona_heartbeat_interval we want to update
     *   }
     * })
     */
    upsert<T extends pona_heartbeat_intervalUpsertArgs>(args: SelectSubset<T, pona_heartbeat_intervalUpsertArgs<ExtArgs>>): Prisma__pona_heartbeat_intervalClient<$Result.GetResult<Prisma.$pona_heartbeat_intervalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pona_heartbeat_intervals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_heartbeat_intervalCountArgs} args - Arguments to filter Pona_heartbeat_intervals to count.
     * @example
     * // Count the number of Pona_heartbeat_intervals
     * const count = await prisma.pona_heartbeat_interval.count({
     *   where: {
     *     // ... the filter for the Pona_heartbeat_intervals we want to count
     *   }
     * })
    **/
    count<T extends pona_heartbeat_intervalCountArgs>(
      args?: Subset<T, pona_heartbeat_intervalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Pona_heartbeat_intervalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pona_heartbeat_interval.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Pona_heartbeat_intervalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Pona_heartbeat_intervalAggregateArgs>(args: Subset<T, Pona_heartbeat_intervalAggregateArgs>): Prisma.PrismaPromise<GetPona_heartbeat_intervalAggregateType<T>>

    /**
     * Group by Pona_heartbeat_interval.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_heartbeat_intervalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends pona_heartbeat_intervalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pona_heartbeat_intervalGroupByArgs['orderBy'] }
        : { orderBy?: pona_heartbeat_intervalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, pona_heartbeat_intervalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPona_heartbeat_intervalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pona_heartbeat_interval model
   */
  readonly fields: pona_heartbeat_intervalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pona_heartbeat_interval.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pona_heartbeat_intervalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the pona_heartbeat_interval model
   */
  interface pona_heartbeat_intervalFieldRefs {
    readonly id: FieldRef<"pona_heartbeat_interval", 'BigInt'>
    readonly time: FieldRef<"pona_heartbeat_interval", 'DateTime'>
    readonly clusterid: FieldRef<"pona_heartbeat_interval", 'String'>
    readonly shardid: FieldRef<"pona_heartbeat_interval", 'String'>
    readonly ptm: FieldRef<"pona_heartbeat_interval", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * pona_heartbeat_interval findUnique
   */
  export type pona_heartbeat_intervalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * Filter, which pona_heartbeat_interval to fetch.
     */
    where: pona_heartbeat_intervalWhereUniqueInput
  }

  /**
   * pona_heartbeat_interval findUniqueOrThrow
   */
  export type pona_heartbeat_intervalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * Filter, which pona_heartbeat_interval to fetch.
     */
    where: pona_heartbeat_intervalWhereUniqueInput
  }

  /**
   * pona_heartbeat_interval findFirst
   */
  export type pona_heartbeat_intervalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * Filter, which pona_heartbeat_interval to fetch.
     */
    where?: pona_heartbeat_intervalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_heartbeat_intervals to fetch.
     */
    orderBy?: pona_heartbeat_intervalOrderByWithRelationInput | pona_heartbeat_intervalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pona_heartbeat_intervals.
     */
    cursor?: pona_heartbeat_intervalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_heartbeat_intervals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_heartbeat_intervals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_heartbeat_intervals.
     */
    distinct?: Pona_heartbeat_intervalScalarFieldEnum | Pona_heartbeat_intervalScalarFieldEnum[]
  }

  /**
   * pona_heartbeat_interval findFirstOrThrow
   */
  export type pona_heartbeat_intervalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * Filter, which pona_heartbeat_interval to fetch.
     */
    where?: pona_heartbeat_intervalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_heartbeat_intervals to fetch.
     */
    orderBy?: pona_heartbeat_intervalOrderByWithRelationInput | pona_heartbeat_intervalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pona_heartbeat_intervals.
     */
    cursor?: pona_heartbeat_intervalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_heartbeat_intervals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_heartbeat_intervals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_heartbeat_intervals.
     */
    distinct?: Pona_heartbeat_intervalScalarFieldEnum | Pona_heartbeat_intervalScalarFieldEnum[]
  }

  /**
   * pona_heartbeat_interval findMany
   */
  export type pona_heartbeat_intervalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * Filter, which pona_heartbeat_intervals to fetch.
     */
    where?: pona_heartbeat_intervalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_heartbeat_intervals to fetch.
     */
    orderBy?: pona_heartbeat_intervalOrderByWithRelationInput | pona_heartbeat_intervalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pona_heartbeat_intervals.
     */
    cursor?: pona_heartbeat_intervalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_heartbeat_intervals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_heartbeat_intervals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_heartbeat_intervals.
     */
    distinct?: Pona_heartbeat_intervalScalarFieldEnum | Pona_heartbeat_intervalScalarFieldEnum[]
  }

  /**
   * pona_heartbeat_interval create
   */
  export type pona_heartbeat_intervalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * The data needed to create a pona_heartbeat_interval.
     */
    data?: XOR<pona_heartbeat_intervalCreateInput, pona_heartbeat_intervalUncheckedCreateInput>
  }

  /**
   * pona_heartbeat_interval createMany
   */
  export type pona_heartbeat_intervalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pona_heartbeat_intervals.
     */
    data: pona_heartbeat_intervalCreateManyInput | pona_heartbeat_intervalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pona_heartbeat_interval update
   */
  export type pona_heartbeat_intervalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * The data needed to update a pona_heartbeat_interval.
     */
    data: XOR<pona_heartbeat_intervalUpdateInput, pona_heartbeat_intervalUncheckedUpdateInput>
    /**
     * Choose, which pona_heartbeat_interval to update.
     */
    where: pona_heartbeat_intervalWhereUniqueInput
  }

  /**
   * pona_heartbeat_interval updateMany
   */
  export type pona_heartbeat_intervalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pona_heartbeat_intervals.
     */
    data: XOR<pona_heartbeat_intervalUpdateManyMutationInput, pona_heartbeat_intervalUncheckedUpdateManyInput>
    /**
     * Filter which pona_heartbeat_intervals to update
     */
    where?: pona_heartbeat_intervalWhereInput
    /**
     * Limit how many pona_heartbeat_intervals to update.
     */
    limit?: number
  }

  /**
   * pona_heartbeat_interval upsert
   */
  export type pona_heartbeat_intervalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * The filter to search for the pona_heartbeat_interval to update in case it exists.
     */
    where: pona_heartbeat_intervalWhereUniqueInput
    /**
     * In case the pona_heartbeat_interval found by the `where` argument doesn't exist, create a new pona_heartbeat_interval with this data.
     */
    create: XOR<pona_heartbeat_intervalCreateInput, pona_heartbeat_intervalUncheckedCreateInput>
    /**
     * In case the pona_heartbeat_interval was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pona_heartbeat_intervalUpdateInput, pona_heartbeat_intervalUncheckedUpdateInput>
  }

  /**
   * pona_heartbeat_interval delete
   */
  export type pona_heartbeat_intervalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
    /**
     * Filter which pona_heartbeat_interval to delete.
     */
    where: pona_heartbeat_intervalWhereUniqueInput
  }

  /**
   * pona_heartbeat_interval deleteMany
   */
  export type pona_heartbeat_intervalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pona_heartbeat_intervals to delete
     */
    where?: pona_heartbeat_intervalWhereInput
    /**
     * Limit how many pona_heartbeat_intervals to delete.
     */
    limit?: number
  }

  /**
   * pona_heartbeat_interval without action
   */
  export type pona_heartbeat_intervalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_heartbeat_interval
     */
    select?: pona_heartbeat_intervalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_heartbeat_interval
     */
    omit?: pona_heartbeat_intervalOmit<ExtArgs> | null
  }


  /**
   * Model pona_voicestate_history
   */

  export type AggregatePona_voicestate_history = {
    _count: Pona_voicestate_historyCountAggregateOutputType | null
    _avg: Pona_voicestate_historyAvgAggregateOutputType | null
    _sum: Pona_voicestate_historySumAggregateOutputType | null
    _min: Pona_voicestate_historyMinAggregateOutputType | null
    _max: Pona_voicestate_historyMaxAggregateOutputType | null
  }

  export type Pona_voicestate_historyAvgAggregateOutputType = {
    id: number | null
  }

  export type Pona_voicestate_historySumAggregateOutputType = {
    id: bigint | null
  }

  export type Pona_voicestate_historyMinAggregateOutputType = {
    id: bigint | null
    guildid: string | null
    memberid: string | null
    channelid: string | null
    beforestate: string | null
    afterstate: string | null
    date: Date | null
    type: string | null
  }

  export type Pona_voicestate_historyMaxAggregateOutputType = {
    id: bigint | null
    guildid: string | null
    memberid: string | null
    channelid: string | null
    beforestate: string | null
    afterstate: string | null
    date: Date | null
    type: string | null
  }

  export type Pona_voicestate_historyCountAggregateOutputType = {
    id: number
    guildid: number
    memberid: number
    channelid: number
    beforestate: number
    afterstate: number
    date: number
    type: number
    _all: number
  }


  export type Pona_voicestate_historyAvgAggregateInputType = {
    id?: true
  }

  export type Pona_voicestate_historySumAggregateInputType = {
    id?: true
  }

  export type Pona_voicestate_historyMinAggregateInputType = {
    id?: true
    guildid?: true
    memberid?: true
    channelid?: true
    beforestate?: true
    afterstate?: true
    date?: true
    type?: true
  }

  export type Pona_voicestate_historyMaxAggregateInputType = {
    id?: true
    guildid?: true
    memberid?: true
    channelid?: true
    beforestate?: true
    afterstate?: true
    date?: true
    type?: true
  }

  export type Pona_voicestate_historyCountAggregateInputType = {
    id?: true
    guildid?: true
    memberid?: true
    channelid?: true
    beforestate?: true
    afterstate?: true
    date?: true
    type?: true
    _all?: true
  }

  export type Pona_voicestate_historyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pona_voicestate_history to aggregate.
     */
    where?: pona_voicestate_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_voicestate_histories to fetch.
     */
    orderBy?: pona_voicestate_historyOrderByWithRelationInput | pona_voicestate_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: pona_voicestate_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_voicestate_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_voicestate_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned pona_voicestate_histories
    **/
    _count?: true | Pona_voicestate_historyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Pona_voicestate_historyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Pona_voicestate_historySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Pona_voicestate_historyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Pona_voicestate_historyMaxAggregateInputType
  }

  export type GetPona_voicestate_historyAggregateType<T extends Pona_voicestate_historyAggregateArgs> = {
        [P in keyof T & keyof AggregatePona_voicestate_history]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePona_voicestate_history[P]>
      : GetScalarType<T[P], AggregatePona_voicestate_history[P]>
  }




  export type pona_voicestate_historyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: pona_voicestate_historyWhereInput
    orderBy?: pona_voicestate_historyOrderByWithAggregationInput | pona_voicestate_historyOrderByWithAggregationInput[]
    by: Pona_voicestate_historyScalarFieldEnum[] | Pona_voicestate_historyScalarFieldEnum
    having?: pona_voicestate_historyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Pona_voicestate_historyCountAggregateInputType | true
    _avg?: Pona_voicestate_historyAvgAggregateInputType
    _sum?: Pona_voicestate_historySumAggregateInputType
    _min?: Pona_voicestate_historyMinAggregateInputType
    _max?: Pona_voicestate_historyMaxAggregateInputType
  }

  export type Pona_voicestate_historyGroupByOutputType = {
    id: bigint
    guildid: string
    memberid: string
    channelid: string
    beforestate: string | null
    afterstate: string | null
    date: Date
    type: string
    _count: Pona_voicestate_historyCountAggregateOutputType | null
    _avg: Pona_voicestate_historyAvgAggregateOutputType | null
    _sum: Pona_voicestate_historySumAggregateOutputType | null
    _min: Pona_voicestate_historyMinAggregateOutputType | null
    _max: Pona_voicestate_historyMaxAggregateOutputType | null
  }

  type GetPona_voicestate_historyGroupByPayload<T extends pona_voicestate_historyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Pona_voicestate_historyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Pona_voicestate_historyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Pona_voicestate_historyGroupByOutputType[P]>
            : GetScalarType<T[P], Pona_voicestate_historyGroupByOutputType[P]>
        }
      >
    >


  export type pona_voicestate_historySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guildid?: boolean
    memberid?: boolean
    channelid?: boolean
    beforestate?: boolean
    afterstate?: boolean
    date?: boolean
    type?: boolean
  }, ExtArgs["result"]["pona_voicestate_history"]>



  export type pona_voicestate_historySelectScalar = {
    id?: boolean
    guildid?: boolean
    memberid?: boolean
    channelid?: boolean
    beforestate?: boolean
    afterstate?: boolean
    date?: boolean
    type?: boolean
  }

  export type pona_voicestate_historyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guildid" | "memberid" | "channelid" | "beforestate" | "afterstate" | "date" | "type", ExtArgs["result"]["pona_voicestate_history"]>

  export type $pona_voicestate_historyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "pona_voicestate_history"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      guildid: string
      memberid: string
      channelid: string
      beforestate: string | null
      afterstate: string | null
      date: Date
      type: string
    }, ExtArgs["result"]["pona_voicestate_history"]>
    composites: {}
  }

  type pona_voicestate_historyGetPayload<S extends boolean | null | undefined | pona_voicestate_historyDefaultArgs> = $Result.GetResult<Prisma.$pona_voicestate_historyPayload, S>

  type pona_voicestate_historyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<pona_voicestate_historyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Pona_voicestate_historyCountAggregateInputType | true
    }

  export interface pona_voicestate_historyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['pona_voicestate_history'], meta: { name: 'pona_voicestate_history' } }
    /**
     * Find zero or one Pona_voicestate_history that matches the filter.
     * @param {pona_voicestate_historyFindUniqueArgs} args - Arguments to find a Pona_voicestate_history
     * @example
     * // Get one Pona_voicestate_history
     * const pona_voicestate_history = await prisma.pona_voicestate_history.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends pona_voicestate_historyFindUniqueArgs>(args: SelectSubset<T, pona_voicestate_historyFindUniqueArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pona_voicestate_history that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {pona_voicestate_historyFindUniqueOrThrowArgs} args - Arguments to find a Pona_voicestate_history
     * @example
     * // Get one Pona_voicestate_history
     * const pona_voicestate_history = await prisma.pona_voicestate_history.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends pona_voicestate_historyFindUniqueOrThrowArgs>(args: SelectSubset<T, pona_voicestate_historyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pona_voicestate_history that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_voicestate_historyFindFirstArgs} args - Arguments to find a Pona_voicestate_history
     * @example
     * // Get one Pona_voicestate_history
     * const pona_voicestate_history = await prisma.pona_voicestate_history.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends pona_voicestate_historyFindFirstArgs>(args?: SelectSubset<T, pona_voicestate_historyFindFirstArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pona_voicestate_history that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_voicestate_historyFindFirstOrThrowArgs} args - Arguments to find a Pona_voicestate_history
     * @example
     * // Get one Pona_voicestate_history
     * const pona_voicestate_history = await prisma.pona_voicestate_history.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends pona_voicestate_historyFindFirstOrThrowArgs>(args?: SelectSubset<T, pona_voicestate_historyFindFirstOrThrowArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pona_voicestate_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_voicestate_historyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pona_voicestate_histories
     * const pona_voicestate_histories = await prisma.pona_voicestate_history.findMany()
     * 
     * // Get first 10 Pona_voicestate_histories
     * const pona_voicestate_histories = await prisma.pona_voicestate_history.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pona_voicestate_historyWithIdOnly = await prisma.pona_voicestate_history.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends pona_voicestate_historyFindManyArgs>(args?: SelectSubset<T, pona_voicestate_historyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pona_voicestate_history.
     * @param {pona_voicestate_historyCreateArgs} args - Arguments to create a Pona_voicestate_history.
     * @example
     * // Create one Pona_voicestate_history
     * const Pona_voicestate_history = await prisma.pona_voicestate_history.create({
     *   data: {
     *     // ... data to create a Pona_voicestate_history
     *   }
     * })
     * 
     */
    create<T extends pona_voicestate_historyCreateArgs>(args: SelectSubset<T, pona_voicestate_historyCreateArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pona_voicestate_histories.
     * @param {pona_voicestate_historyCreateManyArgs} args - Arguments to create many Pona_voicestate_histories.
     * @example
     * // Create many Pona_voicestate_histories
     * const pona_voicestate_history = await prisma.pona_voicestate_history.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends pona_voicestate_historyCreateManyArgs>(args?: SelectSubset<T, pona_voicestate_historyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Pona_voicestate_history.
     * @param {pona_voicestate_historyDeleteArgs} args - Arguments to delete one Pona_voicestate_history.
     * @example
     * // Delete one Pona_voicestate_history
     * const Pona_voicestate_history = await prisma.pona_voicestate_history.delete({
     *   where: {
     *     // ... filter to delete one Pona_voicestate_history
     *   }
     * })
     * 
     */
    delete<T extends pona_voicestate_historyDeleteArgs>(args: SelectSubset<T, pona_voicestate_historyDeleteArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pona_voicestate_history.
     * @param {pona_voicestate_historyUpdateArgs} args - Arguments to update one Pona_voicestate_history.
     * @example
     * // Update one Pona_voicestate_history
     * const pona_voicestate_history = await prisma.pona_voicestate_history.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends pona_voicestate_historyUpdateArgs>(args: SelectSubset<T, pona_voicestate_historyUpdateArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pona_voicestate_histories.
     * @param {pona_voicestate_historyDeleteManyArgs} args - Arguments to filter Pona_voicestate_histories to delete.
     * @example
     * // Delete a few Pona_voicestate_histories
     * const { count } = await prisma.pona_voicestate_history.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends pona_voicestate_historyDeleteManyArgs>(args?: SelectSubset<T, pona_voicestate_historyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pona_voicestate_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_voicestate_historyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pona_voicestate_histories
     * const pona_voicestate_history = await prisma.pona_voicestate_history.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends pona_voicestate_historyUpdateManyArgs>(args: SelectSubset<T, pona_voicestate_historyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Pona_voicestate_history.
     * @param {pona_voicestate_historyUpsertArgs} args - Arguments to update or create a Pona_voicestate_history.
     * @example
     * // Update or create a Pona_voicestate_history
     * const pona_voicestate_history = await prisma.pona_voicestate_history.upsert({
     *   create: {
     *     // ... data to create a Pona_voicestate_history
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pona_voicestate_history we want to update
     *   }
     * })
     */
    upsert<T extends pona_voicestate_historyUpsertArgs>(args: SelectSubset<T, pona_voicestate_historyUpsertArgs<ExtArgs>>): Prisma__pona_voicestate_historyClient<$Result.GetResult<Prisma.$pona_voicestate_historyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pona_voicestate_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_voicestate_historyCountArgs} args - Arguments to filter Pona_voicestate_histories to count.
     * @example
     * // Count the number of Pona_voicestate_histories
     * const count = await prisma.pona_voicestate_history.count({
     *   where: {
     *     // ... the filter for the Pona_voicestate_histories we want to count
     *   }
     * })
    **/
    count<T extends pona_voicestate_historyCountArgs>(
      args?: Subset<T, pona_voicestate_historyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Pona_voicestate_historyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pona_voicestate_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Pona_voicestate_historyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Pona_voicestate_historyAggregateArgs>(args: Subset<T, Pona_voicestate_historyAggregateArgs>): Prisma.PrismaPromise<GetPona_voicestate_historyAggregateType<T>>

    /**
     * Group by Pona_voicestate_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {pona_voicestate_historyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends pona_voicestate_historyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: pona_voicestate_historyGroupByArgs['orderBy'] }
        : { orderBy?: pona_voicestate_historyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, pona_voicestate_historyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPona_voicestate_historyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the pona_voicestate_history model
   */
  readonly fields: pona_voicestate_historyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for pona_voicestate_history.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__pona_voicestate_historyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the pona_voicestate_history model
   */
  interface pona_voicestate_historyFieldRefs {
    readonly id: FieldRef<"pona_voicestate_history", 'BigInt'>
    readonly guildid: FieldRef<"pona_voicestate_history", 'String'>
    readonly memberid: FieldRef<"pona_voicestate_history", 'String'>
    readonly channelid: FieldRef<"pona_voicestate_history", 'String'>
    readonly beforestate: FieldRef<"pona_voicestate_history", 'String'>
    readonly afterstate: FieldRef<"pona_voicestate_history", 'String'>
    readonly date: FieldRef<"pona_voicestate_history", 'DateTime'>
    readonly type: FieldRef<"pona_voicestate_history", 'String'>
  }
    

  // Custom InputTypes
  /**
   * pona_voicestate_history findUnique
   */
  export type pona_voicestate_historyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * Filter, which pona_voicestate_history to fetch.
     */
    where: pona_voicestate_historyWhereUniqueInput
  }

  /**
   * pona_voicestate_history findUniqueOrThrow
   */
  export type pona_voicestate_historyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * Filter, which pona_voicestate_history to fetch.
     */
    where: pona_voicestate_historyWhereUniqueInput
  }

  /**
   * pona_voicestate_history findFirst
   */
  export type pona_voicestate_historyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * Filter, which pona_voicestate_history to fetch.
     */
    where?: pona_voicestate_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_voicestate_histories to fetch.
     */
    orderBy?: pona_voicestate_historyOrderByWithRelationInput | pona_voicestate_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pona_voicestate_histories.
     */
    cursor?: pona_voicestate_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_voicestate_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_voicestate_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_voicestate_histories.
     */
    distinct?: Pona_voicestate_historyScalarFieldEnum | Pona_voicestate_historyScalarFieldEnum[]
  }

  /**
   * pona_voicestate_history findFirstOrThrow
   */
  export type pona_voicestate_historyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * Filter, which pona_voicestate_history to fetch.
     */
    where?: pona_voicestate_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_voicestate_histories to fetch.
     */
    orderBy?: pona_voicestate_historyOrderByWithRelationInput | pona_voicestate_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for pona_voicestate_histories.
     */
    cursor?: pona_voicestate_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_voicestate_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_voicestate_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_voicestate_histories.
     */
    distinct?: Pona_voicestate_historyScalarFieldEnum | Pona_voicestate_historyScalarFieldEnum[]
  }

  /**
   * pona_voicestate_history findMany
   */
  export type pona_voicestate_historyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * Filter, which pona_voicestate_histories to fetch.
     */
    where?: pona_voicestate_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of pona_voicestate_histories to fetch.
     */
    orderBy?: pona_voicestate_historyOrderByWithRelationInput | pona_voicestate_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing pona_voicestate_histories.
     */
    cursor?: pona_voicestate_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` pona_voicestate_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` pona_voicestate_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of pona_voicestate_histories.
     */
    distinct?: Pona_voicestate_historyScalarFieldEnum | Pona_voicestate_historyScalarFieldEnum[]
  }

  /**
   * pona_voicestate_history create
   */
  export type pona_voicestate_historyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * The data needed to create a pona_voicestate_history.
     */
    data: XOR<pona_voicestate_historyCreateInput, pona_voicestate_historyUncheckedCreateInput>
  }

  /**
   * pona_voicestate_history createMany
   */
  export type pona_voicestate_historyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many pona_voicestate_histories.
     */
    data: pona_voicestate_historyCreateManyInput | pona_voicestate_historyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * pona_voicestate_history update
   */
  export type pona_voicestate_historyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * The data needed to update a pona_voicestate_history.
     */
    data: XOR<pona_voicestate_historyUpdateInput, pona_voicestate_historyUncheckedUpdateInput>
    /**
     * Choose, which pona_voicestate_history to update.
     */
    where: pona_voicestate_historyWhereUniqueInput
  }

  /**
   * pona_voicestate_history updateMany
   */
  export type pona_voicestate_historyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update pona_voicestate_histories.
     */
    data: XOR<pona_voicestate_historyUpdateManyMutationInput, pona_voicestate_historyUncheckedUpdateManyInput>
    /**
     * Filter which pona_voicestate_histories to update
     */
    where?: pona_voicestate_historyWhereInput
    /**
     * Limit how many pona_voicestate_histories to update.
     */
    limit?: number
  }

  /**
   * pona_voicestate_history upsert
   */
  export type pona_voicestate_historyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * The filter to search for the pona_voicestate_history to update in case it exists.
     */
    where: pona_voicestate_historyWhereUniqueInput
    /**
     * In case the pona_voicestate_history found by the `where` argument doesn't exist, create a new pona_voicestate_history with this data.
     */
    create: XOR<pona_voicestate_historyCreateInput, pona_voicestate_historyUncheckedCreateInput>
    /**
     * In case the pona_voicestate_history was found with the provided `where` argument, update it with this data.
     */
    update: XOR<pona_voicestate_historyUpdateInput, pona_voicestate_historyUncheckedUpdateInput>
  }

  /**
   * pona_voicestate_history delete
   */
  export type pona_voicestate_historyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
    /**
     * Filter which pona_voicestate_history to delete.
     */
    where: pona_voicestate_historyWhereUniqueInput
  }

  /**
   * pona_voicestate_history deleteMany
   */
  export type pona_voicestate_historyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which pona_voicestate_histories to delete
     */
    where?: pona_voicestate_historyWhereInput
    /**
     * Limit how many pona_voicestate_histories to delete.
     */
    limit?: number
  }

  /**
   * pona_voicestate_history without action
   */
  export type pona_voicestate_historyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the pona_voicestate_history
     */
    select?: pona_voicestate_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the pona_voicestate_history
     */
    omit?: pona_voicestate_historyOmit<ExtArgs> | null
  }


  /**
   * Model search_history
   */

  export type AggregateSearch_history = {
    _count: Search_historyCountAggregateOutputType | null
    _avg: Search_historyAvgAggregateOutputType | null
    _sum: Search_historySumAggregateOutputType | null
    _min: Search_historyMinAggregateOutputType | null
    _max: Search_historyMaxAggregateOutputType | null
  }

  export type Search_historyAvgAggregateOutputType = {
    id: number | null
  }

  export type Search_historySumAggregateOutputType = {
    id: bigint | null
  }

  export type Search_historyMinAggregateOutputType = {
    id: bigint | null
    uid: string | null
    time: Date | null
    text: string | null
  }

  export type Search_historyMaxAggregateOutputType = {
    id: bigint | null
    uid: string | null
    time: Date | null
    text: string | null
  }

  export type Search_historyCountAggregateOutputType = {
    id: number
    uid: number
    time: number
    text: number
    _all: number
  }


  export type Search_historyAvgAggregateInputType = {
    id?: true
  }

  export type Search_historySumAggregateInputType = {
    id?: true
  }

  export type Search_historyMinAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    text?: true
  }

  export type Search_historyMaxAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    text?: true
  }

  export type Search_historyCountAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    text?: true
    _all?: true
  }

  export type Search_historyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which search_history to aggregate.
     */
    where?: search_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of search_histories to fetch.
     */
    orderBy?: search_historyOrderByWithRelationInput | search_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: search_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` search_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` search_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned search_histories
    **/
    _count?: true | Search_historyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Search_historyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Search_historySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Search_historyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Search_historyMaxAggregateInputType
  }

  export type GetSearch_historyAggregateType<T extends Search_historyAggregateArgs> = {
        [P in keyof T & keyof AggregateSearch_history]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSearch_history[P]>
      : GetScalarType<T[P], AggregateSearch_history[P]>
  }




  export type search_historyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: search_historyWhereInput
    orderBy?: search_historyOrderByWithAggregationInput | search_historyOrderByWithAggregationInput[]
    by: Search_historyScalarFieldEnum[] | Search_historyScalarFieldEnum
    having?: search_historyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Search_historyCountAggregateInputType | true
    _avg?: Search_historyAvgAggregateInputType
    _sum?: Search_historySumAggregateInputType
    _min?: Search_historyMinAggregateInputType
    _max?: Search_historyMaxAggregateInputType
  }

  export type Search_historyGroupByOutputType = {
    id: bigint
    uid: string
    time: Date
    text: string
    _count: Search_historyCountAggregateOutputType | null
    _avg: Search_historyAvgAggregateOutputType | null
    _sum: Search_historySumAggregateOutputType | null
    _min: Search_historyMinAggregateOutputType | null
    _max: Search_historyMaxAggregateOutputType | null
  }

  type GetSearch_historyGroupByPayload<T extends search_historyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Search_historyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Search_historyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Search_historyGroupByOutputType[P]>
            : GetScalarType<T[P], Search_historyGroupByOutputType[P]>
        }
      >
    >


  export type search_historySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    time?: boolean
    text?: boolean
  }, ExtArgs["result"]["search_history"]>



  export type search_historySelectScalar = {
    id?: boolean
    uid?: boolean
    time?: boolean
    text?: boolean
  }

  export type search_historyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "time" | "text", ExtArgs["result"]["search_history"]>

  export type $search_historyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "search_history"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      uid: string
      time: Date
      text: string
    }, ExtArgs["result"]["search_history"]>
    composites: {}
  }

  type search_historyGetPayload<S extends boolean | null | undefined | search_historyDefaultArgs> = $Result.GetResult<Prisma.$search_historyPayload, S>

  type search_historyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<search_historyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Search_historyCountAggregateInputType | true
    }

  export interface search_historyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['search_history'], meta: { name: 'search_history' } }
    /**
     * Find zero or one Search_history that matches the filter.
     * @param {search_historyFindUniqueArgs} args - Arguments to find a Search_history
     * @example
     * // Get one Search_history
     * const search_history = await prisma.search_history.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends search_historyFindUniqueArgs>(args: SelectSubset<T, search_historyFindUniqueArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Search_history that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {search_historyFindUniqueOrThrowArgs} args - Arguments to find a Search_history
     * @example
     * // Get one Search_history
     * const search_history = await prisma.search_history.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends search_historyFindUniqueOrThrowArgs>(args: SelectSubset<T, search_historyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Search_history that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {search_historyFindFirstArgs} args - Arguments to find a Search_history
     * @example
     * // Get one Search_history
     * const search_history = await prisma.search_history.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends search_historyFindFirstArgs>(args?: SelectSubset<T, search_historyFindFirstArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Search_history that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {search_historyFindFirstOrThrowArgs} args - Arguments to find a Search_history
     * @example
     * // Get one Search_history
     * const search_history = await prisma.search_history.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends search_historyFindFirstOrThrowArgs>(args?: SelectSubset<T, search_historyFindFirstOrThrowArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Search_histories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {search_historyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Search_histories
     * const search_histories = await prisma.search_history.findMany()
     * 
     * // Get first 10 Search_histories
     * const search_histories = await prisma.search_history.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const search_historyWithIdOnly = await prisma.search_history.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends search_historyFindManyArgs>(args?: SelectSubset<T, search_historyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Search_history.
     * @param {search_historyCreateArgs} args - Arguments to create a Search_history.
     * @example
     * // Create one Search_history
     * const Search_history = await prisma.search_history.create({
     *   data: {
     *     // ... data to create a Search_history
     *   }
     * })
     * 
     */
    create<T extends search_historyCreateArgs>(args: SelectSubset<T, search_historyCreateArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Search_histories.
     * @param {search_historyCreateManyArgs} args - Arguments to create many Search_histories.
     * @example
     * // Create many Search_histories
     * const search_history = await prisma.search_history.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends search_historyCreateManyArgs>(args?: SelectSubset<T, search_historyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Search_history.
     * @param {search_historyDeleteArgs} args - Arguments to delete one Search_history.
     * @example
     * // Delete one Search_history
     * const Search_history = await prisma.search_history.delete({
     *   where: {
     *     // ... filter to delete one Search_history
     *   }
     * })
     * 
     */
    delete<T extends search_historyDeleteArgs>(args: SelectSubset<T, search_historyDeleteArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Search_history.
     * @param {search_historyUpdateArgs} args - Arguments to update one Search_history.
     * @example
     * // Update one Search_history
     * const search_history = await prisma.search_history.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends search_historyUpdateArgs>(args: SelectSubset<T, search_historyUpdateArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Search_histories.
     * @param {search_historyDeleteManyArgs} args - Arguments to filter Search_histories to delete.
     * @example
     * // Delete a few Search_histories
     * const { count } = await prisma.search_history.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends search_historyDeleteManyArgs>(args?: SelectSubset<T, search_historyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Search_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {search_historyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Search_histories
     * const search_history = await prisma.search_history.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends search_historyUpdateManyArgs>(args: SelectSubset<T, search_historyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Search_history.
     * @param {search_historyUpsertArgs} args - Arguments to update or create a Search_history.
     * @example
     * // Update or create a Search_history
     * const search_history = await prisma.search_history.upsert({
     *   create: {
     *     // ... data to create a Search_history
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Search_history we want to update
     *   }
     * })
     */
    upsert<T extends search_historyUpsertArgs>(args: SelectSubset<T, search_historyUpsertArgs<ExtArgs>>): Prisma__search_historyClient<$Result.GetResult<Prisma.$search_historyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Search_histories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {search_historyCountArgs} args - Arguments to filter Search_histories to count.
     * @example
     * // Count the number of Search_histories
     * const count = await prisma.search_history.count({
     *   where: {
     *     // ... the filter for the Search_histories we want to count
     *   }
     * })
    **/
    count<T extends search_historyCountArgs>(
      args?: Subset<T, search_historyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Search_historyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Search_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Search_historyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Search_historyAggregateArgs>(args: Subset<T, Search_historyAggregateArgs>): Prisma.PrismaPromise<GetSearch_historyAggregateType<T>>

    /**
     * Group by Search_history.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {search_historyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends search_historyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: search_historyGroupByArgs['orderBy'] }
        : { orderBy?: search_historyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, search_historyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSearch_historyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the search_history model
   */
  readonly fields: search_historyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for search_history.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__search_historyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the search_history model
   */
  interface search_historyFieldRefs {
    readonly id: FieldRef<"search_history", 'BigInt'>
    readonly uid: FieldRef<"search_history", 'String'>
    readonly time: FieldRef<"search_history", 'DateTime'>
    readonly text: FieldRef<"search_history", 'String'>
  }
    

  // Custom InputTypes
  /**
   * search_history findUnique
   */
  export type search_historyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * Filter, which search_history to fetch.
     */
    where: search_historyWhereUniqueInput
  }

  /**
   * search_history findUniqueOrThrow
   */
  export type search_historyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * Filter, which search_history to fetch.
     */
    where: search_historyWhereUniqueInput
  }

  /**
   * search_history findFirst
   */
  export type search_historyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * Filter, which search_history to fetch.
     */
    where?: search_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of search_histories to fetch.
     */
    orderBy?: search_historyOrderByWithRelationInput | search_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for search_histories.
     */
    cursor?: search_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` search_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` search_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of search_histories.
     */
    distinct?: Search_historyScalarFieldEnum | Search_historyScalarFieldEnum[]
  }

  /**
   * search_history findFirstOrThrow
   */
  export type search_historyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * Filter, which search_history to fetch.
     */
    where?: search_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of search_histories to fetch.
     */
    orderBy?: search_historyOrderByWithRelationInput | search_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for search_histories.
     */
    cursor?: search_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` search_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` search_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of search_histories.
     */
    distinct?: Search_historyScalarFieldEnum | Search_historyScalarFieldEnum[]
  }

  /**
   * search_history findMany
   */
  export type search_historyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * Filter, which search_histories to fetch.
     */
    where?: search_historyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of search_histories to fetch.
     */
    orderBy?: search_historyOrderByWithRelationInput | search_historyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing search_histories.
     */
    cursor?: search_historyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` search_histories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` search_histories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of search_histories.
     */
    distinct?: Search_historyScalarFieldEnum | Search_historyScalarFieldEnum[]
  }

  /**
   * search_history create
   */
  export type search_historyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * The data needed to create a search_history.
     */
    data: XOR<search_historyCreateInput, search_historyUncheckedCreateInput>
  }

  /**
   * search_history createMany
   */
  export type search_historyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many search_histories.
     */
    data: search_historyCreateManyInput | search_historyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * search_history update
   */
  export type search_historyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * The data needed to update a search_history.
     */
    data: XOR<search_historyUpdateInput, search_historyUncheckedUpdateInput>
    /**
     * Choose, which search_history to update.
     */
    where: search_historyWhereUniqueInput
  }

  /**
   * search_history updateMany
   */
  export type search_historyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update search_histories.
     */
    data: XOR<search_historyUpdateManyMutationInput, search_historyUncheckedUpdateManyInput>
    /**
     * Filter which search_histories to update
     */
    where?: search_historyWhereInput
    /**
     * Limit how many search_histories to update.
     */
    limit?: number
  }

  /**
   * search_history upsert
   */
  export type search_historyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * The filter to search for the search_history to update in case it exists.
     */
    where: search_historyWhereUniqueInput
    /**
     * In case the search_history found by the `where` argument doesn't exist, create a new search_history with this data.
     */
    create: XOR<search_historyCreateInput, search_historyUncheckedCreateInput>
    /**
     * In case the search_history was found with the provided `where` argument, update it with this data.
     */
    update: XOR<search_historyUpdateInput, search_historyUncheckedUpdateInput>
  }

  /**
   * search_history delete
   */
  export type search_historyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
    /**
     * Filter which search_history to delete.
     */
    where: search_historyWhereUniqueInput
  }

  /**
   * search_history deleteMany
   */
  export type search_historyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which search_histories to delete
     */
    where?: search_historyWhereInput
    /**
     * Limit how many search_histories to delete.
     */
    limit?: number
  }

  /**
   * search_history without action
   */
  export type search_historyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the search_history
     */
    select?: search_historySelect<ExtArgs> | null
    /**
     * Omit specific fields from the search_history
     */
    omit?: search_historyOmit<ExtArgs> | null
  }


  /**
   * Model subscribe_artist
   */

  export type AggregateSubscribe_artist = {
    _count: Subscribe_artistCountAggregateOutputType | null
    _avg: Subscribe_artistAvgAggregateOutputType | null
    _sum: Subscribe_artistSumAggregateOutputType | null
    _min: Subscribe_artistMinAggregateOutputType | null
    _max: Subscribe_artistMaxAggregateOutputType | null
  }

  export type Subscribe_artistAvgAggregateOutputType = {
    id: number | null
  }

  export type Subscribe_artistSumAggregateOutputType = {
    id: bigint | null
  }

  export type Subscribe_artistMinAggregateOutputType = {
    id: bigint | null
    uid: string | null
    target: string | null
    time: Date | null
    cache: string | null
    cache_lastupdated: Date | null
  }

  export type Subscribe_artistMaxAggregateOutputType = {
    id: bigint | null
    uid: string | null
    target: string | null
    time: Date | null
    cache: string | null
    cache_lastupdated: Date | null
  }

  export type Subscribe_artistCountAggregateOutputType = {
    id: number
    uid: number
    target: number
    time: number
    cache: number
    cache_lastupdated: number
    _all: number
  }


  export type Subscribe_artistAvgAggregateInputType = {
    id?: true
  }

  export type Subscribe_artistSumAggregateInputType = {
    id?: true
  }

  export type Subscribe_artistMinAggregateInputType = {
    id?: true
    uid?: true
    target?: true
    time?: true
    cache?: true
    cache_lastupdated?: true
  }

  export type Subscribe_artistMaxAggregateInputType = {
    id?: true
    uid?: true
    target?: true
    time?: true
    cache?: true
    cache_lastupdated?: true
  }

  export type Subscribe_artistCountAggregateInputType = {
    id?: true
    uid?: true
    target?: true
    time?: true
    cache?: true
    cache_lastupdated?: true
    _all?: true
  }

  export type Subscribe_artistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscribe_artist to aggregate.
     */
    where?: subscribe_artistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_artists to fetch.
     */
    orderBy?: subscribe_artistOrderByWithRelationInput | subscribe_artistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: subscribe_artistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned subscribe_artists
    **/
    _count?: true | Subscribe_artistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Subscribe_artistAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Subscribe_artistSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Subscribe_artistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Subscribe_artistMaxAggregateInputType
  }

  export type GetSubscribe_artistAggregateType<T extends Subscribe_artistAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscribe_artist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscribe_artist[P]>
      : GetScalarType<T[P], AggregateSubscribe_artist[P]>
  }




  export type subscribe_artistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subscribe_artistWhereInput
    orderBy?: subscribe_artistOrderByWithAggregationInput | subscribe_artistOrderByWithAggregationInput[]
    by: Subscribe_artistScalarFieldEnum[] | Subscribe_artistScalarFieldEnum
    having?: subscribe_artistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Subscribe_artistCountAggregateInputType | true
    _avg?: Subscribe_artistAvgAggregateInputType
    _sum?: Subscribe_artistSumAggregateInputType
    _min?: Subscribe_artistMinAggregateInputType
    _max?: Subscribe_artistMaxAggregateInputType
  }

  export type Subscribe_artistGroupByOutputType = {
    id: bigint
    uid: string
    target: string
    time: Date
    cache: string | null
    cache_lastupdated: Date | null
    _count: Subscribe_artistCountAggregateOutputType | null
    _avg: Subscribe_artistAvgAggregateOutputType | null
    _sum: Subscribe_artistSumAggregateOutputType | null
    _min: Subscribe_artistMinAggregateOutputType | null
    _max: Subscribe_artistMaxAggregateOutputType | null
  }

  type GetSubscribe_artistGroupByPayload<T extends subscribe_artistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Subscribe_artistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Subscribe_artistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Subscribe_artistGroupByOutputType[P]>
            : GetScalarType<T[P], Subscribe_artistGroupByOutputType[P]>
        }
      >
    >


  export type subscribe_artistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    target?: boolean
    time?: boolean
    cache?: boolean
    cache_lastupdated?: boolean
  }, ExtArgs["result"]["subscribe_artist"]>



  export type subscribe_artistSelectScalar = {
    id?: boolean
    uid?: boolean
    target?: boolean
    time?: boolean
    cache?: boolean
    cache_lastupdated?: boolean
  }

  export type subscribe_artistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "target" | "time" | "cache" | "cache_lastupdated", ExtArgs["result"]["subscribe_artist"]>

  export type $subscribe_artistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "subscribe_artist"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      uid: string
      target: string
      time: Date
      cache: string | null
      cache_lastupdated: Date | null
    }, ExtArgs["result"]["subscribe_artist"]>
    composites: {}
  }

  type subscribe_artistGetPayload<S extends boolean | null | undefined | subscribe_artistDefaultArgs> = $Result.GetResult<Prisma.$subscribe_artistPayload, S>

  type subscribe_artistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<subscribe_artistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Subscribe_artistCountAggregateInputType | true
    }

  export interface subscribe_artistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['subscribe_artist'], meta: { name: 'subscribe_artist' } }
    /**
     * Find zero or one Subscribe_artist that matches the filter.
     * @param {subscribe_artistFindUniqueArgs} args - Arguments to find a Subscribe_artist
     * @example
     * // Get one Subscribe_artist
     * const subscribe_artist = await prisma.subscribe_artist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends subscribe_artistFindUniqueArgs>(args: SelectSubset<T, subscribe_artistFindUniqueArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscribe_artist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {subscribe_artistFindUniqueOrThrowArgs} args - Arguments to find a Subscribe_artist
     * @example
     * // Get one Subscribe_artist
     * const subscribe_artist = await prisma.subscribe_artist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends subscribe_artistFindUniqueOrThrowArgs>(args: SelectSubset<T, subscribe_artistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscribe_artist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_artistFindFirstArgs} args - Arguments to find a Subscribe_artist
     * @example
     * // Get one Subscribe_artist
     * const subscribe_artist = await prisma.subscribe_artist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends subscribe_artistFindFirstArgs>(args?: SelectSubset<T, subscribe_artistFindFirstArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscribe_artist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_artistFindFirstOrThrowArgs} args - Arguments to find a Subscribe_artist
     * @example
     * // Get one Subscribe_artist
     * const subscribe_artist = await prisma.subscribe_artist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends subscribe_artistFindFirstOrThrowArgs>(args?: SelectSubset<T, subscribe_artistFindFirstOrThrowArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscribe_artists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_artistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscribe_artists
     * const subscribe_artists = await prisma.subscribe_artist.findMany()
     * 
     * // Get first 10 Subscribe_artists
     * const subscribe_artists = await prisma.subscribe_artist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscribe_artistWithIdOnly = await prisma.subscribe_artist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends subscribe_artistFindManyArgs>(args?: SelectSubset<T, subscribe_artistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscribe_artist.
     * @param {subscribe_artistCreateArgs} args - Arguments to create a Subscribe_artist.
     * @example
     * // Create one Subscribe_artist
     * const Subscribe_artist = await prisma.subscribe_artist.create({
     *   data: {
     *     // ... data to create a Subscribe_artist
     *   }
     * })
     * 
     */
    create<T extends subscribe_artistCreateArgs>(args: SelectSubset<T, subscribe_artistCreateArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscribe_artists.
     * @param {subscribe_artistCreateManyArgs} args - Arguments to create many Subscribe_artists.
     * @example
     * // Create many Subscribe_artists
     * const subscribe_artist = await prisma.subscribe_artist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends subscribe_artistCreateManyArgs>(args?: SelectSubset<T, subscribe_artistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Subscribe_artist.
     * @param {subscribe_artistDeleteArgs} args - Arguments to delete one Subscribe_artist.
     * @example
     * // Delete one Subscribe_artist
     * const Subscribe_artist = await prisma.subscribe_artist.delete({
     *   where: {
     *     // ... filter to delete one Subscribe_artist
     *   }
     * })
     * 
     */
    delete<T extends subscribe_artistDeleteArgs>(args: SelectSubset<T, subscribe_artistDeleteArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscribe_artist.
     * @param {subscribe_artistUpdateArgs} args - Arguments to update one Subscribe_artist.
     * @example
     * // Update one Subscribe_artist
     * const subscribe_artist = await prisma.subscribe_artist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends subscribe_artistUpdateArgs>(args: SelectSubset<T, subscribe_artistUpdateArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscribe_artists.
     * @param {subscribe_artistDeleteManyArgs} args - Arguments to filter Subscribe_artists to delete.
     * @example
     * // Delete a few Subscribe_artists
     * const { count } = await prisma.subscribe_artist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends subscribe_artistDeleteManyArgs>(args?: SelectSubset<T, subscribe_artistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscribe_artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_artistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscribe_artists
     * const subscribe_artist = await prisma.subscribe_artist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends subscribe_artistUpdateManyArgs>(args: SelectSubset<T, subscribe_artistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscribe_artist.
     * @param {subscribe_artistUpsertArgs} args - Arguments to update or create a Subscribe_artist.
     * @example
     * // Update or create a Subscribe_artist
     * const subscribe_artist = await prisma.subscribe_artist.upsert({
     *   create: {
     *     // ... data to create a Subscribe_artist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscribe_artist we want to update
     *   }
     * })
     */
    upsert<T extends subscribe_artistUpsertArgs>(args: SelectSubset<T, subscribe_artistUpsertArgs<ExtArgs>>): Prisma__subscribe_artistClient<$Result.GetResult<Prisma.$subscribe_artistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscribe_artists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_artistCountArgs} args - Arguments to filter Subscribe_artists to count.
     * @example
     * // Count the number of Subscribe_artists
     * const count = await prisma.subscribe_artist.count({
     *   where: {
     *     // ... the filter for the Subscribe_artists we want to count
     *   }
     * })
    **/
    count<T extends subscribe_artistCountArgs>(
      args?: Subset<T, subscribe_artistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Subscribe_artistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscribe_artist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Subscribe_artistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Subscribe_artistAggregateArgs>(args: Subset<T, Subscribe_artistAggregateArgs>): Prisma.PrismaPromise<GetSubscribe_artistAggregateType<T>>

    /**
     * Group by Subscribe_artist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_artistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends subscribe_artistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: subscribe_artistGroupByArgs['orderBy'] }
        : { orderBy?: subscribe_artistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, subscribe_artistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscribe_artistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the subscribe_artist model
   */
  readonly fields: subscribe_artistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for subscribe_artist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__subscribe_artistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the subscribe_artist model
   */
  interface subscribe_artistFieldRefs {
    readonly id: FieldRef<"subscribe_artist", 'BigInt'>
    readonly uid: FieldRef<"subscribe_artist", 'String'>
    readonly target: FieldRef<"subscribe_artist", 'String'>
    readonly time: FieldRef<"subscribe_artist", 'DateTime'>
    readonly cache: FieldRef<"subscribe_artist", 'String'>
    readonly cache_lastupdated: FieldRef<"subscribe_artist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * subscribe_artist findUnique
   */
  export type subscribe_artistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_artist to fetch.
     */
    where: subscribe_artistWhereUniqueInput
  }

  /**
   * subscribe_artist findUniqueOrThrow
   */
  export type subscribe_artistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_artist to fetch.
     */
    where: subscribe_artistWhereUniqueInput
  }

  /**
   * subscribe_artist findFirst
   */
  export type subscribe_artistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_artist to fetch.
     */
    where?: subscribe_artistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_artists to fetch.
     */
    orderBy?: subscribe_artistOrderByWithRelationInput | subscribe_artistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscribe_artists.
     */
    cursor?: subscribe_artistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscribe_artists.
     */
    distinct?: Subscribe_artistScalarFieldEnum | Subscribe_artistScalarFieldEnum[]
  }

  /**
   * subscribe_artist findFirstOrThrow
   */
  export type subscribe_artistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_artist to fetch.
     */
    where?: subscribe_artistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_artists to fetch.
     */
    orderBy?: subscribe_artistOrderByWithRelationInput | subscribe_artistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscribe_artists.
     */
    cursor?: subscribe_artistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscribe_artists.
     */
    distinct?: Subscribe_artistScalarFieldEnum | Subscribe_artistScalarFieldEnum[]
  }

  /**
   * subscribe_artist findMany
   */
  export type subscribe_artistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_artists to fetch.
     */
    where?: subscribe_artistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_artists to fetch.
     */
    orderBy?: subscribe_artistOrderByWithRelationInput | subscribe_artistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing subscribe_artists.
     */
    cursor?: subscribe_artistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_artists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_artists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscribe_artists.
     */
    distinct?: Subscribe_artistScalarFieldEnum | Subscribe_artistScalarFieldEnum[]
  }

  /**
   * subscribe_artist create
   */
  export type subscribe_artistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * The data needed to create a subscribe_artist.
     */
    data: XOR<subscribe_artistCreateInput, subscribe_artistUncheckedCreateInput>
  }

  /**
   * subscribe_artist createMany
   */
  export type subscribe_artistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many subscribe_artists.
     */
    data: subscribe_artistCreateManyInput | subscribe_artistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * subscribe_artist update
   */
  export type subscribe_artistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * The data needed to update a subscribe_artist.
     */
    data: XOR<subscribe_artistUpdateInput, subscribe_artistUncheckedUpdateInput>
    /**
     * Choose, which subscribe_artist to update.
     */
    where: subscribe_artistWhereUniqueInput
  }

  /**
   * subscribe_artist updateMany
   */
  export type subscribe_artistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update subscribe_artists.
     */
    data: XOR<subscribe_artistUpdateManyMutationInput, subscribe_artistUncheckedUpdateManyInput>
    /**
     * Filter which subscribe_artists to update
     */
    where?: subscribe_artistWhereInput
    /**
     * Limit how many subscribe_artists to update.
     */
    limit?: number
  }

  /**
   * subscribe_artist upsert
   */
  export type subscribe_artistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * The filter to search for the subscribe_artist to update in case it exists.
     */
    where: subscribe_artistWhereUniqueInput
    /**
     * In case the subscribe_artist found by the `where` argument doesn't exist, create a new subscribe_artist with this data.
     */
    create: XOR<subscribe_artistCreateInput, subscribe_artistUncheckedCreateInput>
    /**
     * In case the subscribe_artist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<subscribe_artistUpdateInput, subscribe_artistUncheckedUpdateInput>
  }

  /**
   * subscribe_artist delete
   */
  export type subscribe_artistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
    /**
     * Filter which subscribe_artist to delete.
     */
    where: subscribe_artistWhereUniqueInput
  }

  /**
   * subscribe_artist deleteMany
   */
  export type subscribe_artistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscribe_artists to delete
     */
    where?: subscribe_artistWhereInput
    /**
     * Limit how many subscribe_artists to delete.
     */
    limit?: number
  }

  /**
   * subscribe_artist without action
   */
  export type subscribe_artistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_artist
     */
    select?: subscribe_artistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_artist
     */
    omit?: subscribe_artistOmit<ExtArgs> | null
  }


  /**
   * Model subscribe_news
   */

  export type AggregateSubscribe_news = {
    _count: Subscribe_newsCountAggregateOutputType | null
    _avg: Subscribe_newsAvgAggregateOutputType | null
    _sum: Subscribe_newsSumAggregateOutputType | null
    _min: Subscribe_newsMinAggregateOutputType | null
    _max: Subscribe_newsMaxAggregateOutputType | null
  }

  export type Subscribe_newsAvgAggregateOutputType = {
    id: number | null
  }

  export type Subscribe_newsSumAggregateOutputType = {
    id: bigint | null
  }

  export type Subscribe_newsMinAggregateOutputType = {
    id: bigint | null
    uid: string | null
    time: Date | null
    type: string | null
    target: string | null
  }

  export type Subscribe_newsMaxAggregateOutputType = {
    id: bigint | null
    uid: string | null
    time: Date | null
    type: string | null
    target: string | null
  }

  export type Subscribe_newsCountAggregateOutputType = {
    id: number
    uid: number
    time: number
    type: number
    target: number
    _all: number
  }


  export type Subscribe_newsAvgAggregateInputType = {
    id?: true
  }

  export type Subscribe_newsSumAggregateInputType = {
    id?: true
  }

  export type Subscribe_newsMinAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    type?: true
    target?: true
  }

  export type Subscribe_newsMaxAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    type?: true
    target?: true
  }

  export type Subscribe_newsCountAggregateInputType = {
    id?: true
    uid?: true
    time?: true
    type?: true
    target?: true
    _all?: true
  }

  export type Subscribe_newsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscribe_news to aggregate.
     */
    where?: subscribe_newsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_news to fetch.
     */
    orderBy?: subscribe_newsOrderByWithRelationInput | subscribe_newsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: subscribe_newsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_news from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_news.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned subscribe_news
    **/
    _count?: true | Subscribe_newsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Subscribe_newsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Subscribe_newsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Subscribe_newsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Subscribe_newsMaxAggregateInputType
  }

  export type GetSubscribe_newsAggregateType<T extends Subscribe_newsAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscribe_news]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscribe_news[P]>
      : GetScalarType<T[P], AggregateSubscribe_news[P]>
  }




  export type subscribe_newsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: subscribe_newsWhereInput
    orderBy?: subscribe_newsOrderByWithAggregationInput | subscribe_newsOrderByWithAggregationInput[]
    by: Subscribe_newsScalarFieldEnum[] | Subscribe_newsScalarFieldEnum
    having?: subscribe_newsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Subscribe_newsCountAggregateInputType | true
    _avg?: Subscribe_newsAvgAggregateInputType
    _sum?: Subscribe_newsSumAggregateInputType
    _min?: Subscribe_newsMinAggregateInputType
    _max?: Subscribe_newsMaxAggregateInputType
  }

  export type Subscribe_newsGroupByOutputType = {
    id: bigint
    uid: string
    time: Date
    type: string
    target: string
    _count: Subscribe_newsCountAggregateOutputType | null
    _avg: Subscribe_newsAvgAggregateOutputType | null
    _sum: Subscribe_newsSumAggregateOutputType | null
    _min: Subscribe_newsMinAggregateOutputType | null
    _max: Subscribe_newsMaxAggregateOutputType | null
  }

  type GetSubscribe_newsGroupByPayload<T extends subscribe_newsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Subscribe_newsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Subscribe_newsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Subscribe_newsGroupByOutputType[P]>
            : GetScalarType<T[P], Subscribe_newsGroupByOutputType[P]>
        }
      >
    >


  export type subscribe_newsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    time?: boolean
    type?: boolean
    target?: boolean
  }, ExtArgs["result"]["subscribe_news"]>



  export type subscribe_newsSelectScalar = {
    id?: boolean
    uid?: boolean
    time?: boolean
    type?: boolean
    target?: boolean
  }

  export type subscribe_newsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "time" | "type" | "target", ExtArgs["result"]["subscribe_news"]>

  export type $subscribe_newsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "subscribe_news"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      uid: string
      time: Date
      type: string
      target: string
    }, ExtArgs["result"]["subscribe_news"]>
    composites: {}
  }

  type subscribe_newsGetPayload<S extends boolean | null | undefined | subscribe_newsDefaultArgs> = $Result.GetResult<Prisma.$subscribe_newsPayload, S>

  type subscribe_newsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<subscribe_newsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Subscribe_newsCountAggregateInputType | true
    }

  export interface subscribe_newsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['subscribe_news'], meta: { name: 'subscribe_news' } }
    /**
     * Find zero or one Subscribe_news that matches the filter.
     * @param {subscribe_newsFindUniqueArgs} args - Arguments to find a Subscribe_news
     * @example
     * // Get one Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends subscribe_newsFindUniqueArgs>(args: SelectSubset<T, subscribe_newsFindUniqueArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscribe_news that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {subscribe_newsFindUniqueOrThrowArgs} args - Arguments to find a Subscribe_news
     * @example
     * // Get one Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends subscribe_newsFindUniqueOrThrowArgs>(args: SelectSubset<T, subscribe_newsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscribe_news that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_newsFindFirstArgs} args - Arguments to find a Subscribe_news
     * @example
     * // Get one Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends subscribe_newsFindFirstArgs>(args?: SelectSubset<T, subscribe_newsFindFirstArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscribe_news that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_newsFindFirstOrThrowArgs} args - Arguments to find a Subscribe_news
     * @example
     * // Get one Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends subscribe_newsFindFirstOrThrowArgs>(args?: SelectSubset<T, subscribe_newsFindFirstOrThrowArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscribe_news that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_newsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.findMany()
     * 
     * // Get first 10 Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscribe_newsWithIdOnly = await prisma.subscribe_news.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends subscribe_newsFindManyArgs>(args?: SelectSubset<T, subscribe_newsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscribe_news.
     * @param {subscribe_newsCreateArgs} args - Arguments to create a Subscribe_news.
     * @example
     * // Create one Subscribe_news
     * const Subscribe_news = await prisma.subscribe_news.create({
     *   data: {
     *     // ... data to create a Subscribe_news
     *   }
     * })
     * 
     */
    create<T extends subscribe_newsCreateArgs>(args: SelectSubset<T, subscribe_newsCreateArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscribe_news.
     * @param {subscribe_newsCreateManyArgs} args - Arguments to create many Subscribe_news.
     * @example
     * // Create many Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends subscribe_newsCreateManyArgs>(args?: SelectSubset<T, subscribe_newsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Subscribe_news.
     * @param {subscribe_newsDeleteArgs} args - Arguments to delete one Subscribe_news.
     * @example
     * // Delete one Subscribe_news
     * const Subscribe_news = await prisma.subscribe_news.delete({
     *   where: {
     *     // ... filter to delete one Subscribe_news
     *   }
     * })
     * 
     */
    delete<T extends subscribe_newsDeleteArgs>(args: SelectSubset<T, subscribe_newsDeleteArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscribe_news.
     * @param {subscribe_newsUpdateArgs} args - Arguments to update one Subscribe_news.
     * @example
     * // Update one Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends subscribe_newsUpdateArgs>(args: SelectSubset<T, subscribe_newsUpdateArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscribe_news.
     * @param {subscribe_newsDeleteManyArgs} args - Arguments to filter Subscribe_news to delete.
     * @example
     * // Delete a few Subscribe_news
     * const { count } = await prisma.subscribe_news.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends subscribe_newsDeleteManyArgs>(args?: SelectSubset<T, subscribe_newsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscribe_news.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_newsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends subscribe_newsUpdateManyArgs>(args: SelectSubset<T, subscribe_newsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscribe_news.
     * @param {subscribe_newsUpsertArgs} args - Arguments to update or create a Subscribe_news.
     * @example
     * // Update or create a Subscribe_news
     * const subscribe_news = await prisma.subscribe_news.upsert({
     *   create: {
     *     // ... data to create a Subscribe_news
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscribe_news we want to update
     *   }
     * })
     */
    upsert<T extends subscribe_newsUpsertArgs>(args: SelectSubset<T, subscribe_newsUpsertArgs<ExtArgs>>): Prisma__subscribe_newsClient<$Result.GetResult<Prisma.$subscribe_newsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscribe_news.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_newsCountArgs} args - Arguments to filter Subscribe_news to count.
     * @example
     * // Count the number of Subscribe_news
     * const count = await prisma.subscribe_news.count({
     *   where: {
     *     // ... the filter for the Subscribe_news we want to count
     *   }
     * })
    **/
    count<T extends subscribe_newsCountArgs>(
      args?: Subset<T, subscribe_newsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Subscribe_newsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscribe_news.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Subscribe_newsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Subscribe_newsAggregateArgs>(args: Subset<T, Subscribe_newsAggregateArgs>): Prisma.PrismaPromise<GetSubscribe_newsAggregateType<T>>

    /**
     * Group by Subscribe_news.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {subscribe_newsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends subscribe_newsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: subscribe_newsGroupByArgs['orderBy'] }
        : { orderBy?: subscribe_newsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, subscribe_newsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscribe_newsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the subscribe_news model
   */
  readonly fields: subscribe_newsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for subscribe_news.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__subscribe_newsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the subscribe_news model
   */
  interface subscribe_newsFieldRefs {
    readonly id: FieldRef<"subscribe_news", 'BigInt'>
    readonly uid: FieldRef<"subscribe_news", 'String'>
    readonly time: FieldRef<"subscribe_news", 'DateTime'>
    readonly type: FieldRef<"subscribe_news", 'String'>
    readonly target: FieldRef<"subscribe_news", 'String'>
  }
    

  // Custom InputTypes
  /**
   * subscribe_news findUnique
   */
  export type subscribe_newsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_news to fetch.
     */
    where: subscribe_newsWhereUniqueInput
  }

  /**
   * subscribe_news findUniqueOrThrow
   */
  export type subscribe_newsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_news to fetch.
     */
    where: subscribe_newsWhereUniqueInput
  }

  /**
   * subscribe_news findFirst
   */
  export type subscribe_newsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_news to fetch.
     */
    where?: subscribe_newsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_news to fetch.
     */
    orderBy?: subscribe_newsOrderByWithRelationInput | subscribe_newsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscribe_news.
     */
    cursor?: subscribe_newsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_news from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_news.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscribe_news.
     */
    distinct?: Subscribe_newsScalarFieldEnum | Subscribe_newsScalarFieldEnum[]
  }

  /**
   * subscribe_news findFirstOrThrow
   */
  export type subscribe_newsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_news to fetch.
     */
    where?: subscribe_newsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_news to fetch.
     */
    orderBy?: subscribe_newsOrderByWithRelationInput | subscribe_newsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for subscribe_news.
     */
    cursor?: subscribe_newsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_news from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_news.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscribe_news.
     */
    distinct?: Subscribe_newsScalarFieldEnum | Subscribe_newsScalarFieldEnum[]
  }

  /**
   * subscribe_news findMany
   */
  export type subscribe_newsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * Filter, which subscribe_news to fetch.
     */
    where?: subscribe_newsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of subscribe_news to fetch.
     */
    orderBy?: subscribe_newsOrderByWithRelationInput | subscribe_newsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing subscribe_news.
     */
    cursor?: subscribe_newsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` subscribe_news from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` subscribe_news.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of subscribe_news.
     */
    distinct?: Subscribe_newsScalarFieldEnum | Subscribe_newsScalarFieldEnum[]
  }

  /**
   * subscribe_news create
   */
  export type subscribe_newsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * The data needed to create a subscribe_news.
     */
    data: XOR<subscribe_newsCreateInput, subscribe_newsUncheckedCreateInput>
  }

  /**
   * subscribe_news createMany
   */
  export type subscribe_newsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many subscribe_news.
     */
    data: subscribe_newsCreateManyInput | subscribe_newsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * subscribe_news update
   */
  export type subscribe_newsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * The data needed to update a subscribe_news.
     */
    data: XOR<subscribe_newsUpdateInput, subscribe_newsUncheckedUpdateInput>
    /**
     * Choose, which subscribe_news to update.
     */
    where: subscribe_newsWhereUniqueInput
  }

  /**
   * subscribe_news updateMany
   */
  export type subscribe_newsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update subscribe_news.
     */
    data: XOR<subscribe_newsUpdateManyMutationInput, subscribe_newsUncheckedUpdateManyInput>
    /**
     * Filter which subscribe_news to update
     */
    where?: subscribe_newsWhereInput
    /**
     * Limit how many subscribe_news to update.
     */
    limit?: number
  }

  /**
   * subscribe_news upsert
   */
  export type subscribe_newsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * The filter to search for the subscribe_news to update in case it exists.
     */
    where: subscribe_newsWhereUniqueInput
    /**
     * In case the subscribe_news found by the `where` argument doesn't exist, create a new subscribe_news with this data.
     */
    create: XOR<subscribe_newsCreateInput, subscribe_newsUncheckedCreateInput>
    /**
     * In case the subscribe_news was found with the provided `where` argument, update it with this data.
     */
    update: XOR<subscribe_newsUpdateInput, subscribe_newsUncheckedUpdateInput>
  }

  /**
   * subscribe_news delete
   */
  export type subscribe_newsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
    /**
     * Filter which subscribe_news to delete.
     */
    where: subscribe_newsWhereUniqueInput
  }

  /**
   * subscribe_news deleteMany
   */
  export type subscribe_newsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which subscribe_news to delete
     */
    where?: subscribe_newsWhereInput
    /**
     * Limit how many subscribe_news to delete.
     */
    limit?: number
  }

  /**
   * subscribe_news without action
   */
  export type subscribe_newsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the subscribe_news
     */
    select?: subscribe_newsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the subscribe_news
     */
    omit?: subscribe_newsOmit<ExtArgs> | null
  }


  /**
   * Model user_session
   */

  export type AggregateUser_session = {
    _count: User_sessionCountAggregateOutputType | null
    _avg: User_sessionAvgAggregateOutputType | null
    _sum: User_sessionSumAggregateOutputType | null
    _min: User_sessionMinAggregateOutputType | null
    _max: User_sessionMaxAggregateOutputType | null
  }

  export type User_sessionAvgAggregateOutputType = {
    id: number | null
  }

  export type User_sessionSumAggregateOutputType = {
    id: bigint | null
  }

  export type User_sessionMinAggregateOutputType = {
    id: bigint | null
    uid: string | null
    ytmusic_visitor_id: string | null
    ytmusic_cookie: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type User_sessionMaxAggregateOutputType = {
    id: bigint | null
    uid: string | null
    ytmusic_visitor_id: string | null
    ytmusic_cookie: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type User_sessionCountAggregateOutputType = {
    id: number
    uid: number
    ytmusic_visitor_id: number
    ytmusic_cookie: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type User_sessionAvgAggregateInputType = {
    id?: true
  }

  export type User_sessionSumAggregateInputType = {
    id?: true
  }

  export type User_sessionMinAggregateInputType = {
    id?: true
    uid?: true
    ytmusic_visitor_id?: true
    ytmusic_cookie?: true
    created_at?: true
    updated_at?: true
  }

  export type User_sessionMaxAggregateInputType = {
    id?: true
    uid?: true
    ytmusic_visitor_id?: true
    ytmusic_cookie?: true
    created_at?: true
    updated_at?: true
  }

  export type User_sessionCountAggregateInputType = {
    id?: true
    uid?: true
    ytmusic_visitor_id?: true
    ytmusic_cookie?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type User_sessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_session to aggregate.
     */
    where?: user_sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionOrderByWithRelationInput | user_sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_sessions
    **/
    _count?: true | User_sessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_sessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_sessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_sessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_sessionMaxAggregateInputType
  }

  export type GetUser_sessionAggregateType<T extends User_sessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_session]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_session[P]>
      : GetScalarType<T[P], AggregateUser_session[P]>
  }




  export type user_sessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_sessionWhereInput
    orderBy?: user_sessionOrderByWithAggregationInput | user_sessionOrderByWithAggregationInput[]
    by: User_sessionScalarFieldEnum[] | User_sessionScalarFieldEnum
    having?: user_sessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_sessionCountAggregateInputType | true
    _avg?: User_sessionAvgAggregateInputType
    _sum?: User_sessionSumAggregateInputType
    _min?: User_sessionMinAggregateInputType
    _max?: User_sessionMaxAggregateInputType
  }

  export type User_sessionGroupByOutputType = {
    id: bigint
    uid: string
    ytmusic_visitor_id: string
    ytmusic_cookie: string | null
    created_at: Date
    updated_at: Date
    _count: User_sessionCountAggregateOutputType | null
    _avg: User_sessionAvgAggregateOutputType | null
    _sum: User_sessionSumAggregateOutputType | null
    _min: User_sessionMinAggregateOutputType | null
    _max: User_sessionMaxAggregateOutputType | null
  }

  type GetUser_sessionGroupByPayload<T extends user_sessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_sessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_sessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_sessionGroupByOutputType[P]>
            : GetScalarType<T[P], User_sessionGroupByOutputType[P]>
        }
      >
    >


  export type user_sessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    ytmusic_visitor_id?: boolean
    ytmusic_cookie?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user_session"]>



  export type user_sessionSelectScalar = {
    id?: boolean
    uid?: boolean
    ytmusic_visitor_id?: boolean
    ytmusic_cookie?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type user_sessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "ytmusic_visitor_id" | "ytmusic_cookie" | "created_at" | "updated_at", ExtArgs["result"]["user_session"]>

  export type $user_sessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_session"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      uid: string
      ytmusic_visitor_id: string
      ytmusic_cookie: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["user_session"]>
    composites: {}
  }

  type user_sessionGetPayload<S extends boolean | null | undefined | user_sessionDefaultArgs> = $Result.GetResult<Prisma.$user_sessionPayload, S>

  type user_sessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<user_sessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: User_sessionCountAggregateInputType | true
    }

  export interface user_sessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_session'], meta: { name: 'user_session' } }
    /**
     * Find zero or one User_session that matches the filter.
     * @param {user_sessionFindUniqueArgs} args - Arguments to find a User_session
     * @example
     * // Get one User_session
     * const user_session = await prisma.user_session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_sessionFindUniqueArgs>(args: SelectSubset<T, user_sessionFindUniqueArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User_session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_sessionFindUniqueOrThrowArgs} args - Arguments to find a User_session
     * @example
     * // Get one User_session
     * const user_session = await prisma.user_session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_sessionFindUniqueOrThrowArgs>(args: SelectSubset<T, user_sessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionFindFirstArgs} args - Arguments to find a User_session
     * @example
     * // Get one User_session
     * const user_session = await prisma.user_session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_sessionFindFirstArgs>(args?: SelectSubset<T, user_sessionFindFirstArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User_session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionFindFirstOrThrowArgs} args - Arguments to find a User_session
     * @example
     * // Get one User_session
     * const user_session = await prisma.user_session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_sessionFindFirstOrThrowArgs>(args?: SelectSubset<T, user_sessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more User_sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_sessions
     * const user_sessions = await prisma.user_session.findMany()
     * 
     * // Get first 10 User_sessions
     * const user_sessions = await prisma.user_session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const user_sessionWithIdOnly = await prisma.user_session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends user_sessionFindManyArgs>(args?: SelectSubset<T, user_sessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User_session.
     * @param {user_sessionCreateArgs} args - Arguments to create a User_session.
     * @example
     * // Create one User_session
     * const User_session = await prisma.user_session.create({
     *   data: {
     *     // ... data to create a User_session
     *   }
     * })
     * 
     */
    create<T extends user_sessionCreateArgs>(args: SelectSubset<T, user_sessionCreateArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many User_sessions.
     * @param {user_sessionCreateManyArgs} args - Arguments to create many User_sessions.
     * @example
     * // Create many User_sessions
     * const user_session = await prisma.user_session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_sessionCreateManyArgs>(args?: SelectSubset<T, user_sessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User_session.
     * @param {user_sessionDeleteArgs} args - Arguments to delete one User_session.
     * @example
     * // Delete one User_session
     * const User_session = await prisma.user_session.delete({
     *   where: {
     *     // ... filter to delete one User_session
     *   }
     * })
     * 
     */
    delete<T extends user_sessionDeleteArgs>(args: SelectSubset<T, user_sessionDeleteArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User_session.
     * @param {user_sessionUpdateArgs} args - Arguments to update one User_session.
     * @example
     * // Update one User_session
     * const user_session = await prisma.user_session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_sessionUpdateArgs>(args: SelectSubset<T, user_sessionUpdateArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more User_sessions.
     * @param {user_sessionDeleteManyArgs} args - Arguments to filter User_sessions to delete.
     * @example
     * // Delete a few User_sessions
     * const { count } = await prisma.user_session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_sessionDeleteManyArgs>(args?: SelectSubset<T, user_sessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_sessions
     * const user_session = await prisma.user_session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_sessionUpdateManyArgs>(args: SelectSubset<T, user_sessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_session.
     * @param {user_sessionUpsertArgs} args - Arguments to update or create a User_session.
     * @example
     * // Update or create a User_session
     * const user_session = await prisma.user_session.upsert({
     *   create: {
     *     // ... data to create a User_session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_session we want to update
     *   }
     * })
     */
    upsert<T extends user_sessionUpsertArgs>(args: SelectSubset<T, user_sessionUpsertArgs<ExtArgs>>): Prisma__user_sessionClient<$Result.GetResult<Prisma.$user_sessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of User_sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionCountArgs} args - Arguments to filter User_sessions to count.
     * @example
     * // Count the number of User_sessions
     * const count = await prisma.user_session.count({
     *   where: {
     *     // ... the filter for the User_sessions we want to count
     *   }
     * })
    **/
    count<T extends user_sessionCountArgs>(
      args?: Subset<T, user_sessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_sessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_sessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_sessionAggregateArgs>(args: Subset<T, User_sessionAggregateArgs>): Prisma.PrismaPromise<GetUser_sessionAggregateType<T>>

    /**
     * Group by User_session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_sessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_sessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_sessionGroupByArgs['orderBy'] }
        : { orderBy?: user_sessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_sessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_sessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_session model
   */
  readonly fields: user_sessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_sessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_session model
   */
  interface user_sessionFieldRefs {
    readonly id: FieldRef<"user_session", 'BigInt'>
    readonly uid: FieldRef<"user_session", 'String'>
    readonly ytmusic_visitor_id: FieldRef<"user_session", 'String'>
    readonly ytmusic_cookie: FieldRef<"user_session", 'String'>
    readonly created_at: FieldRef<"user_session", 'DateTime'>
    readonly updated_at: FieldRef<"user_session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * user_session findUnique
   */
  export type user_sessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * Filter, which user_session to fetch.
     */
    where: user_sessionWhereUniqueInput
  }

  /**
   * user_session findUniqueOrThrow
   */
  export type user_sessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * Filter, which user_session to fetch.
     */
    where: user_sessionWhereUniqueInput
  }

  /**
   * user_session findFirst
   */
  export type user_sessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * Filter, which user_session to fetch.
     */
    where?: user_sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionOrderByWithRelationInput | user_sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_sessions.
     */
    cursor?: user_sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_sessions.
     */
    distinct?: User_sessionScalarFieldEnum | User_sessionScalarFieldEnum[]
  }

  /**
   * user_session findFirstOrThrow
   */
  export type user_sessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * Filter, which user_session to fetch.
     */
    where?: user_sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionOrderByWithRelationInput | user_sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_sessions.
     */
    cursor?: user_sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_sessions.
     */
    distinct?: User_sessionScalarFieldEnum | User_sessionScalarFieldEnum[]
  }

  /**
   * user_session findMany
   */
  export type user_sessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * Filter, which user_sessions to fetch.
     */
    where?: user_sessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_sessions to fetch.
     */
    orderBy?: user_sessionOrderByWithRelationInput | user_sessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_sessions.
     */
    cursor?: user_sessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_sessions.
     */
    distinct?: User_sessionScalarFieldEnum | User_sessionScalarFieldEnum[]
  }

  /**
   * user_session create
   */
  export type user_sessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * The data needed to create a user_session.
     */
    data: XOR<user_sessionCreateInput, user_sessionUncheckedCreateInput>
  }

  /**
   * user_session createMany
   */
  export type user_sessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_sessions.
     */
    data: user_sessionCreateManyInput | user_sessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_session update
   */
  export type user_sessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * The data needed to update a user_session.
     */
    data: XOR<user_sessionUpdateInput, user_sessionUncheckedUpdateInput>
    /**
     * Choose, which user_session to update.
     */
    where: user_sessionWhereUniqueInput
  }

  /**
   * user_session updateMany
   */
  export type user_sessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_sessions.
     */
    data: XOR<user_sessionUpdateManyMutationInput, user_sessionUncheckedUpdateManyInput>
    /**
     * Filter which user_sessions to update
     */
    where?: user_sessionWhereInput
    /**
     * Limit how many user_sessions to update.
     */
    limit?: number
  }

  /**
   * user_session upsert
   */
  export type user_sessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * The filter to search for the user_session to update in case it exists.
     */
    where: user_sessionWhereUniqueInput
    /**
     * In case the user_session found by the `where` argument doesn't exist, create a new user_session with this data.
     */
    create: XOR<user_sessionCreateInput, user_sessionUncheckedCreateInput>
    /**
     * In case the user_session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_sessionUpdateInput, user_sessionUncheckedUpdateInput>
  }

  /**
   * user_session delete
   */
  export type user_sessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
    /**
     * Filter which user_session to delete.
     */
    where: user_sessionWhereUniqueInput
  }

  /**
   * user_session deleteMany
   */
  export type user_sessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_sessions to delete
     */
    where?: user_sessionWhereInput
    /**
     * Limit how many user_sessions to delete.
     */
    limit?: number
  }

  /**
   * user_session without action
   */
  export type user_sessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_session
     */
    select?: user_sessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the user_session
     */
    omit?: user_sessionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Api_keyScalarFieldEnum: {
    id: 'id',
    time: 'time',
    createby: 'createby',
    key: 'key',
    permission: 'permission',
    ratelimitpermin: 'ratelimitpermin',
    allowedipaddresses: 'allowedipaddresses',
    expiredat: 'expiredat',
    isdisabled: 'isdisabled',
    isdeleted: 'isdeleted'
  };

  export type Api_keyScalarFieldEnum = (typeof Api_keyScalarFieldEnum)[keyof typeof Api_keyScalarFieldEnum]


  export const Api_key_logsScalarFieldEnum: {
    id: 'id',
    time: 'time',
    ip: 'ip',
    user_agent: 'user_agent',
    key: 'key'
  };

  export type Api_key_logsScalarFieldEnum = (typeof Api_key_logsScalarFieldEnum)[keyof typeof Api_key_logsScalarFieldEnum]


  export const Channel_notify_webhookScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    time: 'time',
    by: 'by',
    guild_id: 'guild_id',
    broadcaster_id: 'broadcaster_id',
    webhook_url: 'webhook_url',
    message: 'message',
    verify_type: 'verify_type',
    verify_code: 'verify_code',
    hmac_secret: 'hmac_secret',
    lease_sec: 'lease_sec',
    disabled: 'disabled',
    deleted: 'deleted'
  };

  export type Channel_notify_webhookScalarFieldEnum = (typeof Channel_notify_webhookScalarFieldEnum)[keyof typeof Channel_notify_webhookScalarFieldEnum]


  export const Favorite_trackScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    time: 'time',
    target: 'target',
    source: 'source',
    cache: 'cache',
    cache_lastupdated: 'cache_lastupdated'
  };

  export type Favorite_trackScalarFieldEnum = (typeof Favorite_trackScalarFieldEnum)[keyof typeof Favorite_trackScalarFieldEnum]


  export const FeedbackScalarFieldEnum: {
    id: 'id',
    time: 'time',
    message: 'message',
    email: 'email'
  };

  export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum]


  export const GuildsScalarFieldEnum: {
    id: 'id',
    guildid: 'guildid',
    args: 'args'
  };

  export type GuildsScalarFieldEnum = (typeof GuildsScalarFieldEnum)[keyof typeof GuildsScalarFieldEnum]


  export const Player_action_historyScalarFieldEnum: {
    id: 'id',
    actionby: 'actionby',
    timestamp: 'timestamp',
    action_name: 'action_name',
    data: 'data',
    guild: 'guild',
    channel: 'channel'
  };

  export type Player_action_historyScalarFieldEnum = (typeof Player_action_historyScalarFieldEnum)[keyof typeof Player_action_historyScalarFieldEnum]


  export const Player_track_historyScalarFieldEnum: {
    id: 'id',
    requestby: 'requestby',
    uniqueid: 'uniqueid',
    time: 'time',
    voicechannel: 'voicechannel',
    guildid: 'guildid',
    track: 'track'
  };

  export type Player_track_historyScalarFieldEnum = (typeof Player_track_historyScalarFieldEnum)[keyof typeof Player_track_historyScalarFieldEnum]


  export const Pona_flipflop_stateScalarFieldEnum: {
    id: 'id',
    time: 'time',
    guildid: 'guildid',
    active: 'active'
  };

  export type Pona_flipflop_stateScalarFieldEnum = (typeof Pona_flipflop_stateScalarFieldEnum)[keyof typeof Pona_flipflop_stateScalarFieldEnum]


  export const Pona_heartbeat_intervalScalarFieldEnum: {
    id: 'id',
    time: 'time',
    clusterid: 'clusterid',
    shardid: 'shardid',
    ptm: 'ptm'
  };

  export type Pona_heartbeat_intervalScalarFieldEnum = (typeof Pona_heartbeat_intervalScalarFieldEnum)[keyof typeof Pona_heartbeat_intervalScalarFieldEnum]


  export const Pona_voicestate_historyScalarFieldEnum: {
    id: 'id',
    guildid: 'guildid',
    memberid: 'memberid',
    channelid: 'channelid',
    beforestate: 'beforestate',
    afterstate: 'afterstate',
    date: 'date',
    type: 'type'
  };

  export type Pona_voicestate_historyScalarFieldEnum = (typeof Pona_voicestate_historyScalarFieldEnum)[keyof typeof Pona_voicestate_historyScalarFieldEnum]


  export const Search_historyScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    time: 'time',
    text: 'text'
  };

  export type Search_historyScalarFieldEnum = (typeof Search_historyScalarFieldEnum)[keyof typeof Search_historyScalarFieldEnum]


  export const Subscribe_artistScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    target: 'target',
    time: 'time',
    cache: 'cache',
    cache_lastupdated: 'cache_lastupdated'
  };

  export type Subscribe_artistScalarFieldEnum = (typeof Subscribe_artistScalarFieldEnum)[keyof typeof Subscribe_artistScalarFieldEnum]


  export const Subscribe_newsScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    time: 'time',
    type: 'type',
    target: 'target'
  };

  export type Subscribe_newsScalarFieldEnum = (typeof Subscribe_newsScalarFieldEnum)[keyof typeof Subscribe_newsScalarFieldEnum]


  export const User_sessionScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    ytmusic_visitor_id: 'ytmusic_visitor_id',
    ytmusic_cookie: 'ytmusic_cookie',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type User_sessionScalarFieldEnum = (typeof User_sessionScalarFieldEnum)[keyof typeof User_sessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const api_keyOrderByRelevanceFieldEnum: {
    createby: 'createby',
    key: 'key',
    allowedipaddresses: 'allowedipaddresses'
  };

  export type api_keyOrderByRelevanceFieldEnum = (typeof api_keyOrderByRelevanceFieldEnum)[keyof typeof api_keyOrderByRelevanceFieldEnum]


  export const api_key_logsOrderByRelevanceFieldEnum: {
    ip: 'ip',
    user_agent: 'user_agent',
    key: 'key'
  };

  export type api_key_logsOrderByRelevanceFieldEnum = (typeof api_key_logsOrderByRelevanceFieldEnum)[keyof typeof api_key_logsOrderByRelevanceFieldEnum]


  export const channel_notify_webhookOrderByRelevanceFieldEnum: {
    uuid: 'uuid',
    by: 'by',
    guild_id: 'guild_id',
    broadcaster_id: 'broadcaster_id',
    webhook_url: 'webhook_url',
    message: 'message',
    verify_type: 'verify_type',
    verify_code: 'verify_code',
    hmac_secret: 'hmac_secret'
  };

  export type channel_notify_webhookOrderByRelevanceFieldEnum = (typeof channel_notify_webhookOrderByRelevanceFieldEnum)[keyof typeof channel_notify_webhookOrderByRelevanceFieldEnum]


  export const favorite_trackOrderByRelevanceFieldEnum: {
    uid: 'uid',
    target: 'target',
    source: 'source',
    cache: 'cache'
  };

  export type favorite_trackOrderByRelevanceFieldEnum = (typeof favorite_trackOrderByRelevanceFieldEnum)[keyof typeof favorite_trackOrderByRelevanceFieldEnum]


  export const feedbackOrderByRelevanceFieldEnum: {
    message: 'message',
    email: 'email'
  };

  export type feedbackOrderByRelevanceFieldEnum = (typeof feedbackOrderByRelevanceFieldEnum)[keyof typeof feedbackOrderByRelevanceFieldEnum]


  export const guildsOrderByRelevanceFieldEnum: {
    guildid: 'guildid',
    args: 'args'
  };

  export type guildsOrderByRelevanceFieldEnum = (typeof guildsOrderByRelevanceFieldEnum)[keyof typeof guildsOrderByRelevanceFieldEnum]


  export const player_action_historyOrderByRelevanceFieldEnum: {
    actionby: 'actionby',
    action_name: 'action_name',
    data: 'data',
    guild: 'guild',
    channel: 'channel'
  };

  export type player_action_historyOrderByRelevanceFieldEnum = (typeof player_action_historyOrderByRelevanceFieldEnum)[keyof typeof player_action_historyOrderByRelevanceFieldEnum]


  export const player_track_historyOrderByRelevanceFieldEnum: {
    requestby: 'requestby',
    uniqueid: 'uniqueid',
    voicechannel: 'voicechannel',
    guildid: 'guildid',
    track: 'track'
  };

  export type player_track_historyOrderByRelevanceFieldEnum = (typeof player_track_historyOrderByRelevanceFieldEnum)[keyof typeof player_track_historyOrderByRelevanceFieldEnum]


  export const pona_flipflop_stateOrderByRelevanceFieldEnum: {
    guildid: 'guildid'
  };

  export type pona_flipflop_stateOrderByRelevanceFieldEnum = (typeof pona_flipflop_stateOrderByRelevanceFieldEnum)[keyof typeof pona_flipflop_stateOrderByRelevanceFieldEnum]


  export const pona_heartbeat_intervalOrderByRelevanceFieldEnum: {
    clusterid: 'clusterid',
    shardid: 'shardid'
  };

  export type pona_heartbeat_intervalOrderByRelevanceFieldEnum = (typeof pona_heartbeat_intervalOrderByRelevanceFieldEnum)[keyof typeof pona_heartbeat_intervalOrderByRelevanceFieldEnum]


  export const pona_voicestate_historyOrderByRelevanceFieldEnum: {
    guildid: 'guildid',
    memberid: 'memberid',
    channelid: 'channelid',
    beforestate: 'beforestate',
    afterstate: 'afterstate',
    type: 'type'
  };

  export type pona_voicestate_historyOrderByRelevanceFieldEnum = (typeof pona_voicestate_historyOrderByRelevanceFieldEnum)[keyof typeof pona_voicestate_historyOrderByRelevanceFieldEnum]


  export const search_historyOrderByRelevanceFieldEnum: {
    uid: 'uid',
    text: 'text'
  };

  export type search_historyOrderByRelevanceFieldEnum = (typeof search_historyOrderByRelevanceFieldEnum)[keyof typeof search_historyOrderByRelevanceFieldEnum]


  export const subscribe_artistOrderByRelevanceFieldEnum: {
    uid: 'uid',
    target: 'target',
    cache: 'cache'
  };

  export type subscribe_artistOrderByRelevanceFieldEnum = (typeof subscribe_artistOrderByRelevanceFieldEnum)[keyof typeof subscribe_artistOrderByRelevanceFieldEnum]


  export const subscribe_newsOrderByRelevanceFieldEnum: {
    uid: 'uid',
    type: 'type',
    target: 'target'
  };

  export type subscribe_newsOrderByRelevanceFieldEnum = (typeof subscribe_newsOrderByRelevanceFieldEnum)[keyof typeof subscribe_newsOrderByRelevanceFieldEnum]


  export const user_sessionOrderByRelevanceFieldEnum: {
    uid: 'uid',
    ytmusic_visitor_id: 'ytmusic_visitor_id',
    ytmusic_cookie: 'ytmusic_cookie'
  };

  export type user_sessionOrderByRelevanceFieldEnum = (typeof user_sessionOrderByRelevanceFieldEnum)[keyof typeof user_sessionOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type api_keyWhereInput = {
    AND?: api_keyWhereInput | api_keyWhereInput[]
    OR?: api_keyWhereInput[]
    NOT?: api_keyWhereInput | api_keyWhereInput[]
    id?: IntFilter<"api_key"> | number
    time?: DateTimeFilter<"api_key"> | Date | string
    createby?: StringFilter<"api_key"> | string
    key?: StringFilter<"api_key"> | string
    permission?: IntFilter<"api_key"> | number
    ratelimitpermin?: IntFilter<"api_key"> | number
    allowedipaddresses?: StringFilter<"api_key"> | string
    expiredat?: DateTimeNullableFilter<"api_key"> | Date | string | null
    isdisabled?: DateTimeNullableFilter<"api_key"> | Date | string | null
    isdeleted?: DateTimeNullableFilter<"api_key"> | Date | string | null
    api_key_logs?: Api_key_logsListRelationFilter
  }

  export type api_keyOrderByWithRelationInput = {
    id?: SortOrder
    time?: SortOrder
    createby?: SortOrder
    key?: SortOrder
    permission?: SortOrder
    ratelimitpermin?: SortOrder
    allowedipaddresses?: SortOrder
    expiredat?: SortOrderInput | SortOrder
    isdisabled?: SortOrderInput | SortOrder
    isdeleted?: SortOrderInput | SortOrder
    api_key_logs?: api_key_logsOrderByRelationAggregateInput
    _relevance?: api_keyOrderByRelevanceInput
  }

  export type api_keyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    key?: string
    AND?: api_keyWhereInput | api_keyWhereInput[]
    OR?: api_keyWhereInput[]
    NOT?: api_keyWhereInput | api_keyWhereInput[]
    time?: DateTimeFilter<"api_key"> | Date | string
    createby?: StringFilter<"api_key"> | string
    permission?: IntFilter<"api_key"> | number
    ratelimitpermin?: IntFilter<"api_key"> | number
    allowedipaddresses?: StringFilter<"api_key"> | string
    expiredat?: DateTimeNullableFilter<"api_key"> | Date | string | null
    isdisabled?: DateTimeNullableFilter<"api_key"> | Date | string | null
    isdeleted?: DateTimeNullableFilter<"api_key"> | Date | string | null
    api_key_logs?: Api_key_logsListRelationFilter
  }, "id" | "key">

  export type api_keyOrderByWithAggregationInput = {
    id?: SortOrder
    time?: SortOrder
    createby?: SortOrder
    key?: SortOrder
    permission?: SortOrder
    ratelimitpermin?: SortOrder
    allowedipaddresses?: SortOrder
    expiredat?: SortOrderInput | SortOrder
    isdisabled?: SortOrderInput | SortOrder
    isdeleted?: SortOrderInput | SortOrder
    _count?: api_keyCountOrderByAggregateInput
    _avg?: api_keyAvgOrderByAggregateInput
    _max?: api_keyMaxOrderByAggregateInput
    _min?: api_keyMinOrderByAggregateInput
    _sum?: api_keySumOrderByAggregateInput
  }

  export type api_keyScalarWhereWithAggregatesInput = {
    AND?: api_keyScalarWhereWithAggregatesInput | api_keyScalarWhereWithAggregatesInput[]
    OR?: api_keyScalarWhereWithAggregatesInput[]
    NOT?: api_keyScalarWhereWithAggregatesInput | api_keyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"api_key"> | number
    time?: DateTimeWithAggregatesFilter<"api_key"> | Date | string
    createby?: StringWithAggregatesFilter<"api_key"> | string
    key?: StringWithAggregatesFilter<"api_key"> | string
    permission?: IntWithAggregatesFilter<"api_key"> | number
    ratelimitpermin?: IntWithAggregatesFilter<"api_key"> | number
    allowedipaddresses?: StringWithAggregatesFilter<"api_key"> | string
    expiredat?: DateTimeNullableWithAggregatesFilter<"api_key"> | Date | string | null
    isdisabled?: DateTimeNullableWithAggregatesFilter<"api_key"> | Date | string | null
    isdeleted?: DateTimeNullableWithAggregatesFilter<"api_key"> | Date | string | null
  }

  export type api_key_logsWhereInput = {
    AND?: api_key_logsWhereInput | api_key_logsWhereInput[]
    OR?: api_key_logsWhereInput[]
    NOT?: api_key_logsWhereInput | api_key_logsWhereInput[]
    id?: IntFilter<"api_key_logs"> | number
    time?: DateTimeFilter<"api_key_logs"> | Date | string
    ip?: StringFilter<"api_key_logs"> | string
    user_agent?: StringFilter<"api_key_logs"> | string
    key?: StringFilter<"api_key_logs"> | string
    api_key?: XOR<Api_keyScalarRelationFilter, api_keyWhereInput>
  }

  export type api_key_logsOrderByWithRelationInput = {
    id?: SortOrder
    time?: SortOrder
    ip?: SortOrder
    user_agent?: SortOrder
    key?: SortOrder
    api_key?: api_keyOrderByWithRelationInput
    _relevance?: api_key_logsOrderByRelevanceInput
  }

  export type api_key_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: api_key_logsWhereInput | api_key_logsWhereInput[]
    OR?: api_key_logsWhereInput[]
    NOT?: api_key_logsWhereInput | api_key_logsWhereInput[]
    time?: DateTimeFilter<"api_key_logs"> | Date | string
    ip?: StringFilter<"api_key_logs"> | string
    user_agent?: StringFilter<"api_key_logs"> | string
    key?: StringFilter<"api_key_logs"> | string
    api_key?: XOR<Api_keyScalarRelationFilter, api_keyWhereInput>
  }, "id">

  export type api_key_logsOrderByWithAggregationInput = {
    id?: SortOrder
    time?: SortOrder
    ip?: SortOrder
    user_agent?: SortOrder
    key?: SortOrder
    _count?: api_key_logsCountOrderByAggregateInput
    _avg?: api_key_logsAvgOrderByAggregateInput
    _max?: api_key_logsMaxOrderByAggregateInput
    _min?: api_key_logsMinOrderByAggregateInput
    _sum?: api_key_logsSumOrderByAggregateInput
  }

  export type api_key_logsScalarWhereWithAggregatesInput = {
    AND?: api_key_logsScalarWhereWithAggregatesInput | api_key_logsScalarWhereWithAggregatesInput[]
    OR?: api_key_logsScalarWhereWithAggregatesInput[]
    NOT?: api_key_logsScalarWhereWithAggregatesInput | api_key_logsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"api_key_logs"> | number
    time?: DateTimeWithAggregatesFilter<"api_key_logs"> | Date | string
    ip?: StringWithAggregatesFilter<"api_key_logs"> | string
    user_agent?: StringWithAggregatesFilter<"api_key_logs"> | string
    key?: StringWithAggregatesFilter<"api_key_logs"> | string
  }

  export type channel_notify_webhookWhereInput = {
    AND?: channel_notify_webhookWhereInput | channel_notify_webhookWhereInput[]
    OR?: channel_notify_webhookWhereInput[]
    NOT?: channel_notify_webhookWhereInput | channel_notify_webhookWhereInput[]
    id?: BigIntFilter<"channel_notify_webhook"> | bigint | number
    uuid?: StringFilter<"channel_notify_webhook"> | string
    time?: DateTimeFilter<"channel_notify_webhook"> | Date | string
    by?: StringFilter<"channel_notify_webhook"> | string
    guild_id?: StringFilter<"channel_notify_webhook"> | string
    broadcaster_id?: StringFilter<"channel_notify_webhook"> | string
    webhook_url?: StringFilter<"channel_notify_webhook"> | string
    message?: StringFilter<"channel_notify_webhook"> | string
    verify_type?: StringNullableFilter<"channel_notify_webhook"> | string | null
    verify_code?: StringNullableFilter<"channel_notify_webhook"> | string | null
    hmac_secret?: StringNullableFilter<"channel_notify_webhook"> | string | null
    lease_sec?: IntNullableFilter<"channel_notify_webhook"> | number | null
    disabled?: DateTimeNullableFilter<"channel_notify_webhook"> | Date | string | null
    deleted?: DateTimeNullableFilter<"channel_notify_webhook"> | Date | string | null
  }

  export type channel_notify_webhookOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    time?: SortOrder
    by?: SortOrder
    guild_id?: SortOrder
    broadcaster_id?: SortOrder
    webhook_url?: SortOrder
    message?: SortOrder
    verify_type?: SortOrderInput | SortOrder
    verify_code?: SortOrderInput | SortOrder
    hmac_secret?: SortOrderInput | SortOrder
    lease_sec?: SortOrderInput | SortOrder
    disabled?: SortOrderInput | SortOrder
    deleted?: SortOrderInput | SortOrder
    _relevance?: channel_notify_webhookOrderByRelevanceInput
  }

  export type channel_notify_webhookWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    uuid?: string
    AND?: channel_notify_webhookWhereInput | channel_notify_webhookWhereInput[]
    OR?: channel_notify_webhookWhereInput[]
    NOT?: channel_notify_webhookWhereInput | channel_notify_webhookWhereInput[]
    time?: DateTimeFilter<"channel_notify_webhook"> | Date | string
    by?: StringFilter<"channel_notify_webhook"> | string
    guild_id?: StringFilter<"channel_notify_webhook"> | string
    broadcaster_id?: StringFilter<"channel_notify_webhook"> | string
    webhook_url?: StringFilter<"channel_notify_webhook"> | string
    message?: StringFilter<"channel_notify_webhook"> | string
    verify_type?: StringNullableFilter<"channel_notify_webhook"> | string | null
    verify_code?: StringNullableFilter<"channel_notify_webhook"> | string | null
    hmac_secret?: StringNullableFilter<"channel_notify_webhook"> | string | null
    lease_sec?: IntNullableFilter<"channel_notify_webhook"> | number | null
    disabled?: DateTimeNullableFilter<"channel_notify_webhook"> | Date | string | null
    deleted?: DateTimeNullableFilter<"channel_notify_webhook"> | Date | string | null
  }, "id" | "uuid">

  export type channel_notify_webhookOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    time?: SortOrder
    by?: SortOrder
    guild_id?: SortOrder
    broadcaster_id?: SortOrder
    webhook_url?: SortOrder
    message?: SortOrder
    verify_type?: SortOrderInput | SortOrder
    verify_code?: SortOrderInput | SortOrder
    hmac_secret?: SortOrderInput | SortOrder
    lease_sec?: SortOrderInput | SortOrder
    disabled?: SortOrderInput | SortOrder
    deleted?: SortOrderInput | SortOrder
    _count?: channel_notify_webhookCountOrderByAggregateInput
    _avg?: channel_notify_webhookAvgOrderByAggregateInput
    _max?: channel_notify_webhookMaxOrderByAggregateInput
    _min?: channel_notify_webhookMinOrderByAggregateInput
    _sum?: channel_notify_webhookSumOrderByAggregateInput
  }

  export type channel_notify_webhookScalarWhereWithAggregatesInput = {
    AND?: channel_notify_webhookScalarWhereWithAggregatesInput | channel_notify_webhookScalarWhereWithAggregatesInput[]
    OR?: channel_notify_webhookScalarWhereWithAggregatesInput[]
    NOT?: channel_notify_webhookScalarWhereWithAggregatesInput | channel_notify_webhookScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"channel_notify_webhook"> | bigint | number
    uuid?: StringWithAggregatesFilter<"channel_notify_webhook"> | string
    time?: DateTimeWithAggregatesFilter<"channel_notify_webhook"> | Date | string
    by?: StringWithAggregatesFilter<"channel_notify_webhook"> | string
    guild_id?: StringWithAggregatesFilter<"channel_notify_webhook"> | string
    broadcaster_id?: StringWithAggregatesFilter<"channel_notify_webhook"> | string
    webhook_url?: StringWithAggregatesFilter<"channel_notify_webhook"> | string
    message?: StringWithAggregatesFilter<"channel_notify_webhook"> | string
    verify_type?: StringNullableWithAggregatesFilter<"channel_notify_webhook"> | string | null
    verify_code?: StringNullableWithAggregatesFilter<"channel_notify_webhook"> | string | null
    hmac_secret?: StringNullableWithAggregatesFilter<"channel_notify_webhook"> | string | null
    lease_sec?: IntNullableWithAggregatesFilter<"channel_notify_webhook"> | number | null
    disabled?: DateTimeNullableWithAggregatesFilter<"channel_notify_webhook"> | Date | string | null
    deleted?: DateTimeNullableWithAggregatesFilter<"channel_notify_webhook"> | Date | string | null
  }

  export type favorite_trackWhereInput = {
    AND?: favorite_trackWhereInput | favorite_trackWhereInput[]
    OR?: favorite_trackWhereInput[]
    NOT?: favorite_trackWhereInput | favorite_trackWhereInput[]
    id?: BigIntFilter<"favorite_track"> | bigint | number
    uid?: StringFilter<"favorite_track"> | string
    time?: DateTimeFilter<"favorite_track"> | Date | string
    target?: StringFilter<"favorite_track"> | string
    source?: StringFilter<"favorite_track"> | string
    cache?: StringNullableFilter<"favorite_track"> | string | null
    cache_lastupdated?: DateTimeNullableFilter<"favorite_track"> | Date | string | null
  }

  export type favorite_trackOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    target?: SortOrder
    source?: SortOrder
    cache?: SortOrderInput | SortOrder
    cache_lastupdated?: SortOrderInput | SortOrder
    _relevance?: favorite_trackOrderByRelevanceInput
  }

  export type favorite_trackWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    uid_target?: favorite_trackUidTargetCompoundUniqueInput
    AND?: favorite_trackWhereInput | favorite_trackWhereInput[]
    OR?: favorite_trackWhereInput[]
    NOT?: favorite_trackWhereInput | favorite_trackWhereInput[]
    uid?: StringFilter<"favorite_track"> | string
    time?: DateTimeFilter<"favorite_track"> | Date | string
    target?: StringFilter<"favorite_track"> | string
    source?: StringFilter<"favorite_track"> | string
    cache?: StringNullableFilter<"favorite_track"> | string | null
    cache_lastupdated?: DateTimeNullableFilter<"favorite_track"> | Date | string | null
  }, "id" | "uid_target">

  export type favorite_trackOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    target?: SortOrder
    source?: SortOrder
    cache?: SortOrderInput | SortOrder
    cache_lastupdated?: SortOrderInput | SortOrder
    _count?: favorite_trackCountOrderByAggregateInput
    _avg?: favorite_trackAvgOrderByAggregateInput
    _max?: favorite_trackMaxOrderByAggregateInput
    _min?: favorite_trackMinOrderByAggregateInput
    _sum?: favorite_trackSumOrderByAggregateInput
  }

  export type favorite_trackScalarWhereWithAggregatesInput = {
    AND?: favorite_trackScalarWhereWithAggregatesInput | favorite_trackScalarWhereWithAggregatesInput[]
    OR?: favorite_trackScalarWhereWithAggregatesInput[]
    NOT?: favorite_trackScalarWhereWithAggregatesInput | favorite_trackScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"favorite_track"> | bigint | number
    uid?: StringWithAggregatesFilter<"favorite_track"> | string
    time?: DateTimeWithAggregatesFilter<"favorite_track"> | Date | string
    target?: StringWithAggregatesFilter<"favorite_track"> | string
    source?: StringWithAggregatesFilter<"favorite_track"> | string
    cache?: StringNullableWithAggregatesFilter<"favorite_track"> | string | null
    cache_lastupdated?: DateTimeNullableWithAggregatesFilter<"favorite_track"> | Date | string | null
  }

  export type feedbackWhereInput = {
    AND?: feedbackWhereInput | feedbackWhereInput[]
    OR?: feedbackWhereInput[]
    NOT?: feedbackWhereInput | feedbackWhereInput[]
    id?: IntFilter<"feedback"> | number
    time?: DateTimeFilter<"feedback"> | Date | string
    message?: StringFilter<"feedback"> | string
    email?: StringNullableFilter<"feedback"> | string | null
  }

  export type feedbackOrderByWithRelationInput = {
    id?: SortOrder
    time?: SortOrder
    message?: SortOrder
    email?: SortOrderInput | SortOrder
    _relevance?: feedbackOrderByRelevanceInput
  }

  export type feedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: feedbackWhereInput | feedbackWhereInput[]
    OR?: feedbackWhereInput[]
    NOT?: feedbackWhereInput | feedbackWhereInput[]
    time?: DateTimeFilter<"feedback"> | Date | string
    message?: StringFilter<"feedback"> | string
    email?: StringNullableFilter<"feedback"> | string | null
  }, "id">

  export type feedbackOrderByWithAggregationInput = {
    id?: SortOrder
    time?: SortOrder
    message?: SortOrder
    email?: SortOrderInput | SortOrder
    _count?: feedbackCountOrderByAggregateInput
    _avg?: feedbackAvgOrderByAggregateInput
    _max?: feedbackMaxOrderByAggregateInput
    _min?: feedbackMinOrderByAggregateInput
    _sum?: feedbackSumOrderByAggregateInput
  }

  export type feedbackScalarWhereWithAggregatesInput = {
    AND?: feedbackScalarWhereWithAggregatesInput | feedbackScalarWhereWithAggregatesInput[]
    OR?: feedbackScalarWhereWithAggregatesInput[]
    NOT?: feedbackScalarWhereWithAggregatesInput | feedbackScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"feedback"> | number
    time?: DateTimeWithAggregatesFilter<"feedback"> | Date | string
    message?: StringWithAggregatesFilter<"feedback"> | string
    email?: StringNullableWithAggregatesFilter<"feedback"> | string | null
  }

  export type guildsWhereInput = {
    AND?: guildsWhereInput | guildsWhereInput[]
    OR?: guildsWhereInput[]
    NOT?: guildsWhereInput | guildsWhereInput[]
    id?: BigIntFilter<"guilds"> | bigint | number
    guildid?: StringFilter<"guilds"> | string
    args?: StringNullableFilter<"guilds"> | string | null
  }

  export type guildsOrderByWithRelationInput = {
    id?: SortOrder
    guildid?: SortOrder
    args?: SortOrderInput | SortOrder
    _relevance?: guildsOrderByRelevanceInput
  }

  export type guildsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    guildid?: string
    AND?: guildsWhereInput | guildsWhereInput[]
    OR?: guildsWhereInput[]
    NOT?: guildsWhereInput | guildsWhereInput[]
    args?: StringNullableFilter<"guilds"> | string | null
  }, "id" | "guildid">

  export type guildsOrderByWithAggregationInput = {
    id?: SortOrder
    guildid?: SortOrder
    args?: SortOrderInput | SortOrder
    _count?: guildsCountOrderByAggregateInput
    _avg?: guildsAvgOrderByAggregateInput
    _max?: guildsMaxOrderByAggregateInput
    _min?: guildsMinOrderByAggregateInput
    _sum?: guildsSumOrderByAggregateInput
  }

  export type guildsScalarWhereWithAggregatesInput = {
    AND?: guildsScalarWhereWithAggregatesInput | guildsScalarWhereWithAggregatesInput[]
    OR?: guildsScalarWhereWithAggregatesInput[]
    NOT?: guildsScalarWhereWithAggregatesInput | guildsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"guilds"> | bigint | number
    guildid?: StringWithAggregatesFilter<"guilds"> | string
    args?: StringNullableWithAggregatesFilter<"guilds"> | string | null
  }

  export type player_action_historyWhereInput = {
    AND?: player_action_historyWhereInput | player_action_historyWhereInput[]
    OR?: player_action_historyWhereInput[]
    NOT?: player_action_historyWhereInput | player_action_historyWhereInput[]
    id?: BigIntFilter<"player_action_history"> | bigint | number
    actionby?: StringFilter<"player_action_history"> | string
    timestamp?: DateTimeFilter<"player_action_history"> | Date | string
    action_name?: StringFilter<"player_action_history"> | string
    data?: StringNullableFilter<"player_action_history"> | string | null
    guild?: StringNullableFilter<"player_action_history"> | string | null
    channel?: StringNullableFilter<"player_action_history"> | string | null
  }

  export type player_action_historyOrderByWithRelationInput = {
    id?: SortOrder
    actionby?: SortOrder
    timestamp?: SortOrder
    action_name?: SortOrder
    data?: SortOrderInput | SortOrder
    guild?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    _relevance?: player_action_historyOrderByRelevanceInput
  }

  export type player_action_historyWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: player_action_historyWhereInput | player_action_historyWhereInput[]
    OR?: player_action_historyWhereInput[]
    NOT?: player_action_historyWhereInput | player_action_historyWhereInput[]
    actionby?: StringFilter<"player_action_history"> | string
    timestamp?: DateTimeFilter<"player_action_history"> | Date | string
    action_name?: StringFilter<"player_action_history"> | string
    data?: StringNullableFilter<"player_action_history"> | string | null
    guild?: StringNullableFilter<"player_action_history"> | string | null
    channel?: StringNullableFilter<"player_action_history"> | string | null
  }, "id">

  export type player_action_historyOrderByWithAggregationInput = {
    id?: SortOrder
    actionby?: SortOrder
    timestamp?: SortOrder
    action_name?: SortOrder
    data?: SortOrderInput | SortOrder
    guild?: SortOrderInput | SortOrder
    channel?: SortOrderInput | SortOrder
    _count?: player_action_historyCountOrderByAggregateInput
    _avg?: player_action_historyAvgOrderByAggregateInput
    _max?: player_action_historyMaxOrderByAggregateInput
    _min?: player_action_historyMinOrderByAggregateInput
    _sum?: player_action_historySumOrderByAggregateInput
  }

  export type player_action_historyScalarWhereWithAggregatesInput = {
    AND?: player_action_historyScalarWhereWithAggregatesInput | player_action_historyScalarWhereWithAggregatesInput[]
    OR?: player_action_historyScalarWhereWithAggregatesInput[]
    NOT?: player_action_historyScalarWhereWithAggregatesInput | player_action_historyScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"player_action_history"> | bigint | number
    actionby?: StringWithAggregatesFilter<"player_action_history"> | string
    timestamp?: DateTimeWithAggregatesFilter<"player_action_history"> | Date | string
    action_name?: StringWithAggregatesFilter<"player_action_history"> | string
    data?: StringNullableWithAggregatesFilter<"player_action_history"> | string | null
    guild?: StringNullableWithAggregatesFilter<"player_action_history"> | string | null
    channel?: StringNullableWithAggregatesFilter<"player_action_history"> | string | null
  }

  export type player_track_historyWhereInput = {
    AND?: player_track_historyWhereInput | player_track_historyWhereInput[]
    OR?: player_track_historyWhereInput[]
    NOT?: player_track_historyWhereInput | player_track_historyWhereInput[]
    id?: BigIntFilter<"player_track_history"> | bigint | number
    requestby?: StringFilter<"player_track_history"> | string
    uniqueid?: StringFilter<"player_track_history"> | string
    time?: DateTimeFilter<"player_track_history"> | Date | string
    voicechannel?: StringFilter<"player_track_history"> | string
    guildid?: StringFilter<"player_track_history"> | string
    track?: StringFilter<"player_track_history"> | string
  }

  export type player_track_historyOrderByWithRelationInput = {
    id?: SortOrder
    requestby?: SortOrder
    uniqueid?: SortOrder
    time?: SortOrder
    voicechannel?: SortOrder
    guildid?: SortOrder
    track?: SortOrder
    _relevance?: player_track_historyOrderByRelevanceInput
  }

  export type player_track_historyWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: player_track_historyWhereInput | player_track_historyWhereInput[]
    OR?: player_track_historyWhereInput[]
    NOT?: player_track_historyWhereInput | player_track_historyWhereInput[]
    requestby?: StringFilter<"player_track_history"> | string
    uniqueid?: StringFilter<"player_track_history"> | string
    time?: DateTimeFilter<"player_track_history"> | Date | string
    voicechannel?: StringFilter<"player_track_history"> | string
    guildid?: StringFilter<"player_track_history"> | string
    track?: StringFilter<"player_track_history"> | string
  }, "id">

  export type player_track_historyOrderByWithAggregationInput = {
    id?: SortOrder
    requestby?: SortOrder
    uniqueid?: SortOrder
    time?: SortOrder
    voicechannel?: SortOrder
    guildid?: SortOrder
    track?: SortOrder
    _count?: player_track_historyCountOrderByAggregateInput
    _avg?: player_track_historyAvgOrderByAggregateInput
    _max?: player_track_historyMaxOrderByAggregateInput
    _min?: player_track_historyMinOrderByAggregateInput
    _sum?: player_track_historySumOrderByAggregateInput
  }

  export type player_track_historyScalarWhereWithAggregatesInput = {
    AND?: player_track_historyScalarWhereWithAggregatesInput | player_track_historyScalarWhereWithAggregatesInput[]
    OR?: player_track_historyScalarWhereWithAggregatesInput[]
    NOT?: player_track_historyScalarWhereWithAggregatesInput | player_track_historyScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"player_track_history"> | bigint | number
    requestby?: StringWithAggregatesFilter<"player_track_history"> | string
    uniqueid?: StringWithAggregatesFilter<"player_track_history"> | string
    time?: DateTimeWithAggregatesFilter<"player_track_history"> | Date | string
    voicechannel?: StringWithAggregatesFilter<"player_track_history"> | string
    guildid?: StringWithAggregatesFilter<"player_track_history"> | string
    track?: StringWithAggregatesFilter<"player_track_history"> | string
  }

  export type pona_flipflop_stateWhereInput = {
    AND?: pona_flipflop_stateWhereInput | pona_flipflop_stateWhereInput[]
    OR?: pona_flipflop_stateWhereInput[]
    NOT?: pona_flipflop_stateWhereInput | pona_flipflop_stateWhereInput[]
    id?: BigIntFilter<"pona_flipflop_state"> | bigint | number
    time?: DateTimeFilter<"pona_flipflop_state"> | Date | string
    guildid?: StringFilter<"pona_flipflop_state"> | string
    active?: BoolFilter<"pona_flipflop_state"> | boolean
  }

  export type pona_flipflop_stateOrderByWithRelationInput = {
    id?: SortOrder
    time?: SortOrder
    guildid?: SortOrder
    active?: SortOrder
    _relevance?: pona_flipflop_stateOrderByRelevanceInput
  }

  export type pona_flipflop_stateWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: pona_flipflop_stateWhereInput | pona_flipflop_stateWhereInput[]
    OR?: pona_flipflop_stateWhereInput[]
    NOT?: pona_flipflop_stateWhereInput | pona_flipflop_stateWhereInput[]
    time?: DateTimeFilter<"pona_flipflop_state"> | Date | string
    guildid?: StringFilter<"pona_flipflop_state"> | string
    active?: BoolFilter<"pona_flipflop_state"> | boolean
  }, "id">

  export type pona_flipflop_stateOrderByWithAggregationInput = {
    id?: SortOrder
    time?: SortOrder
    guildid?: SortOrder
    active?: SortOrder
    _count?: pona_flipflop_stateCountOrderByAggregateInput
    _avg?: pona_flipflop_stateAvgOrderByAggregateInput
    _max?: pona_flipflop_stateMaxOrderByAggregateInput
    _min?: pona_flipflop_stateMinOrderByAggregateInput
    _sum?: pona_flipflop_stateSumOrderByAggregateInput
  }

  export type pona_flipflop_stateScalarWhereWithAggregatesInput = {
    AND?: pona_flipflop_stateScalarWhereWithAggregatesInput | pona_flipflop_stateScalarWhereWithAggregatesInput[]
    OR?: pona_flipflop_stateScalarWhereWithAggregatesInput[]
    NOT?: pona_flipflop_stateScalarWhereWithAggregatesInput | pona_flipflop_stateScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"pona_flipflop_state"> | bigint | number
    time?: DateTimeWithAggregatesFilter<"pona_flipflop_state"> | Date | string
    guildid?: StringWithAggregatesFilter<"pona_flipflop_state"> | string
    active?: BoolWithAggregatesFilter<"pona_flipflop_state"> | boolean
  }

  export type pona_heartbeat_intervalWhereInput = {
    AND?: pona_heartbeat_intervalWhereInput | pona_heartbeat_intervalWhereInput[]
    OR?: pona_heartbeat_intervalWhereInput[]
    NOT?: pona_heartbeat_intervalWhereInput | pona_heartbeat_intervalWhereInput[]
    id?: BigIntFilter<"pona_heartbeat_interval"> | bigint | number
    time?: DateTimeFilter<"pona_heartbeat_interval"> | Date | string
    clusterid?: StringNullableFilter<"pona_heartbeat_interval"> | string | null
    shardid?: StringNullableFilter<"pona_heartbeat_interval"> | string | null
    ptm?: IntFilter<"pona_heartbeat_interval"> | number
  }

  export type pona_heartbeat_intervalOrderByWithRelationInput = {
    id?: SortOrder
    time?: SortOrder
    clusterid?: SortOrderInput | SortOrder
    shardid?: SortOrderInput | SortOrder
    ptm?: SortOrder
    _relevance?: pona_heartbeat_intervalOrderByRelevanceInput
  }

  export type pona_heartbeat_intervalWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: pona_heartbeat_intervalWhereInput | pona_heartbeat_intervalWhereInput[]
    OR?: pona_heartbeat_intervalWhereInput[]
    NOT?: pona_heartbeat_intervalWhereInput | pona_heartbeat_intervalWhereInput[]
    time?: DateTimeFilter<"pona_heartbeat_interval"> | Date | string
    clusterid?: StringNullableFilter<"pona_heartbeat_interval"> | string | null
    shardid?: StringNullableFilter<"pona_heartbeat_interval"> | string | null
    ptm?: IntFilter<"pona_heartbeat_interval"> | number
  }, "id">

  export type pona_heartbeat_intervalOrderByWithAggregationInput = {
    id?: SortOrder
    time?: SortOrder
    clusterid?: SortOrderInput | SortOrder
    shardid?: SortOrderInput | SortOrder
    ptm?: SortOrder
    _count?: pona_heartbeat_intervalCountOrderByAggregateInput
    _avg?: pona_heartbeat_intervalAvgOrderByAggregateInput
    _max?: pona_heartbeat_intervalMaxOrderByAggregateInput
    _min?: pona_heartbeat_intervalMinOrderByAggregateInput
    _sum?: pona_heartbeat_intervalSumOrderByAggregateInput
  }

  export type pona_heartbeat_intervalScalarWhereWithAggregatesInput = {
    AND?: pona_heartbeat_intervalScalarWhereWithAggregatesInput | pona_heartbeat_intervalScalarWhereWithAggregatesInput[]
    OR?: pona_heartbeat_intervalScalarWhereWithAggregatesInput[]
    NOT?: pona_heartbeat_intervalScalarWhereWithAggregatesInput | pona_heartbeat_intervalScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"pona_heartbeat_interval"> | bigint | number
    time?: DateTimeWithAggregatesFilter<"pona_heartbeat_interval"> | Date | string
    clusterid?: StringNullableWithAggregatesFilter<"pona_heartbeat_interval"> | string | null
    shardid?: StringNullableWithAggregatesFilter<"pona_heartbeat_interval"> | string | null
    ptm?: IntWithAggregatesFilter<"pona_heartbeat_interval"> | number
  }

  export type pona_voicestate_historyWhereInput = {
    AND?: pona_voicestate_historyWhereInput | pona_voicestate_historyWhereInput[]
    OR?: pona_voicestate_historyWhereInput[]
    NOT?: pona_voicestate_historyWhereInput | pona_voicestate_historyWhereInput[]
    id?: BigIntFilter<"pona_voicestate_history"> | bigint | number
    guildid?: StringFilter<"pona_voicestate_history"> | string
    memberid?: StringFilter<"pona_voicestate_history"> | string
    channelid?: StringFilter<"pona_voicestate_history"> | string
    beforestate?: StringNullableFilter<"pona_voicestate_history"> | string | null
    afterstate?: StringNullableFilter<"pona_voicestate_history"> | string | null
    date?: DateTimeFilter<"pona_voicestate_history"> | Date | string
    type?: StringFilter<"pona_voicestate_history"> | string
  }

  export type pona_voicestate_historyOrderByWithRelationInput = {
    id?: SortOrder
    guildid?: SortOrder
    memberid?: SortOrder
    channelid?: SortOrder
    beforestate?: SortOrderInput | SortOrder
    afterstate?: SortOrderInput | SortOrder
    date?: SortOrder
    type?: SortOrder
    _relevance?: pona_voicestate_historyOrderByRelevanceInput
  }

  export type pona_voicestate_historyWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: pona_voicestate_historyWhereInput | pona_voicestate_historyWhereInput[]
    OR?: pona_voicestate_historyWhereInput[]
    NOT?: pona_voicestate_historyWhereInput | pona_voicestate_historyWhereInput[]
    guildid?: StringFilter<"pona_voicestate_history"> | string
    memberid?: StringFilter<"pona_voicestate_history"> | string
    channelid?: StringFilter<"pona_voicestate_history"> | string
    beforestate?: StringNullableFilter<"pona_voicestate_history"> | string | null
    afterstate?: StringNullableFilter<"pona_voicestate_history"> | string | null
    date?: DateTimeFilter<"pona_voicestate_history"> | Date | string
    type?: StringFilter<"pona_voicestate_history"> | string
  }, "id">

  export type pona_voicestate_historyOrderByWithAggregationInput = {
    id?: SortOrder
    guildid?: SortOrder
    memberid?: SortOrder
    channelid?: SortOrder
    beforestate?: SortOrderInput | SortOrder
    afterstate?: SortOrderInput | SortOrder
    date?: SortOrder
    type?: SortOrder
    _count?: pona_voicestate_historyCountOrderByAggregateInput
    _avg?: pona_voicestate_historyAvgOrderByAggregateInput
    _max?: pona_voicestate_historyMaxOrderByAggregateInput
    _min?: pona_voicestate_historyMinOrderByAggregateInput
    _sum?: pona_voicestate_historySumOrderByAggregateInput
  }

  export type pona_voicestate_historyScalarWhereWithAggregatesInput = {
    AND?: pona_voicestate_historyScalarWhereWithAggregatesInput | pona_voicestate_historyScalarWhereWithAggregatesInput[]
    OR?: pona_voicestate_historyScalarWhereWithAggregatesInput[]
    NOT?: pona_voicestate_historyScalarWhereWithAggregatesInput | pona_voicestate_historyScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"pona_voicestate_history"> | bigint | number
    guildid?: StringWithAggregatesFilter<"pona_voicestate_history"> | string
    memberid?: StringWithAggregatesFilter<"pona_voicestate_history"> | string
    channelid?: StringWithAggregatesFilter<"pona_voicestate_history"> | string
    beforestate?: StringNullableWithAggregatesFilter<"pona_voicestate_history"> | string | null
    afterstate?: StringNullableWithAggregatesFilter<"pona_voicestate_history"> | string | null
    date?: DateTimeWithAggregatesFilter<"pona_voicestate_history"> | Date | string
    type?: StringWithAggregatesFilter<"pona_voicestate_history"> | string
  }

  export type search_historyWhereInput = {
    AND?: search_historyWhereInput | search_historyWhereInput[]
    OR?: search_historyWhereInput[]
    NOT?: search_historyWhereInput | search_historyWhereInput[]
    id?: BigIntFilter<"search_history"> | bigint | number
    uid?: StringFilter<"search_history"> | string
    time?: DateTimeFilter<"search_history"> | Date | string
    text?: StringFilter<"search_history"> | string
  }

  export type search_historyOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    text?: SortOrder
    _relevance?: search_historyOrderByRelevanceInput
  }

  export type search_historyWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: search_historyWhereInput | search_historyWhereInput[]
    OR?: search_historyWhereInput[]
    NOT?: search_historyWhereInput | search_historyWhereInput[]
    uid?: StringFilter<"search_history"> | string
    time?: DateTimeFilter<"search_history"> | Date | string
    text?: StringFilter<"search_history"> | string
  }, "id">

  export type search_historyOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    text?: SortOrder
    _count?: search_historyCountOrderByAggregateInput
    _avg?: search_historyAvgOrderByAggregateInput
    _max?: search_historyMaxOrderByAggregateInput
    _min?: search_historyMinOrderByAggregateInput
    _sum?: search_historySumOrderByAggregateInput
  }

  export type search_historyScalarWhereWithAggregatesInput = {
    AND?: search_historyScalarWhereWithAggregatesInput | search_historyScalarWhereWithAggregatesInput[]
    OR?: search_historyScalarWhereWithAggregatesInput[]
    NOT?: search_historyScalarWhereWithAggregatesInput | search_historyScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"search_history"> | bigint | number
    uid?: StringWithAggregatesFilter<"search_history"> | string
    time?: DateTimeWithAggregatesFilter<"search_history"> | Date | string
    text?: StringWithAggregatesFilter<"search_history"> | string
  }

  export type subscribe_artistWhereInput = {
    AND?: subscribe_artistWhereInput | subscribe_artistWhereInput[]
    OR?: subscribe_artistWhereInput[]
    NOT?: subscribe_artistWhereInput | subscribe_artistWhereInput[]
    id?: BigIntFilter<"subscribe_artist"> | bigint | number
    uid?: StringFilter<"subscribe_artist"> | string
    target?: StringFilter<"subscribe_artist"> | string
    time?: DateTimeFilter<"subscribe_artist"> | Date | string
    cache?: StringNullableFilter<"subscribe_artist"> | string | null
    cache_lastupdated?: DateTimeNullableFilter<"subscribe_artist"> | Date | string | null
  }

  export type subscribe_artistOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    target?: SortOrder
    time?: SortOrder
    cache?: SortOrderInput | SortOrder
    cache_lastupdated?: SortOrderInput | SortOrder
    _relevance?: subscribe_artistOrderByRelevanceInput
  }

  export type subscribe_artistWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    uid_target?: subscribe_artistUidTargetCompoundUniqueInput
    AND?: subscribe_artistWhereInput | subscribe_artistWhereInput[]
    OR?: subscribe_artistWhereInput[]
    NOT?: subscribe_artistWhereInput | subscribe_artistWhereInput[]
    uid?: StringFilter<"subscribe_artist"> | string
    target?: StringFilter<"subscribe_artist"> | string
    time?: DateTimeFilter<"subscribe_artist"> | Date | string
    cache?: StringNullableFilter<"subscribe_artist"> | string | null
    cache_lastupdated?: DateTimeNullableFilter<"subscribe_artist"> | Date | string | null
  }, "id" | "uid_target">

  export type subscribe_artistOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    target?: SortOrder
    time?: SortOrder
    cache?: SortOrderInput | SortOrder
    cache_lastupdated?: SortOrderInput | SortOrder
    _count?: subscribe_artistCountOrderByAggregateInput
    _avg?: subscribe_artistAvgOrderByAggregateInput
    _max?: subscribe_artistMaxOrderByAggregateInput
    _min?: subscribe_artistMinOrderByAggregateInput
    _sum?: subscribe_artistSumOrderByAggregateInput
  }

  export type subscribe_artistScalarWhereWithAggregatesInput = {
    AND?: subscribe_artistScalarWhereWithAggregatesInput | subscribe_artistScalarWhereWithAggregatesInput[]
    OR?: subscribe_artistScalarWhereWithAggregatesInput[]
    NOT?: subscribe_artistScalarWhereWithAggregatesInput | subscribe_artistScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"subscribe_artist"> | bigint | number
    uid?: StringWithAggregatesFilter<"subscribe_artist"> | string
    target?: StringWithAggregatesFilter<"subscribe_artist"> | string
    time?: DateTimeWithAggregatesFilter<"subscribe_artist"> | Date | string
    cache?: StringNullableWithAggregatesFilter<"subscribe_artist"> | string | null
    cache_lastupdated?: DateTimeNullableWithAggregatesFilter<"subscribe_artist"> | Date | string | null
  }

  export type subscribe_newsWhereInput = {
    AND?: subscribe_newsWhereInput | subscribe_newsWhereInput[]
    OR?: subscribe_newsWhereInput[]
    NOT?: subscribe_newsWhereInput | subscribe_newsWhereInput[]
    id?: BigIntFilter<"subscribe_news"> | bigint | number
    uid?: StringFilter<"subscribe_news"> | string
    time?: DateTimeFilter<"subscribe_news"> | Date | string
    type?: StringFilter<"subscribe_news"> | string
    target?: StringFilter<"subscribe_news"> | string
  }

  export type subscribe_newsOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    type?: SortOrder
    target?: SortOrder
    _relevance?: subscribe_newsOrderByRelevanceInput
  }

  export type subscribe_newsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    uid_type_target?: subscribe_newsUidTypeTargetCompoundUniqueInput
    AND?: subscribe_newsWhereInput | subscribe_newsWhereInput[]
    OR?: subscribe_newsWhereInput[]
    NOT?: subscribe_newsWhereInput | subscribe_newsWhereInput[]
    uid?: StringFilter<"subscribe_news"> | string
    time?: DateTimeFilter<"subscribe_news"> | Date | string
    type?: StringFilter<"subscribe_news"> | string
    target?: StringFilter<"subscribe_news"> | string
  }, "id" | "uid_type_target">

  export type subscribe_newsOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    type?: SortOrder
    target?: SortOrder
    _count?: subscribe_newsCountOrderByAggregateInput
    _avg?: subscribe_newsAvgOrderByAggregateInput
    _max?: subscribe_newsMaxOrderByAggregateInput
    _min?: subscribe_newsMinOrderByAggregateInput
    _sum?: subscribe_newsSumOrderByAggregateInput
  }

  export type subscribe_newsScalarWhereWithAggregatesInput = {
    AND?: subscribe_newsScalarWhereWithAggregatesInput | subscribe_newsScalarWhereWithAggregatesInput[]
    OR?: subscribe_newsScalarWhereWithAggregatesInput[]
    NOT?: subscribe_newsScalarWhereWithAggregatesInput | subscribe_newsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"subscribe_news"> | bigint | number
    uid?: StringWithAggregatesFilter<"subscribe_news"> | string
    time?: DateTimeWithAggregatesFilter<"subscribe_news"> | Date | string
    type?: StringWithAggregatesFilter<"subscribe_news"> | string
    target?: StringWithAggregatesFilter<"subscribe_news"> | string
  }

  export type user_sessionWhereInput = {
    AND?: user_sessionWhereInput | user_sessionWhereInput[]
    OR?: user_sessionWhereInput[]
    NOT?: user_sessionWhereInput | user_sessionWhereInput[]
    id?: BigIntFilter<"user_session"> | bigint | number
    uid?: StringFilter<"user_session"> | string
    ytmusic_visitor_id?: StringFilter<"user_session"> | string
    ytmusic_cookie?: StringNullableFilter<"user_session"> | string | null
    created_at?: DateTimeFilter<"user_session"> | Date | string
    updated_at?: DateTimeFilter<"user_session"> | Date | string
  }

  export type user_sessionOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    ytmusic_visitor_id?: SortOrder
    ytmusic_cookie?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _relevance?: user_sessionOrderByRelevanceInput
  }

  export type user_sessionWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    uid?: string
    ytmusic_visitor_id?: string
    AND?: user_sessionWhereInput | user_sessionWhereInput[]
    OR?: user_sessionWhereInput[]
    NOT?: user_sessionWhereInput | user_sessionWhereInput[]
    ytmusic_cookie?: StringNullableFilter<"user_session"> | string | null
    created_at?: DateTimeFilter<"user_session"> | Date | string
    updated_at?: DateTimeFilter<"user_session"> | Date | string
  }, "id" | "uid" | "ytmusic_visitor_id">

  export type user_sessionOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    ytmusic_visitor_id?: SortOrder
    ytmusic_cookie?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: user_sessionCountOrderByAggregateInput
    _avg?: user_sessionAvgOrderByAggregateInput
    _max?: user_sessionMaxOrderByAggregateInput
    _min?: user_sessionMinOrderByAggregateInput
    _sum?: user_sessionSumOrderByAggregateInput
  }

  export type user_sessionScalarWhereWithAggregatesInput = {
    AND?: user_sessionScalarWhereWithAggregatesInput | user_sessionScalarWhereWithAggregatesInput[]
    OR?: user_sessionScalarWhereWithAggregatesInput[]
    NOT?: user_sessionScalarWhereWithAggregatesInput | user_sessionScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"user_session"> | bigint | number
    uid?: StringWithAggregatesFilter<"user_session"> | string
    ytmusic_visitor_id?: StringWithAggregatesFilter<"user_session"> | string
    ytmusic_cookie?: StringNullableWithAggregatesFilter<"user_session"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"user_session"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"user_session"> | Date | string
  }

  export type api_keyCreateInput = {
    time?: Date | string
    createby: string
    key?: string
    permission?: number
    ratelimitpermin?: number
    allowedipaddresses?: string
    expiredat?: Date | string | null
    isdisabled?: Date | string | null
    isdeleted?: Date | string | null
    api_key_logs?: api_key_logsCreateNestedManyWithoutApi_keyInput
  }

  export type api_keyUncheckedCreateInput = {
    id?: number
    time?: Date | string
    createby: string
    key?: string
    permission?: number
    ratelimitpermin?: number
    allowedipaddresses?: string
    expiredat?: Date | string | null
    isdisabled?: Date | string | null
    isdeleted?: Date | string | null
    api_key_logs?: api_key_logsUncheckedCreateNestedManyWithoutApi_keyInput
  }

  export type api_keyUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createby?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    permission?: IntFieldUpdateOperationsInput | number
    ratelimitpermin?: IntFieldUpdateOperationsInput | number
    allowedipaddresses?: StringFieldUpdateOperationsInput | string
    expiredat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdisabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdeleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    api_key_logs?: api_key_logsUpdateManyWithoutApi_keyNestedInput
  }

  export type api_keyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createby?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    permission?: IntFieldUpdateOperationsInput | number
    ratelimitpermin?: IntFieldUpdateOperationsInput | number
    allowedipaddresses?: StringFieldUpdateOperationsInput | string
    expiredat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdisabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdeleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    api_key_logs?: api_key_logsUncheckedUpdateManyWithoutApi_keyNestedInput
  }

  export type api_keyCreateManyInput = {
    id?: number
    time?: Date | string
    createby: string
    key?: string
    permission?: number
    ratelimitpermin?: number
    allowedipaddresses?: string
    expiredat?: Date | string | null
    isdisabled?: Date | string | null
    isdeleted?: Date | string | null
  }

  export type api_keyUpdateManyMutationInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createby?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    permission?: IntFieldUpdateOperationsInput | number
    ratelimitpermin?: IntFieldUpdateOperationsInput | number
    allowedipaddresses?: StringFieldUpdateOperationsInput | string
    expiredat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdisabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdeleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type api_keyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createby?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    permission?: IntFieldUpdateOperationsInput | number
    ratelimitpermin?: IntFieldUpdateOperationsInput | number
    allowedipaddresses?: StringFieldUpdateOperationsInput | string
    expiredat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdisabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdeleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type api_key_logsCreateInput = {
    time?: Date | string
    ip: string
    user_agent: string
    api_key?: api_keyCreateNestedOneWithoutApi_key_logsInput
  }

  export type api_key_logsUncheckedCreateInput = {
    id?: number
    time?: Date | string
    ip: string
    user_agent: string
    key?: string
  }

  export type api_key_logsUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    user_agent?: StringFieldUpdateOperationsInput | string
    api_key?: api_keyUpdateOneRequiredWithoutApi_key_logsNestedInput
  }

  export type api_key_logsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    user_agent?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
  }

  export type api_key_logsCreateManyInput = {
    id?: number
    time?: Date | string
    ip: string
    user_agent: string
    key?: string
  }

  export type api_key_logsUpdateManyMutationInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    user_agent?: StringFieldUpdateOperationsInput | string
  }

  export type api_key_logsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    user_agent?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
  }

  export type channel_notify_webhookCreateInput = {
    id?: bigint | number
    uuid?: string
    time?: Date | string
    by: string
    guild_id: string
    broadcaster_id: string
    webhook_url: string
    message: string
    verify_type?: string | null
    verify_code?: string | null
    hmac_secret?: string | null
    lease_sec?: number | null
    disabled?: Date | string | null
    deleted?: Date | string | null
  }

  export type channel_notify_webhookUncheckedCreateInput = {
    id?: bigint | number
    uuid?: string
    time?: Date | string
    by: string
    guild_id: string
    broadcaster_id: string
    webhook_url: string
    message: string
    verify_type?: string | null
    verify_code?: string | null
    hmac_secret?: string | null
    lease_sec?: number | null
    disabled?: Date | string | null
    deleted?: Date | string | null
  }

  export type channel_notify_webhookUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    by?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    webhook_url?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    verify_type?: NullableStringFieldUpdateOperationsInput | string | null
    verify_code?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_secret?: NullableStringFieldUpdateOperationsInput | string | null
    lease_sec?: NullableIntFieldUpdateOperationsInput | number | null
    disabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type channel_notify_webhookUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    by?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    webhook_url?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    verify_type?: NullableStringFieldUpdateOperationsInput | string | null
    verify_code?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_secret?: NullableStringFieldUpdateOperationsInput | string | null
    lease_sec?: NullableIntFieldUpdateOperationsInput | number | null
    disabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type channel_notify_webhookCreateManyInput = {
    id?: bigint | number
    uuid?: string
    time?: Date | string
    by: string
    guild_id: string
    broadcaster_id: string
    webhook_url: string
    message: string
    verify_type?: string | null
    verify_code?: string | null
    hmac_secret?: string | null
    lease_sec?: number | null
    disabled?: Date | string | null
    deleted?: Date | string | null
  }

  export type channel_notify_webhookUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    by?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    webhook_url?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    verify_type?: NullableStringFieldUpdateOperationsInput | string | null
    verify_code?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_secret?: NullableStringFieldUpdateOperationsInput | string | null
    lease_sec?: NullableIntFieldUpdateOperationsInput | number | null
    disabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type channel_notify_webhookUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    by?: StringFieldUpdateOperationsInput | string
    guild_id?: StringFieldUpdateOperationsInput | string
    broadcaster_id?: StringFieldUpdateOperationsInput | string
    webhook_url?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    verify_type?: NullableStringFieldUpdateOperationsInput | string | null
    verify_code?: NullableStringFieldUpdateOperationsInput | string | null
    hmac_secret?: NullableStringFieldUpdateOperationsInput | string | null
    lease_sec?: NullableIntFieldUpdateOperationsInput | number | null
    disabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type favorite_trackCreateInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    target: string
    source: string
    cache?: string | null
    cache_lastupdated?: Date | string | null
  }

  export type favorite_trackUncheckedCreateInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    target: string
    source: string
    cache?: string | null
    cache_lastupdated?: Date | string | null
  }

  export type favorite_trackUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type favorite_trackUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type favorite_trackCreateManyInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    target: string
    source: string
    cache?: string | null
    cache_lastupdated?: Date | string | null
  }

  export type favorite_trackUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type favorite_trackUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type feedbackCreateInput = {
    time?: Date | string
    message: string
    email?: string | null
  }

  export type feedbackUncheckedCreateInput = {
    id?: number
    time?: Date | string
    message: string
    email?: string | null
  }

  export type feedbackUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type feedbackUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type feedbackCreateManyInput = {
    id?: number
    time?: Date | string
    message: string
    email?: string | null
  }

  export type feedbackUpdateManyMutationInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type feedbackUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type guildsCreateInput = {
    id?: bigint | number
    guildid: string
    args?: string | null
  }

  export type guildsUncheckedCreateInput = {
    id?: bigint | number
    guildid: string
    args?: string | null
  }

  export type guildsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    args?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type guildsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    args?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type guildsCreateManyInput = {
    id?: bigint | number
    guildid: string
    args?: string | null
  }

  export type guildsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    args?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type guildsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    args?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type player_action_historyCreateInput = {
    id?: bigint | number
    actionby: string
    timestamp?: Date | string
    action_name: string
    data?: string | null
    guild?: string | null
    channel?: string | null
  }

  export type player_action_historyUncheckedCreateInput = {
    id?: bigint | number
    actionby: string
    timestamp?: Date | string
    action_name: string
    data?: string | null
    guild?: string | null
    channel?: string | null
  }

  export type player_action_historyUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actionby?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action_name?: StringFieldUpdateOperationsInput | string
    data?: NullableStringFieldUpdateOperationsInput | string | null
    guild?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type player_action_historyUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actionby?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action_name?: StringFieldUpdateOperationsInput | string
    data?: NullableStringFieldUpdateOperationsInput | string | null
    guild?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type player_action_historyCreateManyInput = {
    id?: bigint | number
    actionby: string
    timestamp?: Date | string
    action_name: string
    data?: string | null
    guild?: string | null
    channel?: string | null
  }

  export type player_action_historyUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actionby?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action_name?: StringFieldUpdateOperationsInput | string
    data?: NullableStringFieldUpdateOperationsInput | string | null
    guild?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type player_action_historyUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actionby?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    action_name?: StringFieldUpdateOperationsInput | string
    data?: NullableStringFieldUpdateOperationsInput | string | null
    guild?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type player_track_historyCreateInput = {
    id?: bigint | number
    requestby: string
    uniqueid: string
    time?: Date | string
    voicechannel: string
    guildid: string
    track: string
  }

  export type player_track_historyUncheckedCreateInput = {
    id?: bigint | number
    requestby: string
    uniqueid: string
    time?: Date | string
    voicechannel: string
    guildid: string
    track: string
  }

  export type player_track_historyUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    requestby?: StringFieldUpdateOperationsInput | string
    uniqueid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    voicechannel?: StringFieldUpdateOperationsInput | string
    guildid?: StringFieldUpdateOperationsInput | string
    track?: StringFieldUpdateOperationsInput | string
  }

  export type player_track_historyUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    requestby?: StringFieldUpdateOperationsInput | string
    uniqueid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    voicechannel?: StringFieldUpdateOperationsInput | string
    guildid?: StringFieldUpdateOperationsInput | string
    track?: StringFieldUpdateOperationsInput | string
  }

  export type player_track_historyCreateManyInput = {
    id?: bigint | number
    requestby: string
    uniqueid: string
    time?: Date | string
    voicechannel: string
    guildid: string
    track: string
  }

  export type player_track_historyUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    requestby?: StringFieldUpdateOperationsInput | string
    uniqueid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    voicechannel?: StringFieldUpdateOperationsInput | string
    guildid?: StringFieldUpdateOperationsInput | string
    track?: StringFieldUpdateOperationsInput | string
  }

  export type player_track_historyUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    requestby?: StringFieldUpdateOperationsInput | string
    uniqueid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    voicechannel?: StringFieldUpdateOperationsInput | string
    guildid?: StringFieldUpdateOperationsInput | string
    track?: StringFieldUpdateOperationsInput | string
  }

  export type pona_flipflop_stateCreateInput = {
    id?: bigint | number
    time?: Date | string
    guildid: string
    active?: boolean
  }

  export type pona_flipflop_stateUncheckedCreateInput = {
    id?: bigint | number
    time?: Date | string
    guildid: string
    active?: boolean
  }

  export type pona_flipflop_stateUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    guildid?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type pona_flipflop_stateUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    guildid?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type pona_flipflop_stateCreateManyInput = {
    id?: bigint | number
    time?: Date | string
    guildid: string
    active?: boolean
  }

  export type pona_flipflop_stateUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    guildid?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type pona_flipflop_stateUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    guildid?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type pona_heartbeat_intervalCreateInput = {
    id?: bigint | number
    time?: Date | string
    clusterid?: string | null
    shardid?: string | null
    ptm?: number
  }

  export type pona_heartbeat_intervalUncheckedCreateInput = {
    id?: bigint | number
    time?: Date | string
    clusterid?: string | null
    shardid?: string | null
    ptm?: number
  }

  export type pona_heartbeat_intervalUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterid?: NullableStringFieldUpdateOperationsInput | string | null
    shardid?: NullableStringFieldUpdateOperationsInput | string | null
    ptm?: IntFieldUpdateOperationsInput | number
  }

  export type pona_heartbeat_intervalUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterid?: NullableStringFieldUpdateOperationsInput | string | null
    shardid?: NullableStringFieldUpdateOperationsInput | string | null
    ptm?: IntFieldUpdateOperationsInput | number
  }

  export type pona_heartbeat_intervalCreateManyInput = {
    id?: bigint | number
    time?: Date | string
    clusterid?: string | null
    shardid?: string | null
    ptm?: number
  }

  export type pona_heartbeat_intervalUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterid?: NullableStringFieldUpdateOperationsInput | string | null
    shardid?: NullableStringFieldUpdateOperationsInput | string | null
    ptm?: IntFieldUpdateOperationsInput | number
  }

  export type pona_heartbeat_intervalUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterid?: NullableStringFieldUpdateOperationsInput | string | null
    shardid?: NullableStringFieldUpdateOperationsInput | string | null
    ptm?: IntFieldUpdateOperationsInput | number
  }

  export type pona_voicestate_historyCreateInput = {
    id?: bigint | number
    guildid: string
    memberid: string
    channelid: string
    beforestate?: string | null
    afterstate?: string | null
    date?: Date | string
    type: string
  }

  export type pona_voicestate_historyUncheckedCreateInput = {
    id?: bigint | number
    guildid: string
    memberid: string
    channelid: string
    beforestate?: string | null
    afterstate?: string | null
    date?: Date | string
    type: string
  }

  export type pona_voicestate_historyUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    memberid?: StringFieldUpdateOperationsInput | string
    channelid?: StringFieldUpdateOperationsInput | string
    beforestate?: NullableStringFieldUpdateOperationsInput | string | null
    afterstate?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type pona_voicestate_historyUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    memberid?: StringFieldUpdateOperationsInput | string
    channelid?: StringFieldUpdateOperationsInput | string
    beforestate?: NullableStringFieldUpdateOperationsInput | string | null
    afterstate?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type pona_voicestate_historyCreateManyInput = {
    id?: bigint | number
    guildid: string
    memberid: string
    channelid: string
    beforestate?: string | null
    afterstate?: string | null
    date?: Date | string
    type: string
  }

  export type pona_voicestate_historyUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    memberid?: StringFieldUpdateOperationsInput | string
    channelid?: StringFieldUpdateOperationsInput | string
    beforestate?: NullableStringFieldUpdateOperationsInput | string | null
    afterstate?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type pona_voicestate_historyUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    guildid?: StringFieldUpdateOperationsInput | string
    memberid?: StringFieldUpdateOperationsInput | string
    channelid?: StringFieldUpdateOperationsInput | string
    beforestate?: NullableStringFieldUpdateOperationsInput | string | null
    afterstate?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type search_historyCreateInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    text: string
  }

  export type search_historyUncheckedCreateInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    text: string
  }

  export type search_historyUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type search_historyUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type search_historyCreateManyInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    text: string
  }

  export type search_historyUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type search_historyUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type subscribe_artistCreateInput = {
    id?: bigint | number
    uid: string
    target: string
    time?: Date | string
    cache?: string | null
    cache_lastupdated?: Date | string | null
  }

  export type subscribe_artistUncheckedCreateInput = {
    id?: bigint | number
    uid: string
    target: string
    time?: Date | string
    cache?: string | null
    cache_lastupdated?: Date | string | null
  }

  export type subscribe_artistUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscribe_artistUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscribe_artistCreateManyInput = {
    id?: bigint | number
    uid: string
    target: string
    time?: Date | string
    cache?: string | null
    cache_lastupdated?: Date | string | null
  }

  export type subscribe_artistUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscribe_artistUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    cache?: NullableStringFieldUpdateOperationsInput | string | null
    cache_lastupdated?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type subscribe_newsCreateInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    type: string
    target: string
  }

  export type subscribe_newsUncheckedCreateInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    type: string
    target: string
  }

  export type subscribe_newsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
  }

  export type subscribe_newsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
  }

  export type subscribe_newsCreateManyInput = {
    id?: bigint | number
    uid: string
    time?: Date | string
    type: string
    target: string
  }

  export type subscribe_newsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
  }

  export type subscribe_newsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
  }

  export type user_sessionCreateInput = {
    id?: bigint | number
    uid: string
    ytmusic_visitor_id: string
    ytmusic_cookie?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type user_sessionUncheckedCreateInput = {
    id?: bigint | number
    uid: string
    ytmusic_visitor_id: string
    ytmusic_cookie?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type user_sessionUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    ytmusic_visitor_id?: StringFieldUpdateOperationsInput | string
    ytmusic_cookie?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    ytmusic_visitor_id?: StringFieldUpdateOperationsInput | string
    ytmusic_cookie?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionCreateManyInput = {
    id?: bigint | number
    uid: string
    ytmusic_visitor_id: string
    ytmusic_cookie?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type user_sessionUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    ytmusic_visitor_id?: StringFieldUpdateOperationsInput | string
    ytmusic_cookie?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type user_sessionUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uid?: StringFieldUpdateOperationsInput | string
    ytmusic_visitor_id?: StringFieldUpdateOperationsInput | string
    ytmusic_cookie?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type Api_key_logsListRelationFilter = {
    every?: api_key_logsWhereInput
    some?: api_key_logsWhereInput
    none?: api_key_logsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type api_key_logsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type api_keyOrderByRelevanceInput = {
    fields: api_keyOrderByRelevanceFieldEnum | api_keyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type api_keyCountOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    createby?: SortOrder
    key?: SortOrder
    permission?: SortOrder
    ratelimitpermin?: SortOrder
    allowedipaddresses?: SortOrder
    expiredat?: SortOrder
    isdisabled?: SortOrder
    isdeleted?: SortOrder
  }

  export type api_keyAvgOrderByAggregateInput = {
    id?: SortOrder
    permission?: SortOrder
    ratelimitpermin?: SortOrder
  }

  export type api_keyMaxOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    createby?: SortOrder
    key?: SortOrder
    permission?: SortOrder
    ratelimitpermin?: SortOrder
    allowedipaddresses?: SortOrder
    expiredat?: SortOrder
    isdisabled?: SortOrder
    isdeleted?: SortOrder
  }

  export type api_keyMinOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    createby?: SortOrder
    key?: SortOrder
    permission?: SortOrder
    ratelimitpermin?: SortOrder
    allowedipaddresses?: SortOrder
    expiredat?: SortOrder
    isdisabled?: SortOrder
    isdeleted?: SortOrder
  }

  export type api_keySumOrderByAggregateInput = {
    id?: SortOrder
    permission?: SortOrder
    ratelimitpermin?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type Api_keyScalarRelationFilter = {
    is?: api_keyWhereInput
    isNot?: api_keyWhereInput
  }

  export type api_key_logsOrderByRelevanceInput = {
    fields: api_key_logsOrderByRelevanceFieldEnum | api_key_logsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type api_key_logsCountOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    ip?: SortOrder
    user_agent?: SortOrder
    key?: SortOrder
  }

  export type api_key_logsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type api_key_logsMaxOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    ip?: SortOrder
    user_agent?: SortOrder
    key?: SortOrder
  }

  export type api_key_logsMinOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    ip?: SortOrder
    user_agent?: SortOrder
    key?: SortOrder
  }

  export type api_key_logsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type channel_notify_webhookOrderByRelevanceInput = {
    fields: channel_notify_webhookOrderByRelevanceFieldEnum | channel_notify_webhookOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type channel_notify_webhookCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    time?: SortOrder
    by?: SortOrder
    guild_id?: SortOrder
    broadcaster_id?: SortOrder
    webhook_url?: SortOrder
    message?: SortOrder
    verify_type?: SortOrder
    verify_code?: SortOrder
    hmac_secret?: SortOrder
    lease_sec?: SortOrder
    disabled?: SortOrder
    deleted?: SortOrder
  }

  export type channel_notify_webhookAvgOrderByAggregateInput = {
    id?: SortOrder
    lease_sec?: SortOrder
  }

  export type channel_notify_webhookMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    time?: SortOrder
    by?: SortOrder
    guild_id?: SortOrder
    broadcaster_id?: SortOrder
    webhook_url?: SortOrder
    message?: SortOrder
    verify_type?: SortOrder
    verify_code?: SortOrder
    hmac_secret?: SortOrder
    lease_sec?: SortOrder
    disabled?: SortOrder
    deleted?: SortOrder
  }

  export type channel_notify_webhookMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    time?: SortOrder
    by?: SortOrder
    guild_id?: SortOrder
    broadcaster_id?: SortOrder
    webhook_url?: SortOrder
    message?: SortOrder
    verify_type?: SortOrder
    verify_code?: SortOrder
    hmac_secret?: SortOrder
    lease_sec?: SortOrder
    disabled?: SortOrder
    deleted?: SortOrder
  }

  export type channel_notify_webhookSumOrderByAggregateInput = {
    id?: SortOrder
    lease_sec?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type favorite_trackOrderByRelevanceInput = {
    fields: favorite_trackOrderByRelevanceFieldEnum | favorite_trackOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type favorite_trackUidTargetCompoundUniqueInput = {
    uid: string
    target: string
  }

  export type favorite_trackCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    target?: SortOrder
    source?: SortOrder
    cache?: SortOrder
    cache_lastupdated?: SortOrder
  }

  export type favorite_trackAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type favorite_trackMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    target?: SortOrder
    source?: SortOrder
    cache?: SortOrder
    cache_lastupdated?: SortOrder
  }

  export type favorite_trackMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    target?: SortOrder
    source?: SortOrder
    cache?: SortOrder
    cache_lastupdated?: SortOrder
  }

  export type favorite_trackSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type feedbackOrderByRelevanceInput = {
    fields: feedbackOrderByRelevanceFieldEnum | feedbackOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type feedbackCountOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    message?: SortOrder
    email?: SortOrder
  }

  export type feedbackAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type feedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    message?: SortOrder
    email?: SortOrder
  }

  export type feedbackMinOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    message?: SortOrder
    email?: SortOrder
  }

  export type feedbackSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type guildsOrderByRelevanceInput = {
    fields: guildsOrderByRelevanceFieldEnum | guildsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type guildsCountOrderByAggregateInput = {
    id?: SortOrder
    guildid?: SortOrder
    args?: SortOrder
  }

  export type guildsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type guildsMaxOrderByAggregateInput = {
    id?: SortOrder
    guildid?: SortOrder
    args?: SortOrder
  }

  export type guildsMinOrderByAggregateInput = {
    id?: SortOrder
    guildid?: SortOrder
    args?: SortOrder
  }

  export type guildsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type player_action_historyOrderByRelevanceInput = {
    fields: player_action_historyOrderByRelevanceFieldEnum | player_action_historyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type player_action_historyCountOrderByAggregateInput = {
    id?: SortOrder
    actionby?: SortOrder
    timestamp?: SortOrder
    action_name?: SortOrder
    data?: SortOrder
    guild?: SortOrder
    channel?: SortOrder
  }

  export type player_action_historyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type player_action_historyMaxOrderByAggregateInput = {
    id?: SortOrder
    actionby?: SortOrder
    timestamp?: SortOrder
    action_name?: SortOrder
    data?: SortOrder
    guild?: SortOrder
    channel?: SortOrder
  }

  export type player_action_historyMinOrderByAggregateInput = {
    id?: SortOrder
    actionby?: SortOrder
    timestamp?: SortOrder
    action_name?: SortOrder
    data?: SortOrder
    guild?: SortOrder
    channel?: SortOrder
  }

  export type player_action_historySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type player_track_historyOrderByRelevanceInput = {
    fields: player_track_historyOrderByRelevanceFieldEnum | player_track_historyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type player_track_historyCountOrderByAggregateInput = {
    id?: SortOrder
    requestby?: SortOrder
    uniqueid?: SortOrder
    time?: SortOrder
    voicechannel?: SortOrder
    guildid?: SortOrder
    track?: SortOrder
  }

  export type player_track_historyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type player_track_historyMaxOrderByAggregateInput = {
    id?: SortOrder
    requestby?: SortOrder
    uniqueid?: SortOrder
    time?: SortOrder
    voicechannel?: SortOrder
    guildid?: SortOrder
    track?: SortOrder
  }

  export type player_track_historyMinOrderByAggregateInput = {
    id?: SortOrder
    requestby?: SortOrder
    uniqueid?: SortOrder
    time?: SortOrder
    voicechannel?: SortOrder
    guildid?: SortOrder
    track?: SortOrder
  }

  export type player_track_historySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type pona_flipflop_stateOrderByRelevanceInput = {
    fields: pona_flipflop_stateOrderByRelevanceFieldEnum | pona_flipflop_stateOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type pona_flipflop_stateCountOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    guildid?: SortOrder
    active?: SortOrder
  }

  export type pona_flipflop_stateAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type pona_flipflop_stateMaxOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    guildid?: SortOrder
    active?: SortOrder
  }

  export type pona_flipflop_stateMinOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    guildid?: SortOrder
    active?: SortOrder
  }

  export type pona_flipflop_stateSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type pona_heartbeat_intervalOrderByRelevanceInput = {
    fields: pona_heartbeat_intervalOrderByRelevanceFieldEnum | pona_heartbeat_intervalOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type pona_heartbeat_intervalCountOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    clusterid?: SortOrder
    shardid?: SortOrder
    ptm?: SortOrder
  }

  export type pona_heartbeat_intervalAvgOrderByAggregateInput = {
    id?: SortOrder
    ptm?: SortOrder
  }

  export type pona_heartbeat_intervalMaxOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    clusterid?: SortOrder
    shardid?: SortOrder
    ptm?: SortOrder
  }

  export type pona_heartbeat_intervalMinOrderByAggregateInput = {
    id?: SortOrder
    time?: SortOrder
    clusterid?: SortOrder
    shardid?: SortOrder
    ptm?: SortOrder
  }

  export type pona_heartbeat_intervalSumOrderByAggregateInput = {
    id?: SortOrder
    ptm?: SortOrder
  }

  export type pona_voicestate_historyOrderByRelevanceInput = {
    fields: pona_voicestate_historyOrderByRelevanceFieldEnum | pona_voicestate_historyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type pona_voicestate_historyCountOrderByAggregateInput = {
    id?: SortOrder
    guildid?: SortOrder
    memberid?: SortOrder
    channelid?: SortOrder
    beforestate?: SortOrder
    afterstate?: SortOrder
    date?: SortOrder
    type?: SortOrder
  }

  export type pona_voicestate_historyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type pona_voicestate_historyMaxOrderByAggregateInput = {
    id?: SortOrder
    guildid?: SortOrder
    memberid?: SortOrder
    channelid?: SortOrder
    beforestate?: SortOrder
    afterstate?: SortOrder
    date?: SortOrder
    type?: SortOrder
  }

  export type pona_voicestate_historyMinOrderByAggregateInput = {
    id?: SortOrder
    guildid?: SortOrder
    memberid?: SortOrder
    channelid?: SortOrder
    beforestate?: SortOrder
    afterstate?: SortOrder
    date?: SortOrder
    type?: SortOrder
  }

  export type pona_voicestate_historySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type search_historyOrderByRelevanceInput = {
    fields: search_historyOrderByRelevanceFieldEnum | search_historyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type search_historyCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    text?: SortOrder
  }

  export type search_historyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type search_historyMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    text?: SortOrder
  }

  export type search_historyMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    text?: SortOrder
  }

  export type search_historySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type subscribe_artistOrderByRelevanceInput = {
    fields: subscribe_artistOrderByRelevanceFieldEnum | subscribe_artistOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type subscribe_artistUidTargetCompoundUniqueInput = {
    uid: string
    target: string
  }

  export type subscribe_artistCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    target?: SortOrder
    time?: SortOrder
    cache?: SortOrder
    cache_lastupdated?: SortOrder
  }

  export type subscribe_artistAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type subscribe_artistMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    target?: SortOrder
    time?: SortOrder
    cache?: SortOrder
    cache_lastupdated?: SortOrder
  }

  export type subscribe_artistMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    target?: SortOrder
    time?: SortOrder
    cache?: SortOrder
    cache_lastupdated?: SortOrder
  }

  export type subscribe_artistSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type subscribe_newsOrderByRelevanceInput = {
    fields: subscribe_newsOrderByRelevanceFieldEnum | subscribe_newsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type subscribe_newsUidTypeTargetCompoundUniqueInput = {
    uid: string
    type: string
    target: string
  }

  export type subscribe_newsCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    type?: SortOrder
    target?: SortOrder
  }

  export type subscribe_newsAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type subscribe_newsMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    type?: SortOrder
    target?: SortOrder
  }

  export type subscribe_newsMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    time?: SortOrder
    type?: SortOrder
    target?: SortOrder
  }

  export type subscribe_newsSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type user_sessionOrderByRelevanceInput = {
    fields: user_sessionOrderByRelevanceFieldEnum | user_sessionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type user_sessionCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    ytmusic_visitor_id?: SortOrder
    ytmusic_cookie?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_sessionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type user_sessionMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    ytmusic_visitor_id?: SortOrder
    ytmusic_cookie?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_sessionMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    ytmusic_visitor_id?: SortOrder
    ytmusic_cookie?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type user_sessionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type api_key_logsCreateNestedManyWithoutApi_keyInput = {
    create?: XOR<api_key_logsCreateWithoutApi_keyInput, api_key_logsUncheckedCreateWithoutApi_keyInput> | api_key_logsCreateWithoutApi_keyInput[] | api_key_logsUncheckedCreateWithoutApi_keyInput[]
    connectOrCreate?: api_key_logsCreateOrConnectWithoutApi_keyInput | api_key_logsCreateOrConnectWithoutApi_keyInput[]
    createMany?: api_key_logsCreateManyApi_keyInputEnvelope
    connect?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
  }

  export type api_key_logsUncheckedCreateNestedManyWithoutApi_keyInput = {
    create?: XOR<api_key_logsCreateWithoutApi_keyInput, api_key_logsUncheckedCreateWithoutApi_keyInput> | api_key_logsCreateWithoutApi_keyInput[] | api_key_logsUncheckedCreateWithoutApi_keyInput[]
    connectOrCreate?: api_key_logsCreateOrConnectWithoutApi_keyInput | api_key_logsCreateOrConnectWithoutApi_keyInput[]
    createMany?: api_key_logsCreateManyApi_keyInputEnvelope
    connect?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type api_key_logsUpdateManyWithoutApi_keyNestedInput = {
    create?: XOR<api_key_logsCreateWithoutApi_keyInput, api_key_logsUncheckedCreateWithoutApi_keyInput> | api_key_logsCreateWithoutApi_keyInput[] | api_key_logsUncheckedCreateWithoutApi_keyInput[]
    connectOrCreate?: api_key_logsCreateOrConnectWithoutApi_keyInput | api_key_logsCreateOrConnectWithoutApi_keyInput[]
    upsert?: api_key_logsUpsertWithWhereUniqueWithoutApi_keyInput | api_key_logsUpsertWithWhereUniqueWithoutApi_keyInput[]
    createMany?: api_key_logsCreateManyApi_keyInputEnvelope
    set?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    disconnect?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    delete?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    connect?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    update?: api_key_logsUpdateWithWhereUniqueWithoutApi_keyInput | api_key_logsUpdateWithWhereUniqueWithoutApi_keyInput[]
    updateMany?: api_key_logsUpdateManyWithWhereWithoutApi_keyInput | api_key_logsUpdateManyWithWhereWithoutApi_keyInput[]
    deleteMany?: api_key_logsScalarWhereInput | api_key_logsScalarWhereInput[]
  }

  export type api_key_logsUncheckedUpdateManyWithoutApi_keyNestedInput = {
    create?: XOR<api_key_logsCreateWithoutApi_keyInput, api_key_logsUncheckedCreateWithoutApi_keyInput> | api_key_logsCreateWithoutApi_keyInput[] | api_key_logsUncheckedCreateWithoutApi_keyInput[]
    connectOrCreate?: api_key_logsCreateOrConnectWithoutApi_keyInput | api_key_logsCreateOrConnectWithoutApi_keyInput[]
    upsert?: api_key_logsUpsertWithWhereUniqueWithoutApi_keyInput | api_key_logsUpsertWithWhereUniqueWithoutApi_keyInput[]
    createMany?: api_key_logsCreateManyApi_keyInputEnvelope
    set?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    disconnect?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    delete?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    connect?: api_key_logsWhereUniqueInput | api_key_logsWhereUniqueInput[]
    update?: api_key_logsUpdateWithWhereUniqueWithoutApi_keyInput | api_key_logsUpdateWithWhereUniqueWithoutApi_keyInput[]
    updateMany?: api_key_logsUpdateManyWithWhereWithoutApi_keyInput | api_key_logsUpdateManyWithWhereWithoutApi_keyInput[]
    deleteMany?: api_key_logsScalarWhereInput | api_key_logsScalarWhereInput[]
  }

  export type api_keyCreateNestedOneWithoutApi_key_logsInput = {
    create?: XOR<api_keyCreateWithoutApi_key_logsInput, api_keyUncheckedCreateWithoutApi_key_logsInput>
    connectOrCreate?: api_keyCreateOrConnectWithoutApi_key_logsInput
    connect?: api_keyWhereUniqueInput
  }

  export type api_keyUpdateOneRequiredWithoutApi_key_logsNestedInput = {
    create?: XOR<api_keyCreateWithoutApi_key_logsInput, api_keyUncheckedCreateWithoutApi_key_logsInput>
    connectOrCreate?: api_keyCreateOrConnectWithoutApi_key_logsInput
    upsert?: api_keyUpsertWithoutApi_key_logsInput
    connect?: api_keyWhereUniqueInput
    update?: XOR<XOR<api_keyUpdateToOneWithWhereWithoutApi_key_logsInput, api_keyUpdateWithoutApi_key_logsInput>, api_keyUncheckedUpdateWithoutApi_key_logsInput>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type api_key_logsCreateWithoutApi_keyInput = {
    time?: Date | string
    ip: string
    user_agent: string
  }

  export type api_key_logsUncheckedCreateWithoutApi_keyInput = {
    id?: number
    time?: Date | string
    ip: string
    user_agent: string
  }

  export type api_key_logsCreateOrConnectWithoutApi_keyInput = {
    where: api_key_logsWhereUniqueInput
    create: XOR<api_key_logsCreateWithoutApi_keyInput, api_key_logsUncheckedCreateWithoutApi_keyInput>
  }

  export type api_key_logsCreateManyApi_keyInputEnvelope = {
    data: api_key_logsCreateManyApi_keyInput | api_key_logsCreateManyApi_keyInput[]
    skipDuplicates?: boolean
  }

  export type api_key_logsUpsertWithWhereUniqueWithoutApi_keyInput = {
    where: api_key_logsWhereUniqueInput
    update: XOR<api_key_logsUpdateWithoutApi_keyInput, api_key_logsUncheckedUpdateWithoutApi_keyInput>
    create: XOR<api_key_logsCreateWithoutApi_keyInput, api_key_logsUncheckedCreateWithoutApi_keyInput>
  }

  export type api_key_logsUpdateWithWhereUniqueWithoutApi_keyInput = {
    where: api_key_logsWhereUniqueInput
    data: XOR<api_key_logsUpdateWithoutApi_keyInput, api_key_logsUncheckedUpdateWithoutApi_keyInput>
  }

  export type api_key_logsUpdateManyWithWhereWithoutApi_keyInput = {
    where: api_key_logsScalarWhereInput
    data: XOR<api_key_logsUpdateManyMutationInput, api_key_logsUncheckedUpdateManyWithoutApi_keyInput>
  }

  export type api_key_logsScalarWhereInput = {
    AND?: api_key_logsScalarWhereInput | api_key_logsScalarWhereInput[]
    OR?: api_key_logsScalarWhereInput[]
    NOT?: api_key_logsScalarWhereInput | api_key_logsScalarWhereInput[]
    id?: IntFilter<"api_key_logs"> | number
    time?: DateTimeFilter<"api_key_logs"> | Date | string
    ip?: StringFilter<"api_key_logs"> | string
    user_agent?: StringFilter<"api_key_logs"> | string
    key?: StringFilter<"api_key_logs"> | string
  }

  export type api_keyCreateWithoutApi_key_logsInput = {
    time?: Date | string
    createby: string
    key?: string
    permission?: number
    ratelimitpermin?: number
    allowedipaddresses?: string
    expiredat?: Date | string | null
    isdisabled?: Date | string | null
    isdeleted?: Date | string | null
  }

  export type api_keyUncheckedCreateWithoutApi_key_logsInput = {
    id?: number
    time?: Date | string
    createby: string
    key?: string
    permission?: number
    ratelimitpermin?: number
    allowedipaddresses?: string
    expiredat?: Date | string | null
    isdisabled?: Date | string | null
    isdeleted?: Date | string | null
  }

  export type api_keyCreateOrConnectWithoutApi_key_logsInput = {
    where: api_keyWhereUniqueInput
    create: XOR<api_keyCreateWithoutApi_key_logsInput, api_keyUncheckedCreateWithoutApi_key_logsInput>
  }

  export type api_keyUpsertWithoutApi_key_logsInput = {
    update: XOR<api_keyUpdateWithoutApi_key_logsInput, api_keyUncheckedUpdateWithoutApi_key_logsInput>
    create: XOR<api_keyCreateWithoutApi_key_logsInput, api_keyUncheckedCreateWithoutApi_key_logsInput>
    where?: api_keyWhereInput
  }

  export type api_keyUpdateToOneWithWhereWithoutApi_key_logsInput = {
    where?: api_keyWhereInput
    data: XOR<api_keyUpdateWithoutApi_key_logsInput, api_keyUncheckedUpdateWithoutApi_key_logsInput>
  }

  export type api_keyUpdateWithoutApi_key_logsInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createby?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    permission?: IntFieldUpdateOperationsInput | number
    ratelimitpermin?: IntFieldUpdateOperationsInput | number
    allowedipaddresses?: StringFieldUpdateOperationsInput | string
    expiredat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdisabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdeleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type api_keyUncheckedUpdateWithoutApi_key_logsInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createby?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    permission?: IntFieldUpdateOperationsInput | number
    ratelimitpermin?: IntFieldUpdateOperationsInput | number
    allowedipaddresses?: StringFieldUpdateOperationsInput | string
    expiredat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdisabled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isdeleted?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type api_key_logsCreateManyApi_keyInput = {
    id?: number
    time?: Date | string
    ip: string
    user_agent: string
  }

  export type api_key_logsUpdateWithoutApi_keyInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    user_agent?: StringFieldUpdateOperationsInput | string
  }

  export type api_key_logsUncheckedUpdateWithoutApi_keyInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    user_agent?: StringFieldUpdateOperationsInput | string
  }

  export type api_key_logsUncheckedUpdateManyWithoutApi_keyInput = {
    id?: IntFieldUpdateOperationsInput | number
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    user_agent?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}