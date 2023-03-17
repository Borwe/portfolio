export async function asyncRun<T>(promise: Promise<T>)
  : Promise<[T|undefined, any|undefined]>{
  try{
    const res = await promise;
    return [res, undefined]
  }catch(e){
    return [undefined, e]
  }
}
