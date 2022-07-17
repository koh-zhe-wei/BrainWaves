import PushNotificationIOS from "@react-native-community/push-notification-ios";


const showNotfication = (title,message) => { 
    PushNotificationIOS.addNotificationRequest({
        alertTitle: title,
        alertBody:message,

    });
};

const handleCancel = () => {
    PushNotificationIOS.removeAllDeliveredNotifications();
}

export {showNotfication,handleCancel};