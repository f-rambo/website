interface ErrMsg {
    code: number;
    reason: string;
    message: string;
    metadata: any;
}

interface Msg {
    Reason: string;
    Message: string;
}

export function jsonToQueryString(json: any) {
    return Object.keys(json)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
        .join('&');
}

function isErrMsg(obj: any): obj is ErrMsg {
    return obj && obj.code;
}

function isMsg(obj: any): obj is Msg {
    return obj && obj.Reason && obj.Message && typeof obj.Reason === 'string' && typeof obj.Message === 'string';
}

export async function handlerResponse(res: Response) {
    const data = await res.json();
    if (isErrMsg(data)) {
        return new Error(data.message.toString());
    }
    if (!res.ok) {
        return new Error(res.statusText.toString());
    }
    if (isMsg(data) && data.Reason !== 'SUCCEED') {
        return new Error(data.Message.toString());
    }
    return data;
}
