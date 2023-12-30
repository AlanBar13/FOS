import { format, parseISO } from 'date-fns';
import {} from 'date-fns/locale';

export const formatDate = (date?: Date) => {
    if (date == null){
        return;
    }

    return format(parseISO(date.toString()), "d/MM/yy HH:mm");
}

export const formatStringDate = (date?: string) => {
    if (date == null){
        return;
    }

    return format(parseISO(date), "d/MM/yy HH:mm");
}