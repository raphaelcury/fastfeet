import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import DeliveryCreationMailJob from '../app/jobs/DeliveryCreationMailJob';
import DeliveryCancellationMailJob from '../app/jobs/DeliveryCancellationMailJob';

const jobs = [DeliveryCreationMailJob, DeliveryCancellationMailJob];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        queue: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queueKey, jobData) {
    this.queues[queueKey].queue.createJob(jobData).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { queue, handle } = this.queues[job.key];
      queue.process(handle);
    });
  }
}

export default new Queue();
