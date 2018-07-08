/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Authenticate from '../middlewares/auth/Authenticate';
import BasicTokenAuth from '../middlewares/auth/strategies/BasicTokenAuth';
import {asyncHandler} from '../utils/handler';

/**
 * Generate the routes.
 *
 * @param {Router}      router  The router
 * @param {DataStorage} storage The storage
 *
 * @return {Router}
 */
export default function packageRoutes(router, storage) {
    router.use(asyncHandler(new Authenticate(new BasicTokenAuth(storage))));

    return router;
}
