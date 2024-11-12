export const unreadNotificationsFunc = (notificaitons: any) =>{
    return notificaitons.filter((n: any) => n.isRead ===false)
}