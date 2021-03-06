/*
 * This file is part of the Tug package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RouterBack} from '@app/routers/RouterBack';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
declare module 'vue/types/vue' {
    interface Vue {
        $routerBack: RouterBack;
    }
}
