import Mail from '../../lib/Mail';

class DeliveryCancellationMailJob {
  get key() {
    return 'DeliveryCancelattionMailJob';
  }

  async handle({ data }) {
    const { problem } = data;
    await Mail.sendMail({
      to: `${problem.delivery.partner.name} <${problem.delivery.partner.email}>`,
      subject: 'Delivery cancelled',
      text: `${problem.delivery.partner.name}, a delivery has been cancelled. Please check.`,
    });
  }
}

export default new DeliveryCancellationMailJob();
