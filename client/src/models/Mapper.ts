export function Mapper<Output>(obj: any, tranform?: (data: any) => Output): Output {
    if(tranform == null){
        return obj as Output;
    }else{
        return tranform(obj);
    }
}