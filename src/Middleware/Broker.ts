type callBack = () => void

/**
 * The type `Subscriber` is an object with keys as topics and values as arrays of callback functions.
 * @property {callBack[]} [topic: callBack[]] - This is an index signature for the `Subscriber` type.
 * It specifies that the `Subscriber` object has keys of type `string` (representing topics) and values
 * of type `callBack[]` (an array of callback functions). This means that the `Subscriber` object can
 * have multiple topics
 */
type Subscriber = {
  [topic: string]: callBack[]
}

/* The `interface IBroker` defines a contract for a class to implement. It specifies that any class
that implements this interface must have a `subscribe` method that takes a `topic` string and a
`callback` function as arguments and returns `void`. It also specifies that the class must have a
`publish` method that takes a `topic` string as an argument and returns `void`. This interface is
used to ensure that any class that wants to act as a broker in the application must have these two
methods implemented. */
interface IBroker {
  subscribe: (topic: string, callback: () => void) => void
  publish: (topic: string) => void
}

/* The Broker class implements the IBroker interface and allows for subscribing to and publishing
messages on different topics. */
class Broker implements IBroker {
  private readonly subscribers: Subscriber
  constructor() {
    this.subscribers = {}
  }

  subscribe(topic: string, callback: () => void) {
    if(!this.subscribers[topic]) {
      this.subscribers[topic] = []
    }
    this.subscribers[topic].push(callback)
    console.log(this.subscribers[topic].length)
  }

  publish(topic: string) {
    if(this.subscribers[topic]) {
      this.subscribers[topic].forEach(callback => {
        callback()
      })
    }
  } 
}

export default Broker