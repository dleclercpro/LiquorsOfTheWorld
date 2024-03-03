import { RequestHandler } from 'express';
import { successResponse } from '../../utils/calls';
import { PACKAGE_VERSION } from '../../constants';

const GetVersionController: RequestHandler = (req, res, next) => {
    try {
        return res.json(
            successResponse({
                version: PACKAGE_VERSION,
            })
        );

    } catch (err: any) {
        next(err);
    }
}

export default GetVersionController;