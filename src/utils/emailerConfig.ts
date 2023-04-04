import {
  SESClient,
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandOutput,
} from '@aws-sdk/client-ses';

export default class Emailer {
  sesClient: SESClient;

  constructor(region: string) {
    this.sesClient = new SESClient({
      region: region,
    });
  }

  /**
   *
   * @param {string} sourceEmailAddress
   * @param {string | Array<string>} destinationEmailAddress
   * @param {string} templateName
   * @param {object} templateData
   * @returns {Promise<SendTemplatedEmailCommandOutput>}
   */
  async sendTemplateEmail(
    sourceEmailAddress: string,
    destinationEmailAddress: string | Array<string>,
    templateName: string,
    templateData: object
  ): Promise<SendTemplatedEmailCommandOutput> {
    return await this.sesClient.send(
      new SendTemplatedEmailCommand({
        Destination: {
          ToAddresses:
            typeof destinationEmailAddress === 'string'
              ? [destinationEmailAddress]
              : destinationEmailAddress,
        },
        TemplateData: JSON.stringify(templateData),
        Source: sourceEmailAddress,
        Template: templateName,
      })
    );
  }
}
