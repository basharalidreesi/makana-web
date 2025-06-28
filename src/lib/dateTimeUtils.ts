export const renderIsoDate = (date: string | undefined, {
    mode = 'full',
    withFallback = false,
}: {
    mode?: 'full' | 'yearAndMonth' | 'yearOnly';
    withFallback?: boolean;
} = {}) => {
    if (!date && !withFallback) { return; }
    const isValidIsoDate = /^(\d{4})-(\d{2})-(\d{2})$/.test(date || '');
    const safeDate = isValidIsoDate ? date : (withFallback ? '0000-00-00' : undefined);
    if (!safeDate) { return; }
    const [year, month, day] = safeDate.split('-');
    switch (mode) {
        case 'full': return `${day}_${month}_${year}`;
        case 'yearAndMonth': return `${month}_${year}`;
        case 'yearOnly': return year;
        default: return;
    }
};