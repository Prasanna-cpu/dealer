export const formatValidationError = (errors : any) => {
    if(!errors || !errors.issues) return 'Validation failed'

    if(Array.isArray(errors.issues)) return errors.issues.map((error : any) => error.message).join(', ')

    return JSON.stringify(errors)
}