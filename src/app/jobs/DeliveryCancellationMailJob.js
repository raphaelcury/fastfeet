import Mail from '../../lib/Mail';

class DeliveryCancellationMailJob {
  get key() {
    return 'DeliveryCancelattionMailJob';
  }

  async handle({ data }) {
    const { problem } = data;

    // TODO: Mail HTML formatting
    await Mail.sendMail({
      to: `${problem.delivery.partner.name} <${problem.delivery.partner.email}>`,
      subject: 'Delivery cancelled',
      text: `${problem.delivery.partner.name},

A delivery has been cancelled. Please check data:

Product: ${problem.delivery.product}
Recipient: ${problem.delivery.recipient.name}

Cause: ${problem.description}
  `,
    });
  }
}

export default new DeliveryCancellationMailJob();
