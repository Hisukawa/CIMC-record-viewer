import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\patientsController::fkSJCMayBCypGVQm
 * @see app/Http/Controllers/patientsController.php:35
 * @route '/viewer/{hrn}/folder'
 */
export const fkSJCMayBCypGVQm = (args: { hrn: string | number } | [hrn: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fkSJCMayBCypGVQm.url(args, options),
    method: 'get',
})

fkSJCMayBCypGVQm.definition = {
    methods: ["get","head"],
    url: '/viewer/{hrn}/folder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\patientsController::fkSJCMayBCypGVQm
 * @see app/Http/Controllers/patientsController.php:35
 * @route '/viewer/{hrn}/folder'
 */
fkSJCMayBCypGVQm.url = (args: { hrn: string | number } | [hrn: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hrn: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hrn: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hrn: args.hrn,
                }

    return fkSJCMayBCypGVQm.definition.url
            .replace('{hrn}', parsedArgs.hrn.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\patientsController::fkSJCMayBCypGVQm
 * @see app/Http/Controllers/patientsController.php:35
 * @route '/viewer/{hrn}/folder'
 */
fkSJCMayBCypGVQm.get = (args: { hrn: string | number } | [hrn: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fkSJCMayBCypGVQm.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\patientsController::fkSJCMayBCypGVQm
 * @see app/Http/Controllers/patientsController.php:35
 * @route '/viewer/{hrn}/folder'
 */
fkSJCMayBCypGVQm.head = (args: { hrn: string | number } | [hrn: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fkSJCMayBCypGVQm.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\patientsController::fkSJCMayBCypGVQm
 * @see app/Http/Controllers/patientsController.php:35
 * @route '/viewer/{hrn}/folder'
 */
    const fkSJCMayBCypGVQmForm = (args: { hrn: string | number } | [hrn: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: fkSJCMayBCypGVQm.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\patientsController::fkSJCMayBCypGVQm
 * @see app/Http/Controllers/patientsController.php:35
 * @route '/viewer/{hrn}/folder'
 */
        fkSJCMayBCypGVQmForm.get = (args: { hrn: string | number } | [hrn: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fkSJCMayBCypGVQm.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\patientsController::fkSJCMayBCypGVQm
 * @see app/Http/Controllers/patientsController.php:35
 * @route '/viewer/{hrn}/folder'
 */
        fkSJCMayBCypGVQmForm.head = (args: { hrn: string | number } | [hrn: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: fkSJCMayBCypGVQm.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    fkSJCMayBCypGVQm.form = fkSJCMayBCypGVQmForm
const generated = {
    fkSJCMayBCypGVQm: Object.assign(fkSJCMayBCypGVQm, fkSJCMayBCypGVQm),
}

export default generated