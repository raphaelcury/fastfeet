import Mail from '../../lib/Mail';

class DeliveryCreationMailJob {
  get key() {
    return 'DeliveryCreationMailJob';
  }

  async handle({ data }) {
    const { partner } = data;
    await Mail.sendMail({
      to: `${partner.name} <${partner.email}>`,
      subject: 'Delivery requested',
      text: `${partner.name}, a delivery has been requested to you. Please check.`,
    });
  }
}

export default new DeliveryCreationMailJob();
