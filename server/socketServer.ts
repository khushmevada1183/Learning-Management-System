import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";

interface NotificationData {
    title: string;
    message: string;
    createdAt: Date;
    userId: string;
}

export const initSocketServer = (io: SocketIOServer) => {
    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join user to their own room for private notifications
        socket.on("joinUserRoom", (userId: string) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        // Listen for 'notification' event from the frontend
        socket.on("notification", (data: NotificationData) => {
            // Emit to specific user room
            io.to(data.userId).emit("newNotification", data);
            
            // Also emit to admin dashboard
            io.emit("newNotification", data);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });

        // Error handling
        socket.on("error", (error: Error) => {
            console.error(`Socket error: ${error.message}`);
        });
    });
};
