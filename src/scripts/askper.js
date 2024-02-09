if (Notification.permission !== 'granted'){
    console.log("request notification access");
    Notification.requestPermission();
}