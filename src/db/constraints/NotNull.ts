/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import NotEqual from './NotEqual';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export default class NotNull extends NotEqual
{
    /**
     * Constructor.
     */
    constructor() {
        super(null);
    }
};