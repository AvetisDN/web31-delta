/* 
Получаем текущее время в формате yyyy-mm-dd hh:mm:ss
*/
export const getTime = () => new Date().toLocaleString().replace(/\//g, "-");

/* 
Возвращает:
XX min, если < 1 часа
XX h, если < 1 дня
dd Month, если >= 1 дня
*/
export const getTimeFromPresent = (time) => {
  const present = new Date();
  const past = new Date(time);
  const delta = present - past;
  const M = 60000;
  const H = 3600000;
  const D = 86400000;
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (delta < H) {
    return Math.round(delta / M) + "min";
  } else if (delta < D) {
    return Math.round(delta / H) + "h";
  } else {
    const month = Months[past.getMonth()];
    return `${past.getDate()}, ${month}`;
  }
};

/* 
Возвращает:
Month YYYY
*/
export const getTimelineFormat = (time) => {
  const d = new Date(time);
  const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${Months[d.getMonth()]}, ${d.getFullYear()}`;
};
