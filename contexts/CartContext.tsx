import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    buyNowItem: CartItem | null;
    setBuyNowItem: (item: CartItem | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
    const [isCartLoading, setIsCartLoading] = useState(true);
    const { user } = useAuth();

    // This effect syncs the cart with Firestore whenever the user changes.
    // It works seamlessly for both logged-in and anonymous users via their UID.
    useEffect(() => {
        if (!user) {
            // If there's no user (e.g., on initial load or if anonymous sign-in fails),
            // the cart remains empty as we can't access Firestore.
            setCart([]);
            setIsCartLoading(false);
            return;
        }

        setIsCartLoading(true);
        const cartRef = db.collection('carts').doc(user.uid);
        
        // Subscribe to the user's cart document for real-time updates.
        const unsubscribe = cartRef.onSnapshot(
            (docSnapshot) => {
                setCart(docSnapshot.exists ? (docSnapshot.data()?.items || []) : []);
                setIsCartLoading(false);
            },
            (error) => {
                console.error("Error listening to cart document:", error);
                setIsCartLoading(false);
            }
        );

        // Clean up the subscription when the component unmounts or the user changes.
        return () => unsubscribe();
    }, [user]);

    const updateFirestoreCart = async (newCart: CartItem[]) => {
        if (user) {
            try {
                const cartRef = db.collection('carts').doc(user.uid);
                // Using .set() safely creates the document if it doesn't exist or updates it if it does.
                await cartRef.set({ items: newCart });
            } catch (error) {
                console.error("Error updating cart in Firestore:", error);
            }
        }
    };
    
    const addToCart = (product: Product, quantity: number) => {
        const updatedCart = [...cart];
        const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            updatedCart[existingItemIndex].quantity += quantity;
        } else {
            updatedCart.push({ ...product, quantity });
        }
        setCart(updatedCart); // Optimistic UI update
        updateFirestoreCart(updatedCart);
    };

    const removeFromCart = (productId: number) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart); // Optimistic UI update
        updateFirestoreCart(updatedCart);
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        const updatedCart = cart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart); // Optimistic UI update
        updateFirestoreCart(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
        updateFirestoreCart([]);
    };

    const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
    const totalPrice = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        buyNowItem,
        setBuyNowItem,
    };

    return (
        <CartContext.Provider value={value}>
            {!isCartLoading && children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
