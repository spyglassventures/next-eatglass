interface TinyEvent {
  queueName: string;
  data: any;
}

type Consumers = {
  [consumerId: string]: (event: TinyEvent) => void;
}

type Subscribers = {
  [queueName: string]: Consumers;
}

class TinyEventQueue {
  subscribers: Subscribers = {};

  public subscribe(
    queueName: string,
    consumerId: string,
    handler: (event: TinyEvent) => void
  ) {
    this.subscribers[queueName] = this.subscribers[queueName] || {};
    const consumers = this.subscribers[queueName];
    consumers[consumerId] = handler;
  }

  public publish(queueName: string, data: any) {
    const consumers = this.subscribers[queueName];
    if (consumers) {
      Object.keys(consumers).forEach(consumerId => {
        consumers[consumerId]({
          queueName,
          data,
        });
      })
    }
  }

  public unsubscribe(queueName: string, consumerId: string) {
    if (queueName in this.subscribers) {
      delete this.subscribers[queueName][consumerId];
    }
  }
}

export default TinyEventQueue;
