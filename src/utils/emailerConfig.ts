import {
  SESClient,
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandOutput,
  SendEmailCommand,
  SendEmailCommandOutput,
} from '@aws-sdk/client-ses';

export default class Emailer {
  sesClient: SESClient;

  constructor(region: string, accessKey: string, secretKey: string) {
    this.sesClient = new SESClient({
      region: region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
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

  /**
   *
   * @param {string | Array<string>} destinationEmailAddress
   * @param {string} HTMLBody
   * @param {string} subject
   * @param {string} sourceEmailAddress
   * @returns {Promise<SendEmailCommandOutput>}
   */
  async sendHTMLEmail(
    destinationEmailAddress: string | string[],
    HTMLBody: string,
    subject: string,
    sourceEmailAddress: string
  ): Promise<SendEmailCommandOutput> {
    return await this.sesClient.send(
      new SendEmailCommand({
        Destination: {
          ToAddresses:
            typeof destinationEmailAddress === 'string'
              ? [destinationEmailAddress]
              : destinationEmailAddress,
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: HTMLBody,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
        Source: sourceEmailAddress,
      })
    );
  }
}
