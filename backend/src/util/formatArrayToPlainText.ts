export const formatArrayToPlainText = (array: string[], capitalizeInitial: boolean): string => {

    if (array.length === 0) return "";

    if (capitalizeInitial === true) {
        array[0] = array[0].charAt(0).toUpperCase() + array[0].slice(1);
    }

    if (array.length === 1)
        return array[0];
    if (array.length === 2)
        return array.join(" and ");
    else
        return array.reduce((string, item, i, a) =>
            string + (i === a.length - 1
                ? ", and "
                : (i === 0
                    ? ""
                    : ", ")) + item,
            "");
}