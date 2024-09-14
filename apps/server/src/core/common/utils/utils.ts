export function toPlain<T>(dto: T): Partial<T> {
    // Create a new object containing only the own properties of the DTO
    const cleanObject: Partial<T> = Object.keys(dto).reduce((result, key) => {
        console.log('!!!!!!!!!!!!!!dto', JSON.stringify(dto, null, 2))
        if (dto.hasOwnProperty(key)) {
            result[key] = (dto as any)[key];
        }
        return result;
    }, {} as Partial<T>);
    console.log('!!!!!!!!!!!!!!cleanObject', JSON.stringify(cleanObject, null, 2));
    return cleanObject;
}