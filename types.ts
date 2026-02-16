
export interface ItineraryItem {
  id: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  lat?: number;
  lng?: number;
  isFavorite?: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  isBought: boolean;
}

export interface WeatherInfo {
  temp: string;
  condition: string;
}

export interface DayPlan {
  day: number;
  items: ItineraryItem[];
  weather?: WeatherInfo;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  summary: string; // 行程概要
  weatherOverview: string; // 整體天氣概況
  days: DayPlan[];
  shoppingList: ShoppingItem[];
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}
