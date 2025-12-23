import { Order, CartItem, DeliveryDetails } from '../types';
import { db } from './firebase';

/**
 * Creates a new order in Firestore with a 'pending' status.
 * @param orderData - The data for the new order.
 * @param userId - The ID of the user placing the order. (Optional for guest checkouts)
 * @returns A Promise that resolves to the newly created order.
 */
export const createOrder = async (
    orderData: {
        items: CartItem[];
        totalPrice: number;
        deliveryDetails: DeliveryDetails;
    },
    userId?: string
): Promise<Order> => {
    if (!orderData.items || orderData.items.length === 0) {
        throw new Error("Cannot create an empty order.");
    }

    const newOrderData: Omit<Order, 'id'> = {
        date: new Date().toISOString(),
        status: 'pending' as const,
        ...orderData,
        ...(userId && { userId }),
    };

    const docRef = await db.collection('orders').add(newOrderData);

    const createdOrder: Order = { 
        id: docRef.id,
        ...newOrderData,
    };

    return createdOrder;
};

/**
 * Updates the status of an existing order in Firestore.
 * @param orderId - The ID of the order to update.
 * @param status - The new status for the order.
 */
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    console.log(`Updating order ${orderId} status to ${status}`);
    const orderRef = db.collection("orders").doc(orderId);
    await orderRef.update({
        status: status
    });
};

/**
 * Fetches all past orders for a specific user from Firestore.
 * @param userId - The ID of the user whose orders to fetch.
 * @returns A Promise that resolves to an array of orders.
 */
export const getOrders = async (userId: string): Promise<Order[]> => {
    console.log(`Fetching orders for user ${userId}...`);
    const ordersCol = db.collection('orders');
    const q = ordersCol.where("userId", "==", userId).orderBy("date", "desc");

    const querySnapshot = await q.get();
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    return orders;
};

/**
 * Fetches all orders from Firestore, sorted by date. For admin use.
 * @returns A Promise that resolves to an array of all orders.
 */
export const getAllOrders = async (): Promise<Order[]> => {
    console.log("Fetching all orders for admin...");
    const ordersCol = db.collection('orders');
    const q = ordersCol.orderBy("date", "desc");

    const querySnapshot = await q.get();
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    return orders;
};