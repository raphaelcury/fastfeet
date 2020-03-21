import Mail from '../../lib/Mail';

class DeliveryCreationMailJob {
  get key() {
    return 'DeliveryCreationMailJob';
  }

  async handle({ data }) {
    const { delivery, partner, recipient } = data;

    // TODO: Mail HTML formatting
    await Mail.sendMail({
      to: `${partner.name} <${partner.email}>`,
      subject: 'Delivery requested',
      text: `${partner.name},

A delivery has been requested to you. Please check data:

Product: ${delivery.product}
Recipient: ${recipient.name}

Address:
${recipient.address}${recipient.number ? ` , ${recipient.number}` : ''}${
        recipient.complement ? ` / ${recipient.complement}` : ''
      }
${recipient.city}
${recipient.state}
${recipient.zip_code}
`,
    });
  }
}

export default new DeliveryCreationMailJob();
