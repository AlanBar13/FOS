import { format, parseISO } from 'date-fns';

export const formatDate = (date?: Date) => {
    if (date == null){
        return;
    }

    return format(parseISO(date.toString()), "d/MM/yy HH:mm");
}