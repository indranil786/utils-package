import * as AWSXRay from 'aws-xray-sdk';
import { NextFunction, Request, Response } from 'express';

const defaultDaemonAddress = 'localhost:2000'

export const xRayMiddleware = (serviceName: string, daemonAddress: string = defaultDaemonAddress) => {
    AWSXRay.setDaemonAddress(daemonAddress);
    const xrayExpress = AWSXRay.express.openSegment(serviceName);
    return (req: Request, res: Response, next: NextFunction) => {
        xrayExpress(req, res, () => {
            const segment = AWSXRay.getSegment();
            if (segment) {
                segment.addMetadata('http', {
                    request: {
                        method: req.method,
                        url: req.url,
                        headers: req.headers,
                        body: req.body,
                        params: req.params,
                        query: req.query,
                    },
                });

                const subsegment = segment.addNewSubsegment(req.path);
                res.on('finish', () => {
                    subsegment.addMetadata('http', {
                        response: {
                            status: res.statusCode,
                            headers: res.getHeaders(),
                            message: res.statusMessage,
                            data: res.json
                        },
                    });
                    subsegment.close();
                });
            } else {
                // should never land here but still for safety
                console.log('segment not found');
            }
            next();
        });
    };
}
