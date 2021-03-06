/** global Date */
import {Store} from 'flummox';
import _m from 'mori';

var lastId = 0;

class NotificationStore extends Store {
    constructor(flux) {
        super();

        const notificationActions = flux.getActions('notification');

        this.state = {
            notifications: _m.vector()
        };

        this.register(notificationActions.addNotification, this.receiveNotification);
        this.register(notificationActions.removeNotification, this.deleteNotification);
        this.register(notificationActions.removeNotificationsOlderThan, this.deleteOldNotifications);
    }

    /**
     * Saves notification.
     */
    receiveNotification([message, type]) {
        lastId += 1;
        this.setState({
            notifications: _m.conj(this.state.notifications, _m.toClj({
                type: type || 'default',
                message: message,
                id: lastId,
                created: Date.now()
            }))
        });
    }

    /**
     * Removes notification with `id`.
     *
     * @param  {number} id The ID of the notification
     */
    deleteNotification(id) {
        this.setState({
            notifications: _m.filter(n => _m.get(n, 'id') !== id, this.state.notifications)
        });
    }

    /**
     * Removes notifications older than `ms` ms.
     *
     * @param  {number} ms The age of the notification in ms.
     */
    deleteOldNotifications(ms) {
        let now = Date.now();
        this.setState({
            notifications: _m.filter(n => _m.get(n, 'created') > (now - ms), this.state.notifications)
        });
    }

    /**
     * Returns all notifications.
     */
    getNotifications() {
        return _m.toJs(this.state.notifications);
    }

    _empty() {
        this.setState({
            notifications: _m.vector()
        });
    }
}

export default NotificationStore;