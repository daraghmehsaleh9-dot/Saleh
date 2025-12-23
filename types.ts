export interface Product {
  id: number;
  name: { [key: string]: string };
  category: { [key:string]: string };
  price: number;
  imageUrl: string;
  description: { [key: string]: string };
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface Brand {
  name: string;
  logoUrl: string;
}

export interface DeliveryDetails {
  fullName: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
}

export interface Order {
  id: string;
  userId?: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
  deliveryDetails: DeliveryDetails;
  status: 'pending' | 'paid' | 'failed' | 'in progress' | 'in delivery' | 'delivered';
}