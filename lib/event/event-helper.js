class EventHelper
{
    /**
     * debounces functions invoked by events
     *
     * @param {function} func       function to be invoked
     * @param {number} wait         time to wait before func is invoked
     * @returns {function(...[*]=)}
     */
    static debounce (func, wait = 80)
    {
        let timeoutId = null;

        return (...args) =>
        {
            const later = () =>
            {
                timeoutId = null;
                func(...args);
            };

            clearTimeout(timeoutId);

            timeoutId = window.setTimeout(later, wait);
        };
    }
}

export default EventHelper;
