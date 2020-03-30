export const getTodayDate = (date) => {

    const today = date.getFullYear()
        + "-"
        + ((date.getMonth() + 1) >= 10 ? date.getMonth() : "0" + (date.getMonth() + 1))
        + "-"
        + (date.getDate() >= 10 ? date.getDate() : "0" + date.getDate())
    return today;
}
export const getRandomColorValue = () => {
    const min = Math.ceil(0);
    const max = Math.floor(255);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
export const formatMoney = (amount) => {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "NGN"
    });
}